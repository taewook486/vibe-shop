/**
 * Cart Store
 *
 * Zustand 기반 장바구니 상태 관리
 * - 장바구니 아이템 (items)
 * - 로딩 상태 (isLoading)
 * - 에러 (error)
 * - 총액 (total)
 * - CRUD 액션 (fetchCart, addItem, updateQuantity, removeItem, clearCart)
 * - 낙관적 업데이트 (Optimistic Update)
 * - 에러 시 롤백 (Rollback on Error)
 * - localStorage 지속성 (persist)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

/**
 * 장바구니 아이템
 */
export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    discount_price: number | null;
    thumbnail_url: string | null;
  };
}

/**
 * Cart Store State
 */
interface CartStoreState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

/**
 * Cart Store Actions
 */
interface CartStoreActions {
  /**
   * 장바구니 조회
   */
  fetchCart: () => Promise<void>;

  /**
   * 장바구니에 상품 추가
   * @param productId - 상품 ID
   * @param quantity - 수량
   */
  addItem: (productId: string, quantity: number) => Promise<void>;

  /**
   * 수량 변경
   * @param cartItemId - 장바구니 아이템 ID
   * @param quantity - 새 수량
   */
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;

  /**
   * 장바구니에서 삭제
   * @param cartItemId - 장바구니 아이템 ID
   */
  removeItem: (cartItemId: string) => Promise<void>;

  /**
   * 장바구니 비우기
   */
  clearCart: () => void;
}

/**
 * Cart Store
 */
export type CartStore = CartStoreState & CartStoreActions;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 총액 계산
 * - 할인가가 있으면 할인가로 계산
 * - 없으면 정가로 계산
 */
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return total + price * item.quantity;
  }, 0);
}

// ============================================================================
// Store
// ============================================================================

/**
 * useCartStore Hook
 * - persist middleware로 localStorage에 장바구니 상태 저장
 * - items와 total만 저장 (isLoading, error는 저장하지 않음)
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
  // ============================================================================
  // Initial State
  // ============================================================================
  items: [],
  isLoading: false,
  error: null,
  total: 0,

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * 장바구니 조회
   */
  fetchCart: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/cart');

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData?.error?.message || '장바구니 조회에 실패했습니다.';
        set({
          error: errorMessage,
          isLoading: false,
        });
        return;
      }

      const data = await response.json();
      const items = data.items || [];
      const total = data.total || calculateTotal(items);

      set({
        items,
        total,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
      set({
        error: '장바구니 조회에 실패했습니다.',
        isLoading: false,
      });
    }
  },

  /**
   * 장바구니에 상품 추가
   * - 낙관적 업데이트: 임시 아이템을 즉시 추가
   * - API 성공 시: fetchCart로 최신 데이터 가져오기
   * - API 실패 시: 롤백
   */
  addItem: async (productId: string, quantity: number) => {
    const optimisticItem: CartItem = {
      id: `temp-${Date.now()}`,
      product_id: productId,
      quantity,
      product: {
        name: 'Loading...',
        price: 0,
        discount_price: null,
        thumbnail_url: null,
      },
    };

    const previousItems = get().items;

    // 낙관적 업데이트
    set((state) => ({
      items: [...state.items, optimisticItem],
      total: calculateTotal([...state.items, optimisticItem]),
    }));

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData?.error?.message || '장바구니에 추가하지 못했습니다.';

        // 롤백
        set({
          items: previousItems,
          total: calculateTotal(previousItems),
          error: errorMessage,
        });
        return;
      }

      // API 성공: fetchCart로 최신 데이터 가져오기
      await get().fetchCart();
    } catch (error) {
      console.error('장바구니 추가 실패:', error);

      // 롤백
      set({
        items: previousItems,
        total: calculateTotal(previousItems),
        error: '장바구니에 추가하지 못했습니다.',
      });
    }
  },

  /**
   * 수량 변경
   * - 낙관적 업데이트: 즉시 UI에 반영
   * - API 실패 시: 이전 수량으로 롤백
   */
  updateQuantity: async (cartItemId: string, quantity: number) => {
    const previousItems = get().items;
    const itemToUpdate = previousItems.find((item) => item.id === cartItemId);

    if (!itemToUpdate) {
      set({ error: '장바구니 아이템을 찾을 수 없습니다.' });
      return;
    }

    // 낙관적 업데이트
    const updatedItems = previousItems.map((item) =>
      item.id === cartItemId ? { ...item, quantity } : item
    );

    set({
      items: updatedItems,
      total: calculateTotal(updatedItems),
    });

    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData?.error?.message || '수량 변경에 실패했습니다.';

        // 롤백
        set({
          items: previousItems,
          total: calculateTotal(previousItems),
          error: errorMessage,
        });
        return;
      }

      // 성공 시 에러 초기화
      set({ error: null });
    } catch (error) {
      console.error('수량 변경 실패:', error);

      // 롤백
      set({
        items: previousItems,
        total: calculateTotal(previousItems),
        error: '수량 변경에 실패했습니다.',
      });
    }
  },

  /**
   * 장바구니에서 삭제
   * - 낙관적 업데이트: 즉시 UI에서 제거
   * - API 실패 시: 롤백
   */
  removeItem: async (cartItemId: string) => {
    const previousItems = get().items;

    // 낙관적 업데이트
    const updatedItems = previousItems.filter((item) => item.id !== cartItemId);

    set({
      items: updatedItems,
      total: calculateTotal(updatedItems),
    });

    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData?.error?.message || '장바구니 아이템 삭제에 실패했습니다.';

        // 롤백
        set({
          items: previousItems,
          total: calculateTotal(previousItems),
          error: errorMessage,
        });
        return;
      }

      // 성공 시 에러 초기화
      set({ error: null });
    } catch (error) {
      console.error('장바구니 아이템 삭제 실패:', error);

      // 롤백
      set({
        items: previousItems,
        total: calculateTotal(previousItems),
        error: '장바구니 아이템 삭제에 실패했습니다.',
      });
    }
  },

  /**
   * 장바구니 비우기
   */
  clearCart: () => {
    set({
      items: [],
      total: 0,
      error: null,
    });
  },
}),
    {
      name: 'vibeshop-cart', // localStorage key
      partialize: (state) => ({
        // items와 total만 저장 (isLoading, error는 저장하지 않음)
        items: state.items,
        total: state.total,
      }),
    }
  )
);
