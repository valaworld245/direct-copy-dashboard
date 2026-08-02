import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, inr, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/affiliate-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Affiliate Manager — Software Vala" },
      { name: "description", content: "Track affiliate partners, referral clicks, signups and commission payouts from live data." },
      { property: "og:title", content: "Affiliate Manager — Software Vala" },
      { property: "og:description", content: "Partners, tiers, clicks, signups and commissions in one console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AffiliateManager,
});

function AffiliateManager() {
  const partners = useManagerTable<any>("affiliate_partners");
  const commissions = useManagerTable<any>("affiliate_commissions");

  const pending = (commissions.data ?? []).filter((c) => c.status === "pending").reduce((s, c) => s + Number(c.amount), 0);
  const paid = (commissions.data ?? []).filter((c) => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0);
  const clicks = (partners.data ?? []).reduce((s, p) => s + Number(p.clicks), 0);
  const signups = (partners.data ?? []).reduce((s, p) => s + Number(p.signups), 0);

  return (
    <ManagerShell
      activeRole={"affiliate_manager" as any}
      title="Affiliate Manager"
      subtitle="Partners · Clicks · Signups · Commissions"
      kpis={
        <KpiCards
          items={[
            { label: "Partners", value: num(partners.data?.length) },
            { label: "Clicks", value: num(clicks), hint: `${num(signups)} signups` },
            { label: "Pending Commission", value: inr(pending) },
            { label: "Paid Commission", value: inr(paid) },
          ]}
        />
      }
      tabs={[
        {
          id: "partners",
          label: "Partners",
          content: (
            <DataTable
              loading={partners.isLoading}
              error={partners.error}
              rows={partners.data}
              columns={[
                { key: "name", header: "Partner" },
                { key: "affiliate_code", header: "Code" },
                { key: "tier", header: "Tier" },
                { key: "clicks", header: "Clicks", render: (r) => num(r.clicks) },
                { key: "signups", header: "Signups", render: (r) => num(r.signups) },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "commissions",
          label: "Commissions",
          content: (
            <DataTable
              loading={commissions.isLoading}
              error={commissions.error}
              rows={commissions.data}
              columns={[
                { key: "reference", header: "Reference" },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
                { key: "created_at", header: "Date", render: (r) => new Date(r.created_at).toLocaleDateString("en-IN") },
              ]}
            />
          ),
        },
        {
          id: "performance",
          label: "Performance",
          content: (
            <DataTable
              loading={partners.isLoading}
              error={partners.error}
              rows={(partners.data ?? []).slice().sort((a, b) => b.signups - a.signups)}
              columns={[
                { key: "name", header: "Partner" },
                { key: "conv", header: "Conversion", render: (r) => `${r.clicks ? ((r.signups / r.clicks) * 100).toFixed(2) : "0.00"}%` },
                {
                  key: "earned",
                  header: "Earned",
                  render: (r) =>
                    inr((commissions.data ?? []).filter((c) => c.partner_id === r.id).reduce((s, c) => s + Number(c.amount), 0)),
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
