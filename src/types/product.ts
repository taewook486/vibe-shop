import { z } from 'zod';

// ============================================================================
// Product Metadata Types
// ============================================================================

export interface DigitalMetadata {
  file_format?: string;
  file_size?: string;
  preview_url?: string;
}

export interface PhysicalMetadata {
  weight?: number;
  stock?: number;
  shipping_fee?: number;
  sku?: string;
}

export interface ServiceMetadata {
  duration?: number;
  booking_url?: string;
}

export type ProductMetadata = DigitalMetadata | PhysicalMetadata | ServiceMetadata;

// ============================================================================
// Product Type
// ============================================================================

export type ProductType = 'digital' | 'physical' | 'service';
export type ProductStatus = 'draft' | 'active' | 'archived' | 'hidden';

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  discount_price: number | null;
  type: ProductType;
  metadata: ProductMetadata | null;
  status: ProductStatus;
  is_featured: boolean;
  view_count: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Product Image Type
// ============================================================================

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

// ============================================================================
// Product File Type
// ============================================================================

export interface ProductFile {
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
}

// ============================================================================
// Tag Type
// ============================================================================

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// ============================================================================
// Product with Relations
// ============================================================================

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface ProductWithFiles extends Product {
  files: ProductFile[];
}

export interface ProductWithAll extends Product {
  images: ProductImage[];
  files: ProductFile[];
  tags: Tag[];
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  product: ProductWithAll;
}

// ============================================================================
// API Query Params
// ============================================================================

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'popular' | 'newest' | 'price_asc' | 'price_desc';
}

// ============================================================================
// Zod Validation Schemas
// ============================================================================

// Slug validation: only lowercase letters, numbers, and hyphens
const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens');

// Product Type Schema
export const productTypeSchema = z.enum(['digital', 'physical', 'service']);

// Product Status Schema
export const productStatusSchema = z.enum(['draft', 'active', 'archived', 'hidden']);

// Metadata Schemas
export const digitalMetadataSchema = z.object({
  file_format: z.string().optional(),
  file_size: z.string().optional(),
  preview_url: z.string().url().optional(),
});

export const physicalMetadataSchema = z.object({
  weight: z.number().int().positive().optional(),
  stock: z.number().int().min(0).optional(),
  shipping_fee: z.number().int().min(0).optional(),
  sku: z.string().optional(),
});

export const serviceMetadataSchema = z.object({
  duration: z.number().int().positive().optional(),
  booking_url: z.string().url().optional(),
});

// Allow any object as metadata (JSONB field) - passthrough for flexibility
export const productMetadataSchema = z.object({}).passthrough();

// Product Schema
export const productSchema = z.object({
  id: z.string().uuid(),
  category_id: z.string().uuid().nullable(),
  name: z.string().min(1).max(200),
  slug: slugSchema,
  short_description: z.string().max(300).nullable(),
  description: z.string().nullable(),
  price: z.number().int().min(0),
  discount_price: z.number().int().min(0).nullable(),
  type: productTypeSchema,
  metadata: productMetadataSchema,
  status: productStatusSchema,
  is_featured: z.boolean(),
  view_count: z.number().int().min(0),
  sales_count: z.number().int().min(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Product Image Schema
export const productImageSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  url: z.string().url(),
  alt_text: z.string().max(200).nullable(),
  sort_order: z.number().int().min(0),
  is_primary: z.boolean(),
  created_at: z.string().datetime(),
});

// Product File Schema
export const productFileSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  file_path: z.string().min(1).max(500),
  file_size: z.number().int().nullable(),
  file_type: z.string().nullable(),
  version: z.string(),
  download_limit: z.number().int().min(0),
  is_preview: z.boolean(),
  sort_order: z.number().int().min(0),
  created_at: z.string().datetime(),
});

// Tag Schema
export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  slug: slugSchema,
});

// Create Product Input Schema (without auto-generated fields)
export const createProductSchema = productSchema.omit({
  id: true,
  view_count: true,
  sales_count: true,
  created_at: true,
  updated_at: true,
});

// Update Product Input Schema (all fields optional except id)
export const updateProductSchema = productSchema.partial().required({ id: true });

// ============================================================================
// Type Inference from Zod Schemas
// ============================================================================

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
