/**
 * Order Status Badge Component
 *
 * 주문 상태를 시각적으로 표시하는 배지 컴포넌트
 */

import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  pending: {
    label: '결제대기',
    variant: 'outline',
  },
  paid: {
    label: '결제완료',
    variant: 'default',
  },
  completed: {
    label: '처리완료',
    variant: 'secondary',
  },
  cancelled: {
    label: '취소됨',
    variant: 'destructive',
  },
  refunded: {
    label: '환불됨',
    variant: 'destructive',
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
