'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package } from 'lucide-react';

interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

interface ProductsRankingProps {
  products: TopProduct[];
}

export function ProductsRanking({ products }: ProductsRankingProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      notation: 'compact',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankBadge = (index: number) => {
    const rank = index + 1;
    if (rank === 1) return <Badge className="bg-yellow-500 hover:bg-yellow-600">1위</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400 hover:bg-gray-500">2위</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600 hover:bg-amber-700">3위</Badge>;
    return <Badge variant="outline">{rank}위</Badge>;
  };

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>인기 상품 TOP 10</CardTitle>
          <CardDescription>매출액 기준 상위 상품</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 mb-3 opacity-20" />
              <p>판매 데이터가 없습니다.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          인기 상품 TOP 10
        </CardTitle>
        <CardDescription>매출액 기준 상위 상품</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getRankBadge(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    판매량: {product.quantity}개
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="font-bold text-lg">
                  {formatCurrency(product.revenue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
