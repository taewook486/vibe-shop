/**
 * Demo: Admin Orders Page
 *
 * 데모 상태:
 * - list: 주문 목록
 * - detail: 주문 상세
 * - filter: 필터링된 목록
 * - empty: 빈 목록
 */

'use client';

import { useState } from 'react';
import { OrderStatusBadge } from '@/components/admin/order-status-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OrderStatus, OrderWithItems } from '@/types/order';

const mockOrders: OrderWithItems[] = [
  {
    id: '1',
    order_number: 'ORD-20260125-0001',
    user_id: 'user-1',
    guest_email: null,
    status: 'paid',
    total_amount: 50000,
    discount_amount: 0,
    payment_info: {
      method: 'card',
      card_company: '신한카드',
      card_number: '1234-****-****-5678',
    },
    paid_at: '2026-01-25T10:00:00Z',
    created_at: '2026-01-25T09:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
    order_items: [
      {
        id: 'item-1',
        order_id: '1',
        product_id: 'product-1',
        product_name: 'Next.js 실전 가이드',
        price: 50000,
        quantity: 1,
        created_at: '2026-01-25T09:00:00Z',
      },
    ],
  },
  {
    id: '2',
    order_number: 'ORD-20260125-0002',
    user_id: null,
    guest_email: 'guest@example.com',
    status: 'pending',
    total_amount: 30000,
    discount_amount: 5000,
    payment_info: {},
    paid_at: null,
    created_at: '2026-01-25T11:00:00Z',
    updated_at: '2026-01-25T11:00:00Z',
    order_items: [
      {
        id: 'item-2',
        order_id: '2',
        product_id: 'product-2',
        product_name: 'React 패턴집',
        price: 30000,
        quantity: 1,
        created_at: '2026-01-25T11:00:00Z',
      },
    ],
  },
  {
    id: '3',
    order_number: 'ORD-20260125-0003',
    user_id: 'user-2',
    guest_email: null,
    status: 'completed',
    total_amount: 80000,
    discount_amount: 10000,
    payment_info: {
      method: 'card',
      card_company: '국민카드',
      card_number: '9876-****-****-1234',
    },
    paid_at: '2026-01-25T12:00:00Z',
    created_at: '2026-01-25T11:30:00Z',
    updated_at: '2026-01-25T13:00:00Z',
    order_items: [
      {
        id: 'item-3',
        order_id: '3',
        product_id: 'product-3',
        product_name: 'TypeScript 완벽 가이드',
        price: 40000,
        quantity: 2,
        created_at: '2026-01-25T11:30:00Z',
      },
    ],
  },
  {
    id: '4',
    order_number: 'ORD-20260125-0004',
    user_id: 'user-3',
    guest_email: null,
    status: 'cancelled',
    total_amount: 25000,
    discount_amount: 0,
    payment_info: {},
    paid_at: null,
    created_at: '2026-01-25T14:00:00Z',
    updated_at: '2026-01-25T14:30:00Z',
    order_items: [
      {
        id: 'item-4',
        order_id: '4',
        product_id: 'product-4',
        product_name: 'Tailwind CSS 실전',
        price: 25000,
        quantity: 1,
        created_at: '2026-01-25T14:00:00Z',
      },
    ],
  },
];

