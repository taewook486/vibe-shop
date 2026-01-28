import Link from 'next/link';
import { ShoppingBag, Download, Zap } from 'lucide-react';

/**
 * 홈페이지
 * - Neo-Brutalism 디자인 스타일
 * - 히어로 섹션, 주요 기능 소개
 */
export default function Home() {
  return (
    <div className="w-full">
      {/* 히어로 섹션 */}
      <section className="w-full bg-neo-yellow border-b-3 border-neo-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neo-black leading-tight">
              디지털 상품 쇼핑몰 스캘레톤
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-neo-black/70 leading-relaxed">
              라이브 코딩으로 만드는 완벽한 시작점. Next.js + Supabase + Toss Payments로
              당신만의 디지털 상품 쇼핑몰을 구축하세요.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neo-blue text-white border-3 border-neo-black shadow-neo font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
              >
                <ShoppingBag className="w-6 h-6" strokeWidth={2.5} />
                상품 둘러보기
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neo-white text-neo-black border-3 border-neo-black shadow-neo font-bold hover:bg-neo-lime hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
              >
                자세히 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section className="w-full py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-center text-neo-black">
            주요 기능
          </h2>
          <p className="mt-4 text-center text-neo-black/70 max-w-2xl mx-auto">
            디지털 상품을 판매하는 데 필요한 모든 기능이 준비되어 있습니다.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="feature-cards">
            {/* 기능 1 */}
            <div className="bg-neo-white border-3 border-neo-black shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all duration-200 p-8" data-testid="feature-card">
              <div className="w-16 h-16 flex items-center justify-center bg-neo-blue border-3 border-neo-black shadow-neo-sm">
                <ShoppingBag className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-neo-black">
                디지털 상품 판매
              </h3>
              <p className="mt-4 text-neo-black/70 leading-relaxed">
                템플릿, 디자인, 코드 등 디지털 상품을 손쉽게 등록하고 판매할 수 있습니다.
              </p>
            </div>

            {/* 기능 2 */}
            <div className="bg-neo-white border-3 border-neo-black shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all duration-200 p-8">
              <div className="w-16 h-16 flex items-center justify-center bg-neo-pink border-3 border-neo-black shadow-neo-sm">
                <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-neo-black">
                간편한 결제
              </h3>
              <p className="mt-4 text-neo-black/70 leading-relaxed">
                Toss Payments 통합으로 안전하고 빠른 결제를 제공합니다.
              </p>
            </div>

            {/* 기능 3 */}
            <div className="bg-neo-white border-3 border-neo-black shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all duration-200 p-8">
              <div className="w-16 h-16 flex items-center justify-center bg-neo-lime border-3 border-neo-black shadow-neo-sm">
                <Download className="w-8 h-8 text-neo-black" strokeWidth={2.5} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-neo-black">
                즉시 다운로드
              </h3>
              <p className="mt-4 text-neo-black/70 leading-relaxed">
                결제 완료 후 즉시 다운로드 센터에서 파일을 받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="w-full bg-neo-blue border-y-3 border-neo-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">
            지금 시작하세요
          </h2>
          <p className="mt-4 text-lg text-white/90">
            라이브 코딩 콘텐츠와 함께 나만의 쇼핑몰을 만들어보세요.
          </p>
          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neo-yellow text-neo-black border-3 border-neo-black shadow-neo font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
            >
              상품 보러가기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
