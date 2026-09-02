import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/license-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "License Manager — Software Vala" },
      { name: "description", content: "Live license console: issued keys, seats in use, license types, expiry tracking and suspended keys." },
      { property: "og:title", content: "License Manager — Software Vala" },
      { property: "og:description", content: "Keys, seats and expiries from live data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LicenseManager,
});

function LicenseManager() {
  const licenses = useManagerTable<any>("licenses");
  const rows = licenses.data ?? [];

  const active = rows.filter((l) => l.status === "active").length;
  const seats = rows.reduce((s, l) => s + Number(l.seats), 0);
  const today = new Date().toISOString().slice(0, 10);
  const expiring = rows.filter((l) => l.expires_on && String(l.expires_on) <= today).length;

  return (
    <ManagerShell
      activeRole={"license_manager" as any}
      title="License Manager"
      subtitle="Keys · Seats · Expiry"
      kpis={
        <KpiCards
          items={[
            { label: "Licenses", value: num(rows.length) },
            { label: "Active", value: num(active) },
            { label: "Total Seats", value: num(seats) },
            { label: "Expired", value: num(expiring) },
          ]}
        />
      }
      tabs={[
        {
          id: "all",
          label: "All Licenses",
          content: (
            <DataTable
              loading={licenses.isLoading}
              error={licenses.error}
              rows={rows}
              columns={[
                { key: "license_key", header: "Key" },
                { key: "product", header: "Product" },
                { key: "customer", header: "Customer" },
                { key: "seats", header: "Seats" },
                { key: "license_type", header: "Type" },
                { key: "expires_on", header: "Expires", render: (r) => r.expires_on ?? "—" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "expiring",
          label: "Expiring / Expired",
          content: (
            <DataTable
              loading={licenses.isLoading}
              error={licenses.error}
              rows={rows
                .filter((l) => l.expires_on)
                .sort((a, b) => String(a.expires_on).localeCompare(String(b.expires_on)))}
              empty="No licenses with an expiry date."
              columns={[
                { key: "license_key", header: "Key" },
                { key: "customer", header: "Customer" },
                { key: "expires_on", header: "Expires On" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "suspended",
          label: "Suspended",
          content: (
            <DataTable
              loading={licenses.isLoading}
              error={licenses.error}
              rows={rows.filter((l) => l.status === "suspended")}
              empty="No suspended licenses."
              columns={[
                { key: "license_key", header: "Key" },
                { key: "product", header: "Product" },
                { key: "customer", header: "Customer" },
                { key: "seats", header: "Seats" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
