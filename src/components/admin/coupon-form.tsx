/**
 * P7-T7.8: 쿠폰 등록/수정 폼 컴포넌트
 *
 * 기능:
 * - 쿠폰 정보 입력 (코드, 이름, 타입, 할인값 등)
 * - 코드 자동 생성 옵션
 * - 유효기간 설정
 * - 사용 횟수 제한
 * - 유효성 검증
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Shuffle } from 'lucide-react';
import type { Coupon, CouponType } from '@/types/coupon';

interface CouponFormProps {
  initialData?: Partial<Coupon>;
  mode: 'create' | 'edit';
}

export default function CouponForm({ initialData, mode }: CouponFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    type: (initialData?.type || 'percent') as CouponType,
    value: initialData?.value || 0,
    min_order_amount: initialData?.min_order_amount || 0,
    max_discount: initialData?.max_discount || null,
    start_at: initialData?.start_at
      ? new Date(initialData.start_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    end_at: initialData?.end_at
      ? new Date(initialData.end_at).toISOString().slice(0, 16)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 16),
    usage_limit: initialData?.usage_limit || null,
    usage_limit_per_user: initialData?.usage_limit_per_user || 1,
    is_active: initialData?.is_active ?? true,
  });

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
    if (!formData.code) {
      toast({
        title: '오류',
        description: '쿠폰 코드를 입력하세요.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.type !== 'free_shipping' && formData.value <= 0) {
      toast({
        title: '오류',
        description: '할인값을 입력하세요.',
        variant: 'destructive',
      });
      return;
    }

    if (new Date(formData.start_at) >= new Date(formData.end_at)) {
      toast({
        title: '오류',
        description: '종료일은 시작일보다 늦어야 합니다.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        const url =
          mode === 'create'
            ? '/api/admin/coupons'
            : `/api/admin/coupons/${initialData?.id}`;
        const method = mode === 'create' ? 'POST' : 'PATCH';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            usage_limit: formData.usage_limit || null,
            max_discount: formData.max_discount || null,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || '저장 실패');
        }

        toast({
          title: mode === 'create' ? '쿠폰 생성 완료' : '쿠폰 수정 완료',
          description: '쿠폰이 성공적으로 저장되었습니다.',
        });

        router.push('/admin/coupons');
        router.refresh();
      } catch (error) {
        toast({
          title: '오류 발생',
          description: error instanceof Error ? error.message : '알 수 없는 오류',
          variant: 'destructive',
        });
      }
    });
  };

  const handleCancel = () => {
    router.push('/admin/coupons');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">쿠폰 코드 *</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="WELCOME2024"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCode}
                  disabled={mode === 'edit'}
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  자동생성
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">쿠폰명 *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="신규 가입 환영 쿠폰"
              />
            </div>
          </CardContent>
        </Card>

        {/* 할인 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>할인 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">할인 타입 *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: CouponType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">정률 할인 (%)</SelectItem>
                    <SelectItem value="fixed">정액 할인 (원)</SelectItem>
                    <SelectItem value="free_shipping">무료 배송</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type !== 'free_shipping' && (
                <div className="space-y-2">
                  <Label htmlFor="value">
                    할인값 * {formData.type === 'percent' ? '(%)' : '(원)'}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    required
                    min="0"
                    max={formData.type === 'percent' ? 100 : undefined}
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: parseInt(e.target.value) })
                    }
                    placeholder={formData.type === 'percent' ? '10' : '5000'}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min_order_amount">최소 주문금액 (원)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  min="0"
                  value={formData.min_order_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_order_amount: parseInt(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </div>

              {formData.type === 'percent' && (
                <div className="space-y-2">
                  <Label htmlFor="max_discount">최대 할인금액 (원)</Label>
                  <Input
                    id="max_discount"
                    type="number"
                    min="0"
                    value={formData.max_discount || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_discount: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    placeholder="선택사항"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 유효기간 및 사용 제한 */}
        <Card>
          <CardHeader>
            <CardTitle>유효기간 및 사용 제한</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_at">시작일 *</Label>
                <Input
                  id="start_at"
                  type="datetime-local"
                  required
                  value={formData.start_at}
                  onChange={(e) =>
                    setFormData({ ...formData, start_at: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_at">종료일 *</Label>
                <Input
                  id="end_at"
                  type="datetime-local"
                  required
                  value={formData.end_at}
                  onChange={(e) =>
                    setFormData({ ...formData, end_at: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="usage_limit">총 사용 가능 횟수</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  min="0"
                  value={formData.usage_limit || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usage_limit: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="무제한"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usage_limit_per_user">1인당 사용 횟수</Label>
                <Input
                  id="usage_limit_per_user"
                  type="number"
                  min="1"
                  required
                  value={formData.usage_limit_per_user}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usage_limit_per_user: parseInt(e.target.value),
                    })
                  }
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                쿠폰 활성화
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? '저장 중...' : mode === 'create' ? '생성' : '수정'}
          </Button>
        </div>
      </div>
    </form>
  );
}
