import { z } from 'zod';

// ============================================================================
// Category Type
// ============================================================================

export interface Category {
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
}

// ============================================================================
// Category with Relations
// ============================================================================

export interface CategoryWithChildren extends Category {
  children?: Category[];
}

export interface CategoryWithProductCount extends Category {
  product_count: number;
}

export interface CategoryFull extends Category {
  children?: CategoryFull[];
  product_count: number;
}

// ============================================================================
// Zod Validation Schemas
// ============================================================================

// Slug validation: only lowercase letters, numbers, and hyphens
const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens');

// Category Schema
export const categorySchema = z.object({
  id: z.string().uuid(),
  parent_id: z.string().uuid().nullable(),
  name: z.string().min(1).max(100),
  slug: slugSchema,
  description: z.string().nullable(),
  image_url: z.string().url().nullable(),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Create Category Input Schema (without auto-generated fields)
export const createCategorySchema = categorySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Update Category Input Schema (all fields optional except id)
export const updateCategorySchema = categorySchema.partial().required({ id: true });

// ============================================================================
// Type Inference from Zod Schemas
// ============================================================================

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
