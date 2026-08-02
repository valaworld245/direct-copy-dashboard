import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, inr, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/reseller-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reseller Manager — Software Vala" },
      { name: "description", content: "Full reseller control: accounts, KYC, leads, payouts, commissions plus linked franchise accounts and franchise leads." },
      { property: "og:title", content: "Reseller Manager — Software Vala" },
      { property: "og:description", content: "Resellers, KYC, leads, payouts and franchise network access in one live console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResellerManager,
});

function ResellerManager() {
  const resellers = useManagerTable<any>("reseller_accounts");
  const leads = useManagerTable<any>("reseller_leads");
  const payouts = useManagerTable<any>("reseller_payouts");
  const franchises = useManagerTable<any>("franchise_accounts");
  const franchiseLeads = useManagerTable<any>("franchise_leads");

  const pipeline = (leads.data ?? []).reduce((s, l) => s + Number(l.value), 0);
  const pendingPayout = (payouts.data ?? []).filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <ManagerShell
      activeRole={"reseller_manager" as any}
      title="Reseller Manager"
      subtitle="Resellers · KYC · Leads · Payouts · Franchise network"
      kpis={
        <KpiCards
          items={[
            { label: "Resellers", value: num(resellers.data?.length), hint: `${(resellers.data ?? []).filter((r) => r.status === "active").length} active` },
            { label: "Lead Pipeline", value: inr(pipeline), hint: `${num(leads.data?.length)} leads` },
            { label: "Pending Payouts", value: inr(pendingPayout) },
            { label: "Franchises Linked", value: num(franchises.data?.length) },
          ]}
        />
      }
      tabs={[
        {
          id: "accounts",
          label: "Reseller Accounts",
          content: (
            <DataTable
              loading={resellers.isLoading}
              error={resellers.error}
              rows={resellers.data}
              columns={[
                { key: "name", header: "Reseller" },
                { key: "reseller_code", header: "Code" },
                { key: "region", header: "Region" },
                { key: "commission_rate", header: "Commission", render: (r) => `${r.commission_rate}%` },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "kyc",
          label: "KYC & Compliance",
          content: (
            <DataTable
              loading={resellers.isLoading}
              error={resellers.error}
              rows={resellers.data}
              columns={[
                { key: "name", header: "Reseller" },
                { key: "masked_email", header: "Masked Email" },
                { key: "kyc_status", header: "KYC", render: (r) => <StatusPill value={r.kyc_status} /> },
                { key: "status", header: "Account", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "leads",
          label: "Reseller Leads",
          content: (
            <DataTable
              loading={leads.isLoading}
              error={leads.error}
              rows={leads.data}
              columns={[
                { key: "client_name", header: "Client" },
                { key: "product", header: "Product" },
                { key: "value", header: "Value", render: (r) => inr(r.value) },
                { key: "stage", header: "Stage", render: (r) => <StatusPill value={r.stage} /> },
                {
                  key: "reseller",
                  header: "Reseller",
                  render: (r) => (resellers.data ?? []).find((x) => x.id === r.reseller_id)?.name ?? "—",
                },
              ]}
            />
          ),
        },
        {
          id: "payouts",
          label: "Wallet & Payouts",
          content: (
            <DataTable
              loading={payouts.isLoading}
              error={payouts.error}
              rows={payouts.data}
              columns={[
                {
                  key: "reseller",
                  header: "Reseller",
                  render: (r) => (resellers.data ?? []).find((x) => x.id === r.reseller_id)?.name ?? "—",
                },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
                { key: "method", header: "Method" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "commissions",
          label: "Commission Ledger",
          content: (
            <DataTable
              loading={resellers.isLoading || leads.isLoading}
              error={resellers.error ?? leads.error}
              rows={resellers.data}
              columns={[
                { key: "name", header: "Reseller" },
                {
                  key: "won",
                  header: "Won Value",
                  render: (r) =>
                    inr((leads.data ?? []).filter((l) => l.reseller_id === r.id && l.stage === "won").reduce((s, l) => s + Number(l.value), 0)),
                },
                {
                  key: "commission",
                  header: "Commission Due",
                  render: (r) =>
                    inr(
                      ((leads.data ?? []).filter((l) => l.reseller_id === r.id && l.stage === "won").reduce((s, l) => s + Number(l.value), 0) *
                        Number(r.commission_rate)) /
                        100,
                    ),
                },
              ]}
            />
          ),
        },
        {
          id: "franchises",
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
                { key: "monthly_revenue", header: "Revenue", render: (r) => inr(r.monthly_revenue) },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "franchise-leads",
          label: "Franchise Leads",
          content: (
            <DataTable
              loading={franchiseLeads.isLoading}
              error={franchiseLeads.error}
              rows={franchiseLeads.data}
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
