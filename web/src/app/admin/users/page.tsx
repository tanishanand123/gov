"use client";

import React from "react";
import { Search } from "lucide-react";

interface UserRow {
  initials: string;
  bg?: string;
  name: string;
  email: string;
  mobile: string;
  state: string;
  completion: number;
  applications: number;
  joined: string;
}

const USERS: UserRow[] = [
  { initials: "RK", name: "Rahul Kumar", email: "rahul@example.com", mobile: "+91 98765 43210", state: "Uttar Pradesh", completion: 72, applications: 4, joined: "Jan 10, 2026" },
  { initials: "PS", name: "Priya Singh", email: "priya@example.com", mobile: "+91 87654 32109", state: "Maharashtra", completion: 91, applications: 7, joined: "Feb 3, 2026" },
  { initials: "AM", bg: "linear-gradient(135deg,#10B981,#059669)", name: "Arjun Mishra", email: "arjun@example.com", mobile: "+91 76543 21098", state: "Bihar", completion: 45, applications: 1, joined: "Jun 20, 2026" },
];

export default function AdminUsersPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F1F5F9" }}>User Management</h1>
        <p style={{ color: "#64748B" }}>10,482 registered citizens</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, display: "flex", alignItems: "center", padding: "0 14px", gap: 8, height: 44, flex: 1, maxWidth: 360 }}>
          <Search size={16} strokeWidth={2} color="#64748B" />
          <input type="text" placeholder="Search users..." style={{ border: "none", background: "transparent", color: "#F1F5F9", fontSize: 14, outline: "none", flex: 1, fontFamily: "inherit" }} />
        </div>
        <select style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, height: 44, color: "#94A3B8", fontSize: 14, padding: "0 14px", outline: "none", fontFamily: "inherit" }}>
          <option>All States</option>
          <option>Uttar Pradesh</option>
          <option>Maharashtra</option>
          <option>Bihar</option>
        </select>
      </div>

      <div style={{ background: "#1E293B", borderRadius: 16, border: "1px solid #334155", overflow: "hidden" }}>
        <table className="admin-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>User</th><th>Mobile</th><th>State</th><th>Profile</th><th>Applications</th><th>Joined</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.email}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="avatar-circle" style={{ width: 32, height: 32, fontSize: 11, ...(u.bg ? { background: u.bg } : {}) }}>{u.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9" }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: "#94A3B8", fontSize: 13 }}>{u.mobile}</td>
                <td style={{ color: "#94A3B8", fontSize: 13 }}>{u.state}</td>
                <td>
                  <div className="progress-wrap" style={{ width: 80 }}><div className="progress-bar" style={{ width: `${u.completion}%`, height: 6 }} /></div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{u.completion}%</div>
                </td>
                <td style={{ color: "#94A3B8", fontSize: 13 }}>{u.applications}</td>
                <td style={{ color: "#64748B", fontSize: 13 }}>{u.joined}</td>
                <td><button className="btn btn-sm" style={{ background: "#1E1B4B", color: "#818CF8", borderRadius: 8 }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
