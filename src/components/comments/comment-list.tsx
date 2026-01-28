/**
 * @file src/components/comments/comment-list.tsx
 * @description 댓글 목록 컴포넌트 (대댓글 접기/펼치기, 낙관적 업데이트)
 * @author frontend-specialist
 * @date 2026-01-25
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CommentItem from './comment-item';
import CommentForm from './comment-form';
import type { CommentWithAuthor } from '@/types/comment';

interface CommentListProps {
  commentableType: 'review' | 'inquiry';
  commentableId: string;
  comments: CommentWithAuthor[];
  currentUserId: string | null;
  onCommentAdded?: () => void;
  onCommentUpdated?: () => void;
  onCommentDeleted?: () => void;
}

/**
 * CommentList
 * - 댓글 목록 렌더링 (트리 구조)
 * - 대댓글 접기/펼치기
 * - 댓글 작성/수정/삭제
 * - 좋아요 기능
 * - 낙관적 업데이트
 */
export default function CommentList({
  commentableType,
  commentableId,
  comments: initialComments,
  currentUserId,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}: CommentListProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<CommentWithAuthor | null>(null);
  const [collapsedReplies, setCollapsedReplies] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // 댓글을 트리 구조로 변환
  const commentTree = useMemo(() => {
    const parentComments = comments.filter((c) => !c.parent_id);
    const replyMap = new Map<string, CommentWithAuthor[]>();

    // 대댓글 그룹화
    comments.forEach((comment) => {
      if (comment.parent_id) {
        if (!replyMap.has(comment.parent_id)) {
          replyMap.set(comment.parent_id, []);
        }
        replyMap.get(comment.parent_id)!.push(comment);
      }
    });

    return { parentComments, replyMap };
  }, [comments]);

  // 댓글 작성
  const handleCreateComment = async (content: string, parentId?: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentable_type: commentableType,
          commentable_id: commentableId,
          parent_id: parentId || null,
          content,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '댓글 작성 실패');
      }

      const data = await response.json();

      // 낙관적 업데이트
      setComments((prev) => [...prev, data.comment]);
      setReplyingTo(null);
      onCommentAdded?.();
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw error;
    }
  };

  // 댓글 수정
  const handleUpdateComment = async (content: string) => {
    if (!editingComment) return;

    try {
      const response = await fetch(`/api/comments/${editingComment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '댓글 수정 실패');
      }

      const data = await response.json();

      // 낙관적 업데이트
      setComments((prev) =>
        prev.map((c) => (c.id === editingComment.id ? data.comment : c))
      );
      setEditingComment(null);
      onCommentUpdated?.();
    } catch (error) {
      console.error('Failed to update comment:', error);
      throw error;
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '댓글 삭제 실패');
      }

      const data = await response.json();

      // 낙관적 업데이트
      if (data.comment) {
        // 대댓글이 있어서 "삭제된 댓글" 표시
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? data.comment : c))
        );
      } else {
        // 완전 삭제
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
      onCommentDeleted?.();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('댓글 삭제에 실패했습니다');
    }
  };

  // 좋아요 토글
  const handleToggleLike = async (commentId: string) => {
    const isCurrentlyLiked = likedComments.has(commentId);

    // 낙관적 업데이트
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, like_count: c.like_count + (isCurrentlyLiked ? -1 : 1) }
          : c
      )
    );

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likeable_type: 'comment',
          likeable_id: commentId,
        }),
      });

      if (!response.ok) {
        // 실패 시 롤백
        setLikedComments((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.add(commentId);
          } else {
            newSet.delete(commentId);
          }
          return newSet;
        });

        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, like_count: c.like_count + (isCurrentlyLiked ? 1 : -1) }
              : c
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  // 대댓글 접기/펼치기
  const toggleReplies = useCallback((commentId: string) => {
    setCollapsedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">아직 댓글이 없습니다</p>
        <p className="text-sm text-gray-400 mt-1">첫 댓글을 남겨보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment Count */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-gray-400" />
        <span className="font-medium text-gray-900">댓글 {comments.length}개</span>
      </div>

      {/* New Comment Form */}
      {currentUserId && !editingComment && (
        <CommentForm
          commentableType={commentableType}
          commentableId={commentableId}
          onSubmit={(content) => handleCreateComment(content)}
        />
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {commentTree.parentComments.map((comment) => {
          const replies = commentTree.replyMap.get(comment.id) || [];
          const isCollapsed = collapsedReplies.has(comment.id);
          const isEditing = editingComment?.id === comment.id;

          return (
            <div key={comment.id} className="space-y-3">
              {/* Parent Comment */}
              {isEditing ? (
                <div className="ml-11">
                  <CommentForm
                    commentableType={commentableType}
                    commentableId={commentableId}
                    editingComment={editingComment}
                    onSubmit={handleUpdateComment}
                    onCancel={() => setEditingComment(null)}
                  />
                </div>
              ) : (
                <CommentItem
                  comment={comment}
                  currentUserId={currentUserId}
                  onReply={(id) => setReplyingTo(id)}
                  onEdit={(c) => setEditingComment(c)}
                  onDelete={handleDeleteComment}
                  onLike={handleToggleLike}
                  isLiked={likedComments.has(comment.id)}
                />
              )}

              {/* Replies */}
              {replies.length > 0 && (
                <div>
                  {/* Toggle Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-11 h-7 gap-1 text-xs text-gray-600"
                    onClick={() => toggleReplies(comment.id)}
                  >
                    {isCollapsed ? (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        답글 {replies.length}개 보기
                      </>
                    ) : (
                      <>
                        <ChevronUp className="h-3 w-3" />
                        답글 숨기기
                      </>
                    )}
                  </Button>

                  {/* Reply List */}
                  {!isCollapsed && (
                    <div className="space-y-3 mt-3">
                      {replies.map((reply) => {
                        const isEditingReply = editingComment?.id === reply.id;

                        return (
                          <div key={reply.id}>
                            {isEditingReply ? (
                              <div className="ml-11">
                                <CommentForm
                                  commentableType={commentableType}
                                  commentableId={commentableId}
                                  editingComment={editingComment}
                                  onSubmit={handleUpdateComment}
                                  onCancel={() => setEditingComment(null)}
                                />
                              </div>
                            ) : (
                              <CommentItem
                                comment={reply}
                                currentUserId={currentUserId}
                                isNested
                                onReply={() => {}}
                                onEdit={(c) => setEditingComment(c)}
                                onDelete={handleDeleteComment}
                                onLike={handleToggleLike}
                                isLiked={likedComments.has(reply.id)}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === comment.id && currentUserId && (
                <div className="ml-11">
                  <CommentForm
                    commentableType={commentableType}
                    commentableId={commentableId}
                    parentId={comment.id}
                    onSubmit={(content) => handleCreateComment(content, comment.id)}
                    onCancel={() => setReplyingTo(null)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
