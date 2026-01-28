/**
 * P4-T4.6: 상품 등록/수정 폼 컴포넌트
 *
 * 기능:
 * - 상품 정보 입력 (이름, 설명, 가격 등)
 * - 이미지 및 파일 업로드
 * - 상태 선택 (draft/active/hidden)
 * - 유효성 검증
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, ImageIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Category = {
  id: string;
  name: string;
  slug: string;
};

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id?: string;
    name: string;
    slug?: string;
    short_description?: string | null;
    description?: string | null;
    price: number;
    discount_price?: number | null;
    category_id?: string | null;
    status: 'draft' | 'active' | 'hidden' | 'archived';
    is_featured: boolean;
  };
  mode: 'create' | 'edit';
}

export default function ProductForm({
  categories,
  initialData,
  mode,
}: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    short_description: initialData?.short_description || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    discount_price: initialData?.discount_price || 0,
    category_id: initialData?.category_id || '',
    status: initialData?.status || 'draft',
    is_featured: initialData?.is_featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const url =
          mode === 'create'
            ? '/api/admin/products'
            : `/api/admin/products/${initialData?.id}`;
        const method = mode === 'create' ? 'POST' : 'PATCH';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            discount_price: formData.discount_price || null,
            category_id: formData.category_id || null,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || '저장 실패');
        }

        toast({
          title: mode === 'create' ? '상품 등록 완료' : '상품 수정 완료',
          description: '상품이 성공적으로 저장되었습니다.',
        });

        router.push('/admin/products');
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
    router.push('/admin/products');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">상품명 *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="상품명을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">카테고리</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger id="category_id">
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">없음</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">짧은 설명</Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) =>
                  setFormData({ ...formData, short_description: e.target.value })
                }
                placeholder="상품 카드에 표시될 짧은 설명"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Markdown 형식으로 작성 가능합니다"
                rows={8}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>가격 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">가격 *</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseInt(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount_price">할인가</Label>
                <Input
                  id="discount_price"
                  type="number"
                  min="0"
                  value={formData.discount_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_price: parseInt(e.target.value),
                    })
                  }
                  placeholder="선택사항"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>상품 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">임시 저장</SelectItem>
                    <SelectItem value="active">판매 중</SelectItem>
                    <SelectItem value="hidden">숨김</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({ ...formData, is_featured: e.target.checked })
                    }
                  />
                  <span className="text-sm">추천 상품으로 표시</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? '저장 중...' : mode === 'create' ? '등록' : '수정'}
          </Button>
        </div>
      </div>
    </form>
  );
}
