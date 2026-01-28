/**
 * Profile Page
 *
 * P2-T2.1: NextAuth.js 기반 마이페이지
 * - NextAuth useSession 사용
 * - 프로필 정보 표시 (이메일, 닉네임, 아바타)
 * - 닉네임 수정 폼
 * - 로그아웃 버튼
 * - 반응형 Neo-Brutalism 디자인
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Loader2, LogOut, Edit2, X, Check, User, Package, Download, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import Image from 'next/image';

// Nickname validation schema
const nicknameSchema = z.string().min(2, '닉네임은 최소 2자 이상이어야 합니다');

interface Profile {
  id: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedNickname, setEditedNickname] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load user and profile on mount
  useEffect(() => {
    async function loadProfile() {
      // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      if (status === 'unauthenticated') {
        router.push('/auth/login?redirect=/my');
        return;
      }

      // 로딩 중이면 대기
      if (status === 'loading') {
        return;
      }

      // 세션이 있으면 프로필 로드
      if (status === 'authenticated' && session?.user) {
        try {
          const res = await fetch(`/api/profile/${session.user.id}`);

          if (res.ok) {
            const data = await res.json();
            setProfile(data);
            setEditedNickname(data.nickname || '');
          } else if (res.status === 404) {
            // 프로필이 없는 경우 세션 정보로 기본 표시
            setProfile({
              id: session.user.id,
              email: session.user.email,
              nickname: session.user.name || session.user.email.split('@')[0] || null,
              avatar_url: session.user.image || null,
              role: session.user.role === 'admin' ? 'admin' : 'customer',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          } else {
            throw new Error('프로필을 불러올 수 없습니다.');
          }
        } catch (err: any) {
          console.error('Error loading profile:', err);
          setError(err.message || '프로필을 불러오는데 실패했습니다');
        } finally {
          setIsLoading(false);
        }
      }
    }

    loadProfile();
  }, [status, session, router]);

  /**
   * 수정 모드 진입
   */
  const handleEditClick = () => {
    setIsEditMode(true);
    setError(null);
    setSuccessMessage(null);
  };

  /**
   * 수정 취소
   */
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedNickname(profile?.nickname || '');
    setError(null);
  };

  /**
   * 닉네임 저장
   */
  const handleSaveNickname = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      // Validate nickname
      const validation = nicknameSchema.safeParse(editedNickname);
      if (!validation.success) {
        setError(validation.error.issues[0]?.message || '닉네임은 최소 2자 이상이어야 합니다');
        return;
      }

      if (!session?.user?.id) {
        setError('사용자 정보를 찾을 수 없습니다');
        return;
      }

      setIsSaving(true);

      // Update profile via API
      const res = await fetch(`/api/profile/${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: editedNickname }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '닉네임 변경에 실패했습니다.');
      }

      const updatedProfile = await res.json();

      // Update local state
      if (updatedProfile && profile) {
        setProfile({
          ...profile,
          nickname: updatedProfile.nickname,
        });
      }

      setSuccessMessage('닉네임이 변경되었습니다');
      setIsEditMode(false);
    } catch (err: any) {
      setError(err.message || '닉네임 변경 중 오류가 발생했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = async () => {
    try {
      setError(null);
      setIsLoggingOut(true);

      // NextAuth signOut
      await signOut({
        callbackUrl: '/',
        redirect: true,
      });
    } catch (err: any) {
      setError(err.message || '로그아웃 중 오류가 발생했습니다');
      setIsLoggingOut(false);
    }
  };

  // Loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-neo-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-neo-black mx-auto mb-4" strokeWidth={2.5} />
          <p className="text-lg font-bold text-neo-black">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (status === 'unauthenticated' || !session || !profile) {
    return null;
  }

  const displayName = profile.nickname || profile.email;
  const avatarUrl = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=200&background=0066FF&color=fff&bold=true`;

  return (
    <div className="min-h-screen bg-neo-white p-4 py-8 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-neo-black uppercase tracking-tight">
            프로필
          </h1>
          <p className="text-base text-neo-black/70 mt-2">
            내 정보를 관리하세요
          </p>
        </div>

        {/* Profile Card - Neo-Brutalism */}
        <div
          className="
            bg-neo-white
            border-3 border-neo-black
            shadow-neo
            p-6 sm:p-8
            mb-6
          "
        >
          {/* Error Message */}
          {error && (
            <div
              className="
                mb-6
                p-4
                bg-[#FFE6E6]
                border-3 border-[#FF3333]
                shadow-neo-pink
              "
            >
              <p className="text-sm font-medium text-neo-black">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div
              className="
                mb-6
                p-4
                bg-[#F0FFB3]
                border-3 border-neo-black
                shadow-neo-sm
              "
            >
              <p className="text-sm font-medium text-neo-black">{successMessage}</p>
            </div>
          )}

          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className="
                  w-32 h-32
                  border-3 border-neo-black
                  shadow-neo
                  overflow-hidden
                  bg-neo-cream
                  flex items-center justify-center
                "
              >
                {profile.avatar_url ? (
                  <Image
                    src={avatarUrl}
                    alt="프로필 이미지"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="w-16 h-16 text-neo-black/40" strokeWidth={2} />
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="space-y-4">
                {/* Nickname/Display Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-neo-black/60 mb-1">
                    닉네임
                  </label>
                  {isEditMode ? (
                    <div>
                      <label htmlFor="nickname" className="sr-only">
                        닉네임
                      </label>
                      <Input
                        id="nickname"
                        type="text"
                        placeholder="닉네임을 입력하세요"
                        value={editedNickname}
                        onChange={(e) => setEditedNickname(e.target.value)}
                        disabled={isSaving}
                        className="
                          w-full px-4 py-2
                          bg-neo-white
                          border-3 border-neo-black
                          shadow-neo-sm
                          text-neo-black
                          placeholder:text-neo-black/40
                          font-medium

                          focus:outline-none
                          focus:shadow-neo
                          focus:border-neo-blue
                          focus-visible:ring-0
                          focus-visible:ring-offset-0

                          disabled:opacity-50
                          disabled:cursor-not-allowed

                          transition-all duration-150
                        "
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-black text-neo-black truncate" data-testid="profile-display-name">
                      {profile.nickname || '(닉네임 없음)'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-neo-black/60 mb-1">
                    이메일
                  </label>
                  <p className="text-base font-medium text-neo-black truncate">
                    {profile.email}
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-neo-black/60 mb-1">
                    역할
                  </label>
                  <div
                    className="
                      inline-block
                      px-3 py-1
                      bg-neo-blue
                      text-white
                      border-2 border-neo-black
                      shadow-neo
                      text-xs font-bold uppercase
                    "
                  >
                    {profile.role === 'admin' ? '관리자' : '일반 회원'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isEditMode ? (
              <>
                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveNickname}
                  disabled={isSaving}
                  className="
                    flex-1
                    px-6 py-3
                    bg-neo-blue
                    text-white
                    border-3 border-neo-black
                    shadow-neo
                    font-bold uppercase tracking-wide
                    flex items-center justify-center gap-2

                    hover:translate-x-[2px] hover:translate-y-[2px]
                    hover:shadow-neo-sm

                    active:translate-x-[4px] active:translate-y-[4px]
                    active:shadow-none

                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    disabled:hover:translate-x-0
                    disabled:hover:translate-y-0
                    disabled:hover:shadow-neo

                    transition-all duration-150
                  "
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                      <span>저장 중...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                      <span>저장</span>
                    </>
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="
                    flex-1
                    px-6 py-3
                    bg-neo-white
                    text-neo-black
                    border-3 border-neo-black
                    shadow-neo
                    font-bold uppercase tracking-wide
                    flex items-center justify-center gap-2

                    hover:translate-x-[2px] hover:translate-y-[2px]
                    hover:shadow-neo-sm
                    hover:bg-neo-cream

                    active:translate-x-[4px] active:translate-y-[4px]
                    active:shadow-none

                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    disabled:hover:translate-x-0
                    disabled:hover:translate-y-0
                    disabled:hover:shadow-neo

                    transition-all duration-150
                  "
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                  <span>취소</span>
                </button>
              </>
            ) : (
              <>
                {/* Edit Button */}
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="
                    flex-1
                    px-6 py-3
                    bg-neo-white
                    text-neo-black
                    border-3 border-neo-black
                    shadow-neo
                    font-bold uppercase tracking-wide
                    flex items-center justify-center gap-2

                    hover:translate-x-[2px] hover:translate-y-[2px]
                    hover:shadow-neo-sm
                    hover:bg-neo-cream

                    active:translate-x-[4px] active:translate-y-[4px]
                    active:shadow-none

                    transition-all duration-150
                  "
                >
                  <Edit2 className="w-5 h-5" strokeWidth={2.5} />
                  <span>수정</span>
                </button>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="
                    flex-1
                    px-6 py-3
                    bg-[#FF3366]
                    text-white
                    border-3 border-neo-black
                    shadow-neo
                    font-bold uppercase tracking-wide
                    flex items-center justify-center gap-2

                    hover:translate-x-[2px] hover:translate-y-[2px]
                    hover:shadow-neo-sm

                    active:translate-x-[4px] active:translate-y-[4px]
                    active:shadow-none

                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    disabled:hover:translate-x-0
                    disabled:hover:translate-y-0
                    disabled:hover:shadow-neo

                    transition-all duration-150
                  "
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                      <span>로그아웃 중...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-5 h-5" strokeWidth={2.5} />
                      <span>로그아웃</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <div
          className="
            bg-neo-white
            border-3 border-neo-black
            shadow-neo
            overflow-hidden
            mb-6
          "
        >
          <h2 className="text-lg font-black text-neo-black uppercase p-4 border-b-3 border-neo-black bg-neo-cream">
            내 활동
          </h2>
          <div className="divide-y-2 divide-neo-black/20">
            {/* Orders Link */}
            <Link
              href="/my/orders"
              className="
                flex items-center justify-between
                p-4
                bg-neo-white
                hover:bg-neo-cream
                transition-colors duration-150
                group
              "
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-neo-blue border-2 border-neo-black">
                  <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-bold text-neo-black">주문 현황</p>
                  <p className="text-xs text-neo-black/60">주문 내역 및 결제 상태 확인</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neo-black/40 group-hover:text-neo-black transition-colors" strokeWidth={2.5} />
            </Link>

            {/* Downloads Link */}
            <Link
              href="/my/downloads"
              className="
                flex items-center justify-between
                p-4
                bg-neo-white
                hover:bg-neo-cream
                transition-colors duration-150
                group
              "
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#FF3366] border-2 border-neo-black">
                  <Download className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-bold text-neo-black">다운로드 센터</p>
                  <p className="text-xs text-neo-black/60">구매한 상품 다운로드</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neo-black/40 group-hover:text-neo-black transition-colors" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Account Info */}
        <div
          className="
            bg-neo-cream
            border-3 border-neo-black
            shadow-neo-sm
            p-6
          "
        >
          <h2 className="text-lg font-black text-neo-black uppercase mb-4">
            계정 정보
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neo-black/60 font-bold">가입일</span>
              <span className="text-neo-black font-medium">
                {new Date(profile.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neo-black/60 font-bold">마지막 수정</span>
              <span className="text-neo-black font-medium">
                {new Date(profile.updated_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
