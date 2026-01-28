/**
 * Settings Page
 *
 * 사용자 설정 페이지
 * - 비밀번호 변경
 * - 알림 설정
 * - 계정 삭제
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  Lock,
  Bell,
  ArrowLeft,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?redirect=/my/settings');
    }
  }, [status, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('새 비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      setIsChangingPassword(true);

      // 비밀번호 변경 API 호출
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          newPassword
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setPasswordError(data.error || '비밀번호 변경 실패');
        return;
      }

      setPasswordSuccess('비밀번호가 변경되었습니다');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('비밀번호 변경 중 오류가 발생했습니다');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neo-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-neo-black mx-auto mb-4" strokeWidth={2.5} />
          <p className="text-lg font-bold text-neo-black">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neo-white p-4 py-8 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/my"
          className="inline-flex items-center gap-2 text-neo-black font-bold hover:text-neo-blue transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          마이페이지로 돌아가기
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-neo-black uppercase tracking-tight">
            설정
          </h1>
          <p className="text-base text-neo-black/70 mt-2">
            계정 설정을 관리하세요
          </p>
        </div>

        {/* Password Change Section */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-neo-blue flex items-center justify-center border-2 border-neo-black">
              <Lock className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-neo-black uppercase">
              비밀번호 변경
            </h2>
          </div>

          {/* Error Message */}
          {passwordError && (
            <div className="mb-6 p-4 bg-neo-pink/20 border-3 border-neo-pink">
              <p className="text-sm font-bold text-neo-black">{passwordError}</p>
            </div>
          )}

          {/* Success Message */}
          {passwordSuccess && (
            <div className="mb-6 p-4 bg-neo-lime/50 border-3 border-neo-black">
              <p className="text-sm font-bold text-neo-black flex items-center gap-2">
                <Check className="w-4 h-4" strokeWidth={2.5} />
                {passwordSuccess}
              </p>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {/* New Password */}
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-black uppercase text-neo-black"
              >
                새 비밀번호
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="새 비밀번호 입력"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isChangingPassword}
                  className="w-full px-4 py-3 pr-12 bg-neo-white border-3 border-neo-black font-medium text-neo-black placeholder:text-neo-black/40 focus:outline-none focus:ring-2 focus:ring-neo-blue disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-black/60 hover:text-neo-black"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={2.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-black uppercase text-neo-black"
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="새 비밀번호 다시 입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
                className="w-full px-4 py-3 bg-neo-white border-3 border-neo-black font-medium text-neo-black placeholder:text-neo-black/40 focus:outline-none focus:ring-2 focus:ring-neo-blue disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full px-6 py-3 bg-neo-blue text-white border-3 border-neo-black shadow-neo font-bold uppercase tracking-wide flex items-center justify-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                  <span>변경 중...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" strokeWidth={2.5} />
                  <span>비밀번호 변경</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Notification Settings Section */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-neo-yellow flex items-center justify-center border-2 border-neo-black">
              <Bell className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-neo-black uppercase">
              알림 설정
            </h2>
          </div>

          <div className="space-y-4">
            {/* Email Notification */}
            <div className="flex items-center justify-between p-4 bg-neo-cream border-2 border-neo-black">
              <div>
                <p className="font-bold text-neo-black">이메일 알림</p>
                <p className="text-sm text-neo-black/60">주문 및 배송 알림을 이메일로 받습니다</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-12 h-6 bg-neo-black/20 peer-focus:outline-none border-2 border-neo-black peer-checked:bg-neo-blue transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white border-2 border-neo-black transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>

            {/* Marketing Notification */}
            <div className="flex items-center justify-between p-4 bg-neo-cream border-2 border-neo-black">
              <div>
                <p className="font-bold text-neo-black">마케팅 알림</p>
                <p className="text-sm text-neo-black/60">할인 및 이벤트 정보를 받습니다</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-6 bg-neo-black/20 peer-focus:outline-none border-2 border-neo-black peer-checked:bg-neo-blue transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white border-2 border-neo-black transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-neo-cream border-3 border-neo-black shadow-neo-sm p-6">
          <h2 className="text-lg font-black text-neo-black uppercase mb-4">
            계정 관리
          </h2>
          <p className="text-sm text-neo-black/70 mb-4">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-neo-white text-neo-pink border-2 border-neo-pink font-bold text-sm hover:bg-neo-pink hover:text-white transition-colors"
          >
            계정 삭제 요청
          </button>
        </div>
      </div>
    </div>
  );
}
