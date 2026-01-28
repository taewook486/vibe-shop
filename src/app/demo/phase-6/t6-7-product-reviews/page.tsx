'use client';

import React from 'react';
import { ProductReviews } from '@/components/reviews/product-reviews';
import { ReviewWithAuthor, ReviewStats, CreateReviewInput, ReviewFilter } from '@/types/review';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type DemoState = 'empty' | 'with-reviews' | 'write-form' | 'with-images';

// Mock 데이터
const mockStats: ReviewStats = {
  total_count: 24,
  average_rating: 4.3,
  rating_distribution: {
    '1': 1,
    '2': 2,
    '3': 4,
    '4': 7,
    '5': 10,
  },
  has_images_count: 12,
  best_reviews_count: 3,
};

const mockEmptyStats: ReviewStats = {
  total_count: 0,
  average_rating: 0,
  rating_distribution: {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
  },
  has_images_count: 0,
  best_reviews_count: 0,
};

const mockReviews: ReviewWithAuthor[] = [
  {
    id: 'review-1',
    product_id: 'product-demo',
    user_id: 'user-1',
    order_item_id: 'order-item-1',
    rating: 5,
    title: '정말 유용한 디지털 상품입니다!',
    content: '바이브랩스 유튜브를 보고 구매했는데, 정말 도움이 많이 됐습니다. 특히 라이브 코딩 콘텐츠와 함께 보니 이해가 더 잘 되더라고요. 초보자도 쉽게 따라할 수 있는 구조라 추천합니다!',
    images: [],
    like_count: 42,
    view_count: 156,
    is_best: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 'user-1',
      email: 'developer@example.com',
      nickname: '코딩초보탈출',
      avatar_url: null,
    },
  },
  {
    id: 'review-2',
    product_id: 'product-demo',
    user_id: 'user-2',
    order_item_id: 'order-item-2',
    rating: 4,
    title: '가격 대비 좋은 퀄리티',
    content: '다운로드 받자마자 바로 사용할 수 있어서 편했습니다. 문서화도 잘 되어 있고, 예제 코드도 충분해요. 다만 고급 기능은 조금 더 있었으면 좋겠네요.',
    images: [],
    like_count: 18,
    view_count: 89,
    is_best: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 'user-2',
      email: 'buyer@example.com',
      nickname: '일반구매자',
      avatar_url: null,
    },
  },
  {
    id: 'review-3',
    product_id: 'product-demo',
    user_id: 'user-3',
    order_item_id: 'order-item-3',
    rating: 5,
    title: '이미지 첨부 후기입니다',
    content: '실제로 프로젝트에 적용한 결과 스크린샷 첨부합니다. 깔끔하게 잘 작동하네요!',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
      'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400',
    ],
    like_count: 35,
    view_count: 124,
    is_best: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 'user-3',
      email: 'power@example.com',
      nickname: '파워유저',
      avatar_url: null,
    },
  },
  {
    id: 'review-4',
    product_id: 'product-demo',
    user_id: 'user-4',
    order_item_id: 'order-item-4',
    rating: 3,
    title: '보통입니다',
    content: '나쁘지 않지만 기대했던 것보다는 조금 부족했어요. 그래도 기본적인 기능은 다 있습니다.',
    images: [],
    like_count: 5,
    view_count: 43,
    is_best: false,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 'user-4',
      email: 'user4@example.com',
      nickname: '냉정한평가',
      avatar_url: null,
    },
  },
];

/**
 * Demo Page: Product Reviews (P6-T6.7)
 *
 * 상품 후기 컴포넌트 데모 페이지
 *
 * 데모 상태:
 * - empty: 후기가 없는 상태
 * - with-reviews: 후기가 있는 상태
 * - write-form: 후기 작성 폼 열린 상태
 * - with-images: 이미지가 있는 후기들
 */
