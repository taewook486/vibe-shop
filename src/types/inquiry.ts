import { z } from 'zod';

// ============================================================
// Inquiry Types & Schemas
// ============================================================

/**
 * Inquiry (상품 문의)
 * - 로그인 사용자만 작성 가능
 * - 비밀글 옵션 지원
 * - 관리자 답변 기능
 * - 카테고리별 분류 (상품/배송/환불/기타)
 */

// Inquiry 카테고리
export const INQUIRY_CATEGORIES = {
  product: '상품 정보',
  shipping: '배송 문의',
  refund: '환불/교환',
  etc: '기타',
} as const;

export type InquiryCategoryType = keyof typeof INQUIRY_CATEGORIES;

// Inquiry 상태
export const INQUIRY_STATUS = {
  pending: '답변 대기',
  answered: '답변 완료',
} as const;

export type InquiryStatusType = keyof typeof INQUIRY_STATUS;

// Inquiry 기본 스키마
export const InquirySchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  user_id: z.string().uuid(),
  category: z.enum(['product', 'shipping', 'refund', 'etc']),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  is_private: z.boolean().default(false),
  status: z.enum(['pending', 'answered']).default('pending'),
  answer: z.string().nullable(),
  answered_by: z.string().uuid().nullable(),
  answered_at: z.string().datetime().nullable(),
  view_count: z.number().int().nonnegative().default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Inquiry = z.infer<typeof InquirySchema>;

// Inquiry with Author (작성자 정보 포함)
export const InquiryWithAuthorSchema = InquirySchema.extend({
  author: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    nickname: z.string().nullable(),
    avatar_url: z.string().url().nullable(),
  }),
});

export type InquiryWithAuthor = z.infer<typeof InquiryWithAuthorSchema>;

// Inquiry with Product (상품 정보 포함)
export const InquiryWithProductSchema = InquirySchema.extend({
  product: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    thumbnail_url: z.string().url().nullable(),
  }),
});

export type InquiryWithProduct = z.infer<typeof InquiryWithProductSchema>;

// Inquiry with Answer (답변자 정보 포함)
export const InquiryWithAnswerSchema = InquirySchema.extend({
  answerer: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    nickname: z.string().nullable(),
    avatar_url: z.string().url().nullable(),
  }).nullable(),
});

export type InquiryWithAnswer = z.infer<typeof InquiryWithAnswerSchema>;

// Inquiry 생성 입력 스키마
export const CreateInquirySchema = z.object({
  product_id: z.string().uuid().optional(),
  category: z.enum(['product', 'shipping', 'refund', 'etc']),
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이내로 입력해주세요'),
  content: z.string().min(10, '내용을 10자 이상 입력해주세요'),
  is_private: z.boolean(),
});

export type CreateInquiryInput = z.infer<typeof CreateInquirySchema>;

// Inquiry 수정 입력 스키마 (답변 전에만 수정 가능)
export const UpdateInquirySchema = z.object({
  category: z.enum(['product', 'shipping', 'refund', 'etc']).optional(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(10).optional(),
  is_private: z.boolean().optional(),
});

export type UpdateInquiryInput = z.infer<typeof UpdateInquirySchema>;

// Inquiry 답변 입력 스키마 (관리자용)
export const AnswerInquirySchema = z.object({
  answer: z.string().min(1, '답변 내용을 입력해주세요'),
});

export type AnswerInquiryInput = z.infer<typeof AnswerInquirySchema>;

// Inquiry 필터 스키마
export const InquiryFilterSchema = z.object({
  product_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  category: z.enum(['product', 'shipping', 'refund', 'etc']).optional(),
  status: z.enum(['pending', 'answered']).optional(),
  is_private: z.boolean().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['latest', 'oldest', 'unanswered', 'most_viewed']).default('latest'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type InquiryFilter = z.infer<typeof InquiryFilterSchema>;

// Inquiry 정렬 옵션
export const INQUIRY_SORT_OPTIONS = {
  latest: { label: '최신순', value: 'latest' },
  oldest: { label: '오래된순', value: 'oldest' },
  unanswered: { label: '답변 대기', value: 'unanswered' },
  most_viewed: { label: '조회수순', value: 'most_viewed' },
} as const;

// Inquiry 통계 스키마
export const InquiryStatsSchema = z.object({
  total_count: z.number().int().nonnegative(),
  pending_count: z.number().int().nonnegative(),
  answered_count: z.number().int().nonnegative(),
  category_distribution: z.object({
    product: z.number().int().nonnegative(),
    shipping: z.number().int().nonnegative(),
    refund: z.number().int().nonnegative(),
    etc: z.number().int().nonnegative(),
  }),
  private_count: z.number().int().nonnegative(),
  average_answer_time_hours: z.number().nonnegative().nullable(),
});

export type InquiryStats = z.infer<typeof InquiryStatsSchema>;

// Inquiry 답변 템플릿 스키마 (관리자용)
export const InquiryAnswerTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.enum(['product', 'shipping', 'refund', 'etc']).nullable(),
  content: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type InquiryAnswerTemplate = z.infer<typeof InquiryAnswerTemplateSchema>;
