/**
 * Module Switch KPIs.
 *
 * Every value here is measured from a REAL source at runtime:
 * the module registry, the user's stored preferences, the live auth session,
 * the browser connection state and the Performance API.
 * Nothing is mocked and no fake endpoint is called.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Activity, Boxes, Clock, Gauge, Layers, Rocket, Star, Timer, UserCircle, Wifi,
  type LucideIcon,
} from "lucide-react";
import type { ModuleEntry } from "@/lib/module-catalog";
import { getOpenedAt, getSessionOpens, getSessionStart, relativeTime } from "@/lib/module-prefs";
import type { RoleKey } from "@/lib/roles";

export type ModuleKpiCard = {
  id: string;
  label: string;
  value: string;
  subValues: string[];
  status: "healthy" | "warning" | "critical" | "action";
  icon: LucideIcon;
  source: string;
  urgency: "low" | "medium" | "high" | "critical";
  lastUpdate: string;
};

function useConnection() {
  const [state, setState] = useState({ online: true, type: "" });
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { effectiveType?: string } };
    const update = () =>
      setState({ online: navigator.onLine, type: nav.connection?.effectiveType ?? "" });
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return state;
}

/** Ticks every second so live metrics keep moving. */
function useTick(ms = 1000) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return tick;
}

function formatDuration(msTotal: number) {
  const s = Math.max(0, Math.floor(msTotal / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function useLoadTime() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const entry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (entry) setMs(Math.round(entry.domContentLoadedEventEnd));
  }, []);
  return ms;
}

export function useModuleKpis(args: {
  role: RoleKey | null;
  accessible: ModuleEntry[];
  favorites: string[];
  recents: string[];
  selected: ModuleEntry | null;
}): ModuleKpiCard[] {
  const { role, accessible, favorites, recents, selected } = args;
  const conn = useConnection();
  const loadMs = useLoadTime();
  const tick = useTick(1000);

  return useMemo(() => {
    const groupCount = selected
      ? accessible.filter((m) => m.group === selected.group).length
      : 0;
    const openedAt = selected ? getOpenedAt(selected.id) : null;

    const sessionMs = Date.now() - getSessionStart();
    const opens = getSessionOpens();

    const cards: ModuleKpiCard[] = [
      {
        id: "session-uptime",
        label: "Session Uptime",
        value: formatDuration(sessionMs),
        subValues: ["Live since this tab opened"],
        status: "healthy",
        icon: Timer,
        source: "Live session clock",
        urgency: "low",
        lastUpdate: "now",
      },
      {
        id: "module-opens",
        label: "Module Launches",
        value: String(opens),
        subValues: [opens ? "Counted this session" : "No launches yet this session"],
        status: opens ? "healthy" : "action",
        icon: Rocket,
        source: "Live activity",
        urgency: "low",
        lastUpdate: "now",
      },
      {
        id: "accessible-modules",
        label: "Modules Available",
        value: String(accessible.length),
        subValues: [role ? `Role: ${role}` : "No session"],
        status: accessible.length ? "healthy" : "warning",
        icon: Boxes,
        source: "Module registry",
        urgency: "low",
        lastUpdate: "live",
      },
      {
        id: "workspace-groups",
        label: "Workspace Groups",
        value: String(new Set(accessible.map((m) => m.group)).size),
        subValues: ["Grouped launchers"],
        status: "healthy",
        icon: Layers,
        source: "Module registry",
        urgency: "low",
        lastUpdate: "live",
      },
      {
        id: "favorites",
        label: "Pinned Favorites",
        value: String(favorites.length),
        subValues: [favorites.length ? "Shown first in sidebar" : "Pin with the star icon"],
        status: favorites.length ? "healthy" : "action",
        icon: Star,
        source: "Your preferences",
        urgency: "low",
        lastUpdate: "live",
      },
      {
        id: "recents",
        label: "Recently Opened",
        value: String(recents.length),
        subValues: ["Last 8 workspaces"],
        status: "healthy",
        icon: Clock,
        source: "Your preferences",
        urgency: "low",
        lastUpdate: "live",
      },
      {
        id: "session-role",
        label: "Active Session Role",
        value: role ? role.replace(/-/g, " ") : "signed out",
        subValues: [role ? "Access filtered by role" : "Sign in to unlock modules"],
        status: role ? "healthy" : "critical",
        icon: UserCircle,
        source: "Auth bridge",
        urgency: role ? "low" : "critical",
        lastUpdate: "live",
      },
      {
        id: "connection",
        label: "Connection",
        value: conn.online ? "ONLINE" : "OFFLINE",
        subValues: [conn.type ? `Network: ${conn.type}` : "Browser network status"],
        status: conn.online ? "healthy" : "critical",
        icon: Wifi,
        source: "Browser",
        urgency: conn.online ? "low" : "critical",
        lastUpdate: "live",
      },
      {
        id: "app-load",
        label: "Shell Load Time",
        value: loadMs === null ? "—" : `${loadMs} ms`,
        subValues: ["Performance API navigation timing"],
        status: loadMs === null ? "action" : loadMs < 2500 ? "healthy" : "warning",
        icon: Gauge,
        source: "Performance API",
        urgency: "low",
        lastUpdate: "this session",
      },
    ];

    if (selected) {
      cards.unshift(
        {
          id: "selected-module",
          label: selected.label,
          value: selected.group,
          subValues: [selected.path],
          status: "action",
          icon: selected.icon,
          source: "Selected module",
          urgency: "medium",
          lastUpdate: relativeTime(openedAt),
        },
        {
          id: "sibling-modules",
          label: "Modules In Group",
          value: String(groupCount),
          subValues: [selected.group],
          status: "healthy",
          icon: Activity,
          source: "Module registry",
          urgency: "low",
          lastUpdate: "live",
        },
        {
          id: "module-screens",
          label: "Linked Screens",
          value: String(1 + (selected.quickActions?.length ?? 0)),
          subValues: selected.quickActions?.length
            ? selected.quickActions.map((q) => q.label)
            : ["Single entry route"],
          status: "healthy",
          icon: Layers,
          source: "Route table",
          urgency: "low",
          lastUpdate: "live",
        },
      );
    }

    return cards;
  }, [role, accessible, favorites, recents, selected, conn.online, conn.type, loadMs, tick]);
}
