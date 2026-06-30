"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Category = "All" | "Housing" | "Agriculture" | "Healthcare" | "Education" | "Business" | "Pension";

interface Scheme {
  id: number;
  name: string;
  ministry: string;
  category: Exclude<Category, "All">;
  active: boolean;
  applications: number;
  benefit: string;
  deadline: string;
  updated: string;
}

const allSchemes: Scheme[] = [
  { id: 1, name: "PM Awas Yojana (Gramin)", ministry: "Housing & Urban Affairs", category: "Housing", active: true, applications: 4820, benefit: "₹2.5L", deadline: "Mar 31, 2026", updated: "2 days ago" },
  { id: 2, name: "PM Kisan Samman Nidhi", ministry: "Agriculture", category: "Agriculture", active: true, applications: 12340, benefit: "₹6,000/yr", deadline: "Ongoing", updated: "1 day ago" },
  { id: 3, name: "Ayushman Bharat PM-JAY", ministry: "Health & Family Welfare", category: "Healthcare", active: true, applications: 8910, benefit: "₹5L cover", deadline: "Ongoing", updated: "3 days ago" },
  { id: 4, name: "National Scholarship Portal", ministry: "Education", category: "Education", active: false, applications: 3200, benefit: "₹25,000/yr", deadline: "Dec 31, 2025", updated: "1 week ago" },
  { id: 5, name: "PM MUDRA Yojana", ministry: "Finance", category: "Business", active: true, applications: 5670, benefit: "₹10L loan", deadline: "Ongoing", updated: "4 days ago" },
  { id: 6, name: "Indira Gandhi National Old Age Pension", ministry: "Rural Development", category: "Pension", active: true, applications: 2100, benefit: "₹300/mo", deadline: "Ongoing", updated: "5 days ago" },
  { id: 7, name: "Pradhan Mantri Jan Dhan Yojana", ministry: "Finance", category: "Business", active: true, applications: 9200, benefit: "Zero-balance account", deadline: "Ongoing", updated: "6 days ago" },
  { id: 8, name: "Sukanya Samriddhi Yojana", ministry: "Finance", category: "Education", active: true, applications: 7800, benefit: "8.2% interest", deadline: "Ongoing", updated: "3 days ago" },
];

const categoryColors: Record<string, string> = {
  Housing: "bg-indigo-900/40 text-indigo-300 border border-indigo-700/40",
  Agriculture: "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40",
  Healthcare: "bg-rose-900/40 text-rose-300 border border-rose-700/40",
  Education: "bg-amber-900/40 text-amber-300 border border-amber-700/40",
  Business: "bg-cyan-900/40 text-cyan-300 border border-cyan-700/40",
  Pension: "bg-purple-900/40 text-purple-300 border border-purple-700/40",
};

const categories: Category[] = ["All", "Housing", "Agriculture", "Healthcare", "Education", "Business", "Pension"];

export default function AdminSchemesPage() {
  const [schemes, setSchemes] = useState(allSchemes);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [showModal, setShowModal] = useState(false);

  const toggleScheme = (id: number) => {
    setSchemes((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const filtered = schemes.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.ministry.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Schemes Management</h1>
          <p className="text-sm text-white/40 mt-0.5">{schemes.length} schemes · {schemes.filter((s) => s.active).length} active</p>
        </div>
        <Button leftIcon={<Plus size={14} />} onClick={() => setShowModal(true)}>
          Add New Scheme
        </Button>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
        style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schemes or ministry..."
            className="w-full text-sm pl-9 pr-4 py-2 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#1E1B4B" }}>
                {["Scheme Name", "Ministry", "Category", "Benefit", "Deadline", "Applications", "Active", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((scheme) => (
                <tr key={scheme.id} className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-white">{scheme.name}</div>
                    <div className="text-xs text-white/30 mt-0.5">Updated {scheme.updated}</div>
                  </td>
                  <td className="px-4 py-3.5 text-white/60 text-xs">{scheme.ministry}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${categoryColors[scheme.category]}`}>
                      {scheme.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-emerald-400 text-xs">{scheme.benefit}</td>
                  <td className="px-4 py-3.5 text-white/50 text-xs whitespace-nowrap">{scheme.deadline}</td>
                  <td className="px-4 py-3.5 text-white/70">{scheme.applications.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => toggleScheme(scheme.id)} className="transition-transform hover:scale-110">
                      {scheme.active ? (
                        <ToggleRight size={24} className="text-emerald-400" />
                      ) : (
                        <ToggleLeft size={24} className="text-white/30" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-indigo-400 transition-colors">
                        <Edit2 size={12} />
                      </button>
                      <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-cyan-400 transition-colors">
                        <ExternalLink size={12} />
                      </button>
                      <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/50 hover:text-red-400 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-white/30 text-sm">
                    No schemes match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Scheme Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Star size={18} className="text-indigo-400" /> Add New Scheme
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {["Scheme Name", "Ministry", "Benefit Amount", "Official URL", "Deadline", "Category"].map((field) => (
                <div key={field} className={field === "Scheme Name" || field === "Official URL" ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">{field}</label>
                  {field === "Category" ? (
                    <div className="relative">
                      <select
                        className="w-full text-sm rounded-xl px-3 py-2.5 pr-8 appearance-none text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-3 text-white/40 pointer-events-none" />
                    </div>
                  ) : (
                    <input
                      placeholder={`Enter ${field.toLowerCase()}`}
                      className="w-full text-sm rounded-xl px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="flex-1">Add Scheme</Button>
              <Button variant="outline" className="border-white/20 text-white/70 hover:bg-white/10" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
