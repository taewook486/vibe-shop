'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OrdersChartProps {
  data: {
    pending: number;
    completed: number;
    cancelled: number;
    refunded: number;
  };
}

const COLORS = {
  pending: '#F59E0B', // Vibe Amber
  completed: '#3B82F6', // Vibe Blue
  cancelled: '#EF4444', // Red
  refunded: '#8B5CF6', // Vibe Violet
};

const STATUS_LABELS = {
  pending: '대기 중',
  completed: '완료',
  cancelled: '취소',
  refunded: '환불',
};

export function OrdersChart({ data }: OrdersChartProps) {
  const chartData = Object.entries(data)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status as keyof typeof STATUS_LABELS],
      value: count,
      status,
    }))
    .filter((item) => item.value > 0);

  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>주문 현황</CardTitle>
          <CardDescription>주문 상태별 분포</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            주문 데이터가 없습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>주문 현황</CardTitle>
        <CardDescription>주문 상태별 분포</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.status as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium">{data.name}</span>
                          <span className="text-sm font-bold">{data.value}건</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          전체의 {((data.value / total) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
