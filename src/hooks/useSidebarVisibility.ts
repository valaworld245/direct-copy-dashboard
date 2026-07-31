import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { canSeeSidebarItem, visibleSidebarIds } from "@/lib/sidebar-visibility";

/**
 * Reads the signed-in user's real role from `user_roles` (same source as
 * useAuth) without needing the legacy AuthProvider, so TanStack routes can
 * gate sidebar buttons by role.
 */
export function useSidebarVisibility(allIds: readonly string[]) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) {
          if (!cancelled) { setRole(null); setLoading(false); }
          return;
        }
        const { data } = await supabase
          .from("user_roles")
          .select("role, approval_status")
          .eq("user_id", userId)
          .maybeSingle();

        if (cancelled) return;
        const approved = !data?.approval_status || data.approval_status === "approved";
        setRole(approved ? ((data?.role as string) ?? null) : null);
      } catch {
        if (!cancelled) setRole(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setLoading(true);
        load();
      }
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  return {
    role,
    loading,
    visibleIds: visibleSidebarIds(role, allIds),
    canAccess: (id: string) => canSeeSidebarItem(role, id),
  };
}
