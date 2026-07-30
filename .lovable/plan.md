## What I found

I cloned `BOSSsoftwarevala/sapphire-cockpit` and compared it with your project.

| | Your project | Reference repo |
|---|---|---|
| Framework | TanStack Start (SSR, file routes) | Vite SPA + react-router-dom |
| Styling | Tailwind v4, our OKLCH dark tokens | Tailwind v3 config, light "Aurora" HSL theme |
| Size | ~90 source files | ~2,400 source files, 125+ pages |
| Backend | none enabled | Supabase: 131 migrations, 79 edge functions |

This is a real migration, not a file copy. Three hard incompatibilities must be bridged before any reference page can render here:

1. `react-router-dom` (used in 225 files) does not exist on this stack.
2. `@/integrations/supabase/*` (used in 314 files) does not exist until Cloud is enabled.
3. Tailwind v3 config colours (`aurora-*`, `neon-*`, `surface-1..3`, `sapphire`, `sidebar-*`) must exist as v4 tokens or every copied component renders unstyled.

Your constraints I will hold to: **our colour palette and UI style stay**, features/modules come from the reference, **no auth/login page is added**, nothing existing is deleted.

## Plan

### Phase 1 — Compatibility layer (foundation)
- Add missing deps: framer-motion, zustand, react-markdown, @hello-pangea/dnd, next-themes, qrcode.react, react-simple-maps.
- Add a local `react-router-dom` shim (Vite alias) exposing `Link`, `NavLink`, `Navigate`, `Outlet`, `useNavigate`, `useParams`, `useLocation`, `useSearchParams` on top of TanStack Router, so copied files compile unchanged.
- Extend `src/styles.css` with the reference's *named* token families (aurora, neon, surface, status, sidebar, gradients) but **mapped to our existing dark palette values** — copied components get correct structure in our colours.
- Port the missing shadcn/ui primitives the reference uses and we lack.

### Phase 2 — Module copy (the 35 listed dashboards)
Copy `components/`, `hooks/`, `lib/`, `contexts/`, `stores/`, `types/`, `utils/`, `data/` as-is, then add one TanStack route file per module page (Control Panel, Boss Panel, Super Admin, Boss/CEO Dashboard, Vala AI, Server Manager, AI API Manager, Dev Manager, Product/Demo/Task Manager, Promise Tracker, Assist/Marketing/SEO/Lead Manager, Sales & Support, Customer Support, Franchise Owner, Reseller/Influencer Manager, Influencer Dashboard, Continent/Country Admin, Finance/Legal Manager, Developer Dashboard, Pro Manager, Pro/Basic User Dashboard, Home, Security, R&D, Settings), each with its own `head()` metadata. Auth/login/demo-login pages are skipped by rule. Existing routes and dashboards stay untouched.

Delivered in batches of ~5 modules; after each batch: build, fix compile/runtime errors, verify routes in the preview.

### Phase 3 — Backend and real data
- Enable Lovable Cloud.
- Port the reference schema as consolidated migrations with RLS + grants, plus seed data.
- Replace mock/demo arrays with real queries via server functions; port edge-function logic to server functions where compatible.

### Technical notes
- The shim keeps reference files byte-identical, which makes future re-syncs from that repo cheap.
- Reference pages that rely on Supabase render with their seed/empty states until Phase 3 lands, so nothing crashes mid-migration.
- Capacitor (mobile shell), Vercel config and their `App.tsx` router table are not portable and will not be copied; our routing covers that.

Phase 1 + the first module batch is one work unit; I'll continue automatically through the batches. Confirm and I'll start with Phase 1.
