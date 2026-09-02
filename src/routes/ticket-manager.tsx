import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { DataTable, KpiCards, StatusPill, num, useManagerTable } from "@/components/manager/ManagerData";

export const Route = createFileRoute("/ticket-manager")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Ticket Manager — Software Vala" },
      { name: "description", content: "Live support ticket console: open queue, priorities, agent workload and resolved history." },
      { property: "og:title", content: "Ticket Manager — Software Vala" },
      { property: "og:description", content: "Support queue, priorities and agents from live data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TicketManager,
});

function TicketManager() {
  const tickets = useManagerTable<any>("support_tickets");
  const rows = tickets.data ?? [];

  const open = rows.filter((t) => t.status !== "resolved" && t.status !== "closed");
  const urgent = rows.filter((t) => t.priority === "urgent").length;
  const unassigned = rows.filter((t) => !t.assigned_agent).length;

  const byAgent = Object.entries(
    rows.reduce<Record<string, number>>((acc, t) => {
      const a = t.assigned_agent ?? "Unassigned";
      acc[a] = (acc[a] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([agent, count]) => ({ agent, count }));

  return (
    <ManagerShell
      activeRole={"ticket_manager" as any}
      title="Ticket Manager"
      subtitle="Queue · Priority · Agents"
      kpis={
        <KpiCards
          items={[
            { label: "Tickets", value: num(rows.length) },
            { label: "Open", value: num(open.length) },
            { label: "Urgent", value: num(urgent) },
            { label: "Unassigned", value: num(unassigned) },
          ]}
        />
      }
      tabs={[
        {
          id: "queue",
          label: "Open Queue",
          content: (
            <DataTable
              loading={tickets.isLoading}
              error={tickets.error}
              rows={open}
              empty="Queue is clear — no open tickets."
              columns={[
                { key: "ticket_number", header: "Ticket #" },
                { key: "subject", header: "Subject" },
                { key: "requester", header: "Requester" },
                { key: "priority", header: "Priority", render: (r) => <StatusPill value={r.priority} /> },
                { key: "assigned_agent", header: "Agent", render: (r) => r.assigned_agent ?? "Unassigned" },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "all",
          label: "All Tickets",
          content: (
            <DataTable
              loading={tickets.isLoading}
              error={tickets.error}
              rows={rows}
              columns={[
                { key: "ticket_number", header: "Ticket #" },
                { key: "subject", header: "Subject" },
                { key: "requester", header: "Requester" },
                { key: "priority", header: "Priority", render: (r) => <StatusPill value={r.priority} /> },
                { key: "status", header: "Status", render: (r) => <StatusPill value={r.status} /> },
              ]}
            />
          ),
        },
        {
          id: "agents",
          label: "Agent Load",
          content: (
            <DataTable
              loading={tickets.isLoading}
              error={tickets.error}
              rows={byAgent.sort((a, b) => b.count - a.count)}
              columns={[
                { key: "agent", header: "Agent" },
                { key: "count", header: "Tickets", render: (r) => num(r.count) },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
