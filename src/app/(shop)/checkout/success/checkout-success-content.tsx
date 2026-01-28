'use client';

/**
 * Checkout Success Content Component
 *
 * 결제 완료 페이지 클라이언트 컴포넌트
 * - 주문 정보 표시
 * - 회원/비회원 구분
 * - 다운로드 센터 또는 회원가입 유도
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Download, UserPlus, ArrowRight, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CheckoutSuccessContentProps {
  searchParams: {
    orderId?: string;
    paymentKey?: string;
    amount?: string;
  };
}

export default function CheckoutSuccessContent({
  searchParams,
}: CheckoutSuccessContentProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { orderId, paymentKey, amount } = searchParams;

  // Check if user is authenticated
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsAuthenticated(!!user);
      setIsLoading(false);
    }

    checkAuth();
  }, []);

  // Validate URL parameters
  if (!orderId || !paymentKey || !amount) {
    return (
      <div className="min-h-screen bg-neo-cream flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-[#FFE6E6] border-3 border-[#FF3333] shadow-neo p-8 text-center">
            <p className="text-2xl font-black text-neo-black mb-4">
              잘못된 접근입니다
            </p>
            <p className="text-neo-black/70 mb-6">
              주문 정보를 찾을 수 없습니다.
            </p>
            <button
              onClick={() => router.push('/')}
              className="
                px-6 py-3
                bg-neo-black
                text-white
                border-3 border-neo-black
                shadow-neo
                font-bold uppercase
                hover:translate-x-[2px] hover:translate-y-[2px]
                hover:shadow-neo-sm
                active:translate-x-[4px] active:translate-y-[4px]
                active:shadow-none
                transition-all duration-150
              "
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format amount
  const formattedAmount = new Intl.NumberFormat('ko-KR').format(Number(amount));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neo-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neo-black border-t-transparent"></div>
          <p className="mt-4 text-neo-black font-bold">결제 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F0FFB3] border-3 border-neo-black shadow-neo mb-6">
            <CheckCircle2 className="w-12 h-12 text-neo-black" strokeWidth={3} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-neo-black uppercase tracking-tight mb-4">
            결제가 완료되었습니다!
          </h1>
          <p className="text-lg text-neo-black/70">
            주문이 성공적으로 처리되었습니다.
          </p>
        </div>

        {/* Order Information Card */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-black text-neo-black uppercase mb-6">
            주문 정보
          </h2>

          <div className="space-y-4">
            {/* Order Number */}
            <div className="flex justify-between items-center py-3 border-b-2 border-neo-black/10">
              <span className="font-bold text-neo-black">주문번호</span>
              <span className="font-mono text-neo-black">{orderId}</span>
            </div>

            {/* Payment Amount */}
            <div className="flex justify-between items-center py-3 border-b-2 border-neo-black/10">
              <span className="font-bold text-neo-black">결제금액</span>
              <span className="text-2xl font-black text-neo-blue">
                {formattedAmount}원
              </span>
            </div>

            {/* Payment Key (for debugging/reference) */}
            <div className="flex justify-between items-center py-3">
              <span className="font-bold text-neo-black/60 text-sm">결제 키</span>
              <span className="font-mono text-xs text-neo-black/60 truncate max-w-[200px]">
                {paymentKey}
              </span>
            </div>
          </div>
        </div>

        {/* Authenticated User - Download Center */}
        {isAuthenticated && (
          <div className="bg-neo-blue border-3 border-neo-black shadow-neo p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white border-3 border-neo-black flex items-center justify-center">
                  <Download className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white uppercase mb-2">
                  다운로드 센터에서 확인하세요
                </h3>
                <p className="text-white/90 mb-4">
                  구매하신 디지털 상품은 다운로드 센터에서 바로 다운로드할 수
                  있습니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.push('/my/downloads')}
                    className="
                      inline-flex items-center gap-2
                      px-6 py-3
                      bg-white
                      text-neo-black
                      border-3 border-neo-black
                      shadow-neo
                      font-bold uppercase
                      hover:translate-x-[2px] hover:translate-y-[2px]
                      hover:shadow-neo-sm
                      active:translate-x-[4px] active:translate-y-[4px]
                      active:shadow-none
                      transition-all duration-150
                    "
                  >
                    <Download className="w-5 h-5" strokeWidth={2.5} />
                    다운로드 센터 가기
                  </button>
                  <button
                    onClick={() => router.push('/my/orders')}
                    className="
                      inline-flex items-center gap-2
                      px-6 py-3
                      bg-white/80
                      text-neo-black
                      border-3 border-neo-black
                      shadow-neo-sm
                      font-bold uppercase
                      hover:translate-x-[2px] hover:translate-y-[2px]
                      hover:shadow-none
                      active:translate-x-[4px] active:translate-y-[4px]
                      active:shadow-none
                      transition-all duration-150
                    "
                  >
                    <Package className="w-5 h-5" strokeWidth={2.5} />
                    주문 현황 보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guest User - Conversion Prompt */}
        {!isAuthenticated && (
          <div className="bg-[#FFE6F0] border-3 border-[#FF3366] shadow-neo p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white border-3 border-neo-black flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-neo-black uppercase mb-2">
                  회원가입하고 다운로드 관리하기
                </h3>
                <p className="text-neo-black/70 mb-4">
                  회원으로 전환하시면 구매 내역과 다운로드를 쉽게 관리할 수
                  있습니다.
                  <br />
                  이메일로 다운로드 링크가 발송되었지만, 회원가입하시면 언제든지
                  재다운로드가 가능합니다!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.push('/login')}
                    className="
                      inline-flex items-center justify-center gap-2
                      px-6 py-3
                      bg-[#FF3366]
                      text-white
                      border-3 border-neo-black
                      shadow-neo
                      font-bold uppercase
                      hover:translate-x-[2px] hover:translate-y-[2px]
                      hover:shadow-neo-sm
                      active:translate-x-[4px] active:translate-y-[4px]
                      active:shadow-none
                      transition-all duration-150
                    "
                  >
                    <UserPlus className="w-5 h-5" strokeWidth={2.5} />
                    회원가입하기
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="
                      inline-flex items-center justify-center gap-2
                      px-6 py-3
                      bg-white
                      text-neo-black
                      border-3 border-neo-black
                      shadow-neo
                      font-bold uppercase
                      hover:translate-x-[2px] hover:translate-y-[2px]
                      hover:shadow-neo-sm
                      active:translate-x-[4px] active:translate-y-[4px]
                      active:shadow-none
                      transition-all duration-150
                    "
                  >
                    나중에 하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo-sm p-6">
          <h3 className="font-bold text-neo-black uppercase mb-3">
            안내사항
          </h3>
          <ul className="space-y-2 text-sm text-neo-black/70">
            <li className="flex items-start gap-2">
              <span className="text-neo-blue font-bold">•</span>
              <span>
                디지털 상품은 결제 완료 즉시 다운로드할 수 있습니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neo-blue font-bold">•</span>
              <span>
                {isAuthenticated
                  ? '다운로드 센터에서 언제든지 재다운로드가 가능합니다.'
                  : '이메일로 발송된 다운로드 링크는 7일간 유효합니다.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neo-blue font-bold">•</span>
              <span>
                구매 관련 문의사항은 고객센터로 연락주시기 바랍니다.
              </span>
            </li>
          </ul>
        </div>

        {/* Home Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="
              inline-flex items-center gap-2
              px-8 py-3
              bg-neo-black
              text-white
              border-3 border-neo-black
              shadow-neo
              font-bold uppercase
              hover:translate-x-[2px] hover:translate-y-[2px]
              hover:shadow-neo-sm
              active:translate-x-[4px] active:translate-y-[4px]
              active:shadow-none
              transition-all duration-150
            "
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
