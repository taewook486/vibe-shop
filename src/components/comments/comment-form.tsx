/**
 * @file src/components/comments/comment-form.tsx
 * @description 댓글 작성/수정 폼 컴포넌트
 * @author frontend-specialist
 * @date 2026-01-25
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { CommentWithAuthor } from '@/types/comment';

interface CommentFormProps {
  commentableType: 'review' | 'inquiry';
  commentableId: string;
  parentId?: string | null;
  editingComment?: CommentWithAuthor;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
}

const MAX_LENGTH = 1000;

/**
 * CommentForm
 * - 댓글/대댓글 작성 폼
 * - 댓글 수정 모드 지원
 * - 글자 수 제한 (1000자)
 */
export default function CommentForm({
  parentId,
  editingComment,
  onSubmit,
  onCancel,
  placeholder,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!editingComment;
  const isReplyMode = !!parentId;

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (editingComment) {
      setContent(editingComment.content);
    }
  }, [editingComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedContent = content.trim();

    // 유효성 검증
    if (!trimmedContent) {
      setError('댓글 내용을 입력해주세요');
      return;
    }

    if (trimmedContent.length > MAX_LENGTH) {
      setError(`댓글은 ${MAX_LENGTH}자 이내로 입력해주세요`);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(trimmedContent);

      // 성공 시 폼 초기화 (수정 모드가 아닐 때만)
      if (!isEditMode) {
        setContent('');
      }
    } catch (err) {
      console.error('Comment submit error:', err);
      setError('댓글 등록에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setError('');
    onCancel?.();
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (isReplyMode) return '답글을 입력하세요...';
    return '댓글을 입력하세요...';
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) return '등록 중...';
    if (isEditMode) return '수정';
    return '등록';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Textarea */}
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={getPlaceholder()}
          className="min-h-[80px] resize-none"
          disabled={isSubmitting}
          maxLength={MAX_LENGTH}
        />

        {/* Character Count */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {content.length} / {MAX_LENGTH}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        {(isEditMode || isReplyMode) && onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !content.trim()}
        >
          {getSubmitButtonText()}
        </Button>
      </div>
    </form>
  );
}
