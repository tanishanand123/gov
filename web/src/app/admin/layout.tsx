import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#0B1120" }}>
      <AdminSidebar />
      <main className="ml-64 min-h-screen">
        {/* Admin topbar */}
        <header
          className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-10"
          style={{ background: "#1E1B4B", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-sm">SmartGov Admin</span>
            <span className="text-xs bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-400/30">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <span className="text-sm text-white/70">admin@gov.in</span>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
