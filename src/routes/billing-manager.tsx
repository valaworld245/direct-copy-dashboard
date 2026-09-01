import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, inr, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/billing-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Billing Manager — Software Vala" },
      { name: "description", content: "Live billing console: invoices, tax collected, outstanding balance and overdue accounts." },
      { property: "og:title", content: "Billing Manager — Software Vala" },
      { property: "og:description", content: "Invoices, tax and outstanding balances from live data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BillingManager,
});

function BillingManager() {
  const invoices = useManagerTable<any>("invoices");
  const rows = invoices.data ?? [];

  const billed = rows.reduce((s, i) => s + Number(i.amount) + Number(i.tax), 0);
  const collected = rows.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount) + Number(i.tax), 0);
  const overdue = rows.filter((i) => i.status === "overdue");

  return (
    <ManagerShell
      activeRole={"billing_manager" as any}
      title="Billing Manager"
      subtitle="Invoices · Tax · Collections"
      kpis={
        <KpiCards
          items={[
            { label: "Invoices", value: num(rows.length) },
            { label: "Total Billed", value: inr(billed) },
            { label: "Collected", value: inr(collected) },
            { label: "Outstanding", value: inr(billed - collected), hint: `${overdue.length} overdue` },
          ]}
        />
      }
      tabs={[
        {
          id: "invoices",
          label: "Invoices",
          content: (
            <DataTable
              loading={invoices.isLoading}
              error={invoices.error}
              rows={rows}
              columns={[
                { key: "invoice_number", header: "Invoice #" },
                { key: "customer", header: "Customer" },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
                { key: "tax", header: "Tax", render: (r) => inr(r.tax) },
                { key: "due_date", header: "Due", render: (r) => r.due_date ?? "—" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "outstanding",
          label: "Outstanding",
          content: (
            <DataTable
              loading={invoices.isLoading}
              error={invoices.error}
              rows={rows.filter((i) => i.status !== "paid")}
              empty="Nothing outstanding — every invoice is paid."
              columns={[
                { key: "invoice_number", header: "Invoice #" },
                { key: "customer", header: "Customer" },
                { key: "amount", header: "Due Amount", render: (r) => inr(Number(r.amount) + Number(r.tax)) },
                { key: "due_date", header: "Due Date", render: (r) => r.due_date ?? "—" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "overdue",
          label: "Overdue",
          content: (
            <DataTable
              loading={invoices.isLoading}
              error={invoices.error}
              rows={overdue}
              empty="No overdue invoices."
              columns={[
                { key: "invoice_number", header: "Invoice #" },
                { key: "customer", header: "Customer" },
                { key: "amount", header: "Amount", render: (r) => inr(Number(r.amount) + Number(r.tax)) },
                { key: "due_date", header: "Was Due" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
