import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen, Star, LogOut, Search } from "lucide-react";
import type { ModuleEntry } from "@/lib/module-catalog";

export const MS_SIDEBAR_WIDTH = 252;
export const MS_SIDEBAR_COLLAPSED_WIDTH = 62;

const COLORS = {
  bgGradient: "linear-gradient(180deg, #10254a 0%, #0b1a35 55%, #060d1d 100%)",
  border: "rgba(88, 160, 255, 0.32)",
  activeHighlight: "#2f7dff",
  iconColor: "#bcd8ff",
};

type Props = {
  modules: ModuleEntry[];
  groupOrder: string[];
  favorites: string[];
  activeId: string | null;
  collapsed: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  onToggleCollapse: () => void;
  onSelect: (m: ModuleEntry) => void;
  onToggleFavorite: (id: string) => void;
  onLogout: () => void;
};

const ModuleButton = memo(function ModuleButton({
  module: m, isActive, compact, isFavorite, onSelect, onToggleFavorite,
}: {
  module: ModuleEntry;
  isActive: boolean;
  compact: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  const Icon = m.icon;
  return (
    <div className="group relative flex items-center">
      <button
        type="button"
        onClick={onSelect}
        title={compact ? m.label : undefined}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-left",
          "min-h-[32px] transition-all duration-200 ease-out will-change-transform",
          isActive ? "" : "hover:translate-x-0.5 hover:bg-white/10",
        )}
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${COLORS.activeHighlight} 0%, #48c6ff 100%)`
            : undefined,
          boxShadow: isActive ? "0 10px 26px -12px rgba(50,140,255,0.9)" : undefined,
        }}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-white" />
        )}
        <span
          className={cn(
            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-transform duration-200",
            "group-hover:scale-110",
            isActive ? "bg-white/25" : "bg-white/10",
          )}
        >
          <Icon className="h-[15px] w-[15px]" style={{ color: isActive ? "#fff" : COLORS.iconColor }} />
        </span>
        {!compact && (
          <span className={cn("truncate text-[12.5px] font-bold leading-tight tracking-tight", isActive ? "text-white" : "text-white/85")}>
            {m.label}
          </span>
        )}
      </button>
      {!compact && (
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? `Unpin ${m.label}` : `Pin ${m.label}`}
          className="absolute right-1.5 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 aria-pressed:opacity-100"
          aria-pressed={isFavorite}
        >
          <Star className={cn("h-3.5 w-3.5", isFavorite ? "fill-amber-300 text-amber-300 opacity-100" : "text-white/60")} />
        </button>
      )}
      {isFavorite && !compact && (
        <Star className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 fill-amber-300 text-amber-300 group-hover:opacity-0" />
      )}
    </div>
  );
});

export function ModuleSwitchSidebar({
  modules, groupOrder, favorites, activeId, collapsed, query,
  onQueryChange, onToggleCollapse, onSelect, onToggleFavorite, onLogout,
}: Props) {
  const compact = collapsed;

  const grouped = useMemo(() => {
    const favSet = new Set(favorites);
    const favModules = modules.filter((m) => favSet.has(m.id));
    const rest = groupOrder
      .map((g) => ({ group: g, items: modules.filter((m) => m.group === g && !favSet.has(m.id)) }))
      .filter((g) => g.items.length > 0);
    return favModules.length ? [{ group: "Favorites", items: favModules }, ...rest] : rest;
  }, [modules, groupOrder, favorites]);

  return (
    <motion.aside
      animate={{ width: compact ? MS_SIDEBAR_COLLAPSED_WIDTH : MS_SIDEBAR_WIDTH }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      className="fixed left-0 top-0 z-40 flex flex-shrink-0 flex-col"
      style={{
        height: "100vh",
        background: COLORS.bgGradient,
        borderRight: `2px solid ${COLORS.border}`,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div
        className="flex flex-shrink-0 items-center justify-between gap-2 px-3 py-2.5"
        style={{ borderBottom: `1px solid ${COLORS.border}` }}
      >
        {!compact && (
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-white">Boss Dashboard</h1>
            <p className="text-[10px] font-medium text-white/60">Module command launcher</p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {!compact && (
        <div className="px-2.5 pt-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/50" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search modules…"
              aria-label="Search modules"
              className="w-full rounded-lg border border-white/15 bg-white/10 py-1.5 pl-7 pr-2 text-[11.5px] text-white placeholder:text-white/45 outline-none focus:border-[#48c6ff]"
            />
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-3 px-2 py-2.5">
        {grouped.map((g) => (
          <div key={g.group}>
            {!compact && (
              <div className="px-1 pb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
                {g.group}
              </div>
            )}
            <div className="space-y-0.5">
              {g.items.map((m) => (
                <ModuleButton
                  key={m.id}
                  module={m}
                  compact={compact}
                  isActive={activeId === m.id}
                  isFavorite={favorites.includes(m.id)}
                  onSelect={() => onSelect(m)}
                  onToggleFavorite={() => onToggleFavorite(m.id)}
                />
              ))}
            </div>
          </div>
        ))}
        {grouped.length === 0 && !compact && (
          <p className="px-2 py-6 text-center text-[11px] text-white/50">No module matches your search.</p>
        )}
      </nav>

      <div className="flex-shrink-0 px-2 py-2" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-red-500/20"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10">
            <LogOut className="h-[15px] w-[15px] text-red-300" />
          </span>
          {!compact && <span className="text-[12.5px] font-bold text-white/85">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
