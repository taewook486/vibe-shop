/**
 * Order Types
 */

import { z } from 'zod';

/**
 * UUID-like pattern (accepts both standard UUIDs and seed data UUIDs)
 */
const uuidLikePattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Order Status
 */
export type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';

/**
 * Order
 */
export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  guest_email: string | null;
  status: OrderStatus;
  total_amount: number;
  discount_amount: number;
  payment_info: Record<string, any>;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Order Item
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
  created_at: string;
}

/**
 * Order with Items
 */
export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/**
 * Create Order Request
 */
export const CreateOrderRequestSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.string().regex(uuidLikePattern, '유효한 상품 ID를 입력해주세요.'),
      product_name: z.string().min(1),
      price: z.number().int().min(0),
      quantity: z.number().int().min(1).default(1),
    })
  ).min(1, '주문 상품은 최소 1개 이상이어야 합니다'),
  guest_email: z.string().email().optional(),
  discount_amount: z.number().int().min(0).default(0),
});

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;

/**
 * Update Payment Request
 */
export const UpdatePaymentRequestSchema = z.object({
  paymentKey: z.string().min(1, '결제 키는 필수입니다'),
  orderId: z.string().min(1, '주문번호는 필수입니다'),
  amount: z.number().int().min(1, '결제 금액은 1 이상이어야 합니다'),
});

export type UpdatePaymentRequest = z.infer<typeof UpdatePaymentRequestSchema>;

/**
 * Order Response
 */
export interface OrderResponse {
  data: OrderWithItems;
}

/**
 * Orders List Response
 */
export interface OrdersListResponse {
  data: OrderWithItems[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
