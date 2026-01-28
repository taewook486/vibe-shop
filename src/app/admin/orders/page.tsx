/**
 * Admin Orders List Page
 *
 * 관리자 주문 목록 페이지
 * - Neo-Brutalism 디자인
 * - 직접 DB 조회 (서버 컴포넌트)
 */

import Link from 'next/link';
import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { OrdersFilter } from '@/components/admin/orders-filter';
import { ShoppingCart, ExternalLink, AlertCircle, Package } from 'lucide-react';
import type { OrderStatus } from '@/types/order';

interface SearchParams {
  status?: OrderStatus | 'all';
  search?: string;
  page?: string;
}

interface AdminOrdersPageProps {
  searchParams: Promise<SearchParams>;
}

/**
 * 금액 포맷
 */
function formatPrice(price: number): string {
  return `₩${price.toLocaleString('ko-KR')}`;
}

/**
 * 날짜 포맷
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * 상태 배지 색상
 */
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-neo-yellow', text: 'text-neo-black' },
  paid: { bg: 'bg-neo-blue', text: 'text-neo-white' },
  completed: { bg: 'bg-neo-green', text: 'text-neo-black' },
  cancelled: { bg: 'bg-neo-orange', text: 'text-neo-black' },
  refunded: { bg: 'bg-neo-pink', text: 'text-neo-black' },
};

const STATUS_LABELS: Record<string, string> = {
  pending: '결제대기',
  paid: '결제완료',
  completed: '처리완료',
  cancelled: '취소됨',
  refunded: '환불됨',
};

/**
 * 주문 목록 테이블 (직접 DB 조회)
 */
async function OrdersTable({ searchParams }: AdminOrdersPageProps) {
  const resolvedParams = await searchParams;
  const { status, search, page = '1' } = resolvedParams;

  const supabase = await createServerClient();

  // 주문 목록 조회
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  // 상태 필터
  if (status && status !== 'all') {
    query = query.eq('status', status as OrderStatus);
  }

  // 주문번호 검색
  if (search) {
    query = query.ilike('order_number', `%${search}%`);
  }

  // 페이지네이션
  const limit = 20;
  const pageNum = parseInt(page, 10);
  const from = (pageNum - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data: orders, error } = await query;

  if (error) {
    return (
      <div className="bg-neo-pink/20 border-3 border-neo-pink p-6 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-neo-pink" strokeWidth={2.5} />
        <p className="font-bold text-neo-black">주문 목록을 불러올 수 없습니다: {error.message}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="border-3 border-dashed border-neo-black/30 p-12 text-center">
        <Package className="w-12 h-12 text-neo-black/30 mx-auto mb-4" strokeWidth={2} />
        <p className="text-neo-black/60 font-bold">주문이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="border-3 border-neo-black overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-neo-black text-neo-white">
            <th className="px-4 py-3 text-left font-black uppercase text-sm">주문번호</th>
            <th className="px-4 py-3 text-left font-black uppercase text-sm">주문자</th>
            <th className="px-4 py-3 text-left font-black uppercase text-sm">상품</th>
            <th className="px-4 py-3 text-right font-black uppercase text-sm">금액</th>
            <th className="px-4 py-3 text-center font-black uppercase text-sm">상태</th>
            <th className="px-4 py-3 text-left font-black uppercase text-sm">주문일시</th>
            <th className="px-4 py-3 text-center font-black uppercase text-sm">상세</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any, index: number) => {
            const finalAmount = (order.total_amount || 0) - (order.discount_amount || 0);
            const customerInfo = order.user_id
              ? `회원 (${order.user_id.slice(0, 8)}...)`
              : order.guest_email || '비회원';

            const orderItems = order.order_items || [];
            const itemsText = orderItems.length === 0
              ? '-'
              : orderItems.length === 1
                ? orderItems[0].product_name
                : `${orderItems[0].product_name} 외 ${orderItems.length - 1}건`;

            const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            const statusLabel = STATUS_LABELS[order.status] || order.status;

            return (
              <tr
                key={order.id}
                className={`border-t-2 border-neo-black hover:bg-neo-cream/50 transition-colors ${
                  index % 2 === 0 ? 'bg-neo-white' : 'bg-neo-cream/30'
                }`}
              >
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-bold text-neo-blue hover:underline"
                  >
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-4 text-sm">{customerInfo}</td>
                <td className="px-4 py-4 text-sm max-w-[200px] truncate">{itemsText}</td>
                <td className="px-4 py-4 text-right font-bold">{formatPrice(finalAmount)}</td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 border-2 border-neo-black font-bold text-xs uppercase ${statusColor.bg} ${statusColor.text}`}
                  >
                    {statusLabel}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-neo-black/70">{formatDate(order.created_at)}</td>
                <td className="px-4 py-4 text-center">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center justify-center w-8 h-8 bg-neo-blue text-neo-white border-2 border-neo-black hover:bg-neo-blue/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 로딩 스켈레톤
 */
function OrdersTableSkeleton() {
  return (
    <div className="border-3 border-neo-black overflow-hidden">
      <div className="bg-neo-black h-12" />
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`h-16 border-t-2 border-neo-black animate-pulse ${
            i % 2 === 0 ? 'bg-neo-cream/30' : 'bg-neo-cream/50'
          }`}
          data-testid="skeleton"
        />
      ))}
    </div>
  );
}

/**
 * Admin Orders Page
 */
export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const resolvedParams = await searchParams;

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neo-yellow border-3 border-neo-black flex items-center justify-center shadow-neo">
          <ShoppingCart className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-neo-black uppercase tracking-tight">
            주문 관리
          </h1>
          <p className="text-neo-black/60 font-medium">
            주문 목록을 조회하고 관리합니다
          </p>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <OrdersFilter
        defaultStatus={resolvedParams.status}
        defaultSearch={resolvedParams.search}
      />

      {/* 주문 목록 */}
      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
