"""
Eligibility Engine

Given a UserProfile, scores every scheme in the database 0–100.

Architecture:
  1. profile_to_tags()   — converts profile fields into a flat tag set
  2. hard_filter()       — eliminates schemes the user CANNOT qualify for (age, state, gender)
  3. score_scheme()      — gives a 0–100 eligibility score for each remaining scheme
  4. gap_analysis()      — explains WHY the score is what it is ("you earn ₹50K over the limit")

Score breakdown (total = 100):
  - Age match:           20 pts
  - Income match:        20 pts
  - Caste/Category:      15 pts
  - Occupation/Sector:   15 pts
  - State match:         10 pts
  - Gender match:        10 pts
  - Education match:      5 pts
  - Bonus flags:          5 pts  (disability, bpl, minority, kcc, shg...)
"""
from __future__ import annotations
import logging
from dataclasses import dataclass, field
from typing import Optional
from app.models.user import UserProfile
from app.models.scheme import Scheme

logger = logging.getLogger(__name__)


# ── Tag generation ────────────────────────────────────────────────────────────

def profile_to_tags(p: UserProfile) -> set[str]:
    """Convert all profile fields into a searchable tag set."""
    tags: set[str] = set()

    # Demographics
    if p.gender:
        tags.add(p.gender.lower())
    if p.caste:
        tags.add(p.caste.lower())
    if p.minority_status:
        tags.add("minority")
    if p.age:
        if p.age < 18:
            tags.add("minor")
        elif p.age <= 25:
            tags.add("youth")
        elif p.age <= 35:
            tags.add("young-adult")
        elif p.age <= 60:
            tags.add("adult")
        else:
            tags.add("senior")

    # Geography
    if p.state:
        tags.add(p.state.lower())
    if p.area_type:
        tags.add(p.area_type.lower())    # "urban" or "rural"

    # Economic
    if p.annual_income is not None:
        if p.annual_income <= 50000:
            tags.add("below-poverty")
        if p.annual_income <= 100000:
            tags.add("very-low-income")
        if p.annual_income <= 200000:
            tags.add("low-income")
        if p.annual_income <= 500000:
            tags.add("middle-income")
    if p.bpl_card:
        tags.add("bpl")
    if not p.has_bank_account:
        tags.add("unbanked")

    # Occupation
    if p.occupation:
        tags.add(p.occupation.lower())
    if p.sector:
        tags.add(p.sector.lower())

    # Special categories
    if p.is_farmer:
        tags.add("farmer")
        if p.land_holding_acres is not None:
            if p.land_holding_acres <= 2:
                tags.add("marginal-farmer")
            elif p.land_holding_acres <= 5:
                tags.add("small-farmer")
            else:
                tags.add("large-farmer")
    if p.is_student:
        tags.add("student")
    if p.is_woman_entrepreneur:
        tags.add("woman")
        tags.add("entrepreneur")
        tags.add("woman-entrepreneur")
    if p.is_msme:
        tags.add("msme")
    if p.is_startup:
        tags.add("startup")
        tags.add("entrepreneur")
    if p.is_shg:
        tags.add("shg")
        tags.add("self-help-group")
    if p.has_disability:
        tags.add("disability")
        tags.add("divyangjan")
    if p.is_military:
        tags.add("military")
    if p.is_ex_serviceman:
        tags.add("ex-serviceman")
        tags.add("military")
    if p.is_pensioner:
        tags.add("pensioner")
    if p.is_widowed:
        tags.add("widow")

    # Education
    if p.education:
        edu_map = {
            "none": ["illiterate"],
            "primary": ["primary-educated"],
            "8th": ["middle-school"],
            "10th": ["ssc", "matriculate"],
            "12th": ["hsc", "12th-pass"],
            "diploma": ["diploma", "iti"],
            "graduate": ["graduate", "degree"],
            "postgraduate": ["postgraduate", "graduate"],
            "phd": ["phd", "postgraduate", "graduate"],
        }
        for tag in edu_map.get(p.education.lower(), []):
            tags.add(tag)

    # Business
    if p.business_registration:
        reg = p.business_registration.lower()
        tags.add(reg)
        if "udyam" in reg:
            tags.add("msme")
        if "startup" in reg:
            tags.add("startup")

    return tags


# ── Hard filter ───────────────────────────────────────────────────────────────

