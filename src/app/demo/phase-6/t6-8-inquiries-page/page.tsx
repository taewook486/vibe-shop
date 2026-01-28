/**
 * Demo: Inquiries Page (T6.8)
 *
 * 문의 게시판 페이지 데모
 *
 * Demo States:
 * - list: 문의 목록 (다양한 상태)
 * - detail: 문의 상세 (답변 포함)
 * - write-form: 문의 작성 폼
 * - private: 비밀글
 * - answered: 답변 완료
 *
 * URL: /demo/phase-6/t6-8-inquiries-page?state=[state]
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowLeft,
  Lock,
  Eye,
  MessageCircle,
  Plus,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/**
 * Mock 문의 데이터
 */
const MOCK_INQUIRIES = [
  {
    id: '1',
    category: 'product',
    title: '상품 사이즈 문의드립니다',
    content: '사이즈가 어떻게 되나요?',
    is_private: false,
    status: 'pending',
    answer: null,
    view_count: 5,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: {
      nickname: '김고객',
      email: 'customer@example.com',
    },
    product: {
      name: '프리미엄 디지털 상품',
      thumbnail_url: '/placeholder.jpg',
    },
  },
  {
    id: '2',
    category: 'shipping',
    title: '배송 언제 되나요?',
    content: '배송 시작하셨나요?',
    is_private: true,
    status: 'answered',
    answer: '2-3일 내 배송 시작됩니다.',
    view_count: 15,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    answered_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    author: {
      nickname: '이고객',
      email: 'customer2@example.com',
    },
    answerer: {
      nickname: '관리자',
      email: 'admin@example.com',
    },
    product: {
      name: '베스트셀러 상품',
      thumbnail_url: '/placeholder2.jpg',
    },
  },
  {
    id: '3',
    category: 'refund',
    title: '환불 가능한가요?',
    content: '구매 후 환불이 가능한지 궁금합니다.',
    is_private: false,
    status: 'answered',
    answer: '구매일로부터 7일 이내 환불 가능합니다.',
    view_count: 25,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    answered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      nickname: '박고객',
      email: 'customer3@example.com',
    },
    answerer: {
      nickname: '관리자',
      email: 'admin@example.com',
    },
    product: null,
  },
];

const CATEGORY_LABELS = {
  product: '상품 정보',
  shipping: '배송 문의',
  refund: '환불/교환',
  etc: '기타',
};

const CATEGORY_COLORS = {
  product: 'bg-blue-100 text-blue-800',
  shipping: 'bg-green-100 text-green-800',
  refund: 'bg-orange-100 text-orange-800',
  etc: 'bg-gray-100 text-gray-800',
};

