import { z } from 'zod';

// ============================================================
// Comment & Like Types & Schemas
// ============================================================

/**
 * Comment (댓글/대댓글)
 * - 다형성: reviews, inquiries에 공통 적용
 * - 1단계 대댓글만 허용 (parent_id)
 * - 좋아요 기능 지원
 */

// Commentable 타입 (댓글을 달 수 있는 대상)
export const COMMENTABLE_TYPES = {
  review: '후기',
  inquiry: '문의',
} as const;

export type CommentableType = keyof typeof COMMENTABLE_TYPES;

// Comment 기본 스키마
export const CommentSchema = z.object({
  id: z.string().uuid(),
  commentable_type: z.enum(['review', 'inquiry']),
  commentable_id: z.string().uuid(),
  parent_id: z.string().uuid().nullable(),
  user_id: z.string().uuid(),
  content: z.string().min(1),
  like_count: z.number().int().nonnegative().default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Comment = z.infer<typeof CommentSchema>;

// Comment with Author (작성자 정보 포함)
export const CommentWithAuthorSchema = CommentSchema.extend({
  author: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    nickname: z.string().nullable(),
    avatar_url: z.string().url().nullable(),
    role: z.enum(['user', 'admin']),
  }),
});

export type CommentWithAuthor = z.infer<typeof CommentWithAuthorSchema>;

// Comment with Replies (대댓글 포함)
// Note: Using manual type definition due to circular reference complexity in Zod
export type CommentWithReplies = CommentWithAuthor & {
  replies: CommentWithAuthor[];
};

// Comment 생성 입력 스키마
export const CreateCommentSchema = z.object({
  commentable_type: z.enum(['review', 'inquiry']),
  commentable_id: z.string().uuid(),
  parent_id: z.string().uuid().nullable().optional(),
  content: z.string().min(1, '댓글 내용을 입력해주세요').max(1000, '댓글은 1000자 이내로 입력해주세요'),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

// Comment 수정 입력 스키마
export const UpdateCommentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요').max(1000, '댓글은 1000자 이내로 입력해주세요'),
});

export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;

// Comment 필터 스키마
export const CommentFilterSchema = z.object({
  commentable_type: z.enum(['review', 'inquiry']).optional(),
  commentable_id: z.string().uuid().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  user_id: z.string().uuid().optional(),
  sort_by: z.enum(['latest', 'oldest', 'likes']).default('latest'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(50),
});

export type CommentFilter = z.infer<typeof CommentFilterSchema>;

// ============================================================
// Like Types & Schemas
// ============================================================

/**
 * Like (좋아요)
 * - 다형성: reviews, comments에 공통 적용
 * - 중복 방지 (user_id + likeable_type + likeable_id UNIQUE)
 */

// Likeable 타입 (좋아요를 누를 수 있는 대상)
export const LIKEABLE_TYPES = {
  review: '후기',
  comment: '댓글',
} as const;

export type LikeableType = keyof typeof LIKEABLE_TYPES;

// Like 기본 스키마
export const LikeSchema = z.object({
  id: z.string().uuid(),
  likeable_type: z.enum(['review', 'comment']),
  likeable_id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export type Like = z.infer<typeof LikeSchema>;

// Like 토글 입력 스키마 (좋아요 추가/제거)
export const ToggleLikeSchema = z.object({
  likeable_type: z.enum(['review', 'comment']),
  likeable_id: z.string().uuid(),
});

export type ToggleLikeInput = z.infer<typeof ToggleLikeSchema>;

// Like 상태 응답 스키마
export const LikeStateSchema = z.object({
  is_liked: z.boolean(),
  like_count: z.number().int().nonnegative(),
});

export type LikeState = z.infer<typeof LikeStateSchema>;

// Like 필터 스키마
export const LikeFilterSchema = z.object({
  likeable_type: z.enum(['review', 'comment']).optional(),
  likeable_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(50),
});

export type LikeFilter = z.infer<typeof LikeFilterSchema>;

// ============================================================
// Comment 정렬 옵션
// ============================================================

export const COMMENT_SORT_OPTIONS = {
  latest: { label: '최신순', value: 'latest' },
  oldest: { label: '오래된순', value: 'oldest' },
  likes: { label: '좋아요순', value: 'likes' },
} as const;

// ============================================================
// Comment 트리 구조 헬퍼 타입
// ============================================================

// Comment 트리 변환용 타입
export type CommentTree = CommentWithAuthor & {
  replies: CommentTree[];
};

// Comment 깊이 제한 (1단계만 허용)
export const MAX_COMMENT_DEPTH = 1;

// Comment 표시용 플래그
export const COMMENT_FLAGS = {
  isDeleted: '삭제된 댓글입니다',
  isEdited: '(수정됨)',
  isAdmin: '관리자',
} as const;
