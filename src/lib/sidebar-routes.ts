/**
 * SIDEBAR ROUTE MAP
 * Maps every button of ControlPanelSidebar (super-admin-wireframe) to a route
 * that really exists in this ecosystem (TanStack routes + legacy module routes
 * mounted through the "/$" catch-all in src/App.tsx).
 */
export const SIDEBAR_ROUTES: Record<string, string> = {
  // GRADE 1
  boss_owner: "/boss/dashboard",
  ceo: "/ceo/dashboard",
  vala_ai_management: "/ai-console",
  server_manager: "/server-manager",
  api_ai_manager: "/api-manager",
  // GRADE 2
  developer_management: "/dev-manager",
  product_manager: "/super-admin/product-manager",
  demo_manager: "/demo-manager",
  task_management: "/task-manager",
  promise_tracker_manager: "/promise-tracker",
  assist_manager: "/assist-manager",
  ams_manager: "/ams",
  // GRADE 3
  marketing_management: "/marketing-manager",
  seo_manager: "/seo-manager",
  lead_manager: "/lead-manager",
  sales_support_manager: "/sales-support-manager",
  customer_support_management: "/client-success",
  // GRADE 4
  franchise_manager: "/franchise-manager",
  reseller_manager: "/reseller-manager",
  influencer_manager: "/influencer-manager",
  affiliate_manager: "/affiliate-manager",
  marketplace_manager: "/marketplace-manager",
  influencer_dashboard: "/influencer-dashboard",
  // GRADE 5
  continent_super_admin: "/continent/dashboard",
  country_head: "/country/dashboard",
  // GRADE 6
  finance_manager: "/finance",
  legal_manager: "/legal-manager",
  developer_dashboard: "/developer-dashboard",
  pro_manager: "/super-admin/prime-manager",
  // GRADE 7
  pro_user_dashboard: "/prime/dashboard",
  basic_user_dashboard: "/user-dashboard",
  // GRADE 8
  home: "/module-switch",
  security: "/security-command",
  settings: "/settings",
};

export function sidebarRouteFor(roleId: string): string {
  return SIDEBAR_ROUTES[roleId] ?? "/module-switch";
}
