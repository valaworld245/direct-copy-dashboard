import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/seo-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "SEO Manager — Software Vala" },
      { name: "description", content: "Track SEO projects, domain health scores, keyword rankings, search volume and intent from live data." },
      { property: "og:title", content: "SEO Manager — Software Vala" },
      { property: "og:description", content: "Projects, health scores and keyword rankings in one live SEO console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SeoManager,
});

function SeoManager() {
  const projects = useManagerTable<any>("seo_projects");
  const keywords = useManagerTable<any>("seo_keywords");

  const avgHealth = projects.data?.length
    ? Math.round(projects.data.reduce((s, p) => s + Number(p.health_score), 0) / projects.data.length)
    : 0;
  const top10 = (keywords.data ?? []).filter((k) => k.position > 0 && k.position <= 10).length;
  const volume = (keywords.data ?? []).reduce((s, k) => s + Number(k.volume), 0);

  return (
    <ManagerShell
      activeRole={"seo_manager" as any}
      title="SEO Manager"
      subtitle="Projects · Health · Keywords · Rankings"
      kpis={
        <KpiCards
          items={[
            { label: "Projects", value: num(projects.data?.length) },
            { label: "Avg Health", value: `${avgHealth}/100` },
            { label: "Keywords", value: num(keywords.data?.length), hint: `${top10} in top 10` },
            { label: "Tracked Volume", value: num(volume) },
          ]}
        />
      }
      tabs={[
        {
          id: "projects",
          label: "Projects",
          content: (
            <DataTable
              loading={projects.isLoading}
              error={projects.error}
              rows={projects.data}
              columns={[
                { key: "domain", header: "Domain" },
                { key: "owner_team", header: "Owner Team" },
                { key: "health_score", header: "Health", render: (r) => `${r.health_score}/100` },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "keywords",
          label: "Keywords",
          content: (
            <DataTable
              loading={keywords.isLoading}
              error={keywords.error}
              rows={keywords.data}
              columns={[
                { key: "keyword", header: "Keyword" },
                {
                  key: "project",
                  header: "Project",
                  render: (r) => (projects.data ?? []).find((p) => p.id === r.project_id)?.domain ?? "—",
                },
                { key: "position", header: "Position" },
                { key: "volume", header: "Volume", render: (r) => num(r.volume) },
                { key: "intent", header: "Intent" },
              ]}
            />
          ),
        },
        {
          id: "opportunities",
          label: "Opportunities",
          content: (
            <DataTable
              loading={keywords.isLoading}
              error={keywords.error}
              rows={(keywords.data ?? []).filter((k) => k.position > 10).sort((a, b) => b.volume - a.volume)}
              empty="No keywords outside the top 10 — nothing to fix."
              columns={[
                { key: "keyword", header: "Keyword" },
                { key: "position", header: "Current Position" },
                { key: "volume", header: "Volume", render: (r) => num(r.volume) },
                { key: "gap", header: "Positions To Top 10", render: (r) => r.position - 10 },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
