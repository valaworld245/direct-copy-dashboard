/**
 * MODULE CATALOG — single source of truth for the Module Switch Dashboard.
 *
 * Every entry points at a route that REALLY exists in this ecosystem
 * (either a TanStack route under src/routes or a legacy module route
 * mounted through the "/$" catch-all in src/App.tsx).
 *
 * No duplicate labels. No invented endpoints.
 */

import {
  Activity, AlertTriangle, Award, BadgeCheck, BarChart3, Bell, Box, Boxes, Brain,
  Building2, Code2, Compass, Crown, DollarSign, Eye, FileCheck, FileText, Flag,
  Gauge, Gavel, Gem, Globe2, Handshake, HeartHandshake, Headphones, Home, Layers,
  LifeBuoy, LineChart, ListTodo, MapPin, Medal, Megaphone, MessageSquare,
  MonitorPlay, Network, Package, PiggyBank, Rocket, ScrollText, Search, Server,
  Settings, Shield, ShieldCheck, Sparkles, Star, Store, Target, Terminal, Ticket,
  Timer, Trophy, User, UserCheck, UserCircle, Users, Wallet, Zap,
  type LucideIcon,
} from "lucide-react";
import type { RoleKey } from "@/lib/roles";

export type KpiKind =
  | "modules-in-group"
  | "total-modules"
  | "favorites"
  | "recents"
  | "session-role"
  | "connection"
  | "app-load"
  | "screens-in-module"
  | "last-opened";

export type ModuleKpi = { key: KpiKind; label: string; icon: LucideIcon };

export type ModuleEntry = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  group: string;
  /** undefined = visible to every authenticated role */
  roles?: RoleKey[];
  /** quick actions are real sub-routes of the same module */
  quickActions?: { label: string; path: string }[];
};

const ADMIN: RoleKey[] = ["admin"];
const ADMIN_DEV: RoleKey[] = ["admin", "developer", "dev-manager"];

