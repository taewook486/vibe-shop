import { z } from 'zod';

// ============================================================================
// Tag Type
// ============================================================================

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// ============================================================================
// Product Tag Relation Type
// ============================================================================

export interface ProductTag {
  product_id: string;
  tag_id: string;
}

// ============================================================================
// Tag with Product Count
// ============================================================================

export interface TagWithProductCount extends Tag {
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

// Tag Schema
export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  slug: slugSchema,
});

// Product Tag Schema
export const productTagSchema = z.object({
  product_id: z.string().uuid(),
  tag_id: z.string().uuid(),
});

// Create Tag Input Schema (without id)
export const createTagSchema = tagSchema.omit({
  id: true,
});

// Update Tag Input Schema (all fields optional except id)
export const updateTagSchema = tagSchema.partial().required({ id: true });

// ============================================================================
// Type Inference from Zod Schemas
// ============================================================================

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
