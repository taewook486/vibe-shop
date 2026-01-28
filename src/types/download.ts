/**
 * Download Types
 */

import { z } from 'zod';

/**
 * Download Status
 */
export type DownloadStatus = 'active' | 'expired' | 'limit_exceeded';

/**
 * Product File (from database)
 * DB columns: name, file_path, file_size, file_type
 */
export interface ProductFile {
  id: string;
  product_id: string;
  name: string;
  file_size: number;
  file_path: string;
  file_type: string;
  download_limit: number;
  is_preview: boolean;
  sort_order: number;
  created_at: string;
}

/**
 * Product File with Product Info
 */
export interface ProductFileWithProduct extends ProductFile {
  product: {
    name: string;
    thumbnail_url: string | null;
  };
}

/**
 * Download Record
 * Note: No user_id column - access through order_items → orders
 */
export interface Download {
  id: string;
  order_item_id: string;
  product_file_id: string;
  download_count: number;
  max_downloads: number;
  expires_at: string;
  last_downloaded_at: string | null;
  created_at: string;
}

/**
 * Download with Product File Info
 */
export interface DownloadWithFile extends Download {
  product_file: ProductFileWithProduct;
}

/**
 * Download Item for Display
 */
export interface DownloadItem {
  id: string;
  productName: string;
  fileName: string;
  fileSize: number;
  thumbnailUrl: string | null;
  downloadCount: number;
  downloadLimit: number;
  expiresAt: string;
  lastDownloadedAt: string | null;
  status: DownloadStatus;
  remainingDownloads: number;
}

/**
 * Format file size helper
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0.00 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Get download status
 */
export function getDownloadStatus(
  downloadCount: number,
  downloadLimit: number,
  expiresAt: string
): DownloadStatus {
  const now = new Date();
  const expires = new Date(expiresAt);

  if (expires < now) {
    return 'expired';
  }

  if (downloadCount >= downloadLimit) {
    return 'limit_exceeded';
  }

  return 'active';
}

/**
 * Format expiration date
 */
export function formatExpirationDate(expiresAt: string): string {
  const date = new Date(expiresAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Get remaining days
 */
export function getRemainingDays(expiresAt: string): number {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffTime = expires.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}
