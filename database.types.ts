export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cards: {
        Row: {
          archetype: string
          card_image: string
          description: string
          frame_type: string
          human_readable_card_type: string
          id: number
          name: string
          race: string
          set_code: string
          set_name: string
          set_price: string
          set_rarity: string
          set_rarity_code: string
          type: string
          ygoprodeck_url: string
        }
        Insert: {
          archetype: string
          card_image: string
          description: string
          frame_type: string
          human_readable_card_type: string
          id?: never
          name: string
          race: string
          set_code: string
          set_name: string
          set_price: string
          set_rarity: string
          set_rarity_code: string
          type: string
          ygoprodeck_url: string
        }
        Update: {
          archetype?: string
          card_image?: string
          description?: string
          frame_type?: string
          human_readable_card_type?: string
          id?: never
          name?: string
          race?: string
          set_code?: string
          set_name?: string
          set_price?: string
          set_rarity?: string
          set_rarity_code?: string
          type?: string
          ygoprodeck_url?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          condition: Database["public"]["Enums"]["condition_enum"] | null
          created_at: string | null
          description: string | null
          id: string
          price: number | null
          product_id: string
          product_type: Database["public"]["Enums"]["product_type_enum"]
          shipping_cost: number | null
          stock_quantity: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          condition?: Database["public"]["Enums"]["condition_enum"] | null
          created_at?: string | null
          description?: string | null
          id: string
          price?: number | null
          product_id: string
          product_type: Database["public"]["Enums"]["product_type_enum"]
          shipping_cost?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          condition?: Database["public"]["Enums"]["condition_enum"] | null
          created_at?: string | null
          description?: string | null
          id?: string
          price?: number | null
          product_id?: string
          product_type?: Database["public"]["Enums"]["product_type_enum"]
          shipping_cost?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          is_vendor: boolean | null
          paypal_merchant_id: string | null
          paypal_onboarding_state: string | null
          postal_code: string | null
          street: string | null
          street_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          is_vendor?: boolean | null
          paypal_merchant_id?: string | null
          paypal_onboarding_state?: string | null
          postal_code?: string | null
          street?: string | null
          street_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          is_vendor?: boolean | null
          paypal_merchant_id?: string | null
          paypal_onboarding_state?: string | null
          postal_code?: string | null
          street?: string | null
          street_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      remove_brackets_from_set_rarity_code: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      condition_enum:
        | "mint"
        | "near mint"
        | "lightly played"
        | "moderately played"
        | "heavily played"
        | "damaged"
      product_type_enum: "card" | "set"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      condition_enum: [
        "mint",
        "near mint",
        "lightly played",
        "moderately played",
        "heavily played",
        "damaged",
      ],
      product_type_enum: ["card", "set"],
    },
  },
} as const