function formatPrice(price: number): string {
  return `${price.toLocaleString('ko-KR')}원`;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function OrdersList({ orders }: { orders: OrderWithItems[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">주문이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>주문번호</TableHead>
            <TableHead>주문자</TableHead>
            <TableHead>상품</TableHead>
            <TableHead>금액</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>주문일시</TableHead>
            <TableHead className="text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const finalAmount = order.total_amount - order.discount_amount;
            const customerInfo = order.user_id
              ? `회원 (ID: ${order.user_id})`
              : order.guest_email;

            const itemsText =
              order.order_items.length === 1
                ? order.order_items[0].product_name
                : `${order.order_items[0].product_name} 외 ${
                    order.order_items.length - 1
                  }건`;

            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.order_number}
                </TableCell>
                <TableCell>{customerInfo}</TableCell>
                <TableCell>{itemsText}</TableCell>
                <TableCell>{formatPrice(finalAmount)}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    상세
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function OrderDetail({ order }: { order: OrderWithItems }) {
  const finalAmount = order.total_amount - order.discount_amount;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>주문 정보</CardTitle>
            <CardDescription>주문 기본 정보</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                주문번호
              </dt>
              <dd className="mt-1 text-sm">{order.order_number}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                주문 상태
              </dt>
              <dd className="mt-1">
                <OrderStatusBadge status={order.status} />
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                주문자
              </dt>
              <dd className="mt-1 text-sm">
                {order.user_id
                  ? `회원 (ID: ${order.user_id})`
                  : order.guest_email || '-'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                주문일시
              </dt>
              <dd className="mt-1 text-sm">{formatDate(order.created_at)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                결제일시
              </dt>
              <dd className="mt-1 text-sm">{formatDate(order.paid_at)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                상태 변경
              </dt>
              <dd className="mt-1">
                <Select defaultValue={order.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">결제대기</SelectItem>
                    <SelectItem value="paid">결제완료</SelectItem>
                    <SelectItem value="completed">처리완료</SelectItem>
                    <SelectItem value="cancelled">취소됨</SelectItem>
                    <SelectItem value="refunded">환불됨</SelectItem>
                  </SelectContent>
                </Select>
              </dd>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>결제 정보</CardTitle>
            <CardDescription>결제 상세 정보</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                상품 금액
              </dt>
              <dd className="mt-1 text-sm">{formatPrice(order.total_amount)}</dd>
            </div>

            {order.discount_amount > 0 && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  할인 금액
                </dt>
                <dd className="mt-1 text-sm text-destructive">
                  -{formatPrice(order.discount_amount)}
                </dd>
              </div>
            )}

            <div className="border-t pt-4">
              <dt className="text-sm font-medium text-muted-foreground">
                최종 결제 금액
              </dt>
              <dd className="mt-1 text-lg font-bold">
                {formatPrice(finalAmount)}
              </dd>
            </div>

            {order.payment_info && Object.keys(order.payment_info).length > 0 && (
              <>
                {order.payment_info.method && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      결제 수단
                    </dt>
                    <dd className="mt-1 text-sm">{order.payment_info.method}</dd>
                  </div>
                )}

                {order.payment_info.card_company && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      카드사
                    </dt>
                    <dd className="mt-1 text-sm">
                      {order.payment_info.card_company}
                    </dd>
                  </div>
                )}

                {order.payment_info.card_number && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      카드번호
                    </dt>
                    <dd className="mt-1 text-sm font-mono">
                      {order.payment_info.card_number}
                    </dd>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>주문 상품</CardTitle>
          <CardDescription>
            총 {order.order_items.length}개 상품
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    수량: {item.quantity}개
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    개당 {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DemoAdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Demo: 관리자 주문 관리</h1>
        <p className="text-muted-foreground">
          주문 목록, 상세, 필터, 빈 상태 데모
        </p>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">주문 목록</TabsTrigger>
          <TabsTrigger value="detail">주문 상세</TabsTrigger>
          <TabsTrigger value="filter">필터링</TabsTrigger>
          <TabsTrigger value="empty">빈 목록</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>주문 목록</CardTitle>
              <CardDescription>전체 주문 목록</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersList orders={mockOrders} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detail" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>주문 상세</CardTitle>
              <CardDescription>
                {mockOrders[0].order_number} 상세 정보
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderDetail order={mockOrders[0]} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>필터링</CardTitle>
              <CardDescription>상태 및 검색 필터 적용</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as OrderStatus | 'all')
                  }
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="pending">결제대기</SelectItem>
                    <SelectItem value="paid">결제완료</SelectItem>
                    <SelectItem value="completed">처리완료</SelectItem>
                    <SelectItem value="cancelled">취소됨</SelectItem>
                    <SelectItem value="refunded">환불됨</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="search"
                  placeholder="주문번호로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <OrdersList orders={filteredOrders} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>빈 목록</CardTitle>
              <CardDescription>주문이 없는 상태</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersList orders={[]} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
