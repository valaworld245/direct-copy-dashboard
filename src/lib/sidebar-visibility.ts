/**
 * SIDEBAR VISIBILITY — role based access for ControlPanelSidebar buttons.
 *
 * Every button id in ControlPanelSidebar (see SIDEBAR_ROUTES in
 * src/lib/sidebar-routes.ts) is mapped to the app roles that are allowed to
 * see AND open it. Anything not allowed is hidden from the sidebar and is
 * refused on click.
 *
 * Roles come from the real `user_roles` table (same source useAuth() uses).
 */

/** Roles that may see every module (no restriction). */
export const ALL_ACCESS_ROLES = ["boss_owner", "master", "super_admin", "ceo"] as const;

/** Buttons every authenticated user always keeps. */
export const ALWAYS_VISIBLE_IDS = ["home", "settings"] as const;

/**
 * button id -> allowed roles.
 * `ALL_ACCESS_ROLES` are implicitly allowed everywhere and are not repeated.
 */
export const SIDEBAR_VISIBILITY: Record<string, string[]> = {
  // GRADE 1
  boss_owner: [],
  ceo: [],
  vala_ai_management: ["ai_manager", "server_manager", "api_security"],
  server_manager: ["server_manager"],
  api_ai_manager: ["api_security", "ai_manager", "server_manager"],

  // GRADE 2
  developer_management: ["developer", "rnd_manager", "r_and_d"],
  product_manager: ["performance_manager", "rnd_manager", "marketing_manager"],
  demo_manager: ["demo_manager", "marketing_manager"],
  task_management: ["task_manager", "performance_manager"],
  promise_tracker_manager: ["promise_tracker", "promise_management", "developer"],
  assist_manager: ["assist_manager", "safe_assist", "support"],
  ams_manager: ["assist_manager", "support", "performance_manager"],

  // GRADE 3
  marketing_management: ["marketing_manager"],
  seo_manager: ["seo_manager", "marketing_manager"],
  lead_manager: ["lead_manager", "marketing_manager", "crm_manager"],
  crm_manager: ["crm_manager", "lead_manager", "support", "client_success", "marketing_manager"],
  order_manager: ["order_manager", "finance_manager", "marketplace_manager", "support"],
  billing_manager: ["billing_manager", "finance_manager"],
  subscription_manager: ["subscription_manager", "finance_manager", "billing_manager"],
  license_manager: ["license_manager", "finance_manager", "developer", "support"],
  ticket_manager: ["ticket_manager", "support", "client_success", "assist_manager"],
  sales_support_manager: ["support", "lead_manager", "client_success"],
  customer_support_management: ["client_success", "support"],

  // GRADE 4
  franchise_manager: ["franchise", "area_manager"],
  reseller_manager: ["reseller", "area_manager"],
  influencer_manager: ["marketing_manager", "area_manager"],
  influencer_dashboard: ["influencer"],
  affiliate_manager: ["marketing_manager", "affiliate_manager", "area_manager"],
  marketplace_manager: ["marketplace_manager", "marketing_manager", "performance_manager"],

  // GRADE 5
  continent_super_admin: ["area_manager"],
  country_head: ["area_manager"],

  // GRADE 6
  finance_manager: ["finance_manager"],
  legal_manager: ["legal_compliance"],
  developer_dashboard: ["developer", "rnd_manager", "r_and_d"],
  pro_manager: ["performance_manager", "prime"],

  // GRADE 7
  pro_user_dashboard: ["prime"],
  basic_user_dashboard: ["client", "prime", "influencer", "reseller", "franchise", "developer"],

  // GRADE 8
  home: [],
  security: ["api_security", "legal_compliance", "server_manager"],
  settings: [],
};

export function hasFullSidebarAccess(role: string | null | undefined): boolean {
  return !!role && (ALL_ACCESS_ROLES as readonly string[]).includes(role);
}

/** Can the given role see/open this sidebar button? */
export function canSeeSidebarItem(role: string | null | undefined, id: string): boolean {
  if ((ALWAYS_VISIBLE_IDS as readonly string[]).includes(id)) return true;
  if (!role) return false;
  if (hasFullSidebarAccess(role)) return true;
  // A role always sees its own dashboard button when the ids line up.
  if (id === role) return true;
  return (SIDEBAR_VISIBILITY[id] ?? []).includes(role);
}

/** All button ids visible for a role. */
export function visibleSidebarIds(role: string | null | undefined, allIds: readonly string[]): string[] {
  return allIds.filter((id) => canSeeSidebarItem(role, id));
}
