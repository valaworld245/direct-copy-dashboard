import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ReactNode } from "react";

/** Real Supabase read for a manager table. */
export function useManagerTable<T = Record<string, unknown>>(
  table: string,
  select = "*",
  order = "created_at",
) {
  return useQuery({
    queryKey: ["manager-table", table, select, order],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(table)
        .select(select)
        .order(order, { ascending: false });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export function inr(value: number | null | undefined) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

export function num(value: number | null | undefined) {
  return Number(value ?? 0).toLocaleString("en-IN");
}

export function KpiCards({
  items,
}: {
  items: { label: string; value: string; hint?: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((k) => (
        <div
          key={k.label}
          className="rounded-xl border border-[rgba(88,160,255,0.28)] bg-white/[0.04] p-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">{k.label}</p>
          <p className="mt-1 text-xl font-extrabold text-white">{k.value}</p>
          {k.hint && <p className="text-[11px] text-white/50">{k.hint}</p>}
        </div>
      ))}
    </div>
  );
}

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
};

export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  loading,
  error,
  empty = "No records yet.",
}: {
  columns: Column<T>[];
  rows: T[] | undefined;
  loading?: boolean;
  error?: unknown;
  empty?: string;
}) {
  if (loading) {
    return <p className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60">Loading live data…</p>;
  }
  if (error) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
        Could not load data: {(error as Error)?.message ?? "unknown error"}
      </p>
    );
  }
  if (!rows || rows.length === 0) {
    return <p className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-[rgba(88,160,255,0.28)] bg-white/[0.03]">
      <table className="w-full min-w-[640px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.04]">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 text-white/85">
                  {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusPill({ value }: { value: string }) {
  const v = (value ?? "").toLowerCase();
  const tone =
    ["active", "paid", "won", "verified", "published", "approved", "completed"].includes(v)
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : ["pending", "review", "new", "running", "negotiation", "audit", "paused"].includes(v)
        ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
        : "border-red-500/30 bg-red-500/10 text-red-300";
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${tone}`}>
      {value ?? "—"}
    </span>
  );
}
