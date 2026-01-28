/**
 * Admin Categories Management Page
 *
 * - Neo-Brutalism 디자인
 * - 카테고리 트리 뷰
 * - 생성/수정/삭제
 */

import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import CategoryTree from '@/components/admin/category-tree';
import { FolderTree, Plus } from 'lucide-react';

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

async function getCategories(): Promise<Category[]> {
  const supabase = await createServerClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return buildCategoryTree(categories || []);
}

function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  categories.forEach(category => {
    const node = categoryMap.get(category.id)!;
    if (category.parent_id === null) {
      rootCategories.push(node);
    } else {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children!.push(node);
      } else {
        rootCategories.push(node);
      }
    }
  });

  return rootCategories;
}

async function CategoryManagementContent() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return (
      <div className="border-3 border-dashed border-neo-black/30 p-12 text-center">
        <FolderTree className="w-12 h-12 text-neo-black/30 mx-auto mb-4" strokeWidth={2} />
        <p className="text-neo-black/60 font-bold mb-4">아직 등록된 카테고리가 없습니다</p>
        <button className="px-4 py-2 bg-neo-blue text-neo-white border-3 border-neo-black font-bold uppercase shadow-neo">
          <Plus className="w-4 h-4 inline mr-2" strokeWidth={2.5} />
          첫 카테고리 만들기
        </button>
      </div>
    );
  }

  return <CategoryTree categories={categories} />;
}

function CategoryTreeSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 bg-neo-cream border-3 border-neo-black animate-pulse" />
      ))}
    </div>
  );
}

export default async function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-neo-orange border-3 border-neo-black flex items-center justify-center shadow-neo">
            <FolderTree className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-neo-black uppercase tracking-tight">
              카테고리 관리
            </h1>
            <p className="text-neo-black/60 font-medium">
              카테고리를 계층 구조로 관리합니다
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-neo-blue text-neo-white border-3 border-neo-black font-bold uppercase shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-all">
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          새 카테고리
        </button>
      </div>

      {/* 카테고리 트리 */}
      <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6">
        <Suspense fallback={<CategoryTreeSkeleton />}>
          <CategoryManagementContent />
        </Suspense>
      </div>
    </div>
  );
}
