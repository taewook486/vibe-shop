'use client';

/**
 * CheckoutPage Demo
 *
 * Phase 3 - Task 3.3: 결제 페이지 데모
 *
 * 데모 상태:
 * - loading: 장바구니 로딩 중
 * - order-summary: 주문 요약
 * - guest-mode: 비회원 이메일 입력
 * - processing: 결제 처리 중
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

// ============================================================================
// Demo Data
// ============================================================================

const demoCartItems = [
  {
    id: 'cart-1',
    product_id: 'product-1',
    quantity: 2,
    product: {
      name: '바이브코딩 강의 패키지',
      price: 99000,
      discount_price: 79000,
      thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    },
  },
  {
    id: 'cart-2',
    product_id: 'product-2',
    quantity: 1,
    product: {
      name: 'Next.js 15 마스터 클래스',
      price: 149000,
      discount_price: 99000,
      thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    },
  },
];

type DemoState = 'loading' | 'order-summary' | 'guest-mode' | 'processing';

// ============================================================================
// Demo Page Component
// ============================================================================

export default function CheckoutPageDemo() {
  const [demoState, setDemoState] = useState<DemoState>('order-summary');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const total = demoCartItems.reduce((sum, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 p-8">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            CheckoutPage Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Phase 3 - Task 3.3: 결제 페이지 (Neo-Brutalism 스타일)
          </p>
        </div>

        {/* State Toggle */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {(['order-summary', 'guest-mode', 'loading', 'processing'] as DemoState[]).map((state) => (
            <Button
              key={state}
              onClick={() => setDemoState(state)}
              variant={demoState === state ? 'default' : 'outline'}
              className="border-2 border-black"
            >
              {state === 'order-summary' && '주문 요약'}
              {state === 'guest-mode' && '비회원 모드'}
              {state === 'loading' && '로딩'}
              {state === 'processing' && '결제 중'}
            </Button>
          ))}
        </div>

        {/* Demo Content */}
        <div className="mx-auto max-w-4xl">
          {demoState === 'loading' && (
            <div className="py-24 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-gray-600">장바구니를 불러오는 중...</p>
            </div>
          )}

          {demoState !== 'loading' && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* 주문 요약 */}
              <div className="lg:col-span-2">
                <Card className="border-4 border-black shadow-neo-xl">
                  <CardHeader>
                    <CardTitle>주문 상품</CardTitle>
                    <CardDescription>총 {demoCartItems.length}개 상품</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {demoCartItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        {/* 썸네일 */}
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 border-black">
                          <Image
                            src={item.product.thumbnail_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* 상품 정보 */}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">수량: {item.quantity}</p>
                          <p className="mt-1 font-bold text-blue-600">
                            {formatPrice(item.product.discount_price ?? item.product.price)}원
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* 결제 정보 */}
              <div className="lg:col-span-1">
                <Card className="border-4 border-black shadow-neo-xl">
                  <CardHeader>
                    <CardTitle>결제 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 이메일 입력 */}
                    {(demoState === 'guest-mode' || demoState === 'processing') && (
                      <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="주문 확인 이메일을 입력하세요"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                          }}
                          className={`border-2 ${
                            emailError ? 'border-red-500' : 'border-black'
                          }`}
                          disabled={demoState === 'processing'}
                        />
                        {emailError && (
                          <p className="text-sm text-red-600">{emailError}</p>
                        )}
                      </div>
                    )}

                    <Separator className="my-4" />

                    {/* 결제 금액 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">상품 금액</span>
                        <span className="font-medium">{formatPrice(total)}원</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>총 결제 금액</span>
                        <span className="text-blue-600">{formatPrice(total)}원</span>
                      </div>
                    </div>

                    {/* 결제 버튼 */}
                    <Button
                      disabled={demoState === 'processing'}
                      className="w-full border-4 border-black bg-blue-400 py-6 text-lg font-bold text-white shadow-neo transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-blue-500 hover:shadow-neo disabled:bg-gray-300 disabled:shadow-none"
                    >
                      {demoState === 'processing' ? '결제 처리 중...' : '결제하기'}
                    </Button>

                    {/* 안내 문구 */}
                    <p className="text-xs text-gray-500">
                      결제하기 버튼을 클릭하면 토스페이먼츠 결제 창으로 이동합니다.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Features Checklist */}
        <div className="mx-auto mt-12 max-w-4xl rounded-lg border-4 border-black bg-white p-8 shadow-neo-xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Features Checklist
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>주문 상품 요약 표시</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>상품별 가격/수량 표시</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>비회원 이메일 입력 폼</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>이메일 형식 검증</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>총 결제 금액 계산</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>Toss Payments SDK 연동</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>결제 처리 중 로딩 상태</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>결제 성공/실패 처리</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>Neo-Brutalism 스타일</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>반응형 레이아웃 (1/3 cols)</span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/demo"
            className="inline-block rounded-lg border-4 border-black bg-blue-400 px-6 py-3 font-bold text-white shadow-neo transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo"
          >
            ← Back to Demo Home
          </a>
        </div>
      </div>
    </div>
  );
}
