'use client';

/**
 * P4-T4.5: Category Tree Component
 *
 * Features:
 * - Hierarchical tree view
 * - Expand/collapse nested categories
 * - Edit/Delete actions
 * - Active/Inactive toggle
 * - Neo-Brutalism 디자인
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

interface CategoryTreeProps {
  categories: Category[];
}

interface CategoryNodeProps {
  category: Category;
  level: number;
  onToggleActive: (id: string, isActive: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  isLoading?: boolean;
}

function findCategoryById(categories: Category[], id: string): Category | null {
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }
    if (category.children) {
      const found = findCategoryById(category.children, id);
      if (found) return found;
    }
  }
  return null;
}

function CategoryNode({
  category,
  level,
  onToggleActive,
  onEdit,
  onDelete,
  onAddChild,
  isLoading = false,
}: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      {/* Category Row */}
      <div
        className={`flex items-center gap-3 p-3 border-3 border-neo-black hover:bg-neo-cream/50 transition-colors ${
          level === 0 ? 'bg-neo-white shadow-neo' : 'bg-neo-cream/30'
        }`}
        style={{ marginLeft: `${level * 24}px` }}
      >
        {/* Drag Handle */}
        <button
          className="cursor-grab active:cursor-grabbing text-neo-black/40 hover:text-neo-black"
          aria-label="카테고리 순서 변경"
        >
          <GripVertical className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-neo-black/60 hover:text-neo-black"
          disabled={!hasChildren}
          aria-label={isExpanded ? '접기' : '펼치기'}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
            ) : (
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
            )
          ) : (
            <div className="w-5 h-5" />
          )}
        </button>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-neo-black truncate">{category.name}</h3>
            <span className={`inline-block px-2 py-0.5 border-2 border-neo-black font-bold text-xs uppercase ${
              category.is_active ? 'bg-neo-green' : 'bg-neo-cream'
            }`}>
              {category.is_active ? '활성' : '비활성'}
            </span>
          </div>
          <p className="text-sm text-neo-black/60 truncate">
            {category.slug}
            {category.description && ` • ${category.description}`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Active Toggle */}
          <button
            onClick={() => onToggleActive(category.id, !category.is_active)}
            disabled={isLoading}
            className={`w-12 h-6 border-3 border-neo-black relative transition-colors ${
              category.is_active ? 'bg-neo-blue' : 'bg-neo-cream'
            }`}
            aria-label="활성화 토글"
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-neo-white border-2 border-neo-black transition-all ${
              category.is_active ? 'right-0.5' : 'left-0.5'
            }`} />
          </button>

          {/* Add Child */}
          <button
            onClick={() => onAddChild(category.id)}
            disabled={isLoading}
            className="w-8 h-8 bg-neo-green border-3 border-neo-black flex items-center justify-center hover:bg-neo-green/80 disabled:opacity-50"
            aria-label="하위 카테고리 추가"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(category.id)}
            disabled={isLoading}
            className="w-8 h-8 bg-neo-yellow border-3 border-neo-black flex items-center justify-center hover:bg-neo-yellow/80 disabled:opacity-50"
            aria-label="수정"
          >
            <Edit className="h-4 w-4" strokeWidth={2.5} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(category.id)}
            disabled={hasChildren || isLoading}
            className="w-8 h-8 bg-neo-pink border-3 border-neo-black flex items-center justify-center hover:bg-neo-pink/80 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="삭제"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2">
          {category.children!.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({ categories }: CategoryTreeProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '카테고리 상태 변경에 실패했습니다');
      }

      toast({
        title: '상태 변경 완료',
        description: `카테고리가 ${isActive ? '활성화' : '비활성화'}되었습니다.`,
      });

      router.refresh();
    } catch (error) {
      console.error('Error toggling category:', error);
      toast({
        title: '상태 변경 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
        variant: 'destructive',
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/categories?edit=${id}`);
  };

  const handleDelete = async (id: string) => {
    const category = findCategoryById(categories, id);
    if (!category) return;

    if (!confirm(`"${category.name}" 카테고리를 삭제하시겠습니까?`)) {
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '카테고리 삭제에 실패했습니다');
      }

      toast({
        title: '삭제 완료',
        description: '카테고리가 삭제되었습니다.',
      });

      router.refresh();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: '삭제 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
        variant: 'destructive',
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAddChild = (parentId: string) => {
    router.push(`/admin/categories?parent=${parentId}`);
  };

  return (
    <div className="space-y-2" role="tree" aria-label="카테고리 트리">
      {categories.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          level={0}
          onToggleActive={handleToggleActive}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
          isLoading={loadingStates[category.id]}
        />
      ))}
    </div>
  );
}
