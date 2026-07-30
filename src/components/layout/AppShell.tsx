// @ts-nocheck
import { type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AmsSidebar } from "./AmsSidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { WorkspaceBar } from "./WorkspaceBar";
import { ROLES } from "@/lib/roles";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const cfg = ROLES.admin;

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <AmsSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          role={cfg}
          onSwitchRole={(r) => navigate({ to: "/dashboard/$role", params: { role: r } })}
          onOpenAIChat={() => navigate({ to: "/ai" })}
        />
        <main className="flex-1 px-4 md:px-6 py-5 space-y-5 overflow-x-hidden">
          <div className="max-w-[1600px] w-full mx-auto">
            <WorkspaceBar />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
