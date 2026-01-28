/**
 * About Page - Neo-Brutalism 디자인
 * 쇼핑몰 소개 페이지
 */

import { Store, Shield, Truck, Headphones, Star, Gift } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neo-cream">
      {/* 히어로 섹션 */}
      <section className="bg-neo-blue border-b-3 border-neo-black">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white mb-4">
            VIBE STORE 소개
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            디지털 상품 전문 쇼핑몰, 더 나은 경험을 제공합니다
          </p>
        </div>
      </section>

      {/* 소개 섹션 */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-black uppercase text-neo-black mb-6">
              최고의 디지털 상품을
              <br />
              <span className="text-neo-pink">합리적인 가격에</span>
            </h2>
            <p className="text-lg text-neo-black/70 mb-6 leading-relaxed">
              Vibe Store는 템플릿, 디자인 에셋, 코드 스니펫 등 다양한 디지털 상품을
              제공하는 전문 쇼핑몰입니다. 구매 후 즉시 다운로드가 가능하며,
              모든 상품은 엄격한 품질 검수를 거쳐 등록됩니다.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neo-yellow text-neo-black border-3 border-neo-black shadow-neo font-bold uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all"
            >
              상품 둘러보기
            </Link>
          </div>
          <div className="bg-neo-white border-3 border-neo-black shadow-neo-lg p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-neo-blue">500+</div>
                <div className="text-neo-black/70 font-bold mt-1">디지털 상품</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-neo-pink">10K+</div>
                <div className="text-neo-black/70 font-bold mt-1">다운로드</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-neo-purple">4.9</div>
                <div className="text-neo-black/70 font-bold mt-1">평균 평점</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-neo-lime">24H</div>
                <div className="text-neo-black/70 font-bold mt-1">고객 지원</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="bg-neo-yellow border-y-3 border-neo-black py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black uppercase text-neo-black text-center mb-12">
            왜 Vibe Store인가요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 특징 1 */}
            <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all">
              <div className="w-14 h-14 flex items-center justify-center bg-neo-blue border-3 border-neo-black shadow-neo-sm mb-4">
                <Shield className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-neo-black mb-2">안전한 결제</h3>
              <p className="text-neo-black/70">
                토스페이먼츠를 통한 안전하고 빠른 결제 시스템을 제공합니다.
              </p>
            </div>

            {/* 특징 2 */}
            <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all">
              <div className="w-14 h-14 flex items-center justify-center bg-neo-pink border-3 border-neo-black shadow-neo-sm mb-4">
                <Truck className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-neo-black mb-2">즉시 다운로드</h3>
              <p className="text-neo-black/70">
                결제 완료 즉시 다운로드 센터에서 파일을 받을 수 있습니다.
              </p>
            </div>

            {/* 특징 3 */}
            <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all">
              <div className="w-14 h-14 flex items-center justify-center bg-neo-lime border-3 border-neo-black shadow-neo-sm mb-4">
                <Headphones className="w-7 h-7 text-neo-black" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-neo-black mb-2">친절한 고객지원</h3>
              <p className="text-neo-black/70">
                상품 관련 문의에 빠르고 친절하게 답변해드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 추가 특징 */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neo-white border-3 border-neo-black shadow-neo p-8 flex gap-6 items-start">
            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-neo-purple border-3 border-neo-black shadow-neo-sm">
              <Star className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-black text-neo-black mb-2">품질 보증</h3>
              <p className="text-neo-black/70">
                모든 상품은 전문가의 검수를 거쳐 등록됩니다.
                품질에 만족하지 못하시면 환불해드립니다.
              </p>
            </div>
          </div>

          <div className="bg-neo-white border-3 border-neo-black shadow-neo p-8 flex gap-6 items-start">
            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-neo-pink border-3 border-neo-black shadow-neo-sm">
              <Gift className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-black text-neo-black mb-2">정기 할인 이벤트</h3>
              <p className="text-neo-black/70">
                매월 다양한 할인 이벤트와 프로모션을 진행합니다.
                회원가입 시 첫 구매 10% 할인 쿠폰을 드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-neo-black py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black uppercase text-white mb-4">
            지금 시작하세요
          </h2>
          <p className="text-lg text-white/80 mb-8">
            회원가입하고 다양한 디지털 상품을 만나보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neo-yellow text-neo-black border-3 border-neo-yellow font-bold uppercase tracking-wide hover:bg-neo-lime transition-colors"
            >
              회원가입
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white border-3 border-white font-bold uppercase tracking-wide hover:bg-white hover:text-neo-black transition-colors"
            >
              상품 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
