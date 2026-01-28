/**
 * @file src/components/comments/comment-item.tsx
 * @description 개별 댓글 아이템 컴포넌트
 * @author frontend-specialist
 * @date 2026-01-25
 */

'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ThumbsUp, Reply, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { CommentWithAuthor } from '@/types/comment';

interface CommentItemProps {
  comment: CommentWithAuthor;
  currentUserId: string | null;
  isNested?: boolean;
  onReply: (commentId: string) => void;
  onEdit: (comment: CommentWithAuthor) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  isLiked?: boolean;
}

/**
 * CommentItem
 * - 댓글 내용, 작성자, 작성 시간 표시
 * - 좋아요, 답글, 수정, 삭제 버튼
 * - 삭제된 댓글 처리
 */
export default function CommentItem({
  comment,
  currentUserId,
  isNested = false,
  onReply,
  onEdit,
  onDelete,
  onLike,
  isLiked = false,
}: CommentItemProps) {
  const isOwner = currentUserId === comment.user_id;
  const isDeleted = comment.content === '[삭제된 댓글입니다]';
  const isAdmin = comment.author.role === 'admin';

  const handleDelete = () => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      onDelete(comment.id);
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={`flex gap-3 ${isNested ? 'ml-12 pl-4 border-l-2 border-gray-200' : ''}`}
      data-comment-id={comment.id}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={comment.author.avatar_url || undefined} alt={comment.author.nickname || 'User'} />
        <AvatarFallback className="text-xs">
          {getInitials(comment.author.nickname || comment.author.email)}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-gray-900">
            {comment.author.nickname || comment.author.email.split('@')[0]}
          </span>
          {isAdmin && (
            <span className="text-xs bg-vibe-blue-100 text-vibe-blue-700 px-2 py-0.5 rounded">
              관리자
            </span>
          )}
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
          {comment.updated_at !== comment.created_at && (
            <span className="text-xs text-gray-400">(수정됨)</span>
          )}
        </div>

        {/* Comment Content */}
        <p
          className={`text-sm text-gray-700 whitespace-pre-wrap break-words mb-2 ${
            isDeleted ? 'text-gray-400 italic' : ''
          }`}
        >
          {comment.content}
        </p>

        {/* Actions */}
        {!isDeleted && (
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 gap-1 ${isLiked ? 'text-vibe-blue-600' : 'text-gray-600'}`}
              onClick={() => onLike(comment.id)}
              aria-label="좋아요"
            >
              <ThumbsUp className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{comment.like_count > 0 ? comment.like_count : ''}</span>
            </Button>

            {/* Reply Button */}
            {!isNested && currentUserId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-gray-600"
                onClick={() => onReply(comment.id)}
              >
                <Reply className="h-3 w-3" />
                <span className="text-xs">답글</span>
              </Button>
            )}

            {/* Edit & Delete Buttons (only for owner) */}
            {isOwner && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-gray-600"
                  onClick={() => onEdit(comment)}
                >
                  <Edit className="h-3 w-3" />
                  <span className="text-xs">수정</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-gray-600"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="text-xs">삭제</span>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
