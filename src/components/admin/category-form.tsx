'use client';

/**
 * P4-T4.5: Category Form Component
 *
 * Features:
 * - Create/Edit category form
 * - Parent category selection (for nested structure)
 * - Auto-generate slug from name
 * - Image upload
 * - Active/Inactive toggle
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

interface CategoryFormProps {
  category?: Category;
  categories?: Category[];
  onSubmit: (data: Partial<Category>) => void;
  onCancel: () => void;
}

/**
 * Generate URL-friendly slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Category Form Component
 */
export default function CategoryForm({
  category,
  categories = [],
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parent_id: category?.parent_id || null,
    image_url: category?.image_url || '',
    is_active: category?.is_active ?? true,
  });

  const [autoSlug, setAutoSlug] = useState(!category);

  // Auto-generate slug when name changes
  useEffect(() => {
    if (autoSlug && formData.name) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.name),
      }));
    }
  }, [formData.name, autoSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="name">카테고리명 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="예: 디지털 상품"
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">슬러그 (URL용) *</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => {
            setAutoSlug(false);
            setFormData({ ...formData, slug: e.target.value });
          }}
          placeholder="digital-products"
          required
        />
        <p className="text-sm text-muted-foreground">
          URL에 사용됩니다. 영문, 숫자, 하이픈만 사용 가능.
        </p>
      </div>

      {/* Parent Category */}
      <div className="space-y-2">
        <Label htmlFor="parent_id">상위 카테고리</Label>
        <Select
          value={formData.parent_id || 'none'}
          onValueChange={(value) =>
            setFormData({ ...formData, parent_id: value === 'none' ? null : value })
          }
        >
          <SelectTrigger id="parent_id">
            <SelectValue placeholder="최상위 카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">최상위 카테고리</SelectItem>
            {categories
              .filter((cat) => cat.id !== category?.id)
              .map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="카테고리에 대한 간단한 설명"
          rows={3}
        />
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="image_url">이미지 URL</Label>
        <Input
          id="image_url"
          type="url"
          value={formData.image_url || ''}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="is_active">활성화</Label>
          <p className="text-sm text-muted-foreground">
            비활성화하면 고객 페이지에서 표시되지 않습니다.
          </p>
        </div>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">
          {category ? '수정' : '등록'}
        </Button>
      </div>
    </form>
  );
}
