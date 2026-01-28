/**
 * Admin Order Detail Page
 *
 * 관리자 주문 상세 페이지
 * - 주문 상세 정보 조회
 * - 주문 상태 변경
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OrderWithItems } from '@/types/order';

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 주문 상세 조회
 */
async function fetchOrder(id: string): Promise<OrderWithItems | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/orders/${id}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.data;
}

/**
 * 금액 포맷
 */
function formatPrice(price: number): string {
  return `${price.toLocaleString('ko-KR')}원`;
}

/**
 * 날짜 포맷
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

/**
 * Admin Order Detail Page
 */
export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await fetchOrder(id);

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
          <h2 className="text-xl font-semibold text-destructive">
            주문을 찾을 수 없습니다
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            주문이 삭제되었거나 존재하지 않습니다.
          </p>
          <Button variant="outline" asChild className="mt-4">
            <Link href="/admin/orders">주문 목록으로</Link>
          </Button>
        </div>
      </div>
    );
  }

  const finalAmount = order.total_amount - order.discount_amount;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{order.order_number}</h1>
          <p className="text-muted-foreground">주문 상세 정보</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/orders">목록으로</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 주문 정보 */}
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
                  <SelectTrigger aria-label="상태 변경">
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

        {/* 결제 정보 */}
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

      {/* 주문 상품 목록 */}
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
