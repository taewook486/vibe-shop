/**
 * P7-T7.11: 재고 변경 이력 컴포넌트
 *
 * 기능:
 * - 변경 타입별 필터
 * - 기간별 조회
 * - 상세 정보 표시
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, TrendingDown, Edit3, Loader2 } from 'lucide-react';

interface InventoryLog {
  id: string;
  product_id: string;
  type: 'in' | 'out' | 'adjust';
  quantity: number;
  reason: string | null;
  reference_id: string | null;
  reference_type: string | null;
  stock_before: number;
  stock_after: number;
  created_at: string;
  creator?: {
    id: string;
    email: string;
  } | null;
}

interface InventoryHistoryProps {
  productId: string;
}

function getLogTypeBadge(type: string) {
  switch (type) {
    case 'in':
      return (
        <Badge variant="default" className="bg-green-600 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          입고
        </Badge>
      );
    case 'out':
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          출고
        </Badge>
      );
    case 'adjust':
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Edit3 className="w-3 h-3" />
          조정
        </Badge>
      );
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
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

export default function InventoryHistory({ productId }: InventoryHistoryProps) {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // 재고 이력 조회
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          product_id: productId,
          limit: '50',
        });

        if (typeFilter !== 'all') {
          params.set('type', typeFilter);
        }

        const response = await fetch(
          `/api/admin/inventory/history?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error('재고 이력 조회 실패');
        }

        const data = await response.json();
        setLogs(data.data || []);
      } catch (error) {
        console.error('재고 이력 조회 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [productId, typeFilter]);

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">변경 타입</label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="in">입고</SelectItem>
            <SelectItem value="out">출고</SelectItem>
            <SelectItem value="adjust">조정</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 이력 테이블 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          재고 변경 이력이 없습니다.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>일시</TableHead>
                <TableHead className="text-center">타입</TableHead>
                <TableHead className="text-center">변경량</TableHead>
                <TableHead className="text-center">변경 전</TableHead>
                <TableHead className="text-center">변경 후</TableHead>
                <TableHead>사유</TableHead>
                <TableHead>처리자</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {formatDate(log.created_at)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getLogTypeBadge(log.type)}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    <span
                      className={
                        log.quantity > 0
                          ? 'text-green-600'
                          : log.quantity < 0
                          ? 'text-red-600'
                          : ''
                      }
                    >
                      {log.quantity > 0 ? '+' : ''}
                      {log.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {log.stock_before}
                  </TableCell>
                  <TableCell className="text-center font-mono font-medium">
                    {log.stock_after}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.reason || '-'}
                    {log.reference_type && (
                      <div className="text-xs text-muted-foreground">
                        참조: {log.reference_type}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.creator?.email || '시스템'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
