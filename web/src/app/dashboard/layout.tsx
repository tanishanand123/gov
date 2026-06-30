import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <Topbar />
      <main className="md:ml-64 pt-16 min-h-screen pb-16 md:pb-0">
        <div className="p-4 md:p-6">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
