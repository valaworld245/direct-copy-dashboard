import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, inr, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/influencer-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Influencer Manager — Software Vala" },
      { name: "description", content: "Manage creator roster, reach, engagement rate and campaign budgets with live conversion data." },
      { property: "og:title", content: "Influencer Manager — Software Vala" },
      { property: "og:description", content: "Creators, reach, campaigns and conversions in one live console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InfluencerManager,
});

function InfluencerManager() {
  const creators = useManagerTable<any>("influencer_profiles");
  const campaigns = useManagerTable<any>("influencer_campaigns");

  const reach = (creators.data ?? []).reduce((s, c) => s + Number(c.followers), 0);
  const budget = (campaigns.data ?? []).reduce((s, c) => s + Number(c.budget), 0);
  const conversions = (campaigns.data ?? []).reduce((s, c) => s + Number(c.conversions), 0);

  return (
    <ManagerShell
      activeRole={"influencer_manager" as any}
      title="Influencer Manager"
      subtitle="Creators · Reach · Campaigns · Conversions"
      kpis={
        <KpiCards
          items={[
            { label: "Creators", value: num(creators.data?.length), hint: `${(creators.data ?? []).filter((c) => c.status === "active").length} active` },
            { label: "Total Reach", value: num(reach) },
            { label: "Campaign Budget", value: inr(budget) },
            { label: "Conversions", value: num(conversions) },
          ]}
        />
      }
      tabs={[
        {
          id: "creators",
          label: "Creators",
          content: (
            <DataTable
              loading={creators.isLoading}
              error={creators.error}
              rows={creators.data}
              columns={[
                { key: "name", header: "Creator" },
                { key: "handle", header: "Handle" },
                { key: "platform", header: "Platform" },
                { key: "followers", header: "Followers", render: (r) => num(r.followers) },
                { key: "engagement_rate", header: "Engagement", render: (r) => `${r.engagement_rate}%` },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "campaigns",
          label: "Campaigns",
          content: (
            <DataTable
              loading={campaigns.isLoading}
              error={campaigns.error}
              rows={campaigns.data}
              columns={[
                { key: "title", header: "Campaign" },
                {
                  key: "creator",
                  header: "Creator",
                  render: (r) => (creators.data ?? []).find((x) => x.id === r.influencer_id)?.name ?? "—",
                },
                { key: "budget", header: "Budget", render: (r) => inr(r.budget) },
                { key: "conversions", header: "Conversions", render: (r) => num(r.conversions) },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "roi",
          label: "ROI",
          content: (
            <DataTable
              loading={campaigns.isLoading}
              error={campaigns.error}
              rows={campaigns.data}
              columns={[
                { key: "title", header: "Campaign" },
                { key: "cpa", header: "Cost / Conversion", render: (r) => (r.conversions ? inr(Math.round(r.budget / r.conversions)) : "—") },
                { key: "budget", header: "Spend", render: (r) => inr(r.budget) },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
