/**
 * Inquiries List Page - Neo-Brutalism 디자인
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Search, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { InquiryCard } from '@/components/inquiries/inquiry-card';
import {
  INQUIRY_CATEGORIES,
  type InquiryCategoryType,
  type InquiryStatusType,
  type InquiryWithAuthor,
} from '@/types/inquiry';

interface InquiriesPageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
    sort_by?: string;
    page?: string;
    search?: string;
  }>;
}

export default async function InquiriesPage({ searchParams }: InquiriesPageProps) {
  const params = await searchParams;
  const category = params.category as InquiryCategoryType | undefined;
  const status = params.status as InquiryStatusType | undefined;
  const sortBy = params.sort_by || 'latest';
  const page = parseInt(params.page || '1');
  const search = params.search;

  // API 호출
  const queryParams = new URLSearchParams();
  if (category) queryParams.set('category', category);
  if (status) queryParams.set('status', status);
  if (sortBy) queryParams.set('sort_by', sortBy);
  if (page) queryParams.set('page', page.toString());
  if (search) queryParams.set('search', search);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // AbortController로 10초 타임아웃 설정
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/inquiries?${queryParams.toString()}`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (fetchError: unknown) {
    if (fetchError instanceof Error && fetchError.name === 'AbortError') {
      // 타임아웃 시 빈 데이터 반환
      response = { ok: false, status: 408, statusText: 'Request Timeout' } as Response;
    } else {
      throw fetchError;
    }
  }

  let inquiries: unknown[] = [];
  let pagination = { total: 0, totalPages: 1 };

  if (!response.ok) {
    // 타임아웃 등 에러 발생 시 빈 데이터로 정상 페이지 렌더링
    inquiries = [];
    pagination = { total: 0, totalPages: 1 };
  } else {
    const data = await response.json();
    inquiries = data?.inquiries || [];
    pagination = data?.pagination || { total: 0, totalPages: 1 };
  }

  return (
    <div className="min-h-screen bg-neo-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center bg-neo-blue border-3 border-neo-black shadow-neo">
              <MessageCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase text-neo-black">문의 게시판</h1>
              <p className="text-neo-black/70 mt-1">
                상품이나 서비스에 대해 궁금한 점을 문의해주세요
              </p>
            </div>
          </div>
          <Link
            href="/inquiries/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neo-pink text-white border-3 border-neo-black shadow-neo font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            문의 작성
          </Link>
        </div>

        {/* 상태 탭 */}
        <div className="flex gap-2 mb-6">
          <Link
            href="/inquiries"
            className={`inline-flex items-center gap-2 px-4 py-2 border-3 border-neo-black font-bold transition-all ${
              !status
                ? 'bg-neo-black text-white shadow-none'
                : 'bg-neo-white text-neo-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
            }`}
          >
            전체
          </Link>
          <Link
            href="/inquiries?status=pending"
            className={`inline-flex items-center gap-2 px-4 py-2 border-3 border-neo-black font-bold transition-all ${
              status === 'pending'
                ? 'bg-neo-yellow text-neo-black shadow-none'
                : 'bg-neo-white text-neo-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
            }`}
          >
            <Clock className="w-4 h-4" strokeWidth={2.5} />
            답변 대기
          </Link>
          <Link
            href="/inquiries?status=answered"
            className={`inline-flex items-center gap-2 px-4 py-2 border-3 border-neo-black font-bold transition-all ${
              status === 'answered'
                ? 'bg-neo-lime text-neo-black shadow-none'
                : 'bg-neo-white text-neo-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
            }`}
          >
            <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
            답변 완료
          </Link>
        </div>

        {/* 카테고리 & 검색 */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* 카테고리 필터 */}
            <div className="flex gap-2 flex-wrap">
              <Link
                href={`/inquiries${status ? `?status=${status}` : ''}`}
                className={`px-3 py-1.5 text-sm font-bold border-2 border-neo-black transition-all ${
                  !category
                    ? 'bg-neo-blue text-white'
                    : 'bg-transparent text-neo-black hover:bg-neo-black/10'
                }`}
              >
                전체
              </Link>
              {Object.entries(INQUIRY_CATEGORIES).map(([key, label]) => (
                <Link
                  key={key}
                  href={`/inquiries?category=${key}${status ? `&status=${status}` : ''}`}
                  className={`px-3 py-1.5 text-sm font-bold border-2 border-neo-black transition-all ${
                    category === key
                      ? 'bg-neo-blue text-white'
                      : 'bg-transparent text-neo-black hover:bg-neo-black/10'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* 검색 */}
            <form className="flex-1 min-w-[200px]" method="GET" action="/inquiries">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neo-black/50" strokeWidth={2.5} />
                <input
                  type="search"
                  name="search"
                  placeholder="제목 또는 내용 검색..."
                  className="w-full pl-10 pr-4 py-2 border-3 border-neo-black font-medium focus:outline-none focus:ring-2 focus:ring-neo-blue"
                  defaultValue={search}
                />
                {category && <input type="hidden" name="category" value={category} />}
                {status && <input type="hidden" name="status" value={status} />}
                {sortBy && <input type="hidden" name="sort_by" value={sortBy} />}
              </div>
            </form>
          </div>
        </div>

        {/* 문의 목록 */}
        <Suspense
          fallback={
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-neo-white border-3 border-neo-black/30 animate-pulse" />
              ))}
            </div>
          }
        >
          {inquiries.length === 0 ? (
            <div className="bg-neo-white border-3 border-neo-black shadow-neo p-12 text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-neo-black/30" strokeWidth={2} />
              <p className="text-neo-black/70 mb-6 text-lg">
                등록된 문의가 없습니다.
              </p>
              <Link
                href="/inquiries/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neo-blue text-white border-3 border-neo-black shadow-neo font-bold uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                첫 문의 작성하기
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry: unknown) => (
                <InquiryCard key={(inquiry as { id: string }).id} inquiry={inquiry as InquiryWithAuthor} />
              ))}
            </div>
          )}
        </Suspense>

        {/* 페이지네이션 */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            {page > 1 && (
              <Link
                href={`/inquiries?page=${page - 1}${category ? `&category=${category}` : ''}${status ? `&status=${status}` : ''}${sortBy ? `&sort_by=${sortBy}` : ''}`}
                className="px-4 py-2 bg-neo-white border-3 border-neo-black shadow-neo-sm font-bold hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                이전
              </Link>
            )}
            <span className="px-4 py-2 bg-neo-black text-white border-3 border-neo-black font-bold">
              {page} / {pagination.totalPages}
            </span>
            {page < pagination.totalPages && (
              <Link
                href={`/inquiries?page=${page + 1}${category ? `&category=${category}` : ''}${status ? `&status=${status}` : ''}${sortBy ? `&sort_by=${sortBy}` : ''}`}
                className="px-4 py-2 bg-neo-white border-3 border-neo-black shadow-neo-sm font-bold hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                다음
              </Link>
            )}
          </div>
        )}

        {/* 총 개수 */}
        <div className="text-center mt-4 font-bold text-neo-black/70">
          총 {pagination.total}개의 문의
        </div>
      </div>
    </div>
  );
}
