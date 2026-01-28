/**
 * P7-T7.8: 쿠폰 목록 컴포넌트
 *
 * 기능:
 * - DataTable 기반 쿠폰 목록
 * - 필터링 및 검색
 * - 활성화/비활성화 토글
 * - 삭제 기능
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Calendar,
} from 'lucide-react';
import type { Coupon, CouponType, CouponStatus } from '@/types/coupon';

interface CouponsListProps {
  coupons: Coupon[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    type?: string;
    status?: string;
    search?: string;
    sort?: string;
  };
}

export default function CouponsList({
  coupons,
  pagination,
  filters,
}: CouponsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const getCouponStatus = (coupon: Coupon): CouponStatus => {
    const now = new Date();
    const endDate = new Date(coupon.end_at);

    if (endDate < now) return 'expired';
    if (!coupon.is_active) return 'inactive';
    return 'active';
  };

  const getUsageRate = (coupon: Coupon): number => {
    if (!coupon.usage_limit) return 0;
    return Math.round((coupon.used_count / coupon.usage_limit) * 100);
  };

  const formatDiscount = (coupon: Coupon): string => {
    switch (coupon.type) {
      case 'percent':
        return `${coupon.value}%`;
      case 'fixed':
        return `${coupon.value.toLocaleString()}원`;
      case 'free_shipping':
        return '무료배송';
      default:
        return '-';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/admin/coupons?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/admin/coupons?${params.toString()}`);
  };

  const handleToggleActive = async (couponId: string, isActive: boolean) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/coupons/${couponId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_active: !isActive }),
        });

        if (!response.ok) {
          throw new Error('상태 변경 실패');
        }

        toast({
          title: '상태 변경 완료',
          description: `쿠폰이 ${!isActive ? '활성화' : '비활성화'}되었습니다.`,
        });

        router.refresh();
      } catch (error) {
        toast({
          title: '오류 발생',
          description: error instanceof Error ? error.message : '알 수 없는 오류',
          variant: 'destructive',
        });
      }
    });
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/coupons/${couponId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('삭제 실패');
        }

        toast({
          title: '삭제 완료',
          description: '쿠폰이 삭제되었습니다.',
        });

        router.refresh();
      } catch (error) {
        toast({
          title: '오류 발생',
          description: error instanceof Error ? error.message : '알 수 없는 오류',
          variant: 'destructive',
        });
      }
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: '복사 완료',
      description: '쿠폰 코드가 클립보드에 복사되었습니다.',
    });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/coupons?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <Input
            placeholder="쿠폰 코드 또는 이름 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">검색</Button>
        </form>

        <div className="flex gap-2">
          <Select
            value={filters.type || ''}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="타입" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">전체</SelectItem>
              <SelectItem value="percent">정률 할인</SelectItem>
              <SelectItem value="fixed">정액 할인</SelectItem>
              <SelectItem value="free_shipping">무료배송</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status || ''}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">전체</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
              <SelectItem value="expired">만료</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sort || 'newest'}
            onValueChange={(value) => handleFilterChange('sort', value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">최신순</SelectItem>
              <SelectItem value="usage">사용순</SelectItem>
              <SelectItem value="end_date">종료일순</SelectItem>
            </SelectContent>
          </Select>

          <Link href="/admin/coupons/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              쿠폰 생성
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>코드</TableHead>
              <TableHead>쿠폰명</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>할인</TableHead>
              <TableHead>유효기간</TableHead>
              <TableHead>사용현황</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  쿠폰이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => {
                const status = getCouponStatus(coupon);
                const usageRate = getUsageRate(coupon);

                return (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-semibold">
                      <div className="flex items-center gap-2">
                        {coupon.code}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(coupon.code)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{coupon.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {coupon.type === 'percent'
                          ? '정률'
                          : coupon.type === 'fixed'
                          ? '정액'
                          : '무료배송'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatDiscount(coupon)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(coupon.end_at).toLocaleDateString()}</div>
                        {status === 'active' && (
                          <div className="text-muted-foreground text-xs">
                            {Math.ceil(
                              (new Date(coupon.end_at).getTime() - Date.now()) /
                                (1000 * 60 * 60 * 24)
                            )}
                            일 남음
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {coupon.used_count}
                          {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ''}
                        </div>
                        {coupon.usage_limit && (
                          <div className="text-muted-foreground text-xs">
                            {usageRate}% 사용
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={coupon.is_active && status !== 'expired'}
                          onCheckedChange={() =>
                            handleToggleActive(coupon.id, coupon.is_active)
                          }
                          disabled={status === 'expired' || isPending}
                        />
                        <Badge
                          variant={
                            status === 'active'
                              ? 'default'
                              : status === 'inactive'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {status === 'active'
                            ? '활성'
                            : status === 'inactive'
                            ? '비활성'
                            : '만료'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/coupons/${coupon.id}/edit`}>
                              <Pencil className="h-4 w-4 mr-2" />
                              수정
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(coupon.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            총 {pagination.total}개 ({pagination.page} / {pagination.totalPages} 페이지)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              이전
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
