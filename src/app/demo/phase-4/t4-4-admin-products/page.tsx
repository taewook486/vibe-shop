/**
 * P4-T4.6 Demo: 관리자 상품 관리 페이지
 *
 * 데모 상태:
 * - list: 상품 목록 표시
 * - create-form: 상품 등록 폼
 * - edit-form: 상품 수정 폼
 * - file-upload: 파일 업로드 UI
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Package,
} from 'lucide-react';

type DemoState = 'list' | 'create-form' | 'edit-form' | 'file-upload';

const mockProducts = [
  {
    id: '1',
    name: 'Next.js 쇼핑몰 템플릿',
    slug: 'nextjs-shop-template',
    price: 49000,
    discount_price: null,
    status: 'active',
    is_featured: true,
    category: '템플릿',
    sales_count: 15,
    created_at: '2026-01-20',
  },
  {
    id: '2',
    name: 'React 컴포넌트 라이브러리',
    slug: 'react-component-library',
    price: 89000,
    discount_price: 69000,
    status: 'draft',
    is_featured: false,
    category: '라이브러리',
    sales_count: 0,
    created_at: '2026-01-21',
  },
  {
    id: '3',
    name: 'Tailwind CSS UI Kit',
    slug: 'tailwind-ui-kit',
    price: 39000,
    discount_price: null,
    status: 'active',
    is_featured: false,
    category: 'UI 키트',
    sales_count: 8,
    created_at: '2026-01-22',
  },
  {
    id: '4',
    name: 'Supabase Auth 보일러플레이트',
    slug: 'supabase-auth-boilerplate',
    price: 29000,
    discount_price: null,
    status: 'hidden',
    is_featured: false,
    category: '템플릿',
    sales_count: 3,
    created_at: '2026-01-23',
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

function getStatusBadge(status: string) {
  const variants: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    draft: { label: '임시 저장', variant: 'secondary' },
    active: { label: '판매 중', variant: 'default' },
    hidden: { label: '숨김', variant: 'outline' },
    archived: { label: '보관', variant: 'destructive' },
  };

  const config = variants[status] || { label: status, variant: 'outline' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function ListState() {
  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="상품명 또는 설명 검색..." className="pl-9" />
              </div>
              <Button>검색</Button>
            </div>

            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="draft">임시 저장</SelectItem>
                  <SelectItem value="active">판매 중</SelectItem>
                  <SelectItem value="hidden">숨김</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  <SelectItem value="templates">템플릿</SelectItem>
                  <SelectItem value="libraries">라이브러리</SelectItem>
                </SelectContent>
              </Select>

              <Button>
                <Plus className="h-4 w-4 mr-2" />
                상품 등록
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>상품명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>판매수</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{product.name}</div>
                    {product.is_featured && (
                      <Badge variant="outline" className="mt-1">
                        추천
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {product.discount_price ? (
                    <div>
                      <div className="line-through text-muted-foreground text-sm">
                        {formatCurrency(product.price)}
                      </div>
                      <div className="font-semibold text-red-600">
                        {formatCurrency(product.discount_price)}
                      </div>
                    </div>
                  ) : (
                    formatCurrency(product.price)
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell>{product.sales_count}건</TableCell>
                <TableCell>{product.created_at}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button variant="outline" disabled>
          이전
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">1 / 1</span>
        </div>
        <Button variant="outline" disabled>
          다음
        </Button>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        총 {mockProducts.length}개의 상품
      </div>
    </div>
  );
}

function CreateFormState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>상품 등록</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">상품명 *</Label>
            <Input id="name" placeholder="상품명을 입력하세요" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">슬러그</Label>
            <Input
              id="slug"
              placeholder="자동 생성됩니다"
              className="text-muted-foreground"
              disabled
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_description">짧은 설명</Label>
          <Input id="short_description" placeholder="상품 카드에 표시될 짧은 설명" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">상세 설명</Label>
          <Textarea
            id="description"
            placeholder="Markdown 형식으로 작성 가능합니다"
            rows={8}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">가격 *</Label>
            <Input id="price" type="number" placeholder="0" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_price">할인가</Label>
            <Input id="discount_price" type="number" placeholder="선택사항" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select>
              <SelectTrigger id="category">
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="templates">템플릿</SelectItem>
                <SelectItem value="libraries">라이브러리</SelectItem>
                <SelectItem value="ui-kits">UI 키트</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">상태</Label>
            <Select defaultValue="draft">
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
              <input type="checkbox" className="rounded" />
              <span className="text-sm">추천 상품으로 표시</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">취소</Button>
          <Button>저장</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EditFormState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>상품 수정</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">상품명 *</Label>
            <Input
              id="name"
              defaultValue="Next.js 쇼핑몰 템플릿"
              placeholder="상품명을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">슬러그</Label>
            <Input
              id="slug"
              defaultValue="nextjs-shop-template"
              className="text-muted-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_description">짧은 설명</Label>
          <Input
            id="short_description"
            defaultValue="Next.js로 만든 완전한 쇼핑몰 템플릿"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">상세 설명</Label>
          <Textarea
            id="description"
            defaultValue="# Next.js 쇼핑몰 템플릿

완전한 기능을 갖춘 쇼핑몰 템플릿입니다."
            rows={8}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">가격 *</Label>
            <Input id="price" type="number" defaultValue="49000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_price">할인가</Label>
            <Input id="discount_price" type="number" placeholder="선택사항" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select defaultValue="templates">
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="templates">템플릿</SelectItem>
                <SelectItem value="libraries">라이브러리</SelectItem>
                <SelectItem value="ui-kits">UI 키트</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">상태</Label>
            <Select defaultValue="active">
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
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm">추천 상품으로 표시</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">취소</Button>
          <Button variant="destructive">삭제</Button>
          <Button>저장</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FileUploadState() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'product-image-1.jpg',
    'product-image-2.jpg',
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(['template-v1.0.zip']);

  return (
    <div className="space-y-6">
      {/* Images Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            상품 이미지
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className="relative border rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50"
              >
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">{image}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() =>
                    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
                {index === 0 && (
                  <Badge variant="default" className="mt-2">
                    대표 이미지
                  </Badge>
                )}
              </div>
            ))}

            {/* Upload Button */}
            <label className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">이미지 추가</span>
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>

          <p className="text-sm text-muted-foreground">
            * 최대 5장까지 업로드 가능합니다. 첫 번째 이미지가 대표 이미지로 사용됩니다.
          </p>
        </CardContent>
      </Card>

      {/* Files Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            다운로드 파일
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{file}</p>
                    <p className="text-xs text-muted-foreground">2.5 MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm font-medium">파일 업로드</span>
            <span className="text-xs text-muted-foreground mt-1">
              ZIP, PDF, 이미지 등
            </span>
            <input type="file" className="hidden" />
          </label>

          <p className="text-sm text-muted-foreground">
            * 구매자가 다운로드할 수 있는 파일입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminProductsDemo() {
  const [state, setState] = useState<DemoState>('list');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Demo Controls */}
        <Card className="mb-8 border-2 border-vibe-blue">
          <CardHeader>
            <CardTitle>Demo: 관리자 상품 관리 (P4-T4.6)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  상품 목록, 등록/수정 폼, 파일 업로드 기능을 확인할 수 있습니다.
                </p>
                <Tabs value={state} onValueChange={(v) => setState(v as DemoState)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="list">List</TabsTrigger>
                    <TabsTrigger value="create-form">Create Form</TabsTrigger>
                    <TabsTrigger value="edit-form">Edit Form</TabsTrigger>
                    <TabsTrigger value="file-upload">File Upload</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="text-sm space-y-2 text-muted-foreground">
                <p>
                  <strong>List:</strong> 상품 목록, 검색, 필터, 상태 변경
                </p>
                <p>
                  <strong>Create Form:</strong> 상품 등록 폼
                </p>
                <p>
                  <strong>Edit Form:</strong> 상품 수정 폼
                </p>
                <p>
                  <strong>File Upload:</strong> 이미지 및 파일 업로드
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">상품 관리</h1>
            <p className="text-muted-foreground mt-2">
              상품을 등록하고 관리할 수 있습니다.
            </p>
          </div>

          {state === 'list' && <ListState />}
          {state === 'create-form' && <CreateFormState />}
          {state === 'edit-form' && <EditFormState />}
          {state === 'file-upload' && <FileUploadState />}
        </div>
      </div>
    </div>
  );
}
