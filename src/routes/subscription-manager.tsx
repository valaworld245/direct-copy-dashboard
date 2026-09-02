import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, inr, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/subscription-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Subscription Manager — Software Vala" },
      { name: "description", content: "Live subscription console: active plans, recurring revenue, trials, renewals and past-due accounts." },
      { property: "og:title", content: "Subscription Manager — Software Vala" },
      { property: "og:description", content: "Plans, recurring revenue and renewals from live data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SubscriptionManager,
});

function SubscriptionManager() {
  const subs = useManagerTable<any>("subscriptions");
  const rows = subs.data ?? [];

  const active = rows.filter((s) => s.status === "active");
  const mrr = active.reduce(
    (sum, s) => sum + (s.billing_cycle === "yearly" ? Number(s.amount) / 12 : Number(s.amount)),
    0,
  );
  const trials = rows.filter((s) => s.status === "trialing").length;
  const pastDue = rows.filter((s) => s.status === "past_due").length;

  return (
    <ManagerShell
      activeRole={"subscription_manager" as any}
      title="Subscription Manager"
      subtitle="Plans · MRR · Renewals"
      kpis={
        <KpiCards
          items={[
            { label: "Subscriptions", value: num(rows.length) },
            { label: "Active", value: num(active.length) },
            { label: "MRR", value: inr(Math.round(mrr)) },
            { label: "Trials / Past Due", value: `${trials} / ${pastDue}` },
          ]}
        />
      }
      tabs={[
        {
          id: "all",
          label: "All Subscriptions",
          content: (
            <DataTable
              loading={subs.isLoading}
              error={subs.error}
              rows={rows}
              columns={[
                { key: "customer", header: "Customer" },
                { key: "plan", header: "Plan" },
                { key: "billing_cycle", header: "Cycle" },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
                { key: "renews_on", header: "Renews", render: (r) => r.renews_on ?? "—" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "renewals",
          label: "Upcoming Renewals",
          content: (
            <DataTable
              loading={subs.isLoading}
              error={subs.error}
              rows={rows
                .filter((s) => s.renews_on)
                .sort((a, b) => String(a.renews_on).localeCompare(String(b.renews_on)))}
              empty="No renewal dates set."
              columns={[
                { key: "customer", header: "Customer" },
                { key: "plan", header: "Plan" },
                { key: "renews_on", header: "Renews On" },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
              ]}
            />
          ),
        },
        {
          id: "risk",
          label: "At Risk",
          content: (
            <DataTable
              loading={subs.isLoading}
              error={subs.error}
              rows={rows.filter((s) => s.status === "past_due" || s.status === "trialing")}
              empty="No trials or past-due subscriptions."
              columns={[
                { key: "customer", header: "Customer" },
                { key: "plan", header: "Plan" },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
