/**
 * Orders Filter Component
 *
 * 주문 목록 필터 컴포넌트 (Client Component)
 * - Neo-Brutalism 디자인
 * - 상태별 필터링
 * - 주문번호 검색
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface OrdersFilterProps {
  defaultStatus?: string;
  defaultSearch?: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: '전체', color: 'bg-neo-cream' },
  { value: 'pending', label: '결제대기', color: 'bg-neo-yellow' },
  { value: 'paid', label: '결제완료', color: 'bg-neo-blue' },
  { value: 'completed', label: '처리완료', color: 'bg-neo-green' },
  { value: 'cancelled', label: '취소됨', color: 'bg-neo-orange' },
  { value: 'refunded', label: '환불됨', color: 'bg-neo-pink' },
];

export function OrdersFilter({ defaultStatus, defaultSearch }: OrdersFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(defaultSearch || '');
  const [activeStatus, setActiveStatus] = useState(defaultStatus || 'all');

  /**
   * URL 업데이트 함수
   */
  const updateQueryParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // 필터 변경 시 페이지를 1로 리셋
      params.delete('page');

      router.push(`/admin/orders?${params.toString()}`);
    },
    [router, searchParams]
  );

  /**
   * 상태 필터 변경
   */
  const handleStatusChange = (value: string) => {
    setActiveStatus(value);
    updateQueryParams('status', value);
  };

  /**
   * 검색 (Enter 키)
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateQueryParams('search', searchValue);
    }
  };

  /**
   * 검색 버튼 클릭
   */
  const handleSearchClick = () => {
    updateQueryParams('search', searchValue);
  };

  return (
    <div className="space-y-4">
      {/* 상태 필터 + 검색을 한 줄에 */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* 상태 필터 - 버튼 그룹 */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
            <span className="font-bold text-neo-black uppercase text-sm">상태:</span>
          </div>
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-3 py-2 border-3 border-neo-black font-bold text-xs uppercase transition-all
                ${activeStatus === option.value
                  ? `${option.color} shadow-neo-sm`
                  : 'bg-neo-white hover:bg-neo-cream'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 검색 */}
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neo-black/60" strokeWidth={2.5} />
            <input
              type="search"
              placeholder="주문번호 검색..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-4 py-2 bg-neo-white border-3 border-neo-black font-medium text-sm text-neo-black placeholder:text-neo-black/40 focus:outline-none focus:ring-2 focus:ring-neo-blue"
            />
          </div>
          <button
            onClick={handleSearchClick}
            className="px-4 py-2 bg-neo-blue text-neo-white border-3 border-neo-black font-bold text-sm uppercase hover:bg-neo-blue/80 transition-colors"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
}
