'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Shield, ShoppingBag } from 'lucide-react';

interface UserStatsProps {
  stats: {
    total: number;
    newThisPeriod: number;
    admins: number;
    customers: number;
  };
}

export function UserStats({ stats }: UserStatsProps) {
  const statCards = [
    {
      title: '전체 사용자',
      value: stats.total,
      description: '등록된 전체 사용자 수',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: '신규 사용자',
      value: stats.newThisPeriod,
      description: '선택한 기간 동안 가입',
      icon: UserPlus,
      color: 'text-green-500',
    },
    {
      title: '관리자',
      value: stats.admins,
      description: '관리자 권한 사용자',
      icon: Shield,
      color: 'text-purple-500',
    },
    {
      title: '고객',
      value: stats.customers,
      description: '일반 고객 사용자',
      icon: ShoppingBag,
      color: 'text-orange-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>사용자 통계</CardTitle>
        <CardDescription>사용자 현황 및 분포</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="flex flex-col gap-3 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </span>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
