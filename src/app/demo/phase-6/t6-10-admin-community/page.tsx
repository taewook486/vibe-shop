'use client';

/**
 * Demo: Admin Community Management (T6-10)
 *
 * Demo States:
 * - reviews-list: 후기 목록
 * - inquiries-list: 문의 목록
 * - answer-form: 답변 작성 폼
 * - bulk-action: 일괄 처리
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  Award,
  ThumbsUp,
  Eye,
  MessageSquare,
  Lock,
  CheckCircle,
  Clock,
} from 'lucide-react';

const DEMO_STATES = [
  { id: 'reviews-list', label: '후기 목록' },
  { id: 'inquiries-list', label: '문의 목록' },
  { id: 'answer-form', label: '답변 작성 폼' },
  { id: 'bulk-action', label: '일괄 처리' },
];

const MOCK_REVIEWS = [
  {
    id: 'review-1',
    rating: 5,
    title: '정말 유용한 상품입니다',
    content: '기대 이상으로 만족스럽습니다. 특히 품질이 좋아요.',
    images: 3,
    likes: 15,
    views: 120,
    isBest: true,
    author: '김민수',
    product: 'Next.js 템플릿',
    createdAt: '2시간 전',
  },
  {
    id: 'review-2',
    rating: 4,
    title: '가격 대비 괜찮습니다',
    content: '전반적으로 만족하지만 일부 개선이 필요합니다.',
    images: 1,
    likes: 8,
    views: 65,
    isBest: false,
    author: '이영희',
    product: 'React 컴포넌트 팩',
    createdAt: '5시간 전',
  },
  {
    id: 'review-3',
    rating: 3,
    title: '보통입니다',
    content: '기대했던 것보다는 조금 아쉽습니다.',
    images: 0,
    likes: 2,
    views: 30,
    isBest: false,
    author: '박철수',
    product: 'TypeScript 가이드',
    createdAt: '1일 전',
  },
];

const MOCK_INQUIRIES = [
  {
    id: 'inquiry-1',
    category: '상품',
    title: '재고 문의드립니다',
    content: 'Next.js 템플릿 재고가 언제 입고되나요?',
    isPrivate: false,
    status: 'pending',
    answer: null,
    author: '김민수',
    product: 'Next.js 템플릿',
    views: 15,
    createdAt: '3시간 전',
  },
  {
    id: 'inquiry-2',
    category: '결제',
    title: '결제 오류 문의',
    content: '카드 결제가 계속 실패합니다.',
    isPrivate: true,
    status: 'answered',
    answer: '확인 후 조치했습니다. 다시 시도해 주세요.',
    author: '이영희',
    product: null,
    views: 8,
    createdAt: '6시간 전',
  },
  {
    id: 'inquiry-3',
    category: '배송',
    title: '배송 문의',
    content: '배송 조회가 안 되는데 확인 부탁드립니다.',
    isPrivate: false,
    status: 'pending',
    answer: null,
    author: '박철수',
    product: 'React 컴포넌트 팩',
    views: 12,
    createdAt: '1일 전',
  },
];

export default function AdminCommunityDemoPage() {
  const [demoState, setDemoState] = useState('reviews-list');

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Demo: 관리자 커뮤니티 관리 (T6-10)
        </h1>
        <p className="text-muted-foreground">
          후기 및 문의 관리 기능을 시연합니다.
        </p>
      </div>

      {/* 데모 상태 선택 */}
      <Card>
        <CardHeader>
          <CardTitle>데모 상태 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {DEMO_STATES.map((state) => (
              <Button
                key={state.id}
                variant={demoState === state.id ? 'default' : 'outline'}
                onClick={() => setDemoState(state.id)}
              >
                {state.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 데모 콘텐츠 */}
      <Tabs value={demoState === 'answer-form' || demoState === 'bulk-action' ? 'inquiries' : demoState === 'reviews-list' ? 'reviews' : 'inquiries'}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">후기 관리</TabsTrigger>
          <TabsTrigger value="inquiries">문의 관리</TabsTrigger>
        </TabsList>

        {/* 후기 관리 탭 */}
        <TabsContent value="reviews" className="space-y-4">
          {demoState === 'reviews-list' && (
            <>
              {/* 필터 영역 */}
              <Card>
                <CardHeader>
                  <CardTitle>필터</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium">별점</label>
                      <select className="w-full mt-1 border rounded px-3 py-2">
                        <option>전체</option>
                        <option>5점</option>
                        <option>4점</option>
                        <option>3점</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">시작일</label>
                      <input type="date" className="w-full mt-1 border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">종료일</label>
                      <input type="date" className="w-full mt-1 border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">정렬</label>
                      <select className="w-full mt-1 border rounded px-3 py-2">
                        <option>최신순</option>
                        <option>좋아요순</option>
                        <option>별점 높은순</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 후기 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle>후기 목록 ({MOCK_REVIEWS.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_REVIEWS.map((review) => (
                      <div
                        key={review.id}
                        className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <input type="checkbox" className="mt-1" />
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
                              {review.isBest && (
                                <Badge>
                                  <Award className="w-3 h-3 mr-1" />
                                  베스트
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-medium">{review.title}</h3>
                            <p className="text-sm text-muted-foreground">{review.content}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{review.author}</span>
                              <span>{review.product}</span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {review.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {review.views}
                              </span>
                              {review.images > 0 && <span>이미지 {review.images}장</span>}
                              <span>{review.createdAt}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={review.isBest ? 'outline' : 'default'}
                              size="sm"
                            >
                              <Award className="w-4 h-4 mr-1" />
                              {review.isBest ? '베스트 해제' : '베스트 선정'}
                            </Button>
                            <Button variant="destructive" size="sm">
                              삭제
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* 문의 관리 탭 */}
        <TabsContent value="inquiries" className="space-y-4">
          {(demoState === 'inquiries-list' || demoState === 'answer-form' || demoState === 'bulk-action') && (
            <>
              {/* 필터 영역 */}
              <Card>
                <CardHeader>
                  <CardTitle>필터</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">상태</label>
                      <select className="w-full mt-1 border rounded px-3 py-2">
                        <option>전체</option>
                        <option>답변 대기</option>
                        <option>답변 완료</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">카테고리</label>
                      <select className="w-full mt-1 border rounded px-3 py-2">
                        <option>전체</option>
                        <option>상품</option>
                        <option>결제</option>
                        <option>배송</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 일괄 처리 영역 (bulk-action 상태일 때만) */}
              {demoState === 'bulk-action' && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">2개 선택됨</span>
                      <Button variant="outline" size="sm">
                        일괄 처리: 답변 완료로 변경
                      </Button>
                      <Button variant="outline" size="sm">
                        일괄 처리: 대기로 변경
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 문의 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle>문의 목록 ({MOCK_INQUIRIES.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_INQUIRIES.map((inquiry, index) => (
                      <div
                        key={inquiry.id}
                        className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            className="mt-1"
                            defaultChecked={demoState === 'bulk-action' && index < 2}
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  inquiry.status === 'answered' ? 'default' : 'secondary'
                                }
                              >
                                {inquiry.status === 'answered' ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    답변 완료
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 mr-1" />
                                    답변 대기
                                  </>
                                )}
                              </Badge>
                              <Badge variant="outline">{inquiry.category}</Badge>
                              {inquiry.isPrivate && (
                                <Badge variant="outline">
                                  <Lock className="w-3 h-3 mr-1" />
                                  비밀글
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-medium">{inquiry.title}</h3>
                            <p className="text-sm text-muted-foreground">{inquiry.content}</p>

                            {inquiry.answer && (
                              <div className="mt-2 p-3 bg-muted rounded-md">
                                <p className="text-sm font-medium mb-1">답변:</p>
                                <p className="text-sm text-muted-foreground">
                                  {inquiry.answer}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{inquiry.author}</span>
                              {inquiry.product && <span>{inquiry.product}</span>}
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {inquiry.views}
                              </span>
                              <span>{inquiry.createdAt}</span>
                            </div>
                          </div>
                          <Button
                            variant={inquiry.status === 'answered' ? 'outline' : 'default'}
                            size="sm"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {inquiry.status === 'answered' ? '답변 수정' : '답변'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 답변 작성 폼 (answer-form 상태일 때만) */}
              {demoState === 'answer-form' && (
                <Card>
                  <CardHeader>
                    <CardTitle>답변 작성</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">문의 내용</h3>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">재고 문의드립니다</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Next.js 템플릿 재고가 언제 입고되나요?
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">답변 내용</label>
                        <select className="border rounded px-3 py-1 text-sm">
                          <option>템플릿 선택</option>
                          <option>재고 문의</option>
                          <option>결제 문의</option>
                          <option>배송 문의</option>
                        </select>
                      </div>
                      <textarea
                        className="w-full border rounded px-3 py-2"
                        rows={6}
                        placeholder="답변을 입력하세요..."
                        defaultValue="문의 주셔서 감사합니다. 해당 상품은 곧 재고가 입고될 예정입니다."
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">취소</Button>
                      <Button>답변 등록</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
