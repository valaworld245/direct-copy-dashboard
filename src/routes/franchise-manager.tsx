import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, inr, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/franchise-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Franchise Manager — Software Vala" },
      { name: "description", content: "Franchise network control: territories, owners, revenue against target and franchise lead pipeline." },
      { property: "og:title", content: "Franchise Manager — Software Vala" },
      { property: "og:description", content: "Territories, owners, targets and franchise lead pipeline in one live console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FranchiseManager,
});

function FranchiseManager() {
  const franchises = useManagerTable<any>("franchise_accounts");
  const leads = useManagerTable<any>("franchise_leads");

  const revenue = (franchises.data ?? []).reduce((s, f) => s + Number(f.monthly_revenue), 0);
  const target = (franchises.data ?? []).reduce((s, f) => s + Number(f.monthly_target), 0);
  const pipeline = (leads.data ?? []).reduce((s, l) => s + Number(l.value), 0);

  return (
    <ManagerShell
      activeRole={"franchise_manager" as any}
      title="Franchise Manager"
      subtitle="Territories · Owners · Targets · Leads"
      kpis={
        <KpiCards
          items={[
            { label: "Franchises", value: num(franchises.data?.length), hint: `${(franchises.data ?? []).filter((f) => f.status === "active").length} active` },
            { label: "Monthly Revenue", value: inr(revenue) },
            { label: "Target Achieved", value: target ? `${((revenue / target) * 100).toFixed(1)}%` : "—", hint: inr(target) },
            { label: "Lead Pipeline", value: inr(pipeline), hint: `${num(leads.data?.length)} leads` },
          ]}
        />
      }
      tabs={[
        {
          id: "accounts",
          label: "Franchise Accounts",
          content: (
            <DataTable
              loading={franchises.isLoading}
              error={franchises.error}
              rows={franchises.data}
              columns={[
                { key: "name", header: "Franchise" },
                { key: "franchise_code", header: "Code" },
                { key: "territory", header: "Territory" },
                { key: "owner_name", header: "Owner" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "performance",
          label: "Performance",
          content: (
            <DataTable
              loading={franchises.isLoading}
              error={franchises.error}
              rows={franchises.data}
              columns={[
                { key: "name", header: "Franchise" },
                { key: "monthly_target", header: "Target", render: (r) => inr(r.monthly_target) },
                { key: "monthly_revenue", header: "Revenue", render: (r) => inr(r.monthly_revenue) },
                {
                  key: "ach",
                  header: "Achievement",
                  render: (r) => (r.monthly_target ? `${((r.monthly_revenue / r.monthly_target) * 100).toFixed(1)}%` : "—"),
                },
              ]}
            />
          ),
        },
        {
          id: "leads",
          label: "Franchise Leads",
          content: (
            <DataTable
              loading={leads.isLoading}
              error={leads.error}
              rows={leads.data}
              columns={[
                { key: "client_name", header: "Client" },
                { key: "city", header: "City" },
                { key: "value", header: "Value", render: (r) => inr(r.value) },
                { key: "stage", header: "Stage", render: (r) => <StatusPill value={r.stage} /> },
                {
                  key: "franchise",
                  header: "Franchise",
                  render: (r) => (franchises.data ?? []).find((x) => x.id === r.franchise_id)?.name ?? "—",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
