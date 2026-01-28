'use client';

import React from 'react';
import { ChevronDown, Filter, Loader2, MessageSquare } from 'lucide-react';
import { ReviewWithAuthor, ReviewStats, CreateReviewInput, ReviewFilter } from '@/types/review';
import { StarRating, RatingDistribution } from './star-rating';
import { ReviewCard, ReviewCardSkeleton } from './review-card';
import { ReviewForm } from './review-form';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'rating_high', label: '별점 높은순' },
  { value: 'rating_low', label: '별점 낮은순' },
  { value: 'likes', label: '좋아요순' },
  { value: 'helpful', label: '도움순' },
] as const;

interface ProductReviewsProps {
  productId: string;
  fetchReviews: (params: Partial<ReviewFilter>) => Promise<{ reviews: ReviewWithAuthor[]; total: number }>;
  fetchStats: (productId: string) => Promise<ReviewStats>;
  createReview: (data: CreateReviewInput) => Promise<{ success: boolean }>;
  toggleLike: (reviewId: string) => Promise<{ liked: boolean }>;
  currentUserId?: string;
  hasPurchased?: boolean;
  orderItemId?: string;
  className?: string;
}

/**
 * ProductReviews 컴포넌트
 *
 * 상품 후기 목록, 통계, 작성 폼을 포함하는 메인 컴포넌트입니다.
 *
 * @example
 * <ProductReviews
 *   productId={productId}
 *   fetchReviews={fetchReviews}
 *   fetchStats={fetchStats}
 *   createReview={createReview}
 *   toggleLike={toggleLike}
 *   currentUserId={user?.id}
 *   hasPurchased={hasPurchased}
 * />
 */
export function ProductReviews({
  productId,
  fetchReviews,
  fetchStats,
  createReview,
  toggleLike,
  currentUserId,
  hasPurchased = false,
  orderItemId,
  className,
}: ProductReviewsProps) {
  const [reviews, setReviews] = React.useState<ReviewWithAuthor[]>([]);
  const [stats, setStats] = React.useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<ReviewFilter['sort_by']>('latest');
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [showWriteForm, setShowWriteForm] = React.useState(false);
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = React.useState<string[]>([]);
  const [likedReviews, setLikedReviews] = React.useState<Set<string>>(new Set());

  const hasMore = reviews.length < total;

  // 초기 데이터 로드
  React.useEffect(() => {
    loadInitialData();
  }, [productId, sortBy]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [reviewsData, statsData] = await Promise.all([
        fetchReviews({ product_id: productId, sort_by: sortBy, page: 1 }),
        fetchStats(productId),
      ]);

      setReviews(reviewsData.reviews);
      setTotal(reviewsData.total);
      setStats(statsData);
      setPage(1);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 더보기
  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { reviews: newReviews } = await fetchReviews({
        product_id: productId,
        sort_by: sortBy,
        page: nextPage,
      });

      setReviews([...reviews, ...newReviews]);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more reviews:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 정렬 변경
  const handleSortChange = (value: ReviewFilter['sort_by']) => {
    setSortBy(value);
  };

  // 후기 작성
  const handleCreateReview = async (data: CreateReviewInput) => {
    await createReview(data);
    setShowWriteForm(false);
    // 새로고침
    await loadInitialData();
  };

  // 좋아요 토글
  const handleToggleLike = async (reviewId: string) => {
    try {
      const { liked } = await toggleLike(reviewId);

      // 낙관적 업데이트
      setLikedReviews((prev) => {
        const newSet = new Set(prev);
        if (liked) {
          newSet.add(reviewId);
        } else {
          newSet.delete(reviewId);
        }
        return newSet;
      });

      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                like_count: liked ? review.like_count + 1 : review.like_count - 1,
              }
            : review
        )
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  // 이미지 라이트박스
  const handleImageClick = (imageUrl: string, allImages: string[]) => {
    setLightboxImage(imageUrl);
    setLightboxImages(allImages);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxImages([]);
  };

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || '최신순';

  return (
    <div className={cn('space-y-8', className)}>
      {/* 통계 섹션 */}
      {isLoading ? (
        <div role="status" className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : stats ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 평균 별점 */}
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div>
                  <p className="text-5xl font-bold text-gray-900">
                    {stats.average_rating.toFixed(1)}
                  </p>
                  <div className="mt-2">
                    <StarRating rating={stats.average_rating} size="lg" />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">전체 {stats.total_count}개의 후기</p>
                  <p>사진 후기 {stats.has_images_count}개</p>
                </div>
              </div>
            </div>

            {/* 별점 분포 */}
            <div>
              <RatingDistribution
                distribution={stats.rating_distribution}
                totalCount={stats.total_count}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* 후기 작성 버튼 */}
      {currentUserId && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            상품 후기 ({stats?.total_count || 0})
          </h2>
          <Button
            onClick={() => setShowWriteForm(!showWriteForm)}
            disabled={!hasPurchased}
            title={!hasPurchased ? '구매 후 후기를 작성할 수 있습니다' : ''}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            후기 작성
          </Button>
        </div>
      )}

      {/* 후기 작성 폼 */}
      {showWriteForm && orderItemId && (
        <ReviewForm
          productId={productId}
          orderItemId={orderItemId}
          onSubmit={handleCreateReview}
          onCancel={() => setShowWriteForm(false)}
        />
      )}

      {/* 정렬 옵션 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          총 <span className="font-semibold">{total}</span>개의 후기
        </p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <span className="text-sm">정렬: {currentSortLabel}</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 후기 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
          </>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">아직 작성된 후기가 없습니다</p>
            {hasPurchased && (
              <Button
                onClick={() => setShowWriteForm(true)}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                첫 후기 작성하기
              </Button>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onLike={handleToggleLike}
              onImageClick={handleImageClick}
              isLiked={likedReviews.has(review.id)}
              showComments={false}
            />
          ))
        )}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && !isLoading && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                로딩 중...
              </>
            ) : (
              '더보기'
            )}
          </Button>
        </div>
      )}

      {/* 이미지 라이트박스 */}
      <Dialog open={!!lightboxImage} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl">
          {lightboxImage && (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <img
                src={lightboxImage}
                alt="후기 이미지 확대"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
