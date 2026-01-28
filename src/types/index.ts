// ============================================================
// Type Exports Index
// ============================================================

// Auth Types
export * from './auth';

// Product Types (avoiding re-export conflicts)
export type {
  Product,
  ProductImage,
  ProductFile,
  ProductWithAll,
} from './product';

export type {
  Category,
  CategoryWithProductCount,
} from './category';

export type { Tag } from './tag';

// Cart & Order Types
export * from './cart';
export * from './order';
export * from './download';

// Community Types (Phase 6)
export * from './review';
export * from './inquiry';
export * from './comment';

// Inventory Types (Phase 7)
export * from './inventory';

// Database Types
export * from './database.types';
