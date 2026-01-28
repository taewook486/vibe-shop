/**
 * Supabase Database Types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          nickname: string | null;
          avatar_url: string | null;
          role: 'customer' | 'admin';
          grade: 'bronze' | 'silver' | 'gold' | 'vip';
          points: number;
          total_order_amount: number;
          is_blocked: boolean;
          blocked_reason: string | null;
          blocked_at: string | null;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nickname?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'admin';
          grade?: 'bronze' | 'silver' | 'gold' | 'vip';
          points?: number;
          total_order_amount?: number;
          is_blocked?: boolean;
          blocked_reason?: string | null;
          blocked_at?: string | null;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nickname?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'admin';
          grade?: 'bronze' | 'silver' | 'gold' | 'vip';
          points?: number;
          total_order_amount?: number;
          is_blocked?: boolean;
          blocked_reason?: string | null;
          blocked_at?: string | null;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          price: number;
          discount_price: number | null;
          metadata: Json;
          status: 'draft' | 'active' | 'archived' | 'hidden';
          is_featured: boolean;
          view_count: number;
          sales_count: number;
          stock: number;
          stock_alert_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          price: number;
          discount_price?: number | null;
          metadata?: Json;
          status?: 'draft' | 'active' | 'archived' | 'hidden';
          is_featured?: boolean;
          view_count?: number;
          sales_count?: number;
          stock?: number;
          stock_alert_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          price?: number;
          discount_price?: number | null;
          metadata?: Json;
          status?: 'draft' | 'active' | 'archived' | 'hidden';
          is_featured?: boolean;
          view_count?: number;
          sales_count?: number;
          stock?: number;
          stock_alert_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      product_files: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          file_path: string;
          file_size: number;
          file_type: string;
          version: string;
          download_limit: number;
          is_preview: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          file_path: string;
          file_size?: number;
          file_type?: string;
          version?: string;
          download_limit?: number;
          is_preview?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          file_path?: string;
          file_size?: number;
          file_type?: string;
          version?: string;
          download_limit?: number;
          is_preview?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      product_tags: {
        Row: {
          product_id: string;
          tag_id: string;
        };
        Insert: {
          product_id: string;
          tag_id: string;
        };
        Update: {
          product_id?: string;
          tag_id?: string;
        };
        Relationships: [];
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          guest_email: string | null;
          status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';
          total_amount: number;
          discount_amount: number;
          payment_info: Json;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          guest_email?: string | null;
          status?: 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';
          total_amount: number;
          discount_amount?: number;
          payment_info?: Json;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          guest_email?: string | null;
          status?: 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';
          total_amount?: number;
          discount_amount?: number;
          payment_info?: Json;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          price: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          price: number;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          price?: number;
          quantity?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      downloads: {
        Row: {
          id: string;
          order_item_id: string;
          product_file_id: string;
          download_count: number;
          max_downloads: number;
          expires_at: string;
          last_downloaded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_item_id: string;
          product_file_id: string;
          download_count?: number;
          max_downloads?: number;
          expires_at: string;
          last_downloaded_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_item_id?: string;
          product_file_id?: string;
          download_count?: number;
          max_downloads?: number;
          expires_at?: string;
          last_downloaded_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          order_item_id: string;
          rating: number;
          title: string;
          content: string;
          images: Json | null;
          like_count: number;
          view_count: number;
          is_best: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          order_item_id: string;
          rating: number;
          title: string;
          content: string;
          images?: Json | null;
          like_count?: number;
          view_count?: number;
          is_best?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          order_item_id?: string;
          rating?: number;
          title?: string;
          content?: string;
          images?: Json | null;
          like_count?: number;
          view_count?: number;
          is_best?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          product_id: string | null;
          user_id: string;
          category: string;
          title: string;
          content: string;
          is_private: boolean;
          status: 'pending' | 'answered';
          answer: string | null;
          answered_at: string | null;
          answered_by: string | null;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          user_id: string;
          category: string;
          title: string;
          content: string;
          is_private?: boolean;
          status?: 'pending' | 'answered';
          answer?: string | null;
          answered_at?: string | null;
          answered_by?: string | null;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          user_id?: string;
          category?: string;
          title?: string;
          content?: string;
          is_private?: boolean;
          status?: 'pending' | 'answered';
          answer?: string | null;
          answered_at?: string | null;
          answered_by?: string | null;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          commentable_type: 'review' | 'inquiry';
          commentable_id: string;
          parent_id: string | null;
          user_id: string;
          content: string;
          like_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          commentable_type: 'review' | 'inquiry';
          commentable_id: string;
          parent_id?: string | null;
          user_id: string;
          content: string;
          like_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          commentable_type?: 'review' | 'inquiry';
          commentable_id?: string;
          parent_id?: string | null;
          user_id?: string;
          content?: string;
          like_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      likes: {
        Row: {
          id: string;
          likeable_type: 'review' | 'comment';
          likeable_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          likeable_type: 'review' | 'comment';
          likeable_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          likeable_type?: 'review' | 'comment';
          likeable_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      inventory_logs: {
        Row: {
          id: string;
          product_id: string;
          type: 'in' | 'out' | 'adjust';
          quantity: number;
          reason: string | null;
          reference_id: string | null;
          reference_type: string | null;
          stock_before: number;
          stock_after: number;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          type: 'in' | 'out' | 'adjust';
          quantity: number;
          reason?: string | null;
          reference_id?: string | null;
          reference_type?: string | null;
          stock_before: number;
          stock_after: number;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          type?: 'in' | 'out' | 'adjust';
          quantity?: number;
          reason?: string | null;
          reference_id?: string | null;
          reference_type?: string | null;
          stock_before?: number;
          stock_after?: number;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          name: string;
          type: 'percent' | 'fixed' | 'free_shipping';
          value: number;
          min_order_amount: number;
          max_discount: number | null;
          start_at: string;
          end_at: string;
          usage_limit: number | null;
          usage_limit_per_user: number;
          used_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          type: 'percent' | 'fixed' | 'free_shipping';
          value: number;
          min_order_amount?: number;
          max_discount?: number | null;
          start_at: string;
          end_at: string;
          usage_limit?: number | null;
          usage_limit_per_user?: number;
          used_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          type?: 'percent' | 'fixed' | 'free_shipping';
          value?: number;
          min_order_amount?: number;
          max_discount?: number | null;
          start_at?: string;
          end_at?: string;
          usage_limit?: number | null;
          usage_limit_per_user?: number;
          used_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coupon_usages: {
        Row: {
          id: string;
          coupon_id: string;
          user_id: string;
          order_id: string;
          discount_amount: number;
          used_at: string;
        };
        Insert: {
          id?: string;
          coupon_id: string;
          user_id: string;
          order_id: string;
          discount_amount: number;
          used_at?: string;
        };
        Update: {
          id?: string;
          coupon_id?: string;
          user_id?: string;
          order_id?: string;
          discount_amount?: number;
          used_at?: string;
        };
        Relationships: [];
      };
      user_coupons: {
        Row: {
          id: string;
          user_id: string;
          coupon_id: string;
          issued_at: string;
          expires_at: string;
          is_used: boolean;
          used_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          coupon_id: string;
          issued_at?: string;
          expires_at: string;
          is_used?: boolean;
          used_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          coupon_id?: string;
          issued_at?: string;
          expires_at?: string;
          is_used?: boolean;
          used_at?: string | null;
        };
        Relationships: [];
      };
      user_grades: {
        Row: {
          id: number;
          code: 'bronze' | 'silver' | 'gold' | 'vip';
          name: string;
          min_order_amount: number;
          discount_rate: number;
          point_rate: number;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          code: 'bronze' | 'silver' | 'gold' | 'vip';
          name: string;
          min_order_amount?: number;
          discount_rate?: number;
          point_rate?: number;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          code?: 'bronze' | 'silver' | 'gold' | 'vip';
          name?: string;
          min_order_amount?: number;
          discount_rate?: number;
          point_rate?: number;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      grade_histories: {
        Row: {
          id: number;
          user_id: string;
          from_grade: string | null;
          to_grade: string;
          reason: string;
          changed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          from_grade?: string | null;
          to_grade: string;
          reason?: string;
          changed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          from_grade?: string | null;
          to_grade?: string;
          reason?: string;
          changed_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      point_histories: {
        Row: {
          id: number;
          user_id: string;
          type: 'earn' | 'use' | 'expire' | 'adjust' | 'refund';
          amount: number;
          balance: number;
          reason: string;
          reference_type: string | null;
          reference_id: string | null;
          expires_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          type: 'earn' | 'use' | 'expire' | 'adjust' | 'refund';
          amount: number;
          balance: number;
          reason: string;
          reference_type?: string | null;
          reference_id?: string | null;
          expires_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          type?: 'earn' | 'use' | 'expire' | 'adjust' | 'refund';
          amount?: number;
          balance?: number;
          reason?: string;
          reference_type?: string | null;
          reference_id?: string | null;
          expires_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      toggle_like: {
        Args: {
          p_likeable_type: 'review' | 'comment';
          p_likeable_id: string;
          p_user_id: string;
        };
        Returns: {
          action: 'liked' | 'unliked';
          like_id: string;
        };
      };
      check_user_liked: {
        Args: {
          p_likeable_type: 'review' | 'comment';
          p_likeable_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      get_comment_tree: {
        Args: {
          p_commentable_type: 'review' | 'inquiry';
          p_commentable_id: string;
        };
        Returns: {
          id: string;
          parent_id: string | null;
          user_id: string;
          content: string;
          like_count: number;
          created_at: string;
          level: number;
        }[];
      };
      increment_inquiry_view_count: {
        Args: {
          inquiry_id: string;
        };
        Returns: void;
      };
      get_pending_inquiry_count: {
        Args: Record<string, never>;
        Returns: number;
      };
      get_product_inquiry_count: {
        Args: {
          p_product_id: string;
        };
        Returns: number;
      };
      increment_review_view_count: {
        Args: {
          review_id: string;
        };
        Returns: void;
      };
      get_product_average_rating: {
        Args: {
          p_product_id: string;
        };
        Returns: number;
      };
      check_stock_availability: {
        Args: {
          p_product_id: string;
          p_quantity: number;
        };
        Returns: boolean;
      };
      deduct_stock: {
        Args: {
          p_product_id: string;
          p_quantity: number;
          p_reference_id: string;
          p_reference_type?: string;
          p_reason?: string;
        };
        Returns: boolean;
      };
      add_stock: {
        Args: {
          p_product_id: string;
          p_quantity: number;
          p_reference_id?: string;
          p_reference_type?: string;
          p_reason?: string;
        };
        Returns: boolean;
      };
      adjust_stock: {
        Args: {
          p_product_id: string;
          p_new_quantity: number;
          p_reason?: string;
        };
        Returns: boolean;
      };
      get_low_stock_products: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          name: string;
          slug: string;
          stock: number;
          stock_alert_threshold: number;
          status: string;
        }[];
      };
      get_product_inventory_summary: {
        Args: {
          p_product_id: string;
        };
        Returns: {
          product_id: string;
          product_name: string;
          current_stock: number;
          total_in: number;
          total_out: number;
          total_adjustments: number;
          last_movement: string | null;
        }[];
      };
      update_last_login: {
        Args: {
          user_id: string;
        };
        Returns: void;
      };
      generate_coupon_code: {
        Args: {
          length?: number;
        };
        Returns: string;
      };
      validate_coupon: {
        Args: {
          p_coupon_code: string;
          p_user_id: string;
          p_order_amount: number;
        };
        Returns: {
          is_valid: boolean;
          error_message: string | null;
          discount_amount: number;
          coupon_id: string | null;
        }[];
      };
      add_user_points: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_reason: string;
          p_reference_type?: string;
          p_created_by?: string;
        };
        Returns: number;
      };
      deduct_user_points: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_reason: string;
          p_reference_type?: string;
          p_created_by?: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
