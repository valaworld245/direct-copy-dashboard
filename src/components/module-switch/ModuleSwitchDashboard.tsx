import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ExternalLink, Rocket, Star } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KPIGrid, KPIBox } from "@/components/boss/KPIGrid";
import { ModuleSwitchSidebar, MS_SIDEBAR_WIDTH, MS_SIDEBAR_COLLAPSED_WIDTH } from "./ModuleSwitchSidebar";
import { ModuleCopilot } from "./ModuleCopilot";
import {
  MODULE_GROUP_ORDER, modulesForRole, searchModules, type ModuleEntry,
} from "@/lib/module-catalog";
import {
  getFavorites, getRecents, markOpened, pushRecent, relativeTime, getOpenedAt, toggleFavorite, bumpSessionOpens,
} from "@/lib/module-prefs";
import { useModuleKpis } from "@/lib/module-kpis";
import { getAuthenticatedRole, signOut } from "@/lib/auth-bridge";
import type { RoleKey } from "@/lib/roles";

const PAGE_BG =
  "radial-gradient(1200px 700px at 18% -10%, #163a72 0%, transparent 60%), radial-gradient(900px 600px at 100% 0%, #0f3a5c 0%, transparent 55%), #070f22";

export function ModuleSwitchDashboard() {
  const [role, setRole] = useState<RoleKey | null>(null);
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await getAuthenticatedRole();
      if (cancelled) return;
      setRole(r);
      setFavorites(getFavorites());
      setRecents(getRecents());
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const accessible = useMemo(() => modulesForRole(role), [role]);
  const visible = useMemo(() => searchModules(accessible, query), [accessible, query]);
  const selected = useMemo(
    () => accessible.find((m) => m.id === selectedId) ?? null,
    [accessible, selectedId],
  );

  const kpis = useModuleKpis({ role, accessible, favorites, recents, selected });

  const recentModules = useMemo(
    () => recents.map((id) => accessible.find((m) => m.id === id)).filter(Boolean) as ModuleEntry[],
    [recents, accessible],
  );
  const favoriteModules = useMemo(
    () => favorites.map((id) => accessible.find((m) => m.id === id)).filter(Boolean) as ModuleEntry[],
    [favorites, accessible],
  );

  const openModule = useCallback((m: ModuleEntry, path?: string) => {
    setRecents(pushRecent(m.id));
    markOpened(m.id);
    bumpSessionOpens();
    window.location.assign(path ?? m.path);
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut();
    window.location.assign("/");
  }, []);

  if (!ready) {
    return <div className="min-h-screen" style={{ background: PAGE_BG }} />;
  }

  return (
    <TooltipProvider>
      <div className="dark flex min-h-screen w-full" style={{ background: PAGE_BG }}>
        <div
          className="flex-shrink-0 transition-[width] duration-300 ease-out"
          style={{ width: collapsed ? MS_SIDEBAR_COLLAPSED_WIDTH : MS_SIDEBAR_WIDTH }}
        >
          <ModuleSwitchSidebar
            modules={visible}
            groupOrder={MODULE_GROUP_ORDER}
            favorites={favorites}
            activeId={selectedId}
            collapsed={collapsed}
            query={query}
            onQueryChange={setQuery}
            onToggleCollapse={() => setCollapsed((v) => !v)}
            onSelect={(m) => setSelectedId(m.id === selectedId ? null : m.id)}
            onToggleFavorite={(id) => setFavorites(toggleFavorite(id))}
            onLogout={handleLogout}
          />
        </div>

        <main className="flex min-w-0 flex-1 flex-col gap-5 p-5">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-white/55">
            <span className="font-semibold text-white/80">Boss Dashboard</span>
            {selected && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span>{selected.group}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="font-semibold text-white">{selected.label}</span>
              </>
            )}
          </nav>

          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                {selected ? selected.label : "Choose a workspace"}
              </h1>
              <p className="mt-1 text-[12px] text-white/60">
                {selected
                  ? `Launch ${selected.label} or jump straight into one of its screens.`
                  : `${accessible.length} workspaces available for your role. Search, pin favorites, then launch.`}
              </p>
            </div>
            {selected && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFavorites(toggleFavorite(selected.id))}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <Star className={favorites.includes(selected.id) ? "h-3.5 w-3.5 fill-amber-300 text-amber-300" : "h-3.5 w-3.5"} />
                  {favorites.includes(selected.id) ? "Pinned" : "Pin"}
                </button>
                <button
                  type="button"
                  onClick={() => openModule(selected)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-bold text-white shadow-[0_12px_30px_-14px_rgba(50,140,255,0.95)] transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                  style={{ background: "linear-gradient(135deg,#2f7dff 0%,#48c6ff 100%)" }}
                >
                  <Rocket className="h-3.5 w-3.5" />
                  Open module
                </button>
              </div>
            )}
          </header>

          {/* Quick actions for the selected module */}
          {selected?.quickActions?.length ? (
            <section>
              <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
                Quick actions
              </h2>
              <div className="flex flex-wrap gap-2">
                {selected.quickActions.map((qa) => (
                  <button
                    key={qa.path}
                    type="button"
                    onClick={() => openModule(selected, qa.path)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[11.5px] font-semibold text-white/85 transition-colors hover:bg-white/15"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {qa.label}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {/* Favorites + recents */}
          {(favoriteModules.length > 0 || recentModules.length > 0) && (
            <section className="grid gap-4 lg:grid-cols-2">
              <Rail title="Favorite modules" items={favoriteModules} empty="Pin modules to see them here." onOpen={openModule} onSelect={(m) => setSelectedId(m.id)} />
              <Rail title="Recently opened" items={recentModules} empty="Open a module to start your history." onOpen={openModule} onSelect={(m) => setSelectedId(m.id)} showTime />
            </section>
          )}

          {/* KPI grid — real measured values */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                {selected ? `${selected.label} — live metrics` : "Launcher metrics"}
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                MEASURED LIVE
              </span>
            </div>
            <KPIGrid>
              {kpis.map((k) => (
                <KPIBox key={k.id} {...k} />
              ))}
            </KPIGrid>
          </section>

          {/* Launcher grid */}
          <section>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
              {query ? `Search results (${visible.length})` : "All workspaces"}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {visible.map((m) => {
                const Icon = m.icon;
                const active = m.id === selectedId;
                return (
                  <motion.button
                    key={m.id}
                    type="button"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    onClick={() => setSelectedId(active ? null : m.id)}
                    onDoubleClick={() => openModule(m)}
                    className="group flex items-start gap-3 rounded-xl border p-3 text-left transition-colors"
                    style={{
                      borderColor: active ? "rgba(72,198,255,0.55)" : "rgba(88,160,255,0.22)",
                      background: active
                        ? "linear-gradient(135deg, rgba(47,125,255,0.28), rgba(72,198,255,0.14))"
                        : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 transition-transform duration-200 group-hover:scale-110">
                      <Icon className="h-4 w-4 text-[#bcd8ff]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-white">{m.label}</span>
                      <span className="block truncate text-[10.5px] text-white/50">{m.group}</span>
                      <span className="mt-1 block truncate font-mono text-[10px] text-white/35">{m.path}</span>
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); openModule(m); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); openModule(m); } }}
                      className="rounded-md bg-[#2f7dff]/25 px-2 py-1 text-[10px] font-bold text-[#bcd8ff] opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Open
                    </span>
                  </motion.button>
                );
              })}
            </div>
            {visible.length === 0 && (
              <p className="py-10 text-center text-[12px] text-white/55">
                {role ? `No module matches “${query}”.` : "Sign in to see the modules your role can open."}
              </p>
            )}
          </section>
        </main>

        <ModuleCopilot
          modules={accessible}
          onOpen={(m) => openModule(m)}
          onSelect={(m) => setSelectedId(m.id)}
        />
      </div>
    </TooltipProvider>
  );
}

function Rail({
  title, items, empty, onOpen, onSelect, showTime,
}: {
  title: string;
  items: ModuleEntry[];
  empty: string;
  onOpen: (m: ModuleEntry) => void;
  onSelect: (m: ModuleEntry) => void;
  showTime?: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: "rgba(88,160,255,0.22)", background: "rgba(255,255,255,0.04)" }}
    >
      <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">{title}</h2>
      {items.length === 0 ? (
        <p className="py-3 text-[11px] text-white/45">{empty}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.06] px-2.5 py-1.5 transition-colors hover:bg-white/15"
              >
                <Icon className="h-3.5 w-3.5 text-[#bcd8ff]" />
                <button type="button" onClick={() => onSelect(m)} className="text-[11.5px] font-semibold text-white/85">
                  {m.label}
                </button>
                {showTime && (
                  <span className="text-[9.5px] text-white/40">{relativeTime(getOpenedAt(m.id))}</span>
                )}
                <button
                  type="button"
                  onClick={() => onOpen(m)}
                  aria-label={`Open ${m.label}`}
                  className="text-[#bcd8ff] hover:text-white"
                >
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
