/**
 * P7-T7.11: 재고 목록 컴포넌트
 *
 * 기능:
 * - 상품별 재고 현황 표시
 * - 저재고 경고 표시
 * - 검색 및 필터링
 * - 재고 조정 모달 연동
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  Search,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Archive,
  Edit,
} from 'lucide-react';
import InventoryAdjustment from './inventory-adjustment';

interface Product {
  id: string;
  name: string;
  slug: string;
  stock: number;
  stock_alert_threshold: number;
  status: string;
  price: number;
}

interface InventoryStats {
  total_products: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_stock_value: number;
}

interface InventoryListProps {
  products: Product[];
  stats: InventoryStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    low_stock?: boolean;
    search?: string;
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

function getStockBadge(stock: number, threshold: number) {
  if (stock === 0) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        품절
      </Badge>
    );
  }

  if (stock <= threshold) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-600">
        <AlertTriangle className="w-3 h-3" />
        부족
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-green-600">
      정상
    </Badge>
  );
}

export default function InventoryList({
  products,
  stats,
  pagination,
  filters,
}: InventoryListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);

  // 검색 처리
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/admin/inventory?${params.toString()}`);
  };

  // 저재고 필터 토글
  const toggleLowStockFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.low_stock) {
      params.delete('low_stock');
    } else {
      params.set('low_stock', 'true');
    }
    params.set('page', '1');
    router.push(`/admin/inventory?${params.toString()}`);
  };

  // 재고 조정 모달 열기
  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product);
    setIsAdjustmentOpen(true);
  };

  // 재고 조정 성공 후 새로고침
  const handleAdjustmentSuccess = () => {
    setIsAdjustmentOpen(false);
    setSelectedProduct(null);
    router.refresh();
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/inventory?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 상품</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_products}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">저재고 상품</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.low_stock_count}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">품절 상품</CardTitle>
            <Archive className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.out_of_stock_count}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 재고 가치</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.total_stock_value)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="상품명 또는 슬러그 검색..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="max-w-md"
              />
              <Button onClick={handleSearch} variant="secondary">
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </div>
            <Button
              variant={filters.low_stock ? 'default' : 'outline'}
              onClick={toggleLowStockFilter}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              저재고만 보기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 재고 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>재고 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상품명</TableHead>
                <TableHead className="text-center">현재 재고</TableHead>
                <TableHead className="text-center">경고 기준</TableHead>
                <TableHead className="text-center">상태</TableHead>
                <TableHead className="text-right">단가</TableHead>
                <TableHead className="text-right">재고 가치</TableHead>
                <TableHead className="text-center">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    재고 데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="hover:underline"
                      >
                        {product.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {product.slug}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {product.stock}
                    </TableCell>
                    <TableCell className="text-center font-mono text-muted-foreground">
                      {product.stock_alert_threshold}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStockBadge(product.stock, product.stock_alert_threshold)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(product.stock * product.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAdjustStock(product)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        조정
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                이전
              </Button>
              <span className="text-sm text-muted-foreground">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                다음
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 재고 조정 모달 */}
      {selectedProduct && (
        <InventoryAdjustment
          product={selectedProduct}
          isOpen={isAdjustmentOpen}
          onClose={() => {
            setIsAdjustmentOpen(false);
            setSelectedProduct(null);
          }}
          onSuccess={handleAdjustmentSuccess}
        />
      )}
    </div>
  );
}
