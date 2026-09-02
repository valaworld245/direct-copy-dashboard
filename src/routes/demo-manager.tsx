import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/demo-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Demo Manager — Software Vala" },
      { name: "description", content: "Live demo console: demo requests, scheduled sessions, completed demos and their outcomes." },
      { property: "og:title", content: "Demo Manager — Software Vala" },
      { property: "og:description", content: "Demo requests, schedule and outcomes from live data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DemoManager,
});

const when = (value: string | null) => (value ? new Date(value).toLocaleString("en-IN") : "Not scheduled");

function DemoManager() {
  const demos = useManagerTable<any>("demo_requests");
  const rows = demos.data ?? [];

  const scheduled = rows.filter((d) => d.status === "scheduled");
  const completed = rows.filter((d) => d.status === "completed");
  const pending = rows.filter((d) => d.status === "requested");

  return (
    <ManagerShell
      activeRole={"demo_manager" as any}
      title="Demo Manager"
      subtitle="Requests · Schedule · Outcomes"
      kpis={
        <KpiCards
          items={[
            { label: "Demo Requests", value: num(rows.length) },
            { label: "Scheduled", value: num(scheduled.length) },
            { label: "Completed", value: num(completed.length) },
            { label: "Awaiting Slot", value: num(pending.length) },
          ]}
        />
      }
      tabs={[
        {
          id: "upcoming",
          label: "Upcoming",
          content: (
            <DataTable
              loading={demos.isLoading}
              error={demos.error}
              rows={scheduled}
              empty="No demos scheduled."
              columns={[
                { key: "company", header: "Company" },
                { key: "contact_name", header: "Contact" },
                { key: "product", header: "Product" },
                { key: "scheduled_at", header: "When", render: (r) => when(r.scheduled_at) },
              ]}
            />
          ),
        },
        {
          id: "requests",
          label: "All Requests",
          content: (
            <DataTable
              loading={demos.isLoading}
              error={demos.error}
              rows={rows}
              columns={[
                { key: "company", header: "Company" },
                { key: "contact_name", header: "Contact" },
                { key: "product", header: "Product" },
                { key: "scheduled_at", header: "When", render: (r) => when(r.scheduled_at) },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "outcomes",
          label: "Outcomes",
          content: (
            <DataTable
              loading={demos.isLoading}
              error={demos.error}
              rows={completed}
              empty="No completed demos yet."
              columns={[
                { key: "company", header: "Company" },
                { key: "product", header: "Product" },
                { key: "scheduled_at", header: "Held On", render: (r) => when(r.scheduled_at) },
                { key: "outcome", header: "Outcome", render: (r) => r.outcome ?? "—" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
