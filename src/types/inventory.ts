import { z } from 'zod';

// ============================================================================
// Inventory Log Types
// ============================================================================

export type InventoryLogType = 'in' | 'out' | 'adjust';
export type InventoryReferenceType = 'order' | 'manual' | 'return' | 'damage' | 'order_cancel';

export interface InventoryLog {
  id: string;
  product_id: string;
  type: InventoryLogType;
  quantity: number; // Positive for in/adjust up, negative for out/adjust down
  reason: string | null;
  reference_id: string | null;
  reference_type: string | null;
  stock_before: number;
  stock_after: number;
  created_by: string | null;
  created_at: string;
}

// ============================================================================
// Inventory Summary Types
// ============================================================================

export interface ProductInventorySummary {
  product_id: string;
  product_name: string;
  current_stock: number;
  total_in: number;
  total_out: number;
  total_adjustments: number;
  last_movement: string | null;
}

export interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  stock: number;
  stock_alert_threshold: number;
  status: string;
}

// ============================================================================
// Inventory with Product Details
// ============================================================================

export interface InventoryWithProduct extends InventoryLog {
  product: {
    id: string;
    name: string;
    slug: string;
    stock: number;
  };
  creator?: {
    id: string;
    email: string;
  } | null;
}

// ============================================================================
// API Request Types
// ============================================================================

export interface AdjustStockRequest {
  product_id: string;
  quantity: number; // Can be positive (add) or negative (subtract)
  reason: string;
  type?: 'in' | 'out' | 'adjust';
}

export interface SetStockRequest {
  product_id: string;
  new_quantity: number; // Exact stock level
  reason?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface InventoryListResponse {
  logs: InventoryWithProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InventoryStatsResponse {
  total_products: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_stock_value: number;
  recent_movements: InventoryLog[];
}

// ============================================================================
// Zod Validation Schemas
// ============================================================================

export const inventoryLogTypeSchema = z.enum(['in', 'out', 'adjust']);

export const adjustStockSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().refine((val) => val !== 0, {
    message: 'Quantity cannot be zero',
  }),
  reason: z.string().min(1).max(500),
  type: inventoryLogTypeSchema.optional(),
});

export const setStockSchema = z.object({
  product_id: z.string().uuid(),
  new_quantity: z.number().int().min(0),
  reason: z.string().max(500).optional().default('Manual inventory adjustment'),
});

export const inventoryQuerySchema = z.object({
  product_id: z.string().uuid().optional(),
  type: inventoryLogTypeSchema.optional(),
  reference_type: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

// ============================================================================
// Type Inference
// ============================================================================

export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type SetStockInput = z.infer<typeof setStockSchema>;
export type InventoryQueryParams = z.infer<typeof inventoryQuerySchema>;
