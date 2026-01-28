'use client';

/**
 * Review Management Component
 *
 * Features:
 * - 후기 목록 조회 및 필터링 (별점, 기간)
 * - 베스트 후기 선정
 * - 후기 삭제
 * - 일괄 처리
 * - 신고 처리
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Trash2, Award, Eye, ThumbsUp, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  like_count: number;
  view_count: number;
  is_best: boolean;
  created_at: string;
  profiles: {
    nickname: string;
    avatar_url: string | null;
  };
  products: {
    name: string;
    slug: string;
  };
}

interface ReviewManagementProps {
  productId?: string;
}

export default function ReviewManagement({ productId }: ReviewManagementProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  // 필터 상태
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('latest');

  useEffect(() => {
    fetchReviews();
  }, [productId, ratingFilter, startDate, endDate, sortBy]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (productId) params.append('product_id', productId);
      if (ratingFilter !== 'all') params.append('rating', ratingFilter);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      params.append('sort', sortBy);

      const response = await fetch(`/api/reviews?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('후기 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBest = async (reviewId: string, isBest: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_best: !isBest }),
      });

      if (response.ok) {
        alert(isBest ? '베스트 후기 해제되었습니다.' : '베스트 후기로 선정되었습니다.');
        fetchReviews();
      }
    } catch (error) {
      console.error('베스트 후기 설정 실패:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await fetch(`/api/admin/reviews/${reviewToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('후기가 삭제되었습니다.');
        setDeleteDialogOpen(false);
        setReviewToDelete(null);
        fetchReviews();
      }
    } catch (error) {
      console.error('후기 삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleBulkAction = async (action: 'set_best' | 'delete') => {
    if (selectedReviews.length === 0) {
      alert('선택된 후기가 없습니다.');
      return;
    }

    if (!confirm(`선택한 ${selectedReviews.length}개의 후기를 ${action === 'set_best' ? '베스트로 선정' : '삭제'}하시겠습니까?`)) {
      return;
    }

    try {
      const promises = selectedReviews.map((id) =>
        fetch(`/api/admin/reviews/${id}`, {
          method: action === 'delete' ? 'DELETE' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: action === 'delete' ? undefined : JSON.stringify({ is_best: true }),
        })
      );

      await Promise.all(promises);
      alert('일괄 처리되었습니다.');
      setSelectedReviews([]);
      fetchReviews();
    } catch (error) {
      console.error('일괄 처리 실패:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map((r) => r.id));
    }
  };

  const toggleSelectReview = (id: string) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* 필터 영역 */}
      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="rating-filter">별점</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger id="rating-filter">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="5">5점</SelectItem>
                  <SelectItem value="4">4점</SelectItem>
                  <SelectItem value="3">3점</SelectItem>
                  <SelectItem value="2">2점</SelectItem>
                  <SelectItem value="1">1점</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start-date">시작일</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="end-date">종료일</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="sort-by">정렬</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="최신순" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">최신순</SelectItem>
                  <SelectItem value="likes">좋아요순</SelectItem>
                  <SelectItem value="rating_high">별점 높은순</SelectItem>
                  <SelectItem value="rating_low">별점 낮은순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 일괄 처리 영역 */}
      {selectedReviews.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedReviews.length}개 선택됨
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('set_best')}
              >
                <Award className="w-4 h-4 mr-2" />
                일괄 처리: 베스트 선정
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction('delete')}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                일괄 처리: 삭제
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 후기 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>후기 목록 ({reviews.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedReviews.length === reviews.length && reviews.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <Label>전체 선택</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">후기가 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedReviews.includes(review.id)}
                      onCheckedChange={() => toggleSelectReview(review.id)}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        {review.is_best && (
                          <Badge variant="default">
                            <Award className="w-3 h-3 mr-1" />
                            베스트
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-medium">{review.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.content}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{review.profiles.nickname}</span>
                        <span>{review.products.name}</span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {review.like_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {review.view_count}
                        </span>
                        {review.images.length > 0 && (
                          <span className="flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            {review.images.length}
                          </span>
                        )}
                        <span>
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={review.is_best ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => handleSetBest(review.id, review.is_best)}
                      >
                        <Award className="w-4 h-4 mr-1" />
                        {review.is_best ? '베스트 해제' : '베스트 선정'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setReviewToDelete(review.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 삭제 확인 대화상자 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>후기 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 후기를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
