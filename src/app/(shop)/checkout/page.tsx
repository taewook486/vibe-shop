'use client';

/**
 * Checkout Page
 *
 * 결제 페이지
 * - 장바구니 상품 요약 표시
 * - 이메일 입력 폼 (로그인 시 자동 입력)
 * - 가상 결제 처리 (테스트용)
 * - 결제 성공/실패 처리
 * - Neo-Brutalism 스타일
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

// ============================================================================
// Types
// ============================================================================

interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

// ============================================================================
// Checkout Page Component
// ============================================================================

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, total, fetchCart } = useCartStore();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // 장바구니 조회
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // 세션에서 이메일 자동 입력
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  // 이메일 유효성 검증
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('이메일 형식이 올바르지 않습니다');
      return false;
    }
    setEmailError('');
    return true;
  };

  // 결제 처리 (가상 결제)
  const handlePayment = async () => {
    // 1. 이메일 검증
    if (!validateEmail(email)) {
      return;
    }

    // 2. 장바구니 확인
    if (items.length === 0) {
      setError('장바구니가 비어있습니다');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // 3. 주문 생성
      const orderItems: OrderItem[] = items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product.name,
        price: item.product.discount_price ?? item.product.price,
        quantity: item.quantity,
      }));

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          guest_email: email,
          discount_amount: 0,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error?.message || '주문 생성에 실패했습니다');
      }

      const { data: order } = await orderResponse.json();

      // 4. 가상 결제 처리 (Toss SDK 대신)
      // 실제 결제 연동 시 이 부분을 Toss Payments SDK로 교체
      const paymentResponse = await fetch(`/api/orders/${order.id}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentKey: `mock_${Date.now()}`,
          orderId: order.order_number,
          amount: order.total_amount,
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error?.message || '결제 처리에 실패했습니다');
      }

      // 5. 장바구니 비우기
      useCartStore.getState().clearCart();

      // 6. 성공 페이지로 이동 (orderId, paymentKey, amount 모두 전달)
      const mockPaymentKey = `mock_${Date.now()}`;
      router.push(`/checkout/success?orderId=${order.id}&paymentKey=${mockPaymentKey}&amount=${order.total_amount}`);
    } catch (err) {
      console.error('결제 처리 실패:', err);
      setError(err instanceof Error ? err.message : '결제 처리 중 오류가 발생했습니다');
      setIsProcessing(false);
    }
  };

  // 가격 포맷
  const formatPrice = (price: number): string => {
    return price.toLocaleString('ko-KR');
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">결제하기</h1>
          <p className="text-gray-600">주문 정보를 확인하고 결제를 진행해주세요</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 주문 요약 */}
          <div className="lg:col-span-2">
            <Card className="border-4 border-black shadow-neo-xl">
              <CardHeader>
                <CardTitle>주문 상품</CardTitle>
                <CardDescription>총 {items.length}개 상품</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    장바구니가 비어있습니다
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* 썸네일 */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 border-black">
                        {item.product.thumbnail_url ? (
                          <Image
                            src={item.product.thumbnail_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <span className="text-2xl">📦</span>
                          </div>
                        )}
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
                  ))
                )}
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
                    disabled={isProcessing || !!session?.user?.email}
                    readOnly={!!session?.user?.email}
                  />
                  {session?.user?.email && (
                    <p className="text-xs text-gray-600">
                      로그인된 계정의 이메일이 자동으로 입력되었습니다
                    </p>
                  )}
                  {emailError && (
                    <p className="text-sm text-red-600">{emailError}</p>
                  )}
                </div>

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

                {/* 에러 메시지 */}
                {error && (
                  <div className="rounded-lg border-2 border-red-500 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* 결제 버튼 */}
                <Button
                  onClick={handlePayment}
                  disabled={items.length === 0 || isProcessing}
                  className="w-full border-4 border-black bg-blue-400 py-6 text-lg font-bold text-white shadow-neo transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-blue-500 hover:shadow-neo disabled:bg-gray-300 disabled:shadow-none"
                >
                  {isProcessing ? '결제 처리 중...' : '가상 결제 (테스트)'}
                </Button>

                {/* 안내 문구 */}
                <div className="rounded-lg border-2 border-amber-400 bg-amber-50 p-3 text-xs text-amber-800">
                  <p className="font-semibold">테스트 모드</p>
                  <p className="mt-1">
                    가상 결제로 테스트 진행됩니다. 실제 결제되지 않습니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
