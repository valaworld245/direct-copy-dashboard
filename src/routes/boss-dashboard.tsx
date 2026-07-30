import { createFileRoute } from "@tanstack/react-router";
import { ModuleSwitchDashboard } from "@/components/module-switch/ModuleSwitchDashboard";

export const Route = createFileRoute("/boss-dashboard")({
  // Reads the client-side auth bridge to filter modules by role.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Boss Dashboard — Software Vala Command Launcher" },
      {
        name: "description",
        content:
          "Boss Dashboard: launch every Software Vala module from one cockpit — control panel, managers, partner portals, AMS recognition and vaults, with live activity metrics.",
      },
      { property: "og:title", content: "Boss Dashboard — Software Vala Command Launcher" },
      {
        property: "og:description",
        content:
          "One boss-level cockpit for every Software Vala module, filtered by role, with favorites, recents, live activity KPIs and an AI copilot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ModuleSwitchDashboard,
});
