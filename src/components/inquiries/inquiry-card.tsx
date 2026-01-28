/**
 * Inquiry Card Component - Neo-Brutalism 디자인
 *
 * 문의 목록에서 개별 문의를 표시하는 카드 컴포넌트
 *
 * Features:
 * - 비밀글 아이콘 표시
 * - 답변 완료/대기 상태 뱃지
 * - 조회수 표시
 * - 카테고리 표시
 * - 작성자 정보
 * - 상품 정보 (있는 경우)
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Lock, Eye, MessageCircle, Clock } from 'lucide-react';
import {
  type InquiryWithAuthor,
  INQUIRY_CATEGORIES,
  type InquiryCategoryType,
} from '@/types/inquiry';

interface InquiryCardProps {
  inquiry: InquiryWithAuthor & {
    product?: {
      id: string;
      name: string;
      slug: string;
      thumbnail_url: string | null;
    } | null;
  };
  className?: string;
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

export function InquiryCard({ inquiry, className }: InquiryCardProps) {
  const {
    id,
    category,
    title,
    is_private,
    status,
    view_count,
    created_at,
    author,
    product,
    answer,
  } = inquiry;

  // 답변 완료 여부
  const isAnswered = status === 'answered';

  // 상대 시간 포맷
  const relativeTime = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Link
      href={`/inquiries/${id}`}
      className={`
        block
        bg-neo-white
        border-3 border-neo-black
        shadow-neo
        hover:translate-x-[2px] hover:translate-y-[2px]
        hover:shadow-neo-sm
        transition-all duration-150
        ${className || ''}
      `}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* 카테고리 & 상태 뱃지 */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span
                className={`
                  px-2 py-0.5
                  border-2 border-neo-black
                  text-xs font-black uppercase
                  ${CATEGORY_COLORS[category]}
                `}
              >
                {INQUIRY_CATEGORIES[category]}
              </span>
              <span
                className={`
                  px-2 py-0.5
                  border-2 border-neo-black
                  text-xs font-black uppercase
                  ${isAnswered
                    ? 'bg-neo-green text-neo-black'
                    : 'bg-neo-yellow text-neo-black'
                  }
                `}
              >
                {isAnswered ? '답변 완료' : '답변 대기'}
              </span>
              {is_private && (
                <span className="flex items-center gap-1 px-2 py-0.5 border-2 border-neo-black bg-neo-black/10 text-xs font-bold">
                  <Lock className="h-3 w-3" strokeWidth={2.5} />
                  비밀
                </span>
              )}
            </div>

            {/* 제목 */}
            <h3 className="font-black text-lg text-neo-black leading-tight line-clamp-1 mb-3">
              {title}
            </h3>

            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-sm">
              {/* 작성자 */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-neo-black bg-neo-cream flex items-center justify-center font-bold text-xs">
                  {author.nickname?.[0] || author.email[0].toUpperCase()}
                </div>
                <span className="font-medium text-neo-black">
                  {author.nickname || author.email.split('@')[0]}
                </span>
              </div>

              {/* 작성 시간 */}
              <span className="text-neo-black/60 font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                {relativeTime}
              </span>

              {/* 조회수 */}
              <span className="text-neo-black/60 font-medium flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                {view_count}
              </span>
            </div>

            {/* 상품 정보 (있는 경우) */}
            {product && (
              <div className="mt-3 pt-3 border-t-2 border-neo-black/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neo-black/60 uppercase">상품:</span>
                  <span className="text-sm font-bold text-neo-black">{product.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* 상품 썸네일 (있는 경우) */}
          {product && product.thumbnail_url && (
            <div className="relative w-16 h-16 border-2 border-neo-black overflow-hidden flex-shrink-0 bg-neo-cream">
              <Image
                src={product.thumbnail_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
