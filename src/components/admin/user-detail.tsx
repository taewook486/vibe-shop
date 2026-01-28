/**
 * P7-T7.3: 관리자 사용자 상세/수정 컴포넌트
 *
 * 기능:
 * - 사용자 기본 정보 표시 및 수정
 * - 등급 변경
 * - 상태 변경 (활성/정지/탈퇴)
 * - 주문 이력 표시
 * - 통계 표시 (주문 수, 총 구매금액, 후기, 문의)
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { AdminUserWithStats, AdminOrder } from '@/types/admin';
import {
  User,
  Mail,
  Calendar,
  CreditCard,
  ShoppingBag,
  MessageSquare,
  Star,
  Save,
  Ban,
  CheckCircle,
} from 'lucide-react';

interface UserDetailProps {
  user: AdminUserWithStats;
  orders: AdminOrder[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

function getGradeBadge(grade: string) {
  const variants: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'outline' }
  > = {
    bronze: { label: '브론즈', variant: 'outline' },
    silver: { label: '실버', variant: 'secondary' },
    gold: { label: '골드', variant: 'default' },
    vip: { label: 'VIP', variant: 'default' },
  };

  const config = variants[grade] || { label: grade, variant: 'outline' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function getOrderStatusBadge(status: string) {
  const variants: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    pending: { label: '결제 대기', variant: 'outline' },
    paid: { label: '결제 완료', variant: 'default' },
    completed: { label: '처리 완료', variant: 'secondary' },
    cancelled: { label: '취소', variant: 'destructive' },
    refunded: { label: '환불', variant: 'destructive' },
  };

  const config = variants[status] || { label: status, variant: 'outline' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default function UserDetail({ user, orders }: UserDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState({
    nickname: user.nickname || '',
    grade: user.grade,
    isBlocked: user.is_blocked,
    blockedReason: user.blocked_reason || '',
    role: user.role,
  });

  // 저장 핸들러
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: formData.nickname,
          grade: formData.grade,
          isBlocked: formData.isBlocked,
          blockedReason: formData.blockedReason || null,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        throw new Error('저장 실패');
      }

      toast({
        title: '저장 완료',
        description: '사용자 정보가 수정되었습니다.',
      });

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast({
        title: '저장 실패',
        description: '사용자 정보 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    setFormData({
      nickname: user.nickname || '',
      grade: user.grade,
      isBlocked: user.is_blocked,
      blockedReason: user.blocked_reason || '',
      role: user.role,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{user.email}</h1>
          <p className="text-muted-foreground mt-1">
            사용자 ID: {user.id}
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <User className="h-4 w-4 mr-2" />
            정보 수정
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="nickname">닉네임</Label>
                  {isEditing ? (
                    <Input
                      id="nickname"
                      value={formData.nickname}
                      onChange={(e) =>
                        setFormData({ ...formData, nickname: e.target.value })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.nickname || '-'}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade">회원 등급</Label>
                  {isEditing ? (
                    <Select
                      value={formData.grade}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, grade: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bronze">브론즈</SelectItem>
                        <SelectItem value="silver">실버</SelectItem>
                        <SelectItem value="gold">골드</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">{getGradeBadge(user.grade)}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="role">권한</Label>
                  {isEditing ? (
                    <Select
                      value={formData.role}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">일반 사용자</SelectItem>
                        <SelectItem value="admin">관리자</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                        {user.role === 'admin' ? '관리자' : '일반 사용자'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>가입일</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(user.created_at)}</span>
                  </div>
                </div>
                <div>
                  <Label>마지막 로그인</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(user.last_login_at)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>계정 상태</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">상태</Label>
                {isEditing ? (
                  <Select
                    value={formData.isBlocked ? 'blocked' : 'active'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, isBlocked: value === 'blocked' })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          활성
                        </div>
                      </SelectItem>
                      <SelectItem value="blocked">
                        <div className="flex items-center gap-2">
                          <Ban className="h-4 w-4 text-red-600" />
                          정지
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    {user.is_blocked ? (
                      <Badge variant="destructive">정지</Badge>
                    ) : (
                      <Badge variant="default">활성</Badge>
                    )}
                  </div>
                )}
              </div>

              {(formData.isBlocked || user.is_blocked) && (
                <div>
                  <Label htmlFor="blockedReason">정지 사유</Label>
                  {isEditing ? (
                    <Textarea
                      id="blockedReason"
                      value={formData.blockedReason}
                      onChange={(e) =>
                        setFormData({ ...formData, blockedReason: e.target.value })
                      }
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.blocked_reason || '-'}
                    </p>
                  )}
                </div>
              )}

              {user.blocked_at && (
                <div>
                  <Label>정지일</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(user.blocked_at)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>최근 주문 내역</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  주문 내역이 없습니다.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>주문금액</TableHead>
                      <TableHead>결제일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.order_number}
                        </TableCell>
                        <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                        <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                        <TableCell>{formatDate(order.paid_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Purchase Stats */}
          <Card>
            <CardHeader>
              <CardTitle>구매 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">총 구매금액</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(user.total_order_amount)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">주문 수</p>
                  <p className="text-xl font-bold">
                    {user.stats?.totalOrders || 0}건
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">적립금</p>
                  <p className="text-xl font-bold">{user.points.toLocaleString()}P</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle>활동 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">작성한 후기</p>
                  <p className="text-xl font-bold">
                    {user.stats?.totalReviews || 0}개
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-pink-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">작성한 문의</p>
                  <p className="text-xl font-bold">
                    {user.stats?.totalInquiries || 0}개
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
