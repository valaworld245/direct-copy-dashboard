import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// The merged module app (all feature dashboards from the reference project)
// is mounted here as a catch-all. Existing top-level routes such as "/" and
// "/dashboard/$role" still win, so the current UI is untouched.
const ModuleApp = lazy(() => import("@/App"));

export const Route = createFileRoute("/$")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Modules — Software Vala" },
      { name: "description", content: "Software Vala module workspaces: sales, HR, finance, demos, AI and more." },
      { property: "og:title", content: "Modules — Software Vala" },
      { property: "og:description", content: "Software Vala module workspaces: sales, HR, finance, demos, AI and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ModuleAppRoute,
});

function ModuleAppRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ModuleApp />
    </Suspense>
  );
}