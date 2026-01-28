import { z } from 'zod';

// ============================================================================
// Cart Item Type
// ============================================================================

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    discount_price: number | null;
    thumbnail_url: string;
  };
}

// ============================================================================
// Cart Response Type (from API)
// ============================================================================

export interface CartResponse {
  items: CartItem[];
  total: number;
}

// ============================================================================
// Cart Actions
// ============================================================================

export interface AddToCartInput {
  product_id: string;
  quantity?: number;
}

export interface UpdateCartItemInput {
  item_id: string;
  quantity: number;
}

// ============================================================================
// Zod Validation Schemas
// ============================================================================

export const addToCartSchema = z.object({
  product_id: z.string().uuid('유효한 상품 ID를 입력해주세요.'),
  quantity: z.number().int().positive('수량은 1개 이상이어야 합니다.').default(1),
});

export const updateCartItemSchema = z.object({
  item_id: z.string().uuid('유효한 아이템 ID를 입력해주세요.'),
  quantity: z.number().int().positive('수량은 1개 이상이어야 합니다.'),
});
