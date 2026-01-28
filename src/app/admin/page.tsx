/**
 * Admin Dashboard Page
 *
 * 관리자 대시보드
 * - Neo-Brutalism 디자인
 */

import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import {
  ShoppingCart,
  TrendingUp,
  Package,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
}

interface RevenueStats {
  total: number;
  today: number;
  thisMonth: number;
  thisYear: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  user_email: string;
}

async function getOrderStats(): Promise<OrderStats> {
  const supabase = await createServerClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('status');

  if (error || !orders) {
    return { total: 0, pending: 0, completed: 0, cancelled: 0 };
  }

  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };
}

async function getRevenueStats(): Promise<RevenueStats> {
  const supabase = await createServerClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .eq('status', 'completed');

  if (error || !orders) {
    return { total: 0, today: 0, thisMonth: 0, thisYear: 0 };
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  return {
    total: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
    today: orders
      .filter((o) => new Date(o.created_at) >= todayStart)
      .reduce((sum, order) => sum + (order.total_amount || 0), 0),
    thisMonth: orders
      .filter((o) => new Date(o.created_at) >= monthStart)
      .reduce((sum, order) => sum + (order.total_amount || 0), 0),
    thisYear: orders
      .filter((o) => new Date(o.created_at) >= yearStart)
      .reduce((sum, order) => sum + (order.total_amount || 0), 0),
  };
}

async function getRecentOrders(): Promise<RecentOrder[]> {
  const supabase = await createServerClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      order_number,
      created_at,
      status,
      total_amount,
      user_id,
      guest_email
    `
    )
    .order('created_at', { ascending: false })
    .limit(5);

  if (error || !orders) {
    return [];
  }

  const userIds = orders
    .filter((o) => o.user_id)
    .map((o) => o.user_id)
    .filter((id): id is string => Boolean(id));

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map((p) => [p.id, p.email]) || []);

  return orders.map((order) => ({
    id: order.id,
    order_number: order.order_number,
    created_at: order.created_at,
    status: order.status,
    total_amount: order.total_amount,
    user_email: order.user_id
      ? profileMap.get(order.user_id) || '알 수 없음'
      : order.guest_email || '비회원',
  }));
}

function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  pending: { bg: 'bg-neo-yellow', label: '대기' },
  paid: { bg: 'bg-neo-blue text-neo-white', label: '결제완료' },
  completed: { bg: 'bg-neo-green', label: '완료' },
  cancelled: { bg: 'bg-neo-orange', label: '취소' },
  refunded: { bg: 'bg-neo-pink', label: '환불' },
};

function DashboardLoading() {
  return (
    <div data-testid="dashboard-loading" className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-neo-white border-3 border-neo-black p-6 animate-pulse">
            <div className="h-4 bg-neo-cream w-20 mb-4" />
            <div className="h-8 bg-neo-cream w-24 mb-2" />
            <div className="h-3 bg-neo-cream w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const [orderStats, revenueStats, recentOrders] = await Promise.all([
    getOrderStats(),
    getRevenueStats(),
    getRecentOrders(),
  ]);

  const statsCards = [
    {
      title: '총 주문',
      value: orderStats.total.toString(),
      description: `대기: ${orderStats.pending} / 완료: ${orderStats.completed}`,
      icon: ShoppingCart,
      color: 'bg-neo-yellow',
    },
    {
      title: '총 매출',
      value: formatCurrency(revenueStats.total),
      description: '전체 기간',
      icon: DollarSign,
      color: 'bg-neo-green',
    },
    {
      title: '오늘 매출',
      value: formatCurrency(revenueStats.today),
      description: '오늘 발생한 매출',
      icon: TrendingUp,
      color: 'bg-neo-blue',
      trend: '+12.5%',
    },
    {
      title: '이번 달 매출',
      value: formatCurrency(revenueStats.thisMonth),
      description: '이번 달 누적',
      icon: Package,
      color: 'bg-neo-pink',
      trend: '+8.2%',
    },
  ];

  return (
    <>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="stats-grid">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-neo-white border-3 border-neo-black shadow-neo p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-neo-black/60 uppercase">
                  {stat.title}
                </span>
                <div className={`w-10 h-10 ${stat.color} border-2 border-neo-black flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-3xl font-black text-neo-black mb-1">{stat.value}</div>
              <p className="text-sm text-neo-black/60">{stat.description}</p>
              {stat.trend && (
                <div className="flex items-center mt-2 text-sm font-bold text-neo-green">
                  <ArrowUpRight className="h-4 w-4 mr-1" strokeWidth={2.5} />
                  {stat.trend}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Order Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6">
          <h2 className="font-black text-neo-black uppercase mb-4">빠른 작업</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/products"
              className="px-4 py-2 bg-neo-blue text-neo-white border-2 border-neo-black font-bold text-sm hover:bg-neo-blue/80 transition-colors"
            >
              상품 관리
            </Link>
            <Link
              href="/admin/orders"
              className="px-4 py-2 bg-neo-white border-2 border-neo-black font-bold text-sm hover:bg-neo-cream transition-colors"
            >
              주문 관리
            </Link>
            <Link
              href="/admin/categories"
              className="px-4 py-2 bg-neo-white border-2 border-neo-black font-bold text-sm hover:bg-neo-cream transition-colors"
            >
              카테고리 관리
            </Link>
          </div>
        </div>

        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6">
          <h2 className="font-black text-neo-black uppercase mb-4">주문 현황</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neo-cream border-2 border-neo-black">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-neo-orange" strokeWidth={2.5} />
                <span className="font-bold">대기 중</span>
              </div>
              <span className="px-3 py-1 bg-neo-orange border-2 border-neo-black font-black">
                {orderStats.pending}건
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neo-cream border-2 border-neo-black">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-neo-green" strokeWidth={2.5} />
                <span className="font-bold">완료</span>
              </div>
              <span className="px-3 py-1 bg-neo-green border-2 border-neo-black font-black">
                {orderStats.completed}건
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-neo-white border-3 border-neo-black shadow-neo">
        <div className="flex items-center justify-between p-6 border-b-3 border-neo-black">
          <h2 className="font-black text-neo-black uppercase">최근 주문</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-bold text-neo-blue hover:underline"
          >
            전체보기
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-neo-black/60 font-medium">
              주문이 없습니다.
            </div>
          ) : (
            <div className="space-y-3" data-testid="recent-orders-list">
              {recentOrders.map((order) => {
                const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-4 border-2 border-neo-black hover:bg-neo-cream/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-neo-black">{order.order_number}</span>
                        <span className={`px-2 py-0.5 text-xs font-bold border border-neo-black ${statusStyle.bg}`}>
                          {statusStyle.label}
                        </span>
                      </div>
                      <div className="text-sm text-neo-black/60">
                        {order.user_email} · {formatDate(order.created_at)}
                      </div>
                    </div>
                    <div className="font-black text-neo-black">
                      {formatCurrency(order.total_amount)}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neo-blue border-3 border-neo-black flex items-center justify-center shadow-neo">
          <LayoutDashboard className="w-6 h-6 text-neo-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-neo-black uppercase tracking-tight">
            대시보드
          </h1>
          <p className="text-neo-black/60 font-medium">
            Vibe Store 관리자 대시보드에 오신 것을 환영합니다
          </p>
        </div>
      </div>

      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