export default function InquiriesDemoPage({
  searchParams,
}: {
  searchParams: { state?: string };
}) {
  const state = searchParams.state || 'list';
  const [formData, setFormData] = useState({
    category: 'product',
    title: '',
    content: '',
    is_private: false,
  });

  /**
   * 문의 목록 상태
   */
  if (state === 'list') {
    return (
      <div className="container max-w-6xl py-8">
        {/* 상태 선택 */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <h3 className="font-semibold">📋 Demo State: 문의 목록</h3>
            <div className="flex gap-2 flex-wrap mt-2">
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=list">
                <Badge>list</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=detail">
                <Badge variant="outline">detail</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=write-form">
                <Badge variant="outline">write-form</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=private">
                <Badge variant="outline">private</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=answered">
                <Badge variant="outline">answered</Badge>
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">문의 게시판</h1>
            <p className="text-muted-foreground mt-2">
              상품이나 서비스에 대해 궁금한 점을 문의해주세요
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            문의 작성
          </Button>
        </div>

        {/* 필터 & 검색 */}
        <div className="space-y-4 mb-6">
          {/* 상태 탭 */}
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="pending">답변 대기</TabsTrigger>
              <TabsTrigger value="answered">답변 완료</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 카테고리 & 정렬 */}
          <div className="flex gap-4 flex-wrap">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                <SelectItem value="product">상품 정보</SelectItem>
                <SelectItem value="shipping">배송 문의</SelectItem>
                <SelectItem value="refund">환불/교환</SelectItem>
                <SelectItem value="etc">기타</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="latest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
                <SelectItem value="unanswered">답변 대기</SelectItem>
                <SelectItem value="most_viewed">조회수순</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="제목 또는 내용 검색..."
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* 문의 목록 */}
        <div className="space-y-4">
          {MOCK_INQUIRIES.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{inquiry.title}</h3>
                      {inquiry.is_private && (
                        <Lock className="h-4 w-4 text-muted-foreground" aria-label="비밀글" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn('text-xs', CATEGORY_COLORS[inquiry.category as keyof typeof CATEGORY_COLORS])}
                      >
                        {CATEGORY_LABELS[inquiry.category as keyof typeof CATEGORY_LABELS]}
                      </Badge>
                      <Badge
                        variant={inquiry.status === 'answered' ? 'default' : 'outline'}
                        className={cn(
                          'text-xs',
                          inquiry.status === 'answered'
                            ? 'bg-green-600'
                            : 'text-orange-600 border-orange-600'
                        )}
                      >
                        {inquiry.status === 'answered' ? '답변 완료' : '답변 대기'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {inquiry.author.nickname[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{inquiry.author.nickname}</span>
                    </div>
                    <span className="text-xs">
                      {formatDistanceToNow(new Date(inquiry.created_at), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {inquiry.answer && (
                      <div className="flex items-center gap-1 text-green-600">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">답변 완료</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">{inquiry.view_count}</span>
                    </div>
                  </div>
                </div>
                {inquiry.product && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">상품:</span>
                      <span className="text-xs font-medium">{inquiry.product.name}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          총 {MOCK_INQUIRIES.length}개의 문의
        </div>
      </div>
    );
  }

  /**
   * 문의 상세 상태
   */
  if (state === 'detail' || state === 'answered') {
    const inquiry = MOCK_INQUIRIES[1]; // 답변 완료된 문의

    return (
      <div className="container max-w-4xl py-8">
        {/* 상태 선택 */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <h3 className="font-semibold">📋 Demo State: 문의 상세 (답변 포함)</h3>
            <div className="flex gap-2 flex-wrap mt-2">
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=list">
                <Badge variant="outline">list</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=detail">
                <Badge>detail</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=write-form">
                <Badge variant="outline">write-form</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=private">
                <Badge variant="outline">private</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=answered">
                <Badge>answered</Badge>
              </Link>
            </div>
          </CardHeader>
        </Card>

        <Link href="#" className="inline-flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                배송 문의
              </Badge>
              <Badge className="bg-green-600">답변 완료</Badge>
            </div>
            <div className="flex items-start gap-3">
              <h1 className="text-2xl font-bold flex-1">{inquiry.title}</h1>
              {inquiry.is_private && (
                <Lock className="h-5 w-5 text-muted-foreground" aria-label="비밀글" />
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{inquiry.author.nickname[0]}</AvatarFallback>
                  </Avatar>
                  <span>{inquiry.author.nickname}</span>
                </div>
                <span>
                  {formatDistanceToNow(new Date(inquiry.created_at), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{inquiry.view_count}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p>{inquiry.content}</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold">답변</h2>
              </div>
              {inquiry.answerer && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {inquiry.answerer.nickname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>{inquiry.answerer.nickname}</span>
                  <span>·</span>
                  <span>
                    {inquiry.answered_at &&
                      formatDistanceToNow(new Date(inquiry.answered_at), {
                        addSuffix: true,
                        locale: ko,
                      })}
                  </span>
                </div>
              )}
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p>{inquiry.answer}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline">목록으로</Button>
        </div>
      </div>
    );
  }

  /**
   * 비밀글 상태
   */
  if (state === 'private') {
    const inquiry = MOCK_INQUIRIES[1]; // 비밀글

    return (
      <div className="container max-w-4xl py-8">
        {/* 상태 선택 */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <h3 className="font-semibold">📋 Demo State: 비밀글</h3>
            <div className="flex gap-2 flex-wrap mt-2">
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=list">
                <Badge variant="outline">list</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=detail">
                <Badge variant="outline">detail</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=write-form">
                <Badge variant="outline">write-form</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=private">
                <Badge>private</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=answered">
                <Badge variant="outline">answered</Badge>
              </Link>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                배송 문의
              </Badge>
              <Badge className="bg-green-600">답변 완료</Badge>
            </div>
            <div className="flex items-start gap-3">
              <h1 className="text-2xl font-bold flex-1">{inquiry.title}</h1>
              <Lock className="h-5 w-5 text-muted-foreground" aria-label="비밀글" />
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Lock className="h-5 w-5" />
                <p className="font-medium">비밀글입니다</p>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                작성자와 관리자만 내용을 볼 수 있습니다.
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  /**
   * 문의 작성 폼 상태
   */
  if (state === 'write-form') {
    return (
      <div className="container max-w-3xl py-8">
        {/* 상태 선택 */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <h3 className="font-semibold">📋 Demo State: 문의 작성 폼</h3>
            <div className="flex gap-2 flex-wrap mt-2">
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=list">
                <Badge variant="outline">list</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=detail">
                <Badge variant="outline">detail</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=write-form">
                <Badge>write-form</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=private">
                <Badge variant="outline">private</Badge>
              </Link>
              <Link href="/demo/phase-6/t6-8-inquiries-page?state=answered">
                <Badge variant="outline">answered</Badge>
              </Link>
            </div>
          </CardHeader>
        </Card>

        <Link href="#" className="inline-flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">문의 작성</h2>
            <p className="text-muted-foreground">
              상품이나 서비스에 대해 궁금한 점을 문의해주세요.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>문의 유형</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">상품 정보</SelectItem>
                  <SelectItem value="shipping">배송 문의</SelectItem>
                  <SelectItem value="refund">환불/교환</SelectItem>
                  <SelectItem value="etc">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>제목</Label>
              <Input
                placeholder="문의 제목을 입력하세요"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>내용</Label>
              <Textarea
                placeholder="문의 내용을 상세히 입력해주세요 (최소 10자)"
                className="min-h-[200px]"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>

            <div className="flex items-start space-x-3 rounded-md border p-4">
              <Checkbox
                checked={formData.is_private}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_private: checked as boolean })
                }
              />
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  비밀글로 작성
                </Label>
                <p className="text-sm text-muted-foreground">
                  비밀글로 설정하면 작성자와 관리자만 내용을 볼 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline">취소</Button>
              <Button>문의 등록</Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">문의 작성 안내</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 문의 내용을 자세히 작성하시면 더 정확한 답변을 받으실 수 있습니다.</li>
            <li>• 비밀글로 작성하시면 작성자와 관리자만 내용을 볼 수 있습니다.</li>
            <li>• 개인정보가 포함된 문의는 반드시 비밀글로 작성해주세요.</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}
