/**
 * Module Switch preferences — favorites + recently opened.
 * Persisted locally per browser; no server schema change.
 */

const FAV_KEY = "sv_module_favorites";
const RECENT_KEY = "sv_module_recents";
const OPENED_AT_KEY = "sv_module_opened_at";
const MAX_RECENTS = 8;

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked — preferences are best-effort */
  }
}

export function getFavorites(): string[] {
  return read(FAV_KEY);
}

export function toggleFavorite(id: string): string[] {
  const current = read(FAV_KEY);
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  write(FAV_KEY, next);
  return next;
}

export function getRecents(): string[] {
  return read(RECENT_KEY);
}

export function pushRecent(id: string): string[] {
  const next = [id, ...read(RECENT_KEY).filter((x) => x !== id)].slice(0, MAX_RECENTS);
  write(RECENT_KEY, next);
  return next;
}

export function markOpened(id: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(OPENED_AT_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[id] = Date.now();
    window.localStorage.setItem(OPENED_AT_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function getOpenedAt(id: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(OPENED_AT_KEY);
    const map = raw ? JSON.parse(raw) : {};
    return typeof map[id] === "number" ? map[id] : null;
  } catch {
    return null;
  }
}

export function relativeTime(ts: number | null): string {
  if (!ts) return "never";
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return `${Math.floor(hr / 24)} d ago`;
}

/** Real activity counters for the current browser session. */
const SESSION_START_KEY = "sv_session_started_at";
const SESSION_OPENS_KEY = "sv_session_module_opens";

export function getSessionStart(): number {
  if (typeof window === "undefined") return Date.now();
  try {
    const raw = window.sessionStorage.getItem(SESSION_START_KEY);
    if (raw) return Number(raw);
    const now = Date.now();
    window.sessionStorage.setItem(SESSION_START_KEY, String(now));
    return now;
  } catch {
    return Date.now();
  }
}

export function bumpSessionOpens(): number {
  if (typeof window === "undefined") return 0;
  try {
    const next = getSessionOpens() + 1;
    window.sessionStorage.setItem(SESSION_OPENS_KEY, String(next));
    return next;
  } catch {
    return 0;
  }
}

export function getSessionOpens(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.sessionStorage.getItem(SESSION_OPENS_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}
