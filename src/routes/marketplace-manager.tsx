import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, inr, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/marketplace-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Marketplace Manager — Software Vala" },
      { name: "description", content: "Manage marketplace vendors, listings and orders with live revenue, approval and catalogue data." },
      { property: "og:title", content: "Marketplace Manager — Software Vala" },
      { property: "og:description", content: "Vendors, listings and orders in one live marketplace control room." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MarketplaceManager,
});

function MarketplaceManager() {
  const vendors = useManagerTable<any>("marketplace_vendors");
  const listings = useManagerTable<any>("marketplace_listings");
  const orders = useManagerTable<any>("marketplace_orders");

  const gmv = (orders.data ?? []).filter((o) => o.status === "paid").reduce((s, o) => s + Number(o.amount), 0);

  return (
    <ManagerShell
      activeRole={"marketplace_manager" as any}
      title="Marketplace Manager"
      subtitle="Vendors · Listings · Orders · Revenue"
      kpis={
        <KpiCards
          items={[
            { label: "Vendors", value: num(vendors.data?.length), hint: `${(vendors.data ?? []).filter((v) => v.status === "active").length} active` },
            { label: "Listings", value: num(listings.data?.length), hint: `${(listings.data ?? []).filter((l) => l.status === "review").length} in review` },
            { label: "Orders", value: num(orders.data?.length) },
            { label: "Paid GMV", value: inr(gmv) },
          ]}
        />
      }
      tabs={[
        {
          id: "vendors",
          label: "Vendors",
          content: (
            <DataTable
              loading={vendors.isLoading}
              error={vendors.error}
              rows={vendors.data}
              columns={[
                { key: "name", header: "Vendor" },
                { key: "country", header: "Country" },
                { key: "contact_email", header: "Contact" },
                { key: "rating", header: "Rating" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "listings",
          label: "Listings",
          content: (
            <DataTable
              loading={listings.isLoading}
              error={listings.error}
              rows={listings.data}
              columns={[
                { key: "title", header: "Listing" },
                { key: "category", header: "Category" },
                { key: "price", header: "Price", render: (r) => inr(r.price) },
                { key: "views", header: "Views", render: (r) => num(r.views) },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "orders",
          label: "Orders",
          content: (
            <DataTable
              loading={orders.isLoading}
              error={orders.error}
              rows={orders.data}
              columns={[
                { key: "buyer_name", header: "Buyer" },
                { key: "amount", header: "Amount", render: (r) => inr(r.amount) },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
                { key: "created_at", header: "Date", render: (r) => new Date(r.created_at).toLocaleDateString("en-IN") },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