def hard_filter(profile: UserProfile, scheme: Scheme) -> tuple[bool, str]:
    """
    Returns (passes, reason).
    If passes=False the scheme is excluded from results entirely.
    Only fail on definitive mismatches — be generous when data is missing.
    """
    elig = scheme.eligibility_raw or {}

    # State check
    scheme_states = elig.get("states", [])
    if scheme_states and profile.state:
        if profile.state not in scheme_states and "All States" not in scheme_states:
            return False, f"Scheme is for {', '.join(scheme_states)} only"

    # Age check
    age_range = elig.get("age", {})
    if profile.age and age_range:
        if age_range.get("min") and profile.age < age_range["min"]:
            return False, f"Minimum age is {age_range['min']} (you are {profile.age})"
        if age_range.get("max") and profile.age > age_range["max"]:
            return False, f"Maximum age is {age_range['max']} (you are {profile.age})"

    # Gender check
    scheme_genders = elig.get("gender", [])
    if scheme_genders and profile.gender:
        if profile.gender.lower() not in [g.lower() for g in scheme_genders]:
            return False, f"Scheme is for {'/'.join(scheme_genders)} only"

    return True, ""


# ── Scoring ───────────────────────────────────────────────────────────────────

@dataclass
class SchemeScore:
    scheme_id: int
    scheme: Scheme
    score: int                          # 0–100
    matched_criteria: list[str] = field(default_factory=list)
    missing_criteria: list[str] = field(default_factory=list)
    gap_analysis: list[str] = field(default_factory=list)
    status: str = "eligible"           # eligible / almost / not-eligible

    @property
    def is_eligible(self) -> bool:
        return self.score >= 70

    @property
    def is_almost(self) -> bool:
        return 40 <= self.score < 70


