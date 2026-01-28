/**
 * P7-T7.3: 관리자 사용자 목록 컴포넌트
 *
 * 기능:
 * - 사용자 목록 표시 (테이블 형식)
 * - 검색 및 필터 (이메일, 닉네임, 등급, 상태)
 * - 정렬 (가입일, 주문 수, 총 구매금액)
 * - 사용자 상태 변경 (활성/정지)
 * - 대량 작업 (등급 변경, 상태 변경)
 * - Neo-Brutalism 디자인
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MoreVertical, Edit, Ban, Users, Filter, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AdminUser } from '@/types/admin';

interface UsersListProps {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search?: string;
    grade?: string;
    isBlocked?: string;
    sort?: string;
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateString));
}

const GRADE_STYLES: Record<string, { label: string; bg: string }> = {
  bronze: { label: '브론즈', bg: 'bg-neo-cream' },
  silver: { label: '실버', bg: 'bg-gray-300' },
  gold: { label: '골드', bg: 'bg-neo-yellow' },
  vip: { label: 'VIP', bg: 'bg-neo-pink' },
};

export default function UsersList({
  users,
  pagination,
  filters,
}: UsersListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [isPending, startTransition] = useTransition();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filters.grade) params.set('grade', filters.grade);
    if (filters.isBlocked) params.set('isBlocked', filters.isBlocked);
    if (filters.sort) params.set('sort', filters.sort);

    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`);
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (key === 'grade' && value !== 'all') params.set('grade', value);
    else if (filters.grade && key !== 'grade') params.set('grade', filters.grade);
    if (key === 'isBlocked' && value !== 'all') params.set('isBlocked', value);
    else if (filters.isBlocked && key !== 'isBlocked')
      params.set('isBlocked', filters.isBlocked);
    if (key === 'sort') params.set('sort', value);
    else if (filters.sort && key !== 'sort') params.set('sort', filters.sort);

    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`);
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleBulkGradeChange = async (grade: 'bronze' | 'silver' | 'gold' | 'vip') => {
    if (selectedUsers.length === 0) {
      toast({
        title: '사용자 선택 필요',
        description: '등급을 변경할 사용자를 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`${selectedUsers.length}명의 등급을 ${GRADE_STYLES[grade]?.label || grade}로 변경하시겠습니까?`)) {
      return;
    }

    try {
      const promises = selectedUsers.map((userId) =>
        fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grade }),
        })
      );

      await Promise.all(promises);

      toast({
        title: '등급 변경 완료',
        description: `${selectedUsers.length}명의 등급이 변경되었습니다.`,
      });

      setSelectedUsers([]);
      router.refresh();
    } catch (error) {
      toast({
        title: '등급 변경 실패',
        description: '등급 변경 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleBulkBlockChange = async (isBlocked: boolean) => {
    if (selectedUsers.length === 0) {
      toast({
        title: '사용자 선택 필요',
        description: '상태를 변경할 사용자를 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }

    const action = isBlocked ? '정지' : '활성화';
    if (!confirm(`${selectedUsers.length}명을 ${action} 처리하시겠습니까?`)) {
      return;
    }

    try {
      const promises = selectedUsers.map((userId) =>
        fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isBlocked }),
        })
      );

      await Promise.all(promises);

      toast({
        title: `${action} 완료`,
        description: `${selectedUsers.length}명이 ${action} 처리되었습니다.`,
      });

      setSelectedUsers([]);
      router.refresh();
    } catch (error) {
      toast({
        title: `${action} 실패`,
        description: `${action} 처리 중 오류가 발생했습니다.`,
        variant: 'destructive',
      });
    }
  };

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleToggleBlock = async (user: AdminUser) => {
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isBlocked: !user.is_blocked,
        }),
      });
      toast({
        title: user.is_blocked ? '활성화 완료' : '정지 완료',
        description: `사용자가 ${user.is_blocked ? '활성화' : '정지'}되었습니다.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: '오류',
        description: '상태 변경 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters & Search */}
      <div className="bg-neo-white border-3 border-neo-black p-4 shadow-neo">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neo-black/60" strokeWidth={2.5} />
              <input
                type="search"
                placeholder="이메일 또는 닉네임 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-neo-white border-3 border-neo-black font-medium text-sm text-neo-black placeholder:text-neo-black/40 focus:outline-none focus:ring-2 focus:ring-neo-blue"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isPending}
              className="px-4 py-2 bg-neo-blue text-neo-white border-3 border-neo-black font-bold text-sm uppercase hover:bg-neo-blue/80 transition-colors disabled:opacity-50"
            >
              검색
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-neo-black" strokeWidth={2.5} />

            <select
              value={filters.grade || 'all'}
              onChange={(e) => handleFilterChange('grade', e.target.value)}
              className="px-3 py-2 bg-neo-white border-3 border-neo-black font-bold text-xs uppercase focus:outline-none"
            >
              <option value="all">전체 등급</option>
              <option value="bronze">브론즈</option>
              <option value="silver">실버</option>
              <option value="gold">골드</option>
              <option value="vip">VIP</option>
            </select>

            <select
              value={filters.isBlocked || 'all'}
              onChange={(e) => handleFilterChange('isBlocked', e.target.value)}
              className="px-3 py-2 bg-neo-white border-3 border-neo-black font-bold text-xs uppercase focus:outline-none"
            >
              <option value="all">전체 상태</option>
              <option value="false">활성</option>
              <option value="true">정지</option>
            </select>

            <select
              value={filters.sort || 'newest'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-3 py-2 bg-neo-white border-3 border-neo-black font-bold text-xs uppercase focus:outline-none"
            >
              <option value="newest">최근 가입순</option>
              <option value="total_spent">총 구매금액순</option>
              <option value="total_orders">주문 수순</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-neo-blue/10 border-3 border-neo-blue">
            <span className="font-bold text-sm">
              {selectedUsers.length}명 선택됨
            </span>
            <div className="flex gap-2 ml-auto">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkGradeChange(e.target.value as any);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-1 bg-neo-white border-3 border-neo-black font-bold text-xs uppercase focus:outline-none"
              >
                <option value="">등급 변경</option>
                <option value="bronze">브론즈로 변경</option>
                <option value="silver">실버로 변경</option>
                <option value="gold">골드로 변경</option>
                <option value="vip">VIP로 변경</option>
              </select>
              <button
                onClick={() => handleBulkBlockChange(true)}
                className="px-3 py-1 bg-neo-orange text-neo-black border-3 border-neo-black font-bold text-xs uppercase hover:bg-neo-orange/80"
              >
                선택 정지
              </button>
              <button
                onClick={() => handleBulkBlockChange(false)}
                className="px-3 py-1 bg-neo-green text-neo-black border-3 border-neo-black font-bold text-xs uppercase hover:bg-neo-green/80"
              >
                선택 활성화
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="border-3 border-dashed border-neo-black/30 p-12 text-center">
          <Users className="w-12 h-12 text-neo-black/30 mx-auto mb-4" strokeWidth={2} />
          <p className="text-neo-black/60 font-bold">등록된 사용자가 없습니다</p>
        </div>
      ) : (
        <div className="border-3 border-neo-black overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-neo-black text-neo-white">
                <th className="px-4 py-3 w-12">
                  <button
                    onClick={() => handleSelectAll(selectedUsers.length !== users.length)}
                    className={`w-5 h-5 border-2 border-neo-white flex items-center justify-center ${
                      selectedUsers.length === users.length ? 'bg-neo-white' : ''
                    }`}
                  >
                    {selectedUsers.length === users.length && (
                      <Check className="w-3 h-3 text-neo-black" strokeWidth={3} />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-black uppercase text-sm">이메일</th>
                <th className="px-4 py-3 text-left font-black uppercase text-sm">닉네임</th>
                <th className="px-4 py-3 text-center font-black uppercase text-sm">등급</th>
                <th className="px-4 py-3 text-center font-black uppercase text-sm">상태</th>
                <th className="px-4 py-3 text-right font-black uppercase text-sm">총 구매</th>
                <th className="px-4 py-3 text-right font-black uppercase text-sm">적립금</th>
                <th className="px-4 py-3 text-left font-black uppercase text-sm">가입일</th>
                <th className="px-4 py-3 text-center font-black uppercase text-sm">액션</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const gradeStyle = GRADE_STYLES[user.grade] || GRADE_STYLES.bronze;

                return (
                  <tr
                    key={user.id}
                    className={`border-t-2 border-neo-black hover:bg-neo-cream/50 transition-colors ${
                      index % 2 === 0 ? 'bg-neo-white' : 'bg-neo-cream/30'
                    }`}
                  >
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleSelectUser(user.id, !selectedUsers.includes(user.id))}
                        className={`w-5 h-5 border-3 border-neo-black flex items-center justify-center ${
                          selectedUsers.includes(user.id) ? 'bg-neo-blue' : 'bg-neo-white'
                        }`}
                      >
                        {selectedUsers.includes(user.id) && (
                          <Check className="w-3 h-3 text-neo-white" strokeWidth={3} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4 font-bold">{user.email}</td>
                    <td className="px-4 py-4">{user.nickname || '-'}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block px-2 py-1 border-2 border-neo-black font-bold text-xs uppercase ${gradeStyle.bg}`}>
                        {gradeStyle.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block px-2 py-1 border-2 border-neo-black font-bold text-xs uppercase ${
                        user.is_blocked ? 'bg-neo-pink' : 'bg-neo-green'
                      }`}>
                        {user.is_blocked ? '정지' : '활성'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold">
                      {formatCurrency(user.total_order_amount)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {user.points.toLocaleString()}P
                    </td>
                    <td className="px-4 py-4 text-sm text-neo-black/70">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-4 py-4 text-center relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                        className="inline-flex items-center justify-center w-8 h-8 bg-neo-cream border-2 border-neo-black hover:bg-neo-yellow transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" strokeWidth={2.5} />
                      </button>

                      {openDropdown === user.id && (
                        <div className="absolute right-4 top-full mt-1 z-10 bg-neo-white border-3 border-neo-black shadow-neo min-w-[140px]">
                          <button
                            onClick={() => {
                              setOpenDropdown(null);
                              handleViewUser(user.id);
                            }}
                            className="w-full px-4 py-2 text-left font-bold text-sm flex items-center gap-2 hover:bg-neo-cream"
                          >
                            <Edit className="w-4 h-4" strokeWidth={2.5} />
                            상세보기
                          </button>
                          <button
                            onClick={() => {
                              setOpenDropdown(null);
                              handleToggleBlock(user);
                            }}
                            className={`w-full px-4 py-2 text-left font-bold text-sm flex items-center gap-2 border-t-2 border-neo-black ${
                              user.is_blocked ? 'hover:bg-neo-green' : 'hover:bg-neo-pink'
                            }`}
                          >
                            <Ban className="w-4 h-4" strokeWidth={2.5} />
                            {user.is_blocked ? '활성화' : '정지'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            disabled={pagination.page === 1 || isPending}
            onClick={() => {
              const params = new URLSearchParams();
              params.set('page', String(pagination.page - 1));
              if (filters.search) params.set('search', filters.search);
              if (filters.grade) params.set('grade', filters.grade);
              if (filters.isBlocked) params.set('isBlocked', filters.isBlocked);
              if (filters.sort) params.set('sort', filters.sort);
              router.push(`/admin/users?${params.toString()}`);
            }}
            className="px-3 py-2 bg-neo-white border-3 border-neo-black font-bold text-sm uppercase hover:bg-neo-cream disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            이전
          </button>

          <span className="px-4 py-2 bg-neo-black text-neo-white font-bold text-sm">
            {pagination.page} / {pagination.totalPages}
          </span>

          <button
            disabled={pagination.page === pagination.totalPages || isPending}
            onClick={() => {
              const params = new URLSearchParams();
              params.set('page', String(pagination.page + 1));
              if (filters.search) params.set('search', filters.search);
              if (filters.grade) params.set('grade', filters.grade);
              if (filters.isBlocked) params.set('isBlocked', filters.isBlocked);
              if (filters.sort) params.set('sort', filters.sort);
              router.push(`/admin/users?${params.toString()}`);
            }}
            className="px-3 py-2 bg-neo-white border-3 border-neo-black font-bold text-sm uppercase hover:bg-neo-cream disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            다음
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="text-center">
        <span className="inline-block px-4 py-2 bg-neo-cream border-3 border-neo-black font-bold text-sm">
          총 {pagination.total}명의 사용자
        </span>
      </div>
    </div>
  );
}
