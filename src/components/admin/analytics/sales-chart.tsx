'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface SalesChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  period: 'day' | 'week' | 'month';
}

export function SalesChart({ data, period }: SalesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      notation: 'compact',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'day':
        return '오늘';
      case 'week':
        return '이번 주';
      case 'month':
        return '이번 달';
      default:
        return '기간';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>매출 추이</CardTitle>
        <CardDescription>{getPeriodLabel()} 매출 및 주문 현황</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]" style={{ minHeight: '400px' }}>
          <ResponsiveContainer width="100%" height={400} minHeight={400}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={formatCurrency}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">
                            {payload[0].payload.date}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-[#3B82F6]">매출</span>
                          <span className="text-sm font-bold">
                            {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-[#8B5CF6]">주문</span>
                          <span className="text-sm font-bold">{payload[1].value}건</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                name="매출 (원)"
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="주문 (건)"
                dot={{ fill: '#8B5CF6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
