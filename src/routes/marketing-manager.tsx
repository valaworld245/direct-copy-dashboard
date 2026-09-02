import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, inr, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/marketing-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Marketing Manager — Software Vala" },
      { name: "description", content: "Live marketing console: campaign spend, budget usage, leads generated, conversions and cost per lead." },
      { property: "og:title", content: "Marketing Manager — Software Vala" },
      { property: "og:description", content: "Campaigns, spend and conversions from live data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MarketingManager,
});

function MarketingManager() {
  const campaigns = useManagerTable<any>("marketing_campaigns");
  const rows = campaigns.data ?? [];

  const budget = rows.reduce((s, c) => s + Number(c.budget), 0);
  const spend = rows.reduce((s, c) => s + Number(c.spend), 0);
  const leads = rows.reduce((s, c) => s + Number(c.leads), 0);
  const conversions = rows.reduce((s, c) => s + Number(c.conversions), 0);
  const cpl = leads ? Math.round(spend / leads) : 0;

  const byChannel = Object.values(
    rows.reduce<Record<string, { channel: string; spend: number; leads: number; conversions: number }>>((acc, c) => {
      const row = acc[c.channel] ?? { channel: c.channel, spend: 0, leads: 0, conversions: 0 };
      row.spend += Number(c.spend);
      row.leads += Number(c.leads);
      row.conversions += Number(c.conversions);
      acc[c.channel] = row;
      return acc;
    }, {}),
  );

  return (
    <ManagerShell
      activeRole={"marketing_management" as any}
      title="Marketing Manager"
      subtitle="Campaigns · Spend · Leads · Conversions"
      kpis={
        <KpiCards
          items={[
            { label: "Campaigns", value: num(rows.length) },
            { label: "Spend / Budget", value: `${inr(spend)} / ${inr(budget)}` },
            { label: "Leads", value: num(leads), hint: `${num(conversions)} conversions` },
            { label: "Cost / Lead", value: inr(cpl) },
          ]}
        />
      }
      tabs={[
        {
          id: "campaigns",
          label: "Campaigns",
          content: (
            <DataTable
              loading={campaigns.isLoading}
              error={campaigns.error}
              rows={rows}
              columns={[
                { key: "name", header: "Campaign" },
                { key: "channel", header: "Channel" },
                { key: "budget", header: "Budget", render: (r) => inr(r.budget) },
                { key: "spend", header: "Spend", render: (r) => inr(r.spend) },
                { key: "leads", header: "Leads", render: (r) => num(r.leads) },
                { key: "conversions", header: "Conv.", render: (r) => num(r.conversions) },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "channels",
          label: "Channels",
          content: (
            <DataTable
              loading={campaigns.isLoading}
              error={campaigns.error}
              rows={byChannel.sort((a, b) => b.leads - a.leads)}
              columns={[
                { key: "channel", header: "Channel" },
                { key: "spend", header: "Spend", render: (r) => inr(r.spend) },
                { key: "leads", header: "Leads", render: (r) => num(r.leads) },
                { key: "conversions", header: "Conversions", render: (r) => num(r.conversions) },
                { key: "cpl", header: "Cost / Lead", render: (r) => inr(r.leads ? Math.round(r.spend / r.leads) : 0) },
              ]}
            />
          ),
        },
        {
          id: "efficiency",
          label: "Efficiency",
          content: (
            <DataTable
              loading={campaigns.isLoading}
              error={campaigns.error}
              rows={[...rows].sort(
                (a, b) => (b.conversions / (b.spend || 1)) - (a.conversions / (a.spend || 1)),
              )}
              columns={[
                { key: "name", header: "Campaign" },
                {
                  key: "conv_rate",
                  header: "Lead → Conv.",
                  render: (r) => `${r.leads ? Math.round((r.conversions / r.leads) * 100) : 0}%`,
                },
                {
                  key: "cac",
                  header: "Cost / Conversion",
                  render: (r) => inr(r.conversions ? Math.round(r.spend / r.conversions) : 0),
                },
                {
                  key: "budget_used",
                  header: "Budget Used",
                  render: (r) => `${r.budget ? Math.round((r.spend / r.budget) * 100) : 0}%`,
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