export const MODULE_CATALOG: ModuleEntry[] = [
  // ── Command & Control ────────────────────────────────────────────────
  { id: "control-panel", label: "Control Panel", path: "/dashboard", icon: Gauge, group: "Command & Control", roles: ADMIN },
  { id: "boss-panel", label: "Boss Panel", path: "/boss/dashboard", icon: Crown, group: "Command & Control", roles: ADMIN },
  { id: "boss-fortress", label: "Boss Fortress", path: "/boss-fortress", icon: ShieldCheck, group: "Command & Control", roles: ADMIN },
  { id: "ceo-dashboard", label: "CEO Dashboard", path: "/ceo/dashboard", icon: Eye, group: "Command & Control", roles: ADMIN },
  { id: "founder-console", label: "Founder Console", path: "/owner", icon: Crown, group: "Command & Control", roles: ADMIN },
  { id: "super-admin", label: "Super Admin", path: "/super-admin", icon: Shield, group: "Command & Control", roles: ADMIN },
  { id: "super-admin-system", label: "Super Admin System", path: "/super-admin-system/dashboard", icon: Network, group: "Command & Control", roles: ADMIN,
    quickActions: [
      { label: "Admins", path: "/super-admin-system/admins" },
      { label: "Approvals", path: "/super-admin-system/approvals" },
      { label: "Modules", path: "/super-admin-system/modules" },
    ] },
  { id: "master-admin", label: "Master Admin", path: "/master-admin", icon: Crown, group: "Command & Control", roles: ADMIN },
  { id: "master-admin-supreme", label: "Master Admin Supreme", path: "/master-admin-supreme", icon: Crown, group: "Command & Control", roles: ADMIN },
  { id: "admin-dashboard", label: "Admin Dashboard", path: "/admin/dashboard", icon: UserCheck, group: "Command & Control", roles: ADMIN },
  { id: "enterprise-control", label: "Enterprise Control", path: "/enterprise-control", icon: Building2, group: "Command & Control", roles: ADMIN },
  { id: "unified-command", label: "Unified Command Center", path: "/super-admin/command-center", icon: Terminal, group: "Command & Control", roles: ADMIN },
  { id: "vala-control", label: "Vala Control", path: "/vala-control", icon: Zap, group: "Command & Control", roles: ADMIN,
    quickActions: [
      { label: "Master", path: "/vala-control/master" },
      { label: "Operations", path: "/vala-control/operations" },
      { label: "Regional", path: "/vala-control/regional" },
    ] },

  // ── Identity & Access ────────────────────────────────────────────────
  { id: "user-manager", label: "User Manager", path: "/super-admin/user-manager", icon: Users, group: "Identity & Access", roles: ADMIN },
  { id: "bulk-users", label: "Bulk Users", path: "/admin/bulk-users", icon: Users, group: "Identity & Access", roles: ADMIN },
  { id: "role-permission", label: "Role & Permission", path: "/super-admin/role-manager", icon: BadgeCheck, group: "Identity & Access", roles: ADMIN },
  { id: "permission-matrix", label: "Permission Matrix", path: "/super-admin/permission-matrix", icon: FileCheck, group: "Identity & Access", roles: ADMIN },
  { id: "role-center", label: "Role Center", path: "/super-admin-system/role-center", icon: UserCircle, group: "Identity & Access", roles: ADMIN },
  { id: "role-switch", label: "Role Switch", path: "/super-admin-system/role-switch", icon: Compass, group: "Identity & Access", roles: ADMIN },
  { id: "security-center", label: "Security Center", path: "/super-admin/security-center", icon: Shield, group: "Identity & Access", roles: ADMIN },
  { id: "security-command", label: "Security Command", path: "/security-command", icon: ShieldCheck, group: "Identity & Access", roles: ADMIN },
  { id: "audit-center", label: "Audit Center", path: "/super-admin/system-audit", icon: ScrollText, group: "Identity & Access", roles: ADMIN },
  { id: "activity-logs", label: "Activity Logs", path: "/super-admin-system/activity-log", icon: Activity, group: "Identity & Access", roles: ADMIN },

  // ── Marketplace & Products ───────────────────────────────────────────
  { id: "marketplace", label: "Marketplace Manager", path: "/showcase", icon: Store, group: "Marketplace & Products" },
  { id: "product-manager", label: "Product Manager", path: "/super-admin/product-manager", icon: Box, group: "Marketplace & Products", roles: ADMIN },
  { id: "catalog-manager", label: "Catalog Manager", path: "/products", icon: Package, group: "Marketplace & Products" },
  { id: "sectors", label: "Sector Catalog", path: "/sectors", icon: Layers, group: "Marketplace & Products" },
  { id: "pricing", label: "Pricing", path: "/pricing", icon: DollarSign, group: "Marketplace & Products" },
  { id: "demo-manager", label: "Demo Manager", path: "/demo-manager", icon: MonitorPlay, group: "Marketplace & Products" },
  { id: "demo-directory", label: "Demo Directory", path: "/demo-directory", icon: Compass, group: "Marketplace & Products" },
  { id: "premium-demos", label: "Premium Demos", path: "/premium-demos", icon: Star, group: "Marketplace & Products" },
  { id: "retail-pos", label: "Retail POS", path: "/retail-pos", icon: Store, group: "Marketplace & Products" },
  { id: "school-erp", label: "School ERP", path: "/school-software/dashboard", icon: Building2, group: "Marketplace & Products" },

  // ── Partners & Network ───────────────────────────────────────────────
  { id: "vendor-manager", label: "Vendor Manager", path: "/dashboard/vendor", icon: Handshake, group: "Partners & Network" },
  { id: "author-manager", label: "Author Manager", path: "/dashboard/author", icon: FileText, group: "Partners & Network" },
  { id: "reseller-manager", label: "Reseller Manager", path: "/reseller-manager", icon: Handshake, group: "Partners & Network" },
  { id: "reseller-dashboard", label: "Reseller Dashboard", path: "/reseller-dashboard", icon: UserCircle, group: "Partners & Network" },
  { id: "affiliate-manager", label: "Affiliate Manager", path: "/dashboard/affiliate", icon: Target, group: "Partners & Network" },
  { id: "franchise-manager", label: "Franchise Manager", path: "/super-admin/franchise-manager", icon: Building2, group: "Partners & Network", roles: ADMIN },
  { id: "franchise-owner", label: "Franchise Owner", path: "/franchise/dashboard", icon: Building2, group: "Partners & Network",
    quickActions: [
      { label: "Franchise CRM", path: "/franchise/crm" },
      { label: "Sales Center", path: "/franchise/sales-center" },
      { label: "Wallet", path: "/franchise/wallet" },
    ] },
  { id: "influencer-manager", label: "Influencer Manager", path: "/influencer-manager", icon: Users, group: "Partners & Network" },
  { id: "influencer-dashboard", label: "Influencer Dashboard", path: "/influencer-dashboard", icon: User, group: "Partners & Network" },
  { id: "customer-manager", label: "Customer Manager", path: "/client-portal", icon: HeartHandshake, group: "Partners & Network" },
  { id: "prime-user", label: "Prime User", path: "/prime/dashboard", icon: Star, group: "Partners & Network" },
  { id: "continent-admin", label: "Continent Admin", path: "/continent/dashboard", icon: Globe2, group: "Partners & Network", roles: ADMIN },
  { id: "country-admin", label: "Country Admin", path: "/country/dashboard", icon: Flag, group: "Partners & Network", roles: ADMIN },
  { id: "area-manager", label: "Area Manager", path: "/area-manager", icon: MapPin, group: "Partners & Network" },

  // ── Revenue & CRM ────────────────────────────────────────────────────
  { id: "sales-manager", label: "Sales Manager", path: "/sales", icon: LineChart, group: "Revenue & CRM" },
  { id: "crm-manager", label: "CRM Manager", path: "/sales-crm", icon: Users, group: "Revenue & CRM" },
  { id: "lead-manager", label: "Lead Manager", path: "/lead-manager", icon: Target, group: "Revenue & CRM" },
  { id: "sales-support", label: "Sales & Support", path: "/sales-support-manager", icon: Headphones, group: "Revenue & CRM" },
  { id: "support-manager", label: "Support Manager", path: "/support-dashboard", icon: LifeBuoy, group: "Revenue & CRM" },
  { id: "client-success", label: "Customer Support", path: "/client-success", icon: HeartHandshake, group: "Revenue & CRM" },
  { id: "assist-manager", label: "Assist Manager", path: "/assist-manager", icon: MonitorPlay, group: "Revenue & CRM" },
  { id: "safe-assist", label: "Safe Assist", path: "/safe-assist", icon: ShieldCheck, group: "Revenue & CRM" },
  { id: "finance-manager", label: "Finance Manager", path: "/finance", icon: Wallet, group: "Revenue & CRM" },
  { id: "finance-center", label: "Finance Center", path: "/super-admin/finance-center", icon: PiggyBank, group: "Revenue & CRM", roles: ADMIN },

  // ── Growth & Content ─────────────────────────────────────────────────
  { id: "marketing-manager", label: "Marketing Manager", path: "/marketing-manager", icon: Megaphone, group: "Growth & Content" },
  { id: "enterprise-marketing", label: "Enterprise Marketing", path: "/enterprise/marketing", icon: Megaphone, group: "Growth & Content" },
  { id: "seo-manager", label: "SEO Manager", path: "/seo-manager", icon: Search, group: "Growth & Content" },
  { id: "seo-dashboard", label: "SEO Dashboard", path: "/seo-dashboard", icon: BarChart3, group: "Growth & Content" },
  { id: "notification-manager", label: "Notification Manager", path: "/notifications", icon: Bell, group: "Growth & Content" },
  { id: "internal-chat", label: "Internal Chat", path: "/internal-chat", icon: MessageSquare, group: "Growth & Content" },

  // ── Operations & People ──────────────────────────────────────────────
  { id: "task-manager", label: "Task Manager", path: "/task-manager", icon: ListTodo, group: "Operations & People" },
  { id: "promise-management", label: "Promise Management", path: "/promise-management", icon: ListTodo, group: "Operations & People" },
  { id: "promise-tracker", label: "Promise Tracker", path: "/promise-tracker", icon: Timer, group: "Operations & People" },
  { id: "hr-manager", label: "HR Manager", path: "/hr-manager", icon: Users, group: "Operations & People" },
  { id: "hr-dashboard", label: "Employee Center", path: "/hr-dashboard", icon: UserCheck, group: "Operations & People" },
  { id: "legal-manager", label: "Legal Manager", path: "/legal-manager", icon: Gavel, group: "Operations & People" },
  { id: "compliance-center", label: "Compliance Center", path: "/super-admin/compliance-center", icon: FileCheck, group: "Operations & People", roles: ADMIN },
  { id: "incident-crisis", label: "Incident & Crisis", path: "/incident-crisis", icon: AlertTriangle, group: "Operations & People" },
  { id: "system-settings", label: "System Settings", path: "/system-settings", icon: Settings, group: "Operations & People", roles: ADMIN },
  { id: "settings", label: "Settings", path: "/settings", icon: Settings, group: "Operations & People" },

  // ── AI & Developer ───────────────────────────────────────────────────
  { id: "ai-console", label: "Vala AI Console", path: "/ai-console", icon: Brain, group: "AI & Developer" },
  { id: "ai-ceo", label: "AI CEO", path: "/ai-ceo", icon: Sparkles, group: "AI & Developer", roles: ADMIN },
  { id: "api-manager", label: "API Manager", path: "/api-manager", icon: Zap, group: "AI & Developer", roles: ADMIN_DEV },
  { id: "api-integrations", label: "Integration Manager", path: "/api-integrations", icon: Network, group: "AI & Developer", roles: ADMIN_DEV },
  { id: "ai-billing", label: "AI Billing", path: "/super-admin/ai-billing", icon: DollarSign, group: "AI & Developer", roles: ADMIN },
  { id: "auto-dev", label: "Automation Engine", path: "/auto-dev", icon: Rocket, group: "AI & Developer", roles: ADMIN_DEV },
  { id: "dev-manager", label: "Development Manager", path: "/dev-manager", icon: Code2, group: "AI & Developer", roles: ADMIN_DEV },
  { id: "dev-command-center", label: "Developer Center", path: "/dev-command-center", icon: Terminal, group: "AI & Developer", roles: ADMIN_DEV },
  { id: "developer-dashboard", label: "Developer Dashboard", path: "/developer-dashboard", icon: Code2, group: "AI & Developer", roles: ADMIN_DEV },
  { id: "server-manager", label: "Server Manager", path: "/server-manager", icon: Server, group: "AI & Developer", roles: ADMIN_DEV },
  { id: "server-portal", label: "Server Portal", path: "/server-portal", icon: Server, group: "AI & Developer", roles: ADMIN_DEV },
  { id: "rnd-dashboard", label: "R&D Dashboard", path: "/rnd-dashboard", icon: Brain, group: "AI & Developer", roles: ADMIN_DEV },
  { id: "performance", label: "Performance Center", path: "/performance", icon: Gauge, group: "AI & Developer", roles: ADMIN_DEV },

  // ── Recognition (AMS) ────────────────────────────────────────────────
  { id: "ams-command-center", label: "AMS Command Center", path: "/command-center", icon: Home, group: "Recognition (AMS)" },
  { id: "ams-manager", label: "AMS Manager", path: "/ams", icon: Boxes, group: "Recognition (AMS)" },
  { id: "achievements", label: "Achievements", path: "/achievements", icon: Award, group: "Recognition (AMS)" },
  { id: "awards", label: "Awards", path: "/awards/new", icon: Medal, group: "Recognition (AMS)" },
  { id: "badges", label: "Badges", path: "/badges", icon: Shield, group: "Recognition (AMS)" },
  { id: "trophies", label: "Trophies", path: "/trophies", icon: Trophy, group: "Recognition (AMS)" },
  { id: "certificates", label: "Certificates", path: "/certificates", icon: FileText, group: "Recognition (AMS)" },
  { id: "ranks", label: "Ranks", path: "/ranks", icon: Crown, group: "Recognition (AMS)" },
  { id: "levels", label: "Levels", path: "/levels", icon: BarChart3, group: "Recognition (AMS)" },
  { id: "xp", label: "XP", path: "/xp", icon: Zap, group: "Recognition (AMS)" },
  { id: "challenges", label: "Challenges", path: "/challenges", icon: Target, group: "Recognition (AMS)" },
  { id: "rewards", label: "Rewards", path: "/rewards", icon: Gem, group: "Recognition (AMS)" },
  { id: "claims", label: "Claims", path: "/claims", icon: Ticket, group: "Recognition (AMS)" },
  { id: "collections", label: "Collections", path: "/collections", icon: Layers, group: "Recognition (AMS)" },
  { id: "leaderboards", label: "Leaderboards", path: "/leaderboards", icon: BarChart3, group: "Recognition (AMS)" },
  { id: "hall-of-fame", label: "Hall of Fame", path: "/hall-of-fame", icon: Star, group: "Recognition (AMS)" },
  { id: "legacy", label: "Legacy", path: "/legacy", icon: Medal, group: "Recognition (AMS)" },
  { id: "passport", label: "Passport", path: "/passport", icon: BadgeCheck, group: "Recognition (AMS)" },
  { id: "identity", label: "Identity", path: "/identity", icon: UserCircle, group: "Recognition (AMS)" },
  { id: "ams-role-manager", label: "AMS Role Manager", path: "/role-manager", icon: UserCheck, group: "Recognition (AMS)" },
  { id: "ams-analytics", label: "Analytics Manager", path: "/analytics", icon: LineChart, group: "Recognition (AMS)" },
  { id: "ams-audit", label: "AMS Audit Logs", path: "/audit", icon: ScrollText, group: "Recognition (AMS)" },
  { id: "ams-chat", label: "AMS Chat", path: "/chat", icon: MessageSquare, group: "Recognition (AMS)" },
  { id: "ai-studio", label: "AI Copilot Studio", path: "/ai", icon: Sparkles, group: "Recognition (AMS)" },

  // ── Vaults ───────────────────────────────────────────────────────────
  { id: "achievement-vault", label: "Achievement Vault", path: "/achievement-vault", icon: Gem, group: "Vaults" },
  { id: "award-vault", label: "Award Vault", path: "/award-vault", icon: Gem, group: "Vaults" },
  { id: "badge-vault", label: "Badge Vault", path: "/badge-vault", icon: Gem, group: "Vaults" },
  { id: "trophy-vault", label: "Trophy Vault", path: "/trophy-vault", icon: Gem, group: "Vaults" },
  { id: "certificate-vault", label: "Certificate Vault", path: "/certificate-vault", icon: Gem, group: "Vaults" },
  { id: "passport-vault", label: "Passport Vault", path: "/passport-vault", icon: Gem, group: "Vaults" },
  { id: "rank-vault", label: "Rank Vault", path: "/rank-vault", icon: Gem, group: "Vaults" },
  { id: "membership-vault", label: "Membership Vault", path: "/membership-vault", icon: Gem, group: "Vaults" },
  { id: "identity-card-vault", label: "Identity Card Vault", path: "/identity-card-vault", icon: Gem, group: "Vaults" },
  { id: "license-card-vault", label: "License Manager Vault", path: "/license-card-vault", icon: Gem, group: "Vaults" },
  { id: "honor-coin-vault", label: "Honor Coin Vault", path: "/honor-coin-vault", icon: Gem, group: "Vaults" },
  { id: "recognition-coin-vault", label: "Recognition Coin Vault", path: "/recognition-coin-vault", icon: Gem, group: "Vaults" },
  { id: "xp-crystal-vault", label: "XP Crystal Vault", path: "/xp-crystal-vault", icon: Gem, group: "Vaults" },
  { id: "reward-chest-vault", label: "Reward Chest Vault", path: "/reward-chest-vault", icon: Gem, group: "Vaults" },
  { id: "legacy-medal-vault", label: "Legacy Medal Vault", path: "/legacy-medal-vault", icon: Gem, group: "Vaults" },
  { id: "founder-seal-vault", label: "Founder Seal Vault", path: "/founder-seal-vault", icon: Gem, group: "Vaults" },
  { id: "trust-seal-vault", label: "Trust Seal Vault", path: "/trust-seal-vault", icon: Gem, group: "Vaults" },
  { id: "verification-vault", label: "Verification Vault", path: "/verification-vault", icon: Gem, group: "Vaults" },
  { id: "reputation-vault", label: "Reputation Vault", path: "/reputation-vault", icon: Gem, group: "Vaults" },
  { id: "hall-of-fame-vault", label: "Hall of Fame Vault", path: "/hall-of-fame-vault", icon: Gem, group: "Vaults" },

  // ── Progression ──────────────────────────────────────────────────────
  { id: "author-progression", label: "Author Progression", path: "/author-progression", icon: LineChart, group: "Progression" },
  { id: "vendor-progression", label: "Vendor Progression", path: "/vendor-progression", icon: LineChart, group: "Progression" },
  { id: "developer-progression", label: "Developer Progression", path: "/developer-progression", icon: LineChart, group: "Progression" },
  { id: "role-showcase", label: "Role Showcase", path: "/role-showcase", icon: Star, group: "Progression" },
];

export const MODULE_GROUP_ORDER: string[] = Array.from(
  new Set(MODULE_CATALOG.map((m) => m.group)),
);

export function modulesForRole(role: RoleKey | null): ModuleEntry[] {
  if (!role) return [];
  if (role === "admin") return MODULE_CATALOG;
  return MODULE_CATALOG.filter((m) => !m.roles || m.roles.includes(role));
}

export function findModuleByPath(path: string): ModuleEntry | undefined {
  return MODULE_CATALOG.find((m) => m.path === path);
}

export function searchModules(list: ModuleEntry[], query: string): ModuleEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (m) =>
      m.label.toLowerCase().includes(q) ||
      m.group.toLowerCase().includes(q) ||
      m.path.toLowerCase().includes(q),
  );
}
