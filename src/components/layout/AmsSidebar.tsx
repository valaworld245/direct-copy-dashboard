// @ts-nocheck
// AMS Manager sidebar — uses the SAME master dashboard UI pattern as
// src/components/dashboard/Sidebar.tsx so every module looks identical.
import {
  Home, LayoutDashboard, UsersRound, BookMarked, Fingerprint, Trophy, Award,
  Shield, Ribbon, Star, Archive, Layers, Crown, Zap, ArrowUpCircle, Target,
  Gift, BarChart3, LineChart, Settings, Bell, ScrollText, Sparkles,
  MessageSquare, CreditCard, LifeBuoy, LogOut, Package,
} from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import logoAsset from "@/assets/softwarevala-logo-official.jpg.asset.json";
import { signOut } from "@/lib/auth-bridge";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: any; accent?: boolean };

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Menu",
    items: [
      { to: "/command-center", label: "Dashboard", icon: Home },
      { to: "/ai", label: "AI Chat", icon: Sparkles, accent: true },
      { to: "/ams", label: "Tickets", icon: LifeBuoy },
      { to: "/chat", label: "Chat", icon: MessageSquare },
    ],
  },
  {
    title: "Identity",
    items: [
      { to: "/role-manager", label: "Role Manager", icon: UsersRound },
      { to: "/passport", label: "Passport", icon: BookMarked },
      { to: "/identity", label: "Identity", icon: Fingerprint },
    ],
  },
  {
    title: "Recognition",
    items: [
      { to: "/achievements", label: "Achievements", icon: Trophy },
      { to: "/awards", label: "Awards", icon: Award },
      { to: "/badges", label: "Badges", icon: Shield },
      { to: "/trophies", label: "Trophies", icon: Trophy },
      { to: "/certificates", label: "Certificates", icon: Ribbon },
      { to: "/hall-of-fame", label: "Hall of Fame", icon: Star },
      { to: "/legacy", label: "Legacy", icon: Archive },
      { to: "/collections", label: "Collections", icon: Layers },
      { to: "/trophy-gallery", label: "Trophy Gallery", icon: Trophy },
      { to: "/role-showcase", label: "Role Rooms", icon: Star },
    ],
  },
  {
    title: "Progression",
    items: [
      { to: "/xp", label: "XP", icon: Zap },
      { to: "/levels", label: "Levels", icon: ArrowUpCircle },
      { to: "/ranks", label: "Ranks", icon: Crown },
      { to: "/developer-progression", label: "Dev Progression", icon: ArrowUpCircle },
      { to: "/author-progression", label: "Author Progression", icon: ArrowUpCircle },
      { to: "/vendor-progression", label: "Vendor Progression", icon: ArrowUpCircle },
    ],
  },
  {
    title: "Engagement",
    items: [
      { to: "/missions", label: "Missions", icon: Target },
      { to: "/challenges", label: "Challenges", icon: Target },
      { to: "/rewards", label: "Rewards", icon: Gift },
      { to: "/claims", label: "Claims", icon: Package },
    ],
  },
  {
    title: "Vaults",
    items: [
      { to: "/passport-vault", label: "Passport Vault", icon: BookMarked },
      { to: "/achievement-vault", label: "Achievement Vault", icon: Trophy },
      { to: "/award-vault", label: "Award Vault", icon: Award },
      { to: "/membership-vault", label: "Membership Vault", icon: CreditCard },
      { to: "/rank-vault", label: "Rank Vault", icon: Crown },
      { to: "/verification-vault", label: "Verification Vault", icon: Shield },
    ],
  },
  {
    title: "Insights",
    items: [
      { to: "/leaderboards", label: "Leaderboards", icon: BarChart3 },
      { to: "/analytics", label: "Analytics", icon: LineChart },
    ],
  },
  {
    title: "Account",
    items: [
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/audit", label: "Audit Logs", icon: ScrollText },
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/support", label: "Support", icon: LifeBuoy },
    ],
  },
];

export function AmsSidebar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function handleLogout() {
    await signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-border">
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <img
            src={logoAsset.url}
            alt="Software Vala"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-[oklch(0.45_0.2_260)]/60 shadow-sm"
          />
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight leading-tight truncate">
              Software Vala<span className="text-[oklch(0.55_0.22_25)]">™</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate">
              AMS Manager
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-6">
        <Section title="Workspace">
          <NavItem to="/" icon={Home} label="Dashboard Home" active={false} />
        </Section>
        {GROUPS.map((g) => (
          <Section key={g.title} title={g.title}>
            {g.items.map((it) => (
              <NavItem
                key={it.to}
                to={it.to}
                icon={it.icon}
                label={it.label}
                accent={it.accent}
                active={pathname === it.to || pathname.startsWith(`${it.to}/`)}
              />
            ))}
          </Section>
        ))}
        <Section title="Session">
          <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />
        </Section>
      </nav>

      <div className="m-3 rounded-xl bg-gradient-brand p-4 text-brand-foreground shadow-glow">
        <div className="text-xs uppercase tracking-wider opacity-80">Upgrade</div>
        <div className="mt-1 font-semibold">Go Pro</div>
        <p className="mt-1 text-xs opacity-80">Unlock advanced analytics & AI tools.</p>
        <button className="mt-3 w-full rounded-lg bg-white/15 hover:bg-white/25 transition text-xs font-medium py-2">
          Upgrade now
        </button>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-3 pb-2 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({
  icon: Icon, label, active, onClick, accent, to,
}: { icon: any; label: string; active?: boolean; onClick?: () => void; accent?: boolean; to?: string }) {
  const cls = cn(
    "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
    active
      ? "bg-brand text-brand-foreground shadow-glow"
      : accent
        ? "text-foreground bg-brand/10 hover:bg-brand/20"
        : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-foreground",
  );
  const inner = (
    <>
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
      {accent && !active && <Sparkles className="ml-auto h-3 w-3 text-[oklch(0.78_0.18_290)]" />}
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
    </>
  );
  if (to) {
    return <Link to={to} className={cls}>{inner}</Link>;
  }
  return <button onClick={onClick} className={cls}>{inner}</button>;
}
