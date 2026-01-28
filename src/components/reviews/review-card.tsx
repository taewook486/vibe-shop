'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, ChevronRight } from 'lucide-react';
import { ReviewWithAuthor } from '@/types/review';
import { StarRating } from './star-rating';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ReviewCardProps {
  review: ReviewWithAuthor;
  onLike?: (reviewId: string) => void;
  onImageClick?: (imageUrl: string, allImages: string[]) => void;
  onCommentClick?: (reviewId: string) => void;
  isLiked?: boolean;
  showComments?: boolean;
  className?: string;
}

/**
 * ReviewCard 컴포넌트
 *
 * 개별 후기 카드를 표시하는 컴포넌트입니다.
 *
 * @example
 * <ReviewCard
 *   review={review}
 *   onLike={handleLike}
 *   onImageClick={handleImageClick}
 *   isLiked={isLiked}
 * />
 */
export function ReviewCard({
  review,
  onLike,
  onImageClick,
  onCommentClick,
  isLiked = false,
  showComments = false,
  className,
}: ReviewCardProps) {
  const handleLikeClick = () => {
    onLike?.(review.id);
  };

  const handleImageClick = (imageUrl: string) => {
    onImageClick?.(imageUrl, review.images);
  };

  const timeAgo = formatDistanceToNow(new Date(review.created_at), {
    addSuffix: true,
    locale: ko,
  });

  // 작성자 닉네임 또는 이메일의 첫 글자
  const authorInitial = review.author.nickname
    ? review.author.nickname[0]
    : review.author.email[0].toUpperCase();

  return (
    <article
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-6 space-y-4',
        'hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* 헤더: 작성자 정보 + 베스트 배지 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.author.avatar_url || undefined} />
            <AvatarFallback>{authorInitial}</AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">
                {review.author.nickname || '익명'}
              </p>
              {review.is_best && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  BEST
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>
        </div>

        {/* 별점 */}
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* 제목 */}
      <h3 className="font-semibold text-lg text-gray-900">
        {review.title}
      </h3>

      {/* 내용 */}
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {review.content}
      </p>

      {/* 이미지 갤러리 */}
      {review.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {review.images.map((imageUrl, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleImageClick(imageUrl)}
              className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
            >
              <Image
                src={imageUrl}
                alt={`후기 이미지 ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        {/* 좋아요 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLikeClick}
          className={cn(
            'flex items-center gap-1.5',
            isLiked && 'text-red-500'
          )}
          aria-label="좋아요"
        >
          <Heart
            className={cn(
              'w-4 h-4',
              isLiked && 'fill-current'
            )}
          />
          <span className="text-sm font-medium">{review.like_count}</span>
        </Button>

        {/* 댓글 버튼 */}
        {showComments && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCommentClick?.(review.id)}
            className="flex items-center gap-1.5"
            aria-label="댓글"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">댓글</span>
          </Button>
        )}

        {/* 조회수 */}
        <span className="text-sm text-gray-500 ml-auto">
          조회 {review.view_count.toLocaleString()}
        </span>
      </div>
    </article>
  );
}

/**
 * ReviewCardSkeleton 컴포넌트
 *
 * 로딩 중 표시할 스켈레톤 UI입니다.
 */
export function ReviewCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 animate-pulse">
      {/* 헤더 */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-5 bg-gray-200 rounded w-20" />
      </div>

      {/* 제목 */}
      <div className="h-6 bg-gray-200 rounded w-3/4" />

      {/* 내용 */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>

      {/* 액션 */}
      <div className="flex gap-4 pt-2">
        <div className="h-8 bg-gray-200 rounded w-16" />
        <div className="h-8 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );
}
