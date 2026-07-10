export const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export const STATE_OTHER = "Other (please specify)";

export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

export const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];

export const OCCUPATIONS = [
  "Student", "Farmer", "Daily Wage Worker", "Salaried Employee", "Self-Employed", "Unemployed", "Other",
];

export const AREA_TYPES = ["Rural", "Urban"];

export const YES_NO = ["Yes", "No"];

export const ENABLED_DISABLED = ["Enabled", "Disabled"];

// Free-to-use (Unsplash License) photos of Indian citizens, used to ground the UI
// in real people instead of illustrations/emoji. Source: images.unsplash.com.
export const STOCK_PHOTOS = {
  womanFarmerRice: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0",
  farmerField: "https://images.unsplash.com/photo-1623211269755-569fec0536d2",
  motherDaughter: "https://images.unsplash.com/photo-1589169011402-8b2cbd1ee593",
  girlPortraitSmiling: "https://images.unsplash.com/photo-1674278882093-3870ef98e826",
};

export function photoUrl(base: string, w: number, q = 80): string {
  return `${base}?w=${w}&q=${q}&auto=format&fit=crop`;
}
