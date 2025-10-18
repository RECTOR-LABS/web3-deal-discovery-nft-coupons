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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          badge_type: string
          earned_at: string | null
          id: string
          metadata: Json | null
          nft_mint_address: string
          user_wallet: string
        }
        Insert: {
          badge_type: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          nft_mint_address: string
          user_wallet: string
        }
        Update: {
          badge_type?: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          nft_mint_address?: string
          user_wallet?: string
        }
        Relationships: []
      }
      cashback_transactions: {
        Row: {
          cashback_amount: number
          cashback_rate: number
          created_at: string | null
          deal_id: string | null
          id: string
          tier: string
          user_wallet: string
        }
        Insert: {
          cashback_amount: number
          cashback_rate: number
          created_at?: string | null
          deal_id?: string | null
          id?: string
          tier: string
          user_wallet: string
        }
        Update: {
          cashback_amount?: number
          cashback_rate?: number
          created_at?: string | null
          deal_id?: string | null
          id?: string
          tier?: string
          user_wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "cashback_transactions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          expiry_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_exclusive: boolean | null
          merchant_id: string | null
          min_tier: string | null
          nft_mint_address: string
          quantity: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_exclusive?: boolean | null
          merchant_id?: string | null
          min_tier?: string | null
          nft_mint_address: string
          quantity?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_exclusive?: boolean | null
          merchant_id?: string | null
          min_tier?: string | null
          nft_mint_address?: string
          quantity?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants_with_location"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          deal_id: string | null
          event_type: string
          id: string
          metadata: Json | null
          timestamp: string | null
          user_wallet: string | null
        }
        Insert: {
          deal_id?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          timestamp?: string | null
          user_wallet?: string | null
        }
        Update: {
          deal_id?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          timestamp?: string | null
          user_wallet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          address: string | null
          business_name: string
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
          wallet_address: string
        }
        Insert: {
          address?: string | null
          business_name: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          wallet_address: string
        }
        Update: {
          address?: string | null
          business_name?: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          claimed_at: string | null
          deal_id: string | null
          id: string
          referee_wallet: string
          referrer_wallet: string
        }
        Insert: {
          claimed_at?: string | null
          deal_id?: string | null
          id?: string
          referee_wallet: string
          referrer_wallet: string
        }
        Update: {
          claimed_at?: string | null
          deal_id?: string | null
          id?: string
          referee_wallet?: string
          referrer_wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      resale_listings: {
        Row: {
          id: string
          is_active: boolean | null
          listed_at: string | null
          nft_mint: string
          price_sol: number | null
          seller_wallet: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          listed_at?: string | null
          nft_mint: string
          price_sol?: number | null
          seller_wallet: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          listed_at?: string | null
          nft_mint?: string
          price_sol?: number | null
          seller_wallet?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          deal_id: string | null
          id: string
          rating: number | null
          review_text: string | null
          user_wallet: string
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          user_wallet: string
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          user_wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      staking: {
        Row: {
          created_at: string | null
          id: string
          last_stake_time: string | null
          staked_amount: number | null
          total_rewards_earned: number | null
          updated_at: string | null
          user_wallet: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_stake_time?: string | null
          staked_amount?: number | null
          total_rewards_earned?: number | null
          updated_at?: string | null
          user_wallet: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_stake_time?: string | null
          staked_amount?: number | null
          total_rewards_earned?: number | null
          updated_at?: string | null
          user_wallet?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          lifetime_cashback: number | null
          preferences: Json | null
          role: string | null
          tier: string | null
          total_redemptions: number | null
          total_referrals: number | null
          total_reviews: number | null
          total_upvotes: number | null
          updated_at: string | null
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          lifetime_cashback?: number | null
          preferences?: Json | null
          role?: string | null
          tier?: string | null
          total_redemptions?: number | null
          total_referrals?: number | null
          total_reviews?: number | null
          total_upvotes?: number | null
          updated_at?: string | null
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          lifetime_cashback?: number | null
          preferences?: Json | null
          role?: string | null
          tier?: string | null
          total_redemptions?: number | null
          total_referrals?: number | null
          total_reviews?: number | null
          total_upvotes?: number | null
          updated_at?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string | null
          deal_id: string | null
          id: string
          user_wallet: string
          vote_type: string | null
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          id?: string
          user_wallet: string
          vote_type?: string | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          id?: string
          user_wallet?: string
          vote_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      merchants_with_location: {
        Row: {
          address: string | null
          business_name: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          postal_code: string | null
          state: string | null
          total_deals: number | null
          wallet_address: string | null
        }
        Relationships: []
      }
      staking_leaderboard: {
        Row: {
          current_rewards: number | null
          last_stake_time: string | null
          lifetime_cashback: number | null
          stake_rank: number | null
          staked_amount: number | null
          tier: string | null
          total_rewards_earned: number | null
          user_wallet: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          badge_count: number | null
          badges: Json | null
          created_at: string | null
          tier: string | null
          total_redemptions: number | null
          total_referrals: number | null
          total_reviews: number | null
          total_upvotes: number | null
          wallet_address: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_distance_miles: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_staking_rewards: {
        Args: { user_wallet_address: string }
        Returns: number
      }
      increment_user_stat: {
        Args: { stat_field: string; user_wallet: string }
        Returns: undefined
      }
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
