/**
 * Inquiry Detail Page
 *
 * 문의 상세 페이지 - Neo-Brutalism 스타일
 *
 * Features:
 * - 문의 상세 내용 표시
 * - 비밀글 접근 제어 (작성자/관리자만)
 * - 답변 표시
 * - 조회수 증가
 * - 작성자 정보
 * - 상품 정보
 *
 * URL: /inquiries/[id]
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, Lock, Eye, MessageCircle, Clock, User } from 'lucide-react';
import {
  INQUIRY_CATEGORIES,
  INQUIRY_STATUS,
  type InquiryCategoryType,
} from '@/types/inquiry';
import { auth } from '@/lib/auth';
import { InquiryAnswerForm } from '@/components/inquiries/inquiry-answer-form';

interface InquiryDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 카테고리별 색상 매핑 (Neo-Brutalism)
 */
const CATEGORY_COLORS: Record<InquiryCategoryType, string> = {
  product: 'bg-neo-blue text-white',
  shipping: 'bg-neo-green text-neo-black',
  refund: 'bg-neo-yellow text-neo-black',
  etc: 'bg-neo-cream text-neo-black',
};

/**
 * 문의 상세 페이지
 */
export default async function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { id } = await params;

  // 세션 확인 (관리자 여부)
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';

  // API 호출
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/inquiries/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch inquiry');
  }

  const data = await response.json();
  const { inquiry } = data;

  // 답변 완료 여부
  const isAnswered = inquiry.status === 'answered';

  // 상대 시간 포맷
  const createdAt = formatDistanceToNow(new Date(inquiry.created_at), {
    addSuffix: true,
    locale: ko,
  });

  const answeredAt = inquiry.answered_at
    ? formatDistanceToNow(new Date(inquiry.answered_at), {
        addSuffix: true,
        locale: ko,
      })
    : null;

  return (
    <div className="min-h-screen bg-neo-white p-4 py-8 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 */}
        <Link
          href="/inquiries"
          className="
            inline-flex items-center gap-2 mb-6
            text-sm font-bold text-neo-black
            hover:text-neo-blue
            transition-colors
          "
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          목록으로
        </Link>

        {/* 문의 카드 */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo">
          {/* 헤더 */}
          <div className="p-6 border-b-3 border-neo-black">
            {/* 카테고리 & 상태 */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span
                className={`
                  px-3 py-1
                  border-2 border-neo-black
                  text-xs font-black uppercase
                  ${CATEGORY_COLORS[inquiry.category as InquiryCategoryType]}
                `}
              >
                {INQUIRY_CATEGORIES[inquiry.category as InquiryCategoryType]}
              </span>
              <span
                className={`
                  px-3 py-1
                  border-2 border-neo-black
                  text-xs font-black uppercase
                  ${isAnswered
                    ? 'bg-neo-green text-neo-black'
                    : 'bg-neo-yellow text-neo-black'
                  }
                `}
              >
                {INQUIRY_STATUS[inquiry.status as keyof typeof INQUIRY_STATUS]}
              </span>
              {inquiry.is_private && (
                <span className="flex items-center gap-1 px-3 py-1 border-2 border-neo-black bg-neo-black/10 text-xs font-bold">
                  <Lock className="h-3 w-3" strokeWidth={2.5} />
                  비밀글
                </span>
              )}
            </div>

            {/* 제목 */}
            <h1 className="text-2xl sm:text-3xl font-black text-neo-black mb-4">
              {inquiry.title}
            </h1>

            {/* 메타 정보 */}
            <div className="flex items-center justify-between flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-4">
                {/* 작성자 */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-2 border-neo-black bg-neo-cream flex items-center justify-center font-black text-sm">
                    {inquiry.author?.nickname?.[0] || inquiry.author?.email[0].toUpperCase()}
                  </div>
                  <span className="font-bold text-neo-black">
                    {inquiry.author?.nickname || inquiry.author?.email.split('@')[0]}
                  </span>
                </div>

                {/* 작성 시간 */}
                <div className="flex items-center gap-1 text-neo-black/60">
                  <Clock className="h-4 w-4" strokeWidth={2} />
                  <span className="font-medium">{createdAt}</span>
                </div>
              </div>

              {/* 조회수 */}
              <div className="flex items-center gap-1 px-3 py-1 border-2 border-neo-black bg-neo-cream">
                <Eye className="h-4 w-4" strokeWidth={2} />
                <span className="font-bold">{inquiry.view_count}</span>
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="p-6">
            {/* 상품 정보 (있는 경우) */}
            {inquiry.product && (
              <div className="mb-6 p-4 border-3 border-neo-black bg-neo-cream">
                <p className="text-xs font-bold text-neo-black/60 uppercase mb-3">문의 상품</p>
                <Link
                  href={`/products/${inquiry.product.slug}`}
                  className="
                    flex items-center gap-4
                    hover:opacity-80 transition-opacity
                  "
                >
                  {inquiry.product.thumbnail_url && (
                    <div className="relative w-16 h-16 border-2 border-neo-black overflow-hidden flex-shrink-0 bg-neo-white">
                      <Image
                        src={inquiry.product.thumbnail_url}
                        alt={inquiry.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-neo-black">{inquiry.product.name}</p>
                    <p className="text-sm font-medium text-neo-blue">상품 보러가기 →</p>
                  </div>
                </Link>
              </div>
            )}

            {/* 문의 내용 */}
            <div className="min-h-[100px] text-neo-black whitespace-pre-wrap leading-relaxed">
              {inquiry.content}
            </div>
          </div>

          {/* 답변 섹션 */}
          {isAnswered && inquiry.answer && (
            <div className="border-t-3 border-neo-black bg-neo-green/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-neo-black" strokeWidth={2.5} />
                <h2 className="text-lg font-black text-neo-black uppercase">답변</h2>
              </div>

              {/* 답변자 정보 */}
              {inquiry.answerer && (
                <div className="flex items-center gap-3 mb-4 text-sm">
                  <div className="w-6 h-6 border-2 border-neo-black bg-neo-green flex items-center justify-center font-bold text-xs">
                    {inquiry.answerer.nickname?.[0] || inquiry.answerer.email[0].toUpperCase()}
                  </div>
                  <span className="font-bold text-neo-black">
                    {inquiry.answerer.nickname || inquiry.answerer.email.split('@')[0]}
                  </span>
                  {answeredAt && (
                    <span className="text-neo-black/60 font-medium">· {answeredAt}</span>
                  )}
                </div>
              )}

              {/* 답변 내용 */}
              <div className="p-4 border-3 border-neo-black bg-neo-white shadow-neo-sm">
                <div className="text-neo-black whitespace-pre-wrap leading-relaxed">
                  {inquiry.answer}
                </div>
              </div>
            </div>
          )}

          {/* 답변 대기 중 메시지 (일반 사용자용) */}
          {!isAnswered && !isAdmin && (
            <div className="border-t-3 border-neo-black bg-neo-yellow/30 p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-3 border-neo-black bg-neo-yellow flex items-center justify-center">
                <Clock className="h-6 w-6 text-neo-black" strokeWidth={2.5} />
              </div>
              <p className="font-bold text-neo-black text-lg">
                관리자의 답변을 기다리고 있습니다.
              </p>
              <p className="text-sm text-neo-black/60 mt-2 font-medium">
                빠른 시일 내에 답변드리겠습니다.
              </p>
            </div>
          )}

          {/* 관리자 답변 폼 */}
          {isAdmin && (
            <InquiryAnswerForm
              inquiryId={id}
              existingAnswer={inquiry.answer}
            />
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-center gap-3 mt-8">
          <Link
            href="/inquiries"
            className="
              px-6 py-3
              bg-neo-white
              text-neo-black
              border-3 border-neo-black
              shadow-neo
              font-bold uppercase tracking-wide

              hover:translate-x-[2px] hover:translate-y-[2px]
              hover:shadow-neo-sm

              active:translate-x-[4px] active:translate-y-[4px]
              active:shadow-none

              transition-all duration-150
            "
          >
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
