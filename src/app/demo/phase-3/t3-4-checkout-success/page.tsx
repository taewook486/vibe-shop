/**
 * Demo: Checkout Success Page States
 *
 * P3-T3.4: 결제 완료 페이지 상태별 데모
 * - success: 결제 성공 (회원)
 * - guest-convert-prompt: 비회원 전환 유도
 */

'use client';

import { useState } from 'react';
import { CheckCircle2, Download, UserPlus, ArrowRight } from 'lucide-react';

type DemoState = 'success-authenticated' | 'success-guest';

export default function CheckoutSuccessPageDemo() {
  const [demoState, setDemoState] =
    useState<DemoState>('success-authenticated');

  return (
    <div className="min-h-screen bg-neo-cream p-8">
      {/* Demo Controls */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-neo-black mb-4">
          P3-T3.4: Checkout Success Page Demo
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setDemoState('success-authenticated')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'success-authenticated'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            Success (Authenticated)
          </button>
          <button
            onClick={() => setDemoState('success-guest')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'success-guest'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            Success (Guest - Conversion Prompt)
          </button>
        </div>
      </div>

      {/* Demo Preview */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mobile Preview */}
          <div>
            <h2 className="text-xl font-bold mb-4">Mobile (375px)</h2>
            <div className="bg-white border-3 border-neo-black shadow-neo p-4">
              <div
                className="mx-auto bg-neo-white overflow-y-auto"
                style={{ width: '375px', height: '667px' }}
              >
                <CheckoutSuccessPreview state={demoState} />
              </div>
            </div>
          </div>

          {/* Desktop Preview */}
          <div>
            <h2 className="text-xl font-bold mb-4">Desktop (1024px+)</h2>
            <div className="bg-white border-3 border-neo-black shadow-neo p-4">
              <div className="bg-neo-white overflow-y-auto" style={{ height: '667px' }}>
                <CheckoutSuccessPreview state={demoState} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutSuccessPreview({ state }: { state: DemoState }) {
  const isAuthenticated = state === 'success-authenticated';

  return (
    <div className="min-h-full bg-neo-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F0FFB3] border-3 border-neo-black shadow-neo mb-6">
            <CheckCircle2 className="w-12 h-12 text-neo-black" strokeWidth={3} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-neo-black uppercase tracking-tight mb-4">
            결제가 완료되었습니다!
          </h1>
          <p className="text-base text-neo-black/70">
            주문이 성공적으로 처리되었습니다.
          </p>
        </div>

        {/* Order Information Card */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 mb-6">
          <h2 className="text-xl font-black text-neo-black uppercase mb-4">
            주문 정보
          </h2>

          <div className="space-y-3">
            {/* Order Number */}
            <div className="flex justify-between items-center py-2 border-b-2 border-neo-black/10">
              <span className="font-bold text-neo-black text-sm">주문번호</span>
              <span className="font-mono text-neo-black text-sm">
                ORD-20260125-0001
              </span>
            </div>

            {/* Payment Amount */}
            <div className="flex justify-between items-center py-2 border-b-2 border-neo-black/10">
              <span className="font-bold text-neo-black text-sm">결제금액</span>
              <span className="text-xl font-black text-neo-blue">29,900원</span>
            </div>

            {/* Payment Key */}
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-neo-black/60 text-xs">결제 키</span>
              <span className="font-mono text-xs text-neo-black/60 truncate max-w-[150px]">
                test-payment-key-123
              </span>
            </div>
          </div>
        </div>

        {/* Authenticated User - Download Center */}
        {isAuthenticated && (
          <div className="bg-neo-blue border-3 border-neo-black shadow-neo p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white border-3 border-neo-black flex items-center justify-center">
                  <Download className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-white uppercase mb-2">
                  다운로드 센터에서 확인하세요
                </h3>
                <p className="text-white/90 mb-4 text-sm">
                  구매하신 디지털 상품은 다운로드 센터에서 바로 다운로드할 수
                  있습니다.
                </p>
                <button
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2
                    bg-white
                    text-neo-black
                    border-3 border-neo-black
                    shadow-neo
                    font-bold uppercase text-sm
                    hover:translate-x-[2px] hover:translate-y-[2px]
                    hover:shadow-neo-sm
                    active:translate-x-[4px] active:translate-y-[4px]
                    active:shadow-none
                    transition-all duration-150
                  "
                >
                  <Download className="w-4 h-4" strokeWidth={2.5} />
                  다운로드 센터 가기
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guest User - Conversion Prompt */}
        {!isAuthenticated && (
          <div className="bg-[#FFE6F0] border-3 border-[#FF3366] shadow-neo p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white border-3 border-neo-black flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-neo-black uppercase mb-2">
                  회원가입하고 다운로드 관리하기
                </h3>
                <p className="text-neo-black/70 mb-4 text-sm">
                  회원으로 전환하시면 구매 내역과 다운로드를 쉽게 관리할 수
                  있습니다. 이메일로 다운로드 링크가 발송되었지만, 회원가입하시면
                  언제든지 재다운로드가 가능합니다!
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    className="
                      inline-flex items-center justify-center gap-2
                      px-4 py-2
                      bg-[#FF3366]
                      text-white
                      border-3 border-neo-black
                      shadow-neo
                      font-bold uppercase text-sm
                      hover:translate-x-[2px] hover:translate-y-[2px]
                      hover:shadow-neo-sm
                      active:translate-x-[4px] active:translate-y-[4px]
                      active:shadow-none
                      transition-all duration-150
                    "
                  >
                    <UserPlus className="w-4 h-4" strokeWidth={2.5} />
                    회원가입하기
                  </button>
                  <button
                    className="
                      inline-flex items-center justify-center gap-2
                      px-4 py-2
                      bg-white
                      text-neo-black
                      border-3 border-neo-black
                      shadow-neo
                      font-bold uppercase text-sm
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
        <div className="bg-neo-white border-3 border-neo-black shadow-neo-sm p-5">
          <h3 className="font-bold text-neo-black uppercase mb-3 text-sm">
            안내사항
          </h3>
          <ul className="space-y-2 text-xs text-neo-black/70">
            <li className="flex items-start gap-2">
              <span className="text-neo-blue font-bold">•</span>
              <span>디지털 상품은 결제 완료 즉시 다운로드할 수 있습니다.</span>
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
              <span>구매 관련 문의사항은 고객센터로 연락주시기 바랍니다.</span>
            </li>
          </ul>
        </div>

        {/* Home Button */}
        <div className="mt-6 text-center">
          <button
            className="
              inline-flex items-center gap-2
              px-6 py-2
              bg-neo-black
              text-white
              border-3 border-neo-black
              shadow-neo
              font-bold uppercase text-sm
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