def score_scheme(profile: UserProfile, scheme: Scheme, profile_tags: set[str]) -> SchemeScore:
    """Score a scheme for a given user profile. Returns SchemeScore 0–100."""
    elig = scheme.eligibility_raw or {}
    score = 0
    matched = []
    missing = []
    gaps = []

    # ── Age (20 pts) ──────────────────────────────────────────────
    age_range = elig.get("age", {})
    if not age_range:
        score += 15   # no restriction = partial credit
        matched.append("No age restriction")
    elif profile.age:
        mn, mx = age_range.get("min"), age_range.get("max")
        if (not mn or profile.age >= mn) and (not mx or profile.age <= mx):
            score += 20
            matched.append(f"Age {profile.age} qualifies")
        else:
            if mn and profile.age < mn:
                gaps.append(f"Minimum age is {mn} — you are {profile.age} (need {mn - profile.age} more years)")
            if mx and profile.age > mx:
                gaps.append(f"Maximum age is {mx} — you are {profile.age} ({profile.age - mx} years over limit)")
            missing.append("Age out of range")
    else:
        score += 10   # unknown age — partial credit

    # ── Income (20 pts) ───────────────────────────────────────────
    income_max = elig.get("income_max")
    if not income_max:
        score += 15
        matched.append("No income restriction")
    elif profile.annual_income is not None:
        if profile.annual_income <= income_max:
            score += 20
            matched.append(f"Income ₹{profile.annual_income:,.0f} within limit")
        else:
            over = profile.annual_income - income_max
            gaps.append(f"Income limit is ₹{income_max:,.0f} — you earn ₹{over:,.0f} over limit")
            # Partial score if close
            if profile.annual_income <= income_max * 1.2:
                score += 5
                missing.append("Income slightly over limit")
            else:
                missing.append("Income exceeds limit")
    else:
        score += 10   # unknown income — partial credit

    # ── Caste/Category (15 pts) ───────────────────────────────────
    scheme_castes = [c.lower() for c in elig.get("caste", [])]
    if not scheme_castes:
        score += 12
        matched.append("Open to all categories")
    elif profile.caste and profile.caste.lower() in scheme_castes:
        score += 15
        matched.append(f"Category {profile.caste.upper()} qualifies")
    else:
        missing.append(f"Scheme is for {'/'.join(c.upper() for c in scheme_castes)}")

    # ── Occupation/Sector (15 pts) ────────────────────────────────
    scheme_occupations = [o.lower() for o in elig.get("occupation", [])]
    scheme_tags = [t.lower() for t in elig.get("tags", [])]
    if not scheme_occupations and not scheme_tags:
        score += 12
        matched.append("No occupation restriction")
    else:
        occ_match = False
        if profile.occupation and profile.occupation.lower() in scheme_occupations:
            occ_match = True
        # Check tag overlap
        tag_overlap = profile_tags & set(scheme_tags)
        if tag_overlap:
            occ_match = True

        if occ_match:
            score += 15
            matched.append("Occupation/sector qualifies")
        else:
            if scheme_occupations:
                missing.append(f"Occupation should be: {', '.join(scheme_occupations)}")
            elif scheme_tags:
                missing.append(f"Profile tags don't match: {', '.join(scheme_tags[:3])}")

    # ── State (10 pts) ────────────────────────────────────────────
    scheme_states = elig.get("states", [])
    if not scheme_states:
        score += 10
        matched.append("Pan-India scheme")
    elif profile.state and profile.state in scheme_states:
        score += 10
        matched.append(f"{profile.state} is eligible state")
    else:
        # State spider data may have the user's state for state-level schemes
        if scheme.state and profile.state and scheme.state.lower() == profile.state.lower():
            score += 10
            matched.append(f"State-specific scheme for {profile.state}")
        else:
            missing.append(f"Scheme is for: {', '.join(scheme_states[:3])}")

    # ── Gender (10 pts) ───────────────────────────────────────────
    scheme_genders = [g.lower() for g in elig.get("gender", [])]
    if not scheme_genders:
        score += 8
        matched.append("Open to all genders")
    elif profile.gender and profile.gender.lower() in scheme_genders:
        score += 10
        matched.append(f"Gender {profile.gender} qualifies")
    else:
        missing.append("Gender requirement not met")

    # ── Education (5 pts) ─────────────────────────────────────────
    edu_order = ["none", "primary", "8th", "10th", "12th", "diploma", "graduate", "postgraduate", "phd"]
    scheme_edu = [e.lower() for e in elig.get("education", [])]
    if not scheme_edu:
        score += 4
    elif profile.education:
        user_edu_idx = next((i for i, e in enumerate(edu_order)
                             if e in profile.education.lower()), -1)
        scheme_edu_idxs = [next((i for i, e in enumerate(edu_order)
                                  if e in se), -1) for se in scheme_edu]
        min_required = min(i for i in scheme_edu_idxs if i >= 0) if scheme_edu_idxs else -1
        if user_edu_idx >= min_required:
            score += 5
            matched.append("Education qualification met")
        else:
            missing.append(f"Minimum education: {scheme_edu[0]}")
    else:
        score += 2   # unknown education — minimal credit

    # ── Bonus flags (5 pts) ───────────────────────────────────────
    bonus = 0
    if elig.get("disability") and profile.has_disability:
        bonus += 2
        matched.append("Disability status matches")
    if "bpl" in scheme_tags and profile.bpl_card:
        bonus += 1
        matched.append("BPL card holder qualifies")
    if "minority" in scheme_tags and profile.minority_status:
        bonus += 1
        matched.append("Minority status qualifies")
    if "shg" in scheme_tags and profile.is_shg:
        bonus += 1
        matched.append("SHG membership qualifies")
    score += min(bonus, 5)

    # Determine status
    status = "not-eligible"
    if score >= 70:
        status = "eligible"
    elif score >= 40:
        status = "almost"

    return SchemeScore(
        scheme_id=scheme.id,
        scheme=scheme,
        score=min(score, 100),
        matched_criteria=matched,
        missing_criteria=missing,
        gap_analysis=gaps,
        status=status,
    )


# ── Main engine ───────────────────────────────────────────────────────────────

async def rank_schemes(
    profile: UserProfile,
    schemes: list[Scheme],
    top_n: int = 50,
) -> list[SchemeScore]:
    """
    Main entry point.
    1. Convert profile to tags
    2. Hard filter (eliminates definitive mismatches)
    3. Score remaining schemes
    4. Return top_n sorted by score descending
    """
    profile_tags = profile_to_tags(profile)
    logger.info(f"[Eligibility] Profile tags: {profile_tags}")

    results: list[SchemeScore] = []

    for scheme in schemes:
        passes, reason = hard_filter(profile, scheme)
        if not passes:
            logger.debug(f"[Eligibility] Hard-filtered {scheme.name}: {reason}")
            continue

        scheme_score = score_scheme(profile, scheme, profile_tags)
        results.append(scheme_score)

    # Sort: eligible first, then almost, then by score descending
    results.sort(key=lambda s: (-s.score))

    logger.info(
        f"[Eligibility] {len(results)} schemes passed filter. "
        f"Eligible: {sum(1 for r in results if r.status == 'eligible')}, "
        f"Almost: {sum(1 for r in results if r.status == 'almost')}"
    )

    return results[:top_n]