export default function DemoProductReviewsPage() {
  const [demoState, setDemoState] = React.useState<DemoState>('with-reviews');

  // Mock API functions
  const mockFetchReviews = async (params: Partial<ReviewFilter>) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (demoState === 'empty') {
      return { reviews: [], total: 0 };
    }

    if (demoState === 'with-images') {
      return {
        reviews: mockReviews.filter((r) => r.images.length > 0),
        total: mockReviews.filter((r) => r.images.length > 0).length,
      };
    }

    // 정렬 적용
    const sortedReviews = [...mockReviews];
    if (params.sort_by === 'rating_high') {
      sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (params.sort_by === 'rating_low') {
      sortedReviews.sort((a, b) => a.rating - b.rating);
    } else if (params.sort_by === 'likes') {
      sortedReviews.sort((a, b) => b.like_count - a.like_count);
    }

    return {
      reviews: sortedReviews,
      total: sortedReviews.length,
    };
  };

  const mockFetchStats = async (productId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (demoState === 'empty') {
      return mockEmptyStats;
    }

    return mockStats;
  };

  const mockCreateReview = async (data: CreateReviewInput) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Created review:', data);
    return { success: true };
  };

  const mockToggleLike = async (reviewId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { liked: true };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 데모 컨트롤 */}
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            데모 컨트롤 (개발 전용)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                데모 상태 선택
              </label>
              <Select
                value={demoState}
                onValueChange={(value) => setDemoState(value as DemoState)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empty">빈 상태 (후기 없음)</SelectItem>
                  <SelectItem value="with-reviews">후기 목록 표시</SelectItem>
                  <SelectItem value="write-form">후기 작성 폼</SelectItem>
                  <SelectItem value="with-images">이미지 후기만</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium text-gray-900 mb-2">현재 상태 설명:</h3>
              <div className="text-sm text-gray-600">
                {demoState === 'empty' && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>후기가 하나도 없는 초기 상태</li>
                    <li>빈 상태 메시지 표시</li>
                    <li>첫 후기 작성 유도 버튼</li>
                  </ul>
                )}
                {demoState === 'with-reviews' && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>총 {mockReviews.length}개의 후기 표시</li>
                    <li>평균 별점 {mockStats.average_rating}점</li>
                    <li>별점 분포 그래프</li>
                    <li>정렬 옵션 (최신순, 별점순, 좋아요순)</li>
                    <li>좋아요, 댓글 기능</li>
                    <li>베스트 후기 배지</li>
                  </ul>
                )}
                {demoState === 'write-form' && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>후기 작성 버튼 활성화 (구매자 전용)</li>
                    <li>별점 선택 (1~5점)</li>
                    <li>제목, 내용 입력</li>
                    <li>이미지 업로드 (최대 5장)</li>
                    <li>유효성 검증</li>
                  </ul>
                )}
                {demoState === 'with-images' && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>이미지가 있는 후기만 필터링</li>
                    <li>이미지 썸네일 표시</li>
                    <li>이미지 클릭 시 라이트박스 열림</li>
                    <li>갤러리 형태로 표시</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            바이브 스토어 스타터 키트
          </h1>
          <p className="text-gray-600 mb-8">
            Next.js 15 + Supabase + Toss Payments 쇼핑몰 스캘레톤
          </p>

          <ProductReviews
            productId="product-demo"
            fetchReviews={mockFetchReviews}
            fetchStats={mockFetchStats}
            createReview={mockCreateReview}
            toggleLike={mockToggleLike}
            currentUserId={demoState === 'write-form' ? 'demo-user' : undefined}
            hasPurchased={demoState === 'write-form'}
            orderItemId={demoState === 'write-form' ? 'demo-order-item' : undefined}
          />
        </div>

        {/* 개발 노트 */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold text-amber-900 mb-2">개발 노트</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>✅ 후기 목록 렌더링 (별점, 내용, 이미지)</li>
            <li>✅ 별점 분포 차트</li>
            <li>✅ 평균 별점 표시</li>
            <li>✅ 정렬 옵션 (최신순, 별점순, 좋아요순)</li>
            <li>✅ 후기 작성 폼 (별점, 제목, 내용, 이미지)</li>
            <li>✅ 이미지 갤러리 + 라이트박스</li>
            <li>✅ 좋아요 기능 (낙관적 업데이트)</li>
            <li>✅ 무한 스크롤 (더보기 버튼)</li>
            <li>✅ 로딩 상태 (스켈레톤 UI)</li>
            <li>✅ 빈 상태 처리</li>
            <li>✅ 베스트 후기 배지</li>
            <li>✅ 구매자만 후기 작성 가능</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
