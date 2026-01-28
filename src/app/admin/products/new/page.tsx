/**
 * P4-T4.6: 상품 등록 페이지
 */

import { createServerClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/product-form';

export default async function NewProductPage() {
  // 참고: middleware.ts에서 이미 관리자 권한 체크 완료

  // 1. Supabase 클라이언트 생성 (DB 접근용)
  const supabase = await createServerClient();

  // 2. 카테고리 목록 조회
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">상품 등록</h1>
          <p className="text-muted-foreground mt-2">
            새로운 상품을 등록합니다.
          </p>
        </div>

        <ProductForm categories={categories || []} mode="create" />
      </div>
    </div>
  );
}
