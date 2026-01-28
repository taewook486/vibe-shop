/**
 * P7-T7.8: 쿠폰 타입 정의
 *
 * 쿠폰 시스템 관련 TypeScript 타입
 */

export type CouponType = 'percent' | 'fixed' | 'free_shipping';
export type CouponStatus = 'active' | 'inactive' | 'expired';

export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: CouponType;
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
}

export interface CouponUsage {
  id: string;
  coupon_id: string;
  user_id: string;
  order_id: string;
  discount_amount: number;
  used_at: string;
}

export interface UserCoupon {
  id: string;
  user_id: string;
  coupon_id: string;
  issued_at: string;
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
}

export interface CouponWithUsage extends Coupon {
  usage_rate: number;
  status: CouponStatus;
  days_until_end: number;
}

export interface CouponFormData {
  code: string;
  name: string;
  type: CouponType;
  value: number;
  min_order_amount: number;
  max_discount: number | null;
  start_at: string;
  end_at: string;
  usage_limit: number | null;
  usage_limit_per_user: number;
  is_active: boolean;
}

export interface CouponFilterParams {
  type?: CouponType;
  status?: CouponStatus;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface CouponValidationResult {
  valid: boolean;
  discount_amount: number;
  error?: string;
}
