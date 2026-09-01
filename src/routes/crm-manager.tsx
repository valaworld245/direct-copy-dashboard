import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, inr, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/crm-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "CRM Manager — Software Vala" },
      { name: "description", content: "Live CRM console for company contacts, pipeline stages, deal value and expected close dates." },
      { property: "og:title", content: "CRM Manager — Software Vala" },
      { property: "og:description", content: "Contacts, deals and pipeline value from live data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CrmManager,
});

function CrmManager() {
  const contacts = useManagerTable<any>("crm_contacts");
  const deals = useManagerTable<any>("crm_deals");

  const pipeline = (deals.data ?? []).filter((d) => d.stage !== "closed_won").reduce((s, d) => s + Number(d.amount), 0);
  const won = (deals.data ?? []).filter((d) => d.stage === "closed_won").reduce((s, d) => s + Number(d.amount), 0);
  const ltv = (contacts.data ?? []).reduce((s, c) => s + Number(c.lifetime_value), 0);

  return (
    <ManagerShell
      activeRole={"crm_manager" as any}
      title="CRM Manager"
      subtitle="Contacts · Pipeline · Deals"
      kpis={
        <KpiCards
          items={[
            { label: "Contacts", value: num(contacts.data?.length) },
            { label: "Open Pipeline", value: inr(pipeline) },
            { label: "Closed Won", value: inr(won) },
            { label: "Lifetime Value", value: inr(ltv) },
          ]}
        />
      }
      tabs={[
        {
          id: "contacts",
          label: "Contacts",
          content: (
            <DataTable
              loading={contacts.isLoading}
              error={contacts.error}
              rows={contacts.data}
              columns={[
                { key: "company", header: "Company" },
                { key: "contact_name", header: "Contact" },
                { key: "email", header: "Email" },
                { key: "phone", header: "Phone" },
                { key: "owner", header: "Owner" },
                { key: "lifetime_value", header: "LTV", render: (r) => inr(r.lifetime_value) },
                { key: "stage", header: "Stage", render: (r) => <StatusPill value={r.stage} /> },
              ]}
            />
          ),
        },
        {
          id: "deals",
          label: "Deals",
          content: (
            <DataTable
              loading={deals.isLoading}
              error={deals.error}
              rows={deals.data}
              columns={[
                { key: "title", header: "Deal" },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
                { key: "probability", header: "Win %", render: (r) => `${r.probability}%` },
                { key: "expected_close", header: "Expected Close", render: (r) => r.expected_close ?? "—" },
                { key: "stage", header: "Stage", render: (r) => <StatusPill value={r.stage} /> },
              ]}
            />
          ),
        },
        {
          id: "closing",
          label: "Closing Soon",
          content: (
            <DataTable
              loading={deals.isLoading}
              error={deals.error}
              rows={(deals.data ?? [])
                .filter((d) => d.stage !== "closed_won" && d.expected_close)
                .sort((a, b) => String(a.expected_close).localeCompare(String(b.expected_close)))}
              empty="No open deals with a close date."
              columns={[
                { key: "title", header: "Deal" },
                { key: "expected_close", header: "Expected Close" },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
                { key: "probability", header: "Win %", render: (r) => `${r.probability}%` },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
