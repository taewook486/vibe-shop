'use client';

/**
 * Inquiry Management Component
 *
 * Features:
 * - 문의 목록 조회 및 필터링
 * - 답변 작성
 * - 상태 변경
 * - 답변 템플릿
 * - 일괄 처리
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, MessageSquare, Eye, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Inquiry {
  id: string;
  product_id: string | null;
  user_id: string;
  category: 'product' | 'shipping' | 'payment' | 'etc';
  title: string;
  content: string;
  is_private: boolean;
  status: 'pending' | 'answered';
  answer: string | null;
  answered_at: string | null;
  answered_by: string | null;
  view_count: number;
  created_at: string;
  author: {
    nickname: string;
    avatar_url: string | null;
  };
  product: {
    name: string;
    slug: string;
  } | null;
}

interface InquiryManagementProps {
  productId?: string;
}

const ANSWER_TEMPLATES = [
  {
    id: 'stock',
    name: '재고 문의',
    content: '문의 주셔서 감사합니다. 해당 상품은 곧 재고가 입고될 예정입니다. 입고 시 별도로 알려드리겠습니다.',
  },
  {
    id: 'payment',
    name: '결제 문의',
    content: '결제 관련 문의 감사합니다. 해당 건은 확인 후 빠른 시일 내에 답변드리겠습니다.',
  },
  {
    id: 'delivery',
    name: '배송 문의',
    content: '배송 관련 문의 감사합니다. 주문하신 상품은 정상적으로 발송되었으며, 곧 도착할 예정입니다.',
  },
  {
    id: 'refund',
    name: '환불 문의',
    content: '환불 요청 확인했습니다. 관련 절차를 진행하여 영업일 기준 3-5일 이내에 환불 처리해 드리겠습니다.',
  },
];

const CATEGORY_LABELS = {
  product: '상품',
  shipping: '배송',
  payment: '결제',
  etc: '기타',
};

export default function InquiryManagement({ productId }: InquiryManagementProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null);
  const [answerContent, setAnswerContent] = useState('');

  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchInquiries();
  }, [productId, statusFilter, categoryFilter]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (productId) params.append('product_id', productId);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);

      const response = await fetch(`/api/inquiries?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error('문의 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAnswerDialog = (inquiry: Inquiry) => {
    setCurrentInquiry(inquiry);
    setAnswerContent(inquiry.answer || '');
    setAnswerDialogOpen(true);
  };

  const handleSubmitAnswer = async () => {
    if (!currentInquiry || !answerContent.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/inquiries/${currentInquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: answerContent,
          status: 'answered',
        }),
      });

      if (response.ok) {
        alert('답변이 등록되었습니다.');
        setAnswerDialogOpen(false);
        setCurrentInquiry(null);
        setAnswerContent('');
        fetchInquiries();
      }
    } catch (error) {
      console.error('답변 등록 실패:', error);
      alert('답변 등록 중 오류가 발생했습니다.');
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = ANSWER_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setAnswerContent(template.content);
    }
  };

  const handleBulkStatusChange = async (status: 'answered' | 'pending') => {
    if (selectedInquiries.length === 0) {
      alert('선택된 문의가 없습니다.');
      return;
    }

    if (!confirm(`선택한 ${selectedInquiries.length}개의 문의 상태를 변경하시겠습니까?`)) {
      return;
    }

    try {
      const promises = selectedInquiries.map((id) =>
        fetch(`/api/admin/inquiries/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
      );

      await Promise.all(promises);
      alert('일괄 처리되었습니다.');
      setSelectedInquiries([]);
      fetchInquiries();
    } catch (error) {
      console.error('일괄 처리 실패:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedInquiries.length === inquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(inquiries.map((i) => i.id));
    }
  };

  const toggleSelectInquiry = (id: string) => {
    setSelectedInquiries((prev) =>
      prev.includes(id) ? prev.filter((iid) => iid !== id) : [...prev, id]
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status-filter">상태</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">대기</SelectItem>
                  <SelectItem value="answered">답변 완료</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category-filter">카테고리</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="product">상품</SelectItem>
                  <SelectItem value="shipping">배송</SelectItem>
                  <SelectItem value="payment">결제</SelectItem>
                  <SelectItem value="etc">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 일괄 처리 영역 */}
      {selectedInquiries.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedInquiries.length}개 선택됨
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange('answered')}
              >
                일괄 처리: 답변 완료로 변경
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange('pending')}
              >
                일괄 처리: 대기로 변경
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 문의 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>문의 목록 ({inquiries.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedInquiries.length === inquiries.length && inquiries.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <Label>전체 선택</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">문의가 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedInquiries.includes(inquiry.id)}
                      onCheckedChange={() => toggleSelectInquiry(inquiry.id)}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={inquiry.status === 'answered' ? 'default' : 'secondary'}>
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
                        <Badge variant="outline">{CATEGORY_LABELS[inquiry.category]}</Badge>
                        {inquiry.is_private && (
                          <Badge variant="outline">
                            <Lock className="w-3 h-3 mr-1" />
                            비밀글
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-medium">{inquiry.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {inquiry.content}
                      </p>

                      {inquiry.answer && (
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium mb-1">답변:</p>
                          <p className="text-sm text-muted-foreground">{inquiry.answer}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{inquiry.author.nickname}</span>
                        {inquiry.product && <span>{inquiry.product.name}</span>}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {inquiry.view_count}
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(inquiry.created_at), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant={inquiry.status === 'answered' ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleOpenAnswerDialog(inquiry)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {inquiry.status === 'answered' ? '답변 수정' : '답변'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 답변 작성 대화상자 */}
      <Dialog open={answerDialogOpen} onOpenChange={setAnswerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>답변 작성</DialogTitle>
          </DialogHeader>

          {currentInquiry && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">문의 내용</h3>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">{currentInquiry.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{currentInquiry.content}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="answer-content">답변 내용</Label>
                  <Select onValueChange={applyTemplate}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="템플릿 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {ANSWER_TEMPLATES.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  id="answer-content"
                  placeholder="답변을 입력하세요..."
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  rows={6}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAnswerDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmitAnswer}>답변 등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
