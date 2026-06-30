"use client";

import React, { useState } from "react";
import { Search, Bell, Sun, Moon, Menu, X } from "lucide-react";

export function Topbar() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-surface border-b border-border flex items-center px-4 md:px-6 gap-4 z-10">
      {/* Search */}
      <div className="flex-1 max-w-[480px]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search schemes, documents, applications..."
            className="w-full h-9 pl-9 pr-4 text-sm bg-elevated border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-elevated text-muted hover:text-text transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-elevated text-muted hover:text-text transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Avatar */}
        <button className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
          RK
        </button>
      </div>
    </header>
  );
}
