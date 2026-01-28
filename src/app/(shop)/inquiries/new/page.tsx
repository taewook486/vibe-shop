/**
 * New Inquiry Page
 *
 * 문의 작성 페이지 - Neo-Brutalism 디자인
 */

import Link from 'next/link';
import { ArrowLeft, MessageCircle, Lock, Info } from 'lucide-react';
import { InquiryForm } from '@/components/inquiries/inquiry-form';

interface NewInquiryPageProps {
  searchParams: Promise<{
    product_id?: string;
  }>;
}

export default async function NewInquiryPage({ searchParams }: NewInquiryPageProps) {
  const params = await searchParams;
  const productId = params.product_id;

  // 상품 정보 가져오기 (product_id가 있는 경우)
  let product = null;
  if (productId) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/products/${productId}`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        product = data.product;
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  }

  return (
    <div className="min-h-screen bg-neo-cream">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 뒤로가기 */}
        <Link
          href="/inquiries"
          className="inline-flex items-center gap-2 mb-6 text-neo-black font-bold hover:text-neo-blue transition-colors"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          목록으로
        </Link>

        {/* 폼 카드 */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 flex items-center justify-center bg-neo-blue border-3 border-neo-black shadow-neo-sm">
              <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black uppercase text-neo-black">문의 작성</h1>
          </div>
          <p className="text-neo-black/70 mb-8">
            상품이나 서비스에 대해 궁금한 점을 문의해주세요. 빠른 시일 내에 답변드리겠습니다.
          </p>

          <InquiryForm
            productId={productId}
            productName={product?.name}
          />
        </div>

        {/* 안내 사항 */}
        <div className="mt-6 bg-neo-yellow border-3 border-neo-black shadow-neo p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
            <h3 className="font-black uppercase text-neo-black">문의 작성 안내</h3>
          </div>
          <ul className="space-y-2 text-neo-black/80">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              문의 내용을 자세히 작성하시면 더 정확한 답변을 받으실 수 있습니다.
            </li>
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              비밀글로 작성하시면 작성자와 관리자만 내용을 볼 수 있습니다.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              개인정보가 포함된 문의는 반드시 비밀글로 작성해주세요.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              답변이 완료되면 이메일로 알림을 보내드립니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
