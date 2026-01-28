/**
 * Press Page - Neo-Brutalism 디자인
 * 보도자료 페이지
 */

import { Download, Mail, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const pressReleases = [
  {
    title: 'Vibe Store, 디지털 상품 마켓플레이스 런칭',
    date: '2026년 1월 15일',
    excerpt: '바이브랩스가 디지털 크리에이터를 위한 새로운 마켓플레이스를 출시했습니다.',
  },
  {
    title: '시리즈 A 투자 유치',
    date: '2025년 12월 1일',
    excerpt: '바이브랩스가 50억 원 규모의 시리즈 A 투자를 유치했습니다.',
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-neo-cream">
      {/* 히어로 섹션 */}
      <section className="bg-neo-purple border-b-3 border-neo-black">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white mb-4">
            보도자료
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Vibe Store의 최신 소식과 미디어 자료를 확인하세요
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 - 보도자료 목록 */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-black uppercase text-neo-black">
              최신 보도자료
            </h2>

            {pressReleases.map((release, index) => (
              <article
                key={index}
                className="bg-neo-white border-3 border-neo-black shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-neo-black/50" strokeWidth={2.5} />
                    <time className="text-sm font-medium text-neo-black/70">
                      {release.date}
                    </time>
                  </div>

                  <h3 className="text-2xl font-black text-neo-black mb-3">
                    {release.title}
                  </h3>

                  <p className="text-lg text-neo-black/70 mb-6 leading-relaxed">
                    {release.excerpt}
                  </p>

                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-neo-blue text-white border-3 border-neo-black shadow-neo-sm font-bold uppercase text-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all">
                    전체 보기
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </article>
            ))}

            {/* 더 많은 보도자료 */}
            <div className="bg-neo-yellow border-3 border-neo-black shadow-neo p-8 text-center">
              <p className="text-lg font-bold text-neo-black mb-4">
                더 많은 보도자료를 찾으시나요?
              </p>
              <a
                href="mailto:press@vibestore.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neo-black text-white border-3 border-neo-black shadow-neo font-bold uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all"
              >
                <Mail className="w-5 h-5" strokeWidth={2.5} />
                문의하기
              </a>
            </div>
          </div>

          {/* 사이드바 - 미디어 연락처 및 자료 */}
          <aside className="space-y-6">
            {/* 미디어 연락처 */}
            <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6">
              <h3 className="text-xl font-black text-neo-black mb-4 uppercase">
                미디어 문의
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-neo-black/70 mb-1">이메일</p>
                  <a
                    href="mailto:press@vibestore.com"
                    className="text-neo-blue font-medium hover:underline"
                  >
                    press@vibestore.com
                  </a>
                </div>
                <div>
                  <p className="text-sm font-bold text-neo-black/70 mb-1">담당자</p>
                  <p className="text-neo-black font-medium">김바이브</p>
                  <p className="text-sm text-neo-black/70">홍보팀 팀장</p>
                </div>
              </div>

              <a
                href="mailto:press@vibestore.com"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neo-pink text-white border-3 border-neo-black shadow-neo-sm font-bold uppercase text-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
              >
                <Mail className="w-4 h-4" strokeWidth={2.5} />
                문의하기
              </a>
            </div>

            {/* 미디어 키트 */}
            <div className="bg-neo-lime border-3 border-neo-black shadow-neo p-6">
              <h3 className="text-xl font-black text-neo-black mb-4 uppercase">
                미디어 키트
              </h3>
              <p className="text-sm text-neo-black/70 mb-4">
                로고, 브랜드 가이드라인, 스크린샷 등 미디어 자료를 다운로드하세요.
              </p>
              <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neo-black text-white border-3 border-neo-black shadow-neo-sm font-bold uppercase text-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all">
                <Download className="w-4 h-4" strokeWidth={2.5} />
                다운로드
              </button>
            </div>

            {/* 회사 정보 */}
            <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6">
              <h3 className="text-xl font-black text-neo-black mb-4 uppercase">
                회사 정보
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-bold text-neo-black/70">회사명</dt>
                  <dd className="text-neo-black font-medium">주식회사 바이브랩스</dd>
                </div>
                <div>
                  <dt className="font-bold text-neo-black/70">설립일</dt>
                  <dd className="text-neo-black font-medium">2025년 1월</dd>
                </div>
                <div>
                  <dt className="font-bold text-neo-black/70">대표자</dt>
                  <dd className="text-neo-black font-medium">김바이브</dd>
                </div>
                <div>
                  <dt className="font-bold text-neo-black/70">위치</dt>
                  <dd className="text-neo-black font-medium">서울특별시 강남구</dd>
                </div>
              </dl>

              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 text-neo-blue font-bold text-sm hover:underline"
              >
                더 알아보기
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* CTA 섹션 */}
      <section className="bg-neo-black py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black uppercase text-white mb-4">
            보도 협력 문의
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Vibe Store에 대한 보도를 준비 중이신가요? <br />
            언제든 연락주시면 성실히 답변드리겠습니다.
          </p>
          <a
            href="mailto:press@vibestore.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neo-yellow text-neo-black border-3 border-neo-yellow font-bold uppercase tracking-wide hover:bg-neo-lime transition-colors"
          >
            <Mail className="w-5 h-5" strokeWidth={2.5} />
            press@vibestore.com
          </a>
        </div>
      </section>
    </div>
  );
}
