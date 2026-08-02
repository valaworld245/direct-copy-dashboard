export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliate_commissions: {
        Row: {
          amount: number
          created_at: string
          id: string
          partner_id: string | null
          reference: string | null
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          partner_id?: string | null
          reference?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          partner_id?: string | null
          reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "affiliate_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_partners: {
        Row: {
          affiliate_code: string
          clicks: number
          created_at: string
          email: string | null
          id: string
          name: string
          signups: number
          status: string
          tier: string
        }
        Insert: {
          affiliate_code: string
          clicks?: number
          created_at?: string
          email?: string | null
          id?: string
          name: string
          signups?: number
          status?: string
          tier?: string
        }
        Update: {
          affiliate_code?: string
          clicks?: number
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          signups?: number
          status?: string
          tier?: string
        }
        Relationships: []
      }
      franchise_accounts: {
        Row: {
          created_at: string
          franchise_code: string
          id: string
          monthly_revenue: number
          monthly_target: number
          name: string
          owner_name: string | null
          status: string
          territory: string | null
        }
        Insert: {
          created_at?: string
          franchise_code: string
          id?: string
          monthly_revenue?: number
          monthly_target?: number
          name: string
          owner_name?: string | null
          status?: string
          territory?: string | null
        }
        Update: {
          created_at?: string
          franchise_code?: string
          id?: string
          monthly_revenue?: number
          monthly_target?: number
          name?: string
          owner_name?: string | null
          status?: string
          territory?: string | null
        }
        Relationships: []
      }
      franchise_leads: {
        Row: {
          city: string | null
          client_name: string
          created_at: string
          franchise_id: string | null
          id: string
          stage: string
          value: number
        }
        Insert: {
          city?: string | null
          client_name: string
          created_at?: string
          franchise_id?: string | null
          id?: string
          stage?: string
          value?: number
        }
        Update: {
          city?: string | null
          client_name?: string
          created_at?: string
          franchise_id?: string | null
          id?: string
          stage?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "franchise_leads_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_campaigns: {
        Row: {
          budget: number
          conversions: number
          created_at: string
          id: string
          influencer_id: string | null
          status: string
          title: string
        }
        Insert: {
          budget?: number
          conversions?: number
          created_at?: string
          id?: string
          influencer_id?: string | null
          status?: string
          title: string
        }
        Update: {
          budget?: number
          conversions?: number
          created_at?: string
          id?: string
          influencer_id?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_campaigns_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_profiles: {
        Row: {
          created_at: string
          engagement_rate: number
          followers: number
          handle: string
          id: string
          name: string
          platform: string
          status: string
        }
        Insert: {
          created_at?: string
          engagement_rate?: number
          followers?: number
          handle: string
          id?: string
          name: string
          platform?: string
          status?: string
        }
        Update: {
          created_at?: string
          engagement_rate?: number
          followers?: number
          handle?: string
          id?: string
          name?: string
          platform?: string
          status?: string
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          category: string
          created_at: string
          id: string
          price: number
          status: string
          title: string
          vendor_id: string | null
          views: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          price?: number
          status?: string
          title: string
          vendor_id?: string | null
          views?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          price?: number
          status?: string
          title?: string
          vendor_id?: string | null
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "marketplace_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_orders: {
        Row: {
          amount: number
          buyer_name: string
          created_at: string
          id: string
          listing_id: string | null
          status: string
        }
        Insert: {
          amount?: number
          buyer_name: string
          created_at?: string
          id?: string
          listing_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          buyer_name?: string
          created_at?: string
          id?: string
          listing_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_vendors: {
        Row: {
          contact_email: string | null
          country: string | null
          created_at: string
          id: string
          name: string
          rating: number
          status: string
        }
        Insert: {
          contact_email?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name: string
          rating?: number
          status?: string
        }
        Update: {
          contact_email?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          rating?: number
          status?: string
        }
        Relationships: []
      }
      reseller_accounts: {
        Row: {
          commission_rate: number
          created_at: string
          id: string
          kyc_status: string
          masked_email: string | null
          name: string
          region: string | null
          reseller_code: string
          status: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          id?: string
          kyc_status?: string
          masked_email?: string | null
          name: string
          region?: string | null
          reseller_code: string
          status?: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          id?: string
          kyc_status?: string
          masked_email?: string | null
          name?: string
          region?: string | null
          reseller_code?: string
          status?: string
        }
        Relationships: []
      }
      reseller_leads: {
        Row: {
          client_name: string
          created_at: string
          id: string
          product: string | null
          reseller_id: string | null
          stage: string
          value: number
        }
        Insert: {
          client_name: string
          created_at?: string
          id?: string
          product?: string | null
          reseller_id?: string | null
          stage?: string
          value?: number
        }
        Update: {
          client_name?: string
          created_at?: string
          id?: string
          product?: string | null
          reseller_id?: string | null
          stage?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "reseller_leads_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_payouts: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string | null
          reseller_id: string | null
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          method?: string | null
          reseller_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string | null
          reseller_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_payouts_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_keywords: {
        Row: {
          created_at: string
          id: string
          intent: string | null
          keyword: string
          position: number
          project_id: string | null
          volume: number
        }
        Insert: {
          created_at?: string
          id?: string
          intent?: string | null
          keyword: string
          position?: number
          project_id?: string | null
          volume?: number
        }
        Update: {
          created_at?: string
          id?: string
          intent?: string | null
          keyword?: string
          position?: number
          project_id?: string | null
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "seo_keywords_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "seo_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_projects: {
        Row: {
          created_at: string
          domain: string
          health_score: number
          id: string
          owner_team: string | null
          status: string
        }
        Insert: {
          created_at?: string
          domain: string
          health_score?: number
          id?: string
          owner_team?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          domain?: string
          health_score?: number
          id?: string
          owner_team?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
