/**
 * Product Types
 * 상품 관련 타입 정의
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price: number | null;
  category_id: string;
  images: string[];
  status: 'active' | 'inactive' | 'sold_out';
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price_adjustment: number;
  stock: number;
  created_at: string;
}

export interface ProductFile {
  id: string;
  product_id: string;
  name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  version: string;
  download_limit: number;
  is_preview: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ProductWithAll extends Product {
  category?: Category;
  variants?: ProductVariant[];
  files?: ProductFile[];
  images_detailed?: ProductImage[];
  tags?: Tag[];
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ProductsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  search?: string;
  status?: 'active' | 'inactive' | 'sold_out';
}
