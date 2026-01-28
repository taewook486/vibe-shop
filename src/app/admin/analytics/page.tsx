/**
 * Admin Analytics Page
 *
 * 관리자 통계 분석 페이지
 * - Neo-Brutalism 디자인
 */

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { SalesChart } from '@/components/admin/analytics/sales-chart';
import { OrdersChart } from '@/components/admin/analytics/orders-chart';
import { ProductsRanking } from '@/components/admin/analytics/products-ranking';
import { UserStats } from '@/components/admin/analytics/user-stats';

interface AnalyticsData {
  period: string;
  summary: {
    totalRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    avgOrderValue: number;
    newUsers: number;
    usersChange: number;
  };
  salesData: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  ordersByStatus: {
    pending: number;
    completed: number;
    cancelled: number;
    refunded: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  userStats: {
    total: number;
    newThisPeriod: number;
    admins: number;
    customers: number;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  const { data, error, isLoading } = useSWR<AnalyticsData>(
    `/api/admin/analytics?period=${period}`,
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString('ko-KR')}`;
  };

  const getChangeIndicator = (change: number) => {
    if (change === 0) return null;

    const isPositive = change > 0;
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
    const colorClass = isPositive ? 'text-neo-green' : 'text-neo-pink';
    const bgClass = isPositive ? 'bg-neo-green/20' : 'bg-neo-pink/20';

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold ${colorClass} ${bgClass} border border-neo-black`}>
        <Icon className="h-3 w-3" strokeWidth={2.5} />
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  const periodOptions = [
    { value: 'day', label: '오늘' },
    { value: 'week', label: '이번 주' },
    { value: 'month', label: '이번 달' },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <div className="bg-neo-pink/20 border-3 border-neo-pink p-8 flex flex-col items-center justify-center">
          <AlertCircle className="w-12 h-12 text-neo-pink mb-4" strokeWidth={2} />
          <p className="text-lg font-bold text-neo-black">데이터를 불러올 수 없습니다</p>
          <p className="text-sm text-neo-black/60 mt-2">잠시 후 다시 시도해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <PageHeader />

      {/* Period Selector */}
      <div className="flex gap-2">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setPeriod(option.value as typeof period)}
            className={`px-4 py-2 border-3 border-neo-black font-bold text-sm uppercase transition-all
              ${period === option.value
                ? 'bg-neo-blue text-neo-white shadow-neo translate-x-0.5 translate-y-0.5'
                : 'bg-neo-white hover:bg-neo-cream'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading || !data ? (
        <AnalyticsLoading />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="총 매출"
              value={formatCurrency(data.summary.totalRevenue)}
              description="이전 기간 대비"
              change={getChangeIndicator(data.summary.revenueChange)}
              icon={DollarSign}
              color="bg-neo-green"
            />
            <StatCard
              title="총 주문"
              value={`${data.summary.totalOrders.toLocaleString()}건`}
              description="이전 기간 대비"
              change={getChangeIndicator(data.summary.ordersChange)}
              icon={ShoppingCart}
              color="bg-neo-yellow"
            />
            <StatCard
              title="평균 주문 금액"
              value={formatCurrency(data.summary.avgOrderValue)}
              description="주문당 평균 매출액"
              icon={TrendingUp}
              color="bg-neo-blue"
            />
            <StatCard
              title="신규 사용자"
              value={`${data.summary.newUsers.toLocaleString()}명`}
              description="이전 기간 대비"
              change={getChangeIndicator(data.summary.usersChange)}
              icon={Users}
              color="bg-neo-pink"
            />
          </div>

          {/* Charts */}
          <div className="bg-neo-white border-3 border-neo-black shadow-neo">
            <SalesChart data={data.salesData} period={period} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="bg-neo-white border-3 border-neo-black shadow-neo">
              <OrdersChart data={data.ordersByStatus} />
            </div>
            <div className="bg-neo-white border-3 border-neo-black shadow-neo">
              <ProductsRanking products={data.topProducts} />
            </div>
          </div>

          <div className="bg-neo-white border-3 border-neo-black shadow-neo">
            <UserStats stats={data.userStats} />
          </div>
        </>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-neo-purple border-3 border-neo-black flex items-center justify-center shadow-neo">
        <BarChart3 className="w-6 h-6 text-neo-white" strokeWidth={2.5} />
      </div>
      <div>
        <h1 className="text-3xl font-black text-neo-black uppercase tracking-tight">
          통계 분석
        </h1>
        <p className="text-neo-black/60 font-medium">
          매출, 주문, 상품, 사용자 통계를 한눈에 확인하세요
        </p>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  change?: React.ReactNode;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, description, change, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-neo-black/60 uppercase">{title}</span>
        <div className={`w-10 h-10 ${color} border-2 border-neo-black flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
        </div>
      </div>
      <div className="text-3xl font-black text-neo-black mb-1">{value}</div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-neo-black/60">{description}</p>
        {change}
      </div>
    </div>
  );
}

function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-neo-white border-3 border-neo-black p-6 animate-pulse">
            <div className="h-4 bg-neo-cream w-20 mb-4" />
            <div className="h-8 bg-neo-cream w-24 mb-2" />
            <div className="h-3 bg-neo-cream w-32" />
          </div>
        ))}
      </div>
      <div className="bg-neo-white border-3 border-neo-black h-[450px] animate-pulse" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bg-neo-white border-3 border-neo-black h-[350px] animate-pulse" />
        <div className="bg-neo-white border-3 border-neo-black h-[350px] animate-pulse" />
      </div>
    </div>
  );
}
