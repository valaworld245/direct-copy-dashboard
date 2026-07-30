import { createFileRoute } from "@tanstack/react-router";
import { ModuleSwitchDashboard } from "@/components/module-switch/ModuleSwitchDashboard";

export const Route = createFileRoute("/module-switch")({
  // Reads the client-side auth bridge to filter modules by role.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Module Switch — Software Vala Workspace Launcher" },
      {
        name: "description",
        content:
          "Launch any Software Vala workspace: control panel, managers, partner portals, AMS recognition and vaults — with search, favorites and role-based access.",
      },
      { property: "og:title", content: "Module Switch — Software Vala Workspace Launcher" },
      {
        property: "og:description",
        content:
          "One premium launcher for every Software Vala module, filtered by your role, with favorites, recents and an AI copilot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ModuleSwitchDashboard,
});
