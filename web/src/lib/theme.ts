"use client";

export function getTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
}

export function setTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}
