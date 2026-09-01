import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/lead-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Lead Manager — Software Vala" },
      { name: "description", content: "Live lead console with sources, country split, lead scoring, assignment and follow-up status." },
      { property: "og:title", content: "Lead Manager — Software Vala" },
      { property: "og:description", content: "Leads, sources and scoring from live data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LeadManager,
});

function LeadManager() {
  const leads = useManagerTable<any>("leads");
  const rows = leads.data ?? [];

  const qualified = rows.filter((l) => l.status === "qualified").length;
  const unassigned = rows.filter((l) => !l.assigned_to || l.assigned_to === "Unassigned").length;
  const avgScore = rows.length ? Math.round(rows.reduce((s, l) => s + Number(l.score), 0) / rows.length) : 0;

  const bySource = Object.entries(
    rows.reduce<Record<string, number>>((acc, l) => {
      acc[l.source] = (acc[l.source] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([source, count]) => ({ source, count }));

  const byCountry = Object.entries(
    rows.reduce<Record<string, number>>((acc, l) => {
      const c = l.country ?? "Unknown";
      acc[c] = (acc[c] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([country, count]) => ({ country, count }));

  return (
    <ManagerShell
      activeRole={"lead_manager" as any}
      title="Lead Manager"
      subtitle="Leads · Sources · Scoring · Assignment"
      kpis={
        <KpiCards
          items={[
            { label: "Total Leads", value: num(rows.length) },
            { label: "Qualified", value: num(qualified) },
            { label: "Avg Score", value: `${avgScore}/100` },
            { label: "Unassigned", value: num(unassigned) },
          ]}
        />
      }
      tabs={[
        {
          id: "all",
          label: "All Leads",
          content: (
            <DataTable
              loading={leads.isLoading}
              error={leads.error}
              rows={rows}
              columns={[
                { key: "full_name", header: "Name" },
                { key: "email", header: "Email" },
                { key: "phone", header: "Phone" },
                { key: "source", header: "Source" },
                { key: "country", header: "Country" },
                { key: "score", header: "Score" },
                { key: "assigned_to", header: "Owner" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "sources",
          label: "Sources",
          content: (
            <DataTable
              loading={leads.isLoading}
              error={leads.error}
              rows={bySource.sort((a, b) => b.count - a.count)}
              columns={[
                { key: "source", header: "Source" },
                { key: "count", header: "Leads", render: (r) => num(r.count) },
                {
                  key: "share",
                  header: "Share",
                  render: (r) => `${rows.length ? Math.round((r.count / rows.length) * 100) : 0}%`,
                },
              ]}
            />
          ),
        },
        {
          id: "countries",
          label: "Countries",
          content: (
            <DataTable
              loading={leads.isLoading}
              error={leads.error}
              rows={byCountry.sort((a, b) => b.count - a.count)}
              columns={[
                { key: "country", header: "Country" },
                { key: "count", header: "Leads", render: (r) => num(r.count) },
              ]}
            />
          ),
        },
        {
          id: "hot",
          label: "Hot Leads",
          content: (
            <DataTable
              loading={leads.isLoading}
              error={leads.error}
              rows={rows.filter((l) => Number(l.score) >= 70).sort((a, b) => b.score - a.score)}
              empty="No leads scoring 70 or above yet."
              columns={[
                { key: "full_name", header: "Name" },
                { key: "score", header: "Score" },
                { key: "source", header: "Source" },
                { key: "assigned_to", header: "Owner" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
