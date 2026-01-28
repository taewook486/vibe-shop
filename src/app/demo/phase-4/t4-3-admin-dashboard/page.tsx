'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingCart,
  TrendingUp,
  Package,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle,
} from 'lucide-react';

type DemoState = 'loading' | 'with-data' | 'empty-state';

const mockOrders = [
  {
    id: '1',
    order_number: 'ORD-20260125-0001',
    created_at: '2026-01-25T10:30:00Z',
    status: 'completed',
    total_amount: 49000,
    user_email: 'customer1@example.com',
  },
  {
    id: '2',
    order_number: 'ORD-20260125-0002',
    created_at: '2026-01-25T11:15:00Z',
    status: 'pending',
    total_amount: 89000,
    user_email: 'customer2@example.com',
  },
  {
    id: '3',
    order_number: 'ORD-20260125-0003',
    created_at: '2026-01-25T12:00:00Z',
    status: 'completed',
    total_amount: 129000,
    user_email: '비회원',
  },
  {
    id: '4',
    order_number: 'ORD-20260124-0098',
    created_at: '2026-01-24T16:45:00Z',
    status: 'cancelled',
    total_amount: 59000,
    user_email: 'customer3@example.com',
  },
  {
    id: '5',
    order_number: 'ORD-20260124-0097',
    created_at: '2026-01-24T14:20:00Z',
    status: 'completed',
    total_amount: 79000,
    user_email: 'customer4@example.com',
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

function getStatusBadge(status: string) {
  const variants: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    pending: { label: '대기 중', variant: 'secondary' },
    completed: { label: '완료', variant: 'default' },
    cancelled: { label: '취소', variant: 'destructive' },
    refunded: { label: '환불', variant: 'outline' },
  };

  const config = variants[status] || { label: status, variant: 'outline' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function LoadingState() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <div className="mt-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

function WithDataState() {
  const orderStats = {
    total: 147,
    pending: 12,
    completed: 128,
    cancelled: 7,
  };

  const revenueStats = {
    total: 12_450_000,
    today: 267_000,
    thisMonth: 4_850_000,
    thisYear: 12_450_000,
  };

  const statsCards = [
    {
      title: '총 주문',
      value: orderStats.total,
      description: `대기: ${orderStats.pending} / 완료: ${orderStats.completed}`,
      icon: ShoppingCart,
      trend: null,
    },
    {
      title: '총 매출',
      value: formatCurrency(revenueStats.total),
      description: '전체 기간',
      icon: DollarSign,
      trend: null,
    },
    {
      title: '오늘 매출',
      value: formatCurrency(revenueStats.today),
      description: '오늘 발생한 매출',
      icon: TrendingUp,
      trend: '+12.5%',
    },
    {
      title: '이번 달 매출',
      value: formatCurrency(revenueStats.thisMonth),
      description: '이번 달 누적',
      icon: Package,
      trend: '+8.2%',
    },
  ];

  return (
    <>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                {stat.trend && (
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">빠른 작업</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm">상품 관리</Button>
            <Button size="sm" variant="outline">
              주문 관리
            </Button>
            <Button size="sm" variant="outline">
              카테고리 관리
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">주문 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>대기 중</span>
                </div>
                <span className="font-semibold">{orderStats.pending}건</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>완료</span>
                </div>
                <span className="font-semibold">{orderStats.completed}건</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>최근 주문</CardTitle>
            <Button variant="outline" size="sm">
              전체보기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{order.order_number}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.user_email} · {formatDate(order.created_at)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(order.total_amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function EmptyState() {
  const statsCards = [
    {
      title: '총 주문',
      value: 0,
      description: '대기: 0 / 완료: 0',
      icon: ShoppingCart,
    },
    {
      title: '총 매출',
      value: formatCurrency(0),
      description: '전체 기간',
      icon: DollarSign,
    },
    {
      title: '오늘 매출',
      value: formatCurrency(0),
      description: '오늘 발생한 매출',
      icon: TrendingUp,
    },
    {
      title: '이번 달 매출',
      value: formatCurrency(0),
      description: '이번 달 누적',
      icon: Package,
    },
  ];

  return (
    <>
      {/* Stats Grid - Empty */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">빠른 작업</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm">상품 관리</Button>
            <Button size="sm" variant="outline">
              주문 관리
            </Button>
            <Button size="sm" variant="outline">
              카테고리 관리
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">주문 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>대기 중</span>
                </div>
                <span className="font-semibold">0건</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>완료</span>
                </div>
                <span className="font-semibold">0건</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty Recent Orders */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>최근 주문</CardTitle>
            <Button variant="outline" size="sm" disabled>
              전체보기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">주문이 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-2">
              첫 번째 주문을 기다리고 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function AdminDashboardDemo() {
  const [state, setState] = useState<DemoState>('with-data');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Demo Controls */}
        <Card className="mb-8 border-2 border-vibe-blue">
          <CardHeader>
            <CardTitle>Demo: 관리자 대시보드 (P4-T4.4)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  주문 현황, 매출 요약, 최근 주문 목록을 확인할 수 있는 관리자 대시보드입니다.
                </p>
                <Tabs value={state} onValueChange={(v) => setState(v as DemoState)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="loading">Loading</TabsTrigger>
                    <TabsTrigger value="with-data">With Data</TabsTrigger>
                    <TabsTrigger value="empty-state">Empty State</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="text-sm space-y-2 text-muted-foreground">
                <p>
                  <strong>Loading:</strong> 데이터 로딩 중 스켈레톤 UI
                </p>
                <p>
                  <strong>With Data:</strong> 통계 카드, 주문 현황, 최근 주문 목록
                </p>
                <p>
                  <strong>Empty State:</strong> 주문이 없는 상태
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Content */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">대시보드</h1>
            <p className="text-muted-foreground mt-2">
              Vibe Store 관리자 대시보드에 오신 것을 환영합니다.
            </p>
          </div>

          {state === 'loading' && <LoadingState />}
          {state === 'with-data' && <WithDataState />}
          {state === 'empty-state' && <EmptyState />}
        </div>
      </div>
    </div>
  );
}
