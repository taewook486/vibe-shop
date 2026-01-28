'use client';

/**
 * P4-T4.5: Admin Categories Demo Page
 *
 * Demo States:
 * - list: Category tree with nested structure
 * - create: Create category form
 * - edit: Edit category form
 * - reorder: Drag and drop reordering (visual demo)
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryTree from '@/components/admin/category-tree';
import CategoryForm from '@/components/admin/category-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Mock category data
const mockCategories = [
  {
    id: '1',
    parent_id: null,
    name: '디지털 상품',
    slug: 'digital',
    description: '다운로드 가능한 디지털 콘텐츠',
    image_url: null,
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    children: [
      {
        id: '2',
        parent_id: '1',
        name: 'E-Book',
        slug: 'digital/ebook',
        description: '전자책 및 PDF',
        image_url: null,
        sort_order: 1,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        children: [],
      },
      {
        id: '3',
        parent_id: '1',
        name: '템플릿',
        slug: 'digital/templates',
        description: '디자인 템플릿',
        image_url: null,
        sort_order: 2,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        children: [],
      },
    ],
  },
  {
    id: '4',
    parent_id: null,
    name: '코스',
    slug: 'courses',
    description: '온라인 강의',
    image_url: null,
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    children: [],
  },
  {
    id: '5',
    parent_id: null,
    name: '서비스',
    slug: 'services',
    description: '컨설팅 및 코칭',
    image_url: null,
    sort_order: 3,
    is_active: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    children: [],
  },
];

const flatCategories = [
  {
    id: '1',
    parent_id: null,
    name: '디지털 상품',
    slug: 'digital',
    description: '다운로드 가능한 디지털 콘텐츠',
    image_url: null,
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    parent_id: '1',
    name: 'E-Book',
    slug: 'digital/ebook',
    description: '전자책 및 PDF',
    image_url: null,
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    parent_id: '1',
    name: '템플릿',
    slug: 'digital/templates',
    description: '디자인 템플릿',
    image_url: null,
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    parent_id: null,
    name: '코스',
    slug: 'courses',
    description: '온라인 강의',
    image_url: null,
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export default function AdminCategoriesDemoPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(mockCategories[0]);

  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setShowCreateForm(false);
    setShowEditForm(false);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Admin Categories Demo
        </h1>
        <p className="text-muted-foreground">
          P4-T4.5: 카테고리 관리 페이지 데모 - 다양한 상태를 확인할 수 있습니다.
        </p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">List (트리 뷰)</TabsTrigger>
          <TabsTrigger value="create">Create (등록)</TabsTrigger>
          <TabsTrigger value="edit">Edit (수정)</TabsTrigger>
          <TabsTrigger value="reorder">Reorder (순서 변경)</TabsTrigger>
        </TabsList>

        {/* List State */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>카테고리 목록</CardTitle>
                  <CardDescription>
                    계층 구조로 카테고리를 관리합니다.
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  새 카테고리
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CategoryTree categories={mockCategories} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create State */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>새 카테고리 만들기</CardTitle>
              <CardDescription>
                새로운 카테고리를 등록합니다. 상위 카테고리를 선택하면 하위 카테고리가 됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryForm
                categories={flatCategories}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit State */}
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>카테고리 수정</CardTitle>
              <CardDescription>
                기존 카테고리 정보를 수정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryForm
                category={selectedCategory}
                categories={flatCategories}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reorder State */}
        <TabsContent value="reorder">
          <Card>
            <CardHeader>
              <CardTitle>순서 변경</CardTitle>
              <CardDescription>
                드래그 앤 드롭으로 카테고리 순서를 변경할 수 있습니다 (시각적 데모).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  💡 왼쪽의 <strong>그립 아이콘</strong>을 드래그하여 순서를 변경할 수 있습니다.
                  실제 구현 시 <code>@dnd-kit</code> 또는 <code>react-beautiful-dnd</code> 라이브러리를 사용합니다.
                </p>
              </div>
              <CategoryTree categories={mockCategories} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">구현 기능</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>계층형 카테고리 트리 뷰</li>
              <li>펼치기/접기 기능</li>
              <li>활성/비활성 토글</li>
              <li>하위 카테고리 추가</li>
              <li>수정/삭제 액션</li>
              <li>드래그 앤 드롭 순서 변경 (UI만)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">폼 기능</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>카테고리명 자동 슬러그 생성</li>
              <li>상위 카테고리 선택 (계층 구조)</li>
              <li>설명 및 이미지 URL</li>
              <li>활성화 토글</li>
              <li>유효성 검증</li>
              <li>생성/수정 모드 구분</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
