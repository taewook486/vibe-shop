/**
 * Admin-specific types for user management
 */

export interface AdminUser {
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
}

export interface AdminUserWithStats extends AdminUser {
  stats?: {
    totalOrders: number;
    totalSpent: number;
    totalReviews: number;
    totalInquiries: number;
  };
}

export interface AdminOrder {
  id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';
  total_amount: number;
  discount_amount: number;
  paid_at: string | null;
  created_at: string;
}
