import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ControlPanelSidebar, {
  SIDEBAR_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_ROLE_IDS,
  type RoleId,
} from "@/components/super-admin-wireframe/ControlPanelSidebar";
import { useSidebarVisibility } from "@/hooks/useSidebarVisibility";
import { sidebarRouteFor } from "@/lib/sidebar-routes";
import { ValaAiAgent } from "@/components/vala-ai/ValaAiAgent";
import { cn } from "@/lib/utils";

const SHELL_BG =
  "radial-gradient(1200px 700px at 18% -10%, #163a72 0%, transparent 60%), radial-gradient(900px 600px at 100% 0%, #0f3a5c 0%, transparent 55%), #070f22";

export type ManagerTab = {
  id: string;
  label: string;
  content: ReactNode;
};

export function ManagerShell({
  activeRole,
  title,
  subtitle,
  tabs,
  kpis,
}: {
  activeRole: RoleId;
  title: string;
  subtitle: string;
  tabs: ManagerTab[];
  kpis?: ReactNode;
}) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState(tabs[0]?.id ?? "");
  const { visibleIds, canAccess, loading } = useSidebarVisibility(SIDEBAR_ROLE_IDS);

  const current = tabs.find((t) => t.id === tab) ?? tabs[0];

  return (
    <TooltipProvider>
      <div className="dark flex min-h-screen w-full" style={{ background: SHELL_BG }}>
        <div
          className="flex-shrink-0 transition-[width] duration-300 ease-out"
          style={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
        >
          <ControlPanelSidebar
            activeRole={activeRole}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((v) => !v)}
            visibleRoleIds={loading ? [] : visibleIds}
            onRoleSelect={(roleId) => {
              if (!canAccess(roleId)) {
                toast.error("You don't have access to this module");
                return;
              }
              navigate({ to: sidebarRouteFor(roleId) });
            }}
            onLogout={() => navigate({ to: "/module-switch" })}
          />
        </div>

        <main className="flex min-w-0 flex-1 flex-col gap-5 p-5">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">{title}</h1>
              <p className="text-xs font-medium text-white/60">{subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              LIVE DATA
            </span>
          </header>

          {kpis}

          <nav className="flex flex-wrap gap-1.5 rounded-xl border border-[rgba(88,160,255,0.28)] bg-white/[0.04] p-1.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[12.5px] font-bold transition-colors",
                  current?.id === t.id
                    ? "bg-gradient-to-br from-[#2f7dff] to-[#48c6ff] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <section className="min-w-0">{current?.content}</section>
        </main>
      </div>
      <ValaAiAgent />
      <Toaster />
    </TooltipProvider>
  );
}
