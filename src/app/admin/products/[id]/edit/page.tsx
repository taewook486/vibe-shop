/**
 * P4-T4.6: 상품 수정 페이지
 */

import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/product-form';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  // 참고: middleware.ts에서 이미 관리자 권한 체크 완료

  // 1. Supabase 클라이언트 생성 (DB 접근용)
  const supabase = await createServerClient();

  // 2. 상품 조회
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  // 3. 카테고리 목록 조회
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">상품 수정</h1>
          <p className="text-muted-foreground mt-2">
            {product.name}
          </p>
        </div>

        <ProductForm
          categories={categories || []}
          initialData={product}
          mode="edit"
        />
      </div>
    </div>
  );
}
