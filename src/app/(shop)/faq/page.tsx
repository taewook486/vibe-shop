/**
 * FAQ Page - Neo-Brutalism 디자인
 * 자주 묻는 질문 페이지 (아코디언 형식)
 */

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// FAQ 데이터 타입
interface FAQ {
  category: string;
  question: string;
  answer: string;
}

// FAQ 샘플 데이터
const faqs: FAQ[] = [
  {
    category: '결제',
    question: '어떤 결제 수단을 지원하나요?',
    answer: '신용카드, 체크카드, 계좌이체, 토스페이, 카카오페이 등 다양한 결제 수단을 지원합니다.'
  },
  {
    category: '결제',
    question: '해외 카드로도 결제할 수 있나요?',
    answer: '네, VISA, MasterCard 등 해외 카드로도 결제 가능합니다.'
  },
  {
    category: '다운로드',
    question: '구매한 파일은 어디서 다운로드하나요?',
    answer: '결제 완료 후 마이페이지 > 다운로드 센터에서 다운로드할 수 있습니다.'
  },
  {
    category: '다운로드',
    question: '다운로드 기간 제한이 있나요?',
    answer: '구매일로부터 1년간 다운로드 가능합니다. 이후에는 재구매가 필요합니다.'
  },
  {
    category: '환불',
    question: '환불이 가능한가요?',
    answer: '디지털 상품 특성상 다운로드 전에만 환불이 가능합니다. 자세한 내용은 환불 정책을 참고해주세요.'
  },
  {
    category: '계정',
    question: '비밀번호를 잊어버렸어요',
    answer: '로그인 페이지에서 "비밀번호 찾기"를 클릭하여 이메일로 재설정 링크를 받을 수 있습니다.'
  }
];

// 카테고리 목록 추출
const categories = ['전체', ...Array.from(new Set(faqs.map((faq) => faq.category)))];

// 아코디언 아이템 컴포넌트
function AccordionItem({
  faq,
  isOpen,
  onToggle
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border-3 border-neo-black shadow-neo transition-colors ${
        isOpen ? 'bg-neo-cream' : 'bg-neo-white'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-neo-cream/50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex-1">
          <div className="inline-block px-3 py-1 bg-neo-blue text-white text-xs font-bold uppercase border-2 border-neo-black shadow-neo-sm mb-2">
            {faq.category}
          </div>
          <h3 className="text-lg font-black text-neo-black">
            {faq.question}
          </h3>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-neo-black flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={3}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-0">
          <div className="pt-4 border-t-3 border-neo-black/10">
            <p className="text-neo-black/80 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 필터링된 FAQ 목록
  const filteredFaqs =
    selectedCategory === '전체'
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  // 아코디언 토글 핸들러
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-neo-cream">
      {/* 히어로 섹션 */}
      <section className="bg-neo-purple border-b-3 border-neo-black">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white mb-4">
            자주 묻는 질문
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            궁금한 점을 빠르게 찾아보세요
          </p>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="bg-neo-white border-b-3 border-neo-black">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setOpenIndex(null); // 카테고리 변경 시 모든 아코디언 닫기
                }}
                className={`px-5 py-2 font-bold uppercase border-3 border-neo-black shadow-neo transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm ${
                  selectedCategory === category
                    ? 'bg-neo-yellow text-neo-black'
                    : 'bg-neo-white text-neo-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ 목록 */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))
          ) : (
            <div className="bg-neo-white border-3 border-neo-black shadow-neo p-12 text-center">
              <p className="text-neo-black/60 text-lg">
                해당 카테고리에 FAQ가 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 추가 도움말 섹션 */}
      <section className="bg-neo-yellow border-t-3 border-neo-black py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black uppercase text-neo-black mb-4">
            찾으시는 답변이 없나요?
          </h2>
          <p className="text-lg text-neo-black/70 mb-8">
            고객센터로 문의하시면 빠르게 도와드리겠습니다.
          </p>
          <a
            href="mailto:support@vibestore.com"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neo-black text-white border-3 border-neo-black font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-neo transition-all"
          >
            고객센터 문의하기
          </a>
        </div>
      </section>
    </div>
  );
}
