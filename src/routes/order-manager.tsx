import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, inr, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/order-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Order Manager — Software Vala" },
      { name: "description", content: "Live order console: order value, payment status, fulfilment stage and pending shipments." },
      { property: "og:title", content: "Order Manager — Software Vala" },
      { property: "og:description", content: "Orders, payments and fulfilment from live data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrderManager,
});

function OrderManager() {
  const orders = useManagerTable<any>("orders");
  const rows = orders.data ?? [];

  const revenue = rows.reduce((s, o) => s + Number(o.amount), 0);
  const paid = rows.filter((o) => o.payment_status === "paid").reduce((s, o) => s + Number(o.amount), 0);
  const open = rows.filter((o) => o.status !== "delivered").length;

  return (
    <ManagerShell
      activeRole={"order_manager" as any}
      title="Order Manager"
      subtitle="Orders · Payments · Fulfilment"
      kpis={
        <KpiCards
          items={[
            { label: "Orders", value: num(rows.length) },
            { label: "Order Value", value: inr(revenue) },
            { label: "Collected", value: inr(paid) },
            { label: "Open Orders", value: num(open) },
          ]}
        />
      }
      tabs={[
        {
          id: "all",
          label: "All Orders",
          content: (
            <DataTable
              loading={orders.isLoading}
              error={orders.error}
              rows={rows}
              columns={[
                { key: "order_number", header: "Order #" },
                { key: "customer", header: "Customer" },
                { key: "product", header: "Product" },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
                { key: "payment_status", header: "Payment", render: (r) => <StatusPill value={r.payment_status} /> },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "unpaid",
          label: "Payment Pending",
          content: (
            <DataTable
              loading={orders.isLoading}
              error={orders.error}
              rows={rows.filter((o) => o.payment_status !== "paid")}
              empty="Every order is fully paid."
              columns={[
                { key: "order_number", header: "Order #" },
                { key: "customer", header: "Customer" },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
                { key: "payment_status", header: "Payment", render: (r) => <StatusPill value={r.payment_status} /> },
              ]}
            />
          ),
        },
        {
          id: "fulfilment",
          label: "Fulfilment",
          content: (
            <DataTable
              loading={orders.isLoading}
              error={orders.error}
              rows={rows.filter((o) => o.status !== "delivered")}
              empty="All orders delivered."
              columns={[
                { key: "order_number", header: "Order #" },
                { key: "product", header: "Product" },
                { key: "customer", header: "Customer" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
