import { z } from 'zod';

// ============================================================
// Review Types & Schemas
// ============================================================

/**
 * Review (상품 후기)
 * - 구매자만 작성 가능 (order_item_id로 검증)
 * - 이미지 최대 5장 지원
 * - 별점 1~5, 좋아요/조회수 기능
 */

// Review 기본 스키마
export const ReviewSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  user_id: z.string().uuid(),
  order_item_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  images: z.array(z.string().url()).max(5).default([]),
  like_count: z.number().int().nonnegative().default(0),
  view_count: z.number().int().nonnegative().default(0),
  is_best: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Review 타입
export type Review = z.infer<typeof ReviewSchema>;

// Review with Author (작성자 정보 포함)
export const ReviewWithAuthorSchema = ReviewSchema.extend({
  author: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    nickname: z.string().nullable(),
    avatar_url: z.string().url().nullable(),
  }),
});

export type ReviewWithAuthor = z.infer<typeof ReviewWithAuthorSchema>;

// Review with Product (상품 정보 포함)
export const ReviewWithProductSchema = ReviewSchema.extend({
  product: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    thumbnail_url: z.string().url().nullable(),
  }),
});

export type ReviewWithProduct = z.infer<typeof ReviewWithProductSchema>;

// Review 생성 입력 스키마
export const CreateReviewSchema = z.object({
  product_id: z.string().uuid(),
  order_item_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이내로 입력해주세요'),
  content: z.string().min(10, '내용을 10자 이상 입력해주세요'),
  images: z.array(z.string().url()).max(5, '이미지는 최대 5장까지 업로드 가능합니다').optional(),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

// Review 수정 입력 스키마
export const UpdateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(10).optional(),
  images: z.array(z.string().url()).max(5).optional(),
});

export type UpdateReviewInput = z.infer<typeof UpdateReviewSchema>;

// Review 필터 스키마
export const ReviewFilterSchema = z.object({
  product_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  is_best: z.boolean().optional(),
  sort_by: z.enum(['latest', 'rating_high', 'rating_low', 'likes', 'helpful']).default('latest'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type ReviewFilter = z.infer<typeof ReviewFilterSchema>;

// Review 통계 스키마
export const ReviewStatsSchema = z.object({
  total_count: z.number().int().nonnegative(),
  average_rating: z.number().min(0).max(5),
  rating_distribution: z.object({
    '1': z.number().int().nonnegative(),
    '2': z.number().int().nonnegative(),
    '3': z.number().int().nonnegative(),
    '4': z.number().int().nonnegative(),
    '5': z.number().int().nonnegative(),
  }),
  has_images_count: z.number().int().nonnegative(),
  best_reviews_count: z.number().int().nonnegative(),
});

export type ReviewStats = z.infer<typeof ReviewStatsSchema>;

// Review 이미지 업로드 스키마
export const ReviewImageUploadSchema = z.object({
  file: z.instanceof(File),
  alt_text: z.string().optional(),
});

export type ReviewImageUpload = z.infer<typeof ReviewImageUploadSchema>;

// Review 좋아요 토글 스키마
export const ToggleReviewLikeSchema = z.object({
  review_id: z.string().uuid(),
});

export type ToggleReviewLike = z.infer<typeof ToggleReviewLikeSchema>;

// Review 정렬 옵션
export const REVIEW_SORT_OPTIONS = {
  latest: { label: '최신순', value: 'latest' },
  rating_high: { label: '별점 높은순', value: 'rating_high' },
  rating_low: { label: '별점 낮은순', value: 'rating_low' },
  likes: { label: '좋아요순', value: 'likes' },
  helpful: { label: '도움순', value: 'helpful' },
} as const;

// Review 별점 라벨
export const REVIEW_RATING_LABELS = {
  1: '매우 불만족',
  2: '불만족',
  3: '보통',
  4: '만족',
  5: '매우 만족',
} as const;
