/**
 * Demo: Profile Page States
 *
 * P1-T1.4: 프로필 페이지 상태별 데모
 * - loading: 로딩 중
 * - user-info: 사용자 정보 표시
 * - edit-mode: 닉네임 수정 모드
 */

'use client';

import { useState } from 'react';
import { Loader2, LogOut, Edit2, X, Check, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

type DemoState = 'loading' | 'user-info' | 'edit-mode' | 'saving';

export default function ProfilePageDemo() {
  const [demoState, setDemoState] = useState<DemoState>('user-info');

  return (
    <div className="min-h-screen bg-neo-cream p-8">
      {/* Demo Controls */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-neo-black mb-4">
          P1-T1.4: Profile Page Demo
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setDemoState('loading')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'loading'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            Loading
          </button>
          <button
            onClick={() => setDemoState('user-info')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'user-info'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            User Info
          </button>
          <button
            onClick={() => setDemoState('edit-mode')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'edit-mode'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            Edit Mode
          </button>
          <button
            onClick={() => setDemoState('saving')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'saving'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            Saving
          </button>
        </div>
      </div>

      {/* Demo Preview */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mobile Preview */}
          <div>
            <h2 className="text-xl font-bold mb-4">Mobile (375px)</h2>
            <div className="bg-white border-3 border-neo-black shadow-neo p-4">
              <div
                className="mx-auto bg-neo-white overflow-y-auto"
                style={{ width: '375px', height: '667px' }}
              >
                <ProfilePagePreview state={demoState} />
              </div>
            </div>
          </div>

          {/* Desktop Preview */}
          <div>
            <h2 className="text-xl font-bold mb-4">Desktop (1024px+)</h2>
            <div className="bg-white border-3 border-neo-black shadow-neo p-4">
              <div className="bg-neo-white overflow-y-auto" style={{ height: '667px' }}>
                <ProfilePagePreview state={demoState} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePagePreview({ state }: { state: DemoState }) {
  const isLoading = state === 'loading';
  const isEditMode = state === 'edit-mode' || state === 'saving';
  const isSaving = state === 'saving';

  if (isLoading) {
    return (
      <div className="min-h-full bg-neo-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-neo-black mx-auto mb-4" strokeWidth={2.5} />
          <p className="text-lg font-bold text-neo-black">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-neo-white p-4 py-8 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-neo-black uppercase tracking-tight">
            프로필
          </h1>
          <p className="text-base text-neo-black/70 mt-2">내 정보를 관리하세요</p>
        </div>

        {/* Profile Card */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 sm:p-8 mb-6">
          {/* Success Message (shown after saving) */}
          {state === 'user-info' && (
            <div className="mb-6 p-4 bg-[#F0FFB3] border-3 border-neo-black shadow-neo-sm">
              <p className="text-sm font-medium text-neo-black">닉네임이 변경되었습니다</p>
            </div>
          )}

          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 border-3 border-neo-black shadow-neo overflow-hidden bg-neo-cream flex items-center justify-center">
                <Image
                  src="https://ui-avatars.com/api/?name=Test+User&size=200&background=0066FF&color=fff&bold=true"
                  alt="프로필 이미지"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="space-y-4">
                {/* Nickname */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-neo-black/60 mb-1">
                    닉네임
                  </label>
                  {isEditMode ? (
                    <Input
                      type="text"
                      placeholder="닉네임을 입력하세요"
                      defaultValue="Test User"
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
                  ) : (
                    <p className="text-2xl font-black text-neo-black truncate">Test User</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-neo-black/60 mb-1">
                    이메일
                  </label>
                  <p className="text-base font-medium text-neo-black truncate">
                    test@example.com
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-neo-black/60 mb-1">
                    역할
                  </label>
                  <div className="inline-block px-3 py-1 bg-neo-blue text-white border-2 border-neo-black shadow-neo text-xs font-bold uppercase">
                    일반 회원
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

                    transition-all duration-150
                  "
                >
                  <LogOut className="w-5 h-5" strokeWidth={2.5} />
                  <span>로그아웃</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-neo-cream border-3 border-neo-black shadow-neo-sm p-6">
          <h2 className="text-lg font-black text-neo-black uppercase mb-4">계정 정보</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neo-black/60 font-bold">가입일</span>
              <span className="text-neo-black font-medium">2024. 1. 1.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neo-black/60 font-bold">마지막 수정</span>
              <span className="text-neo-black font-medium">2024. 1. 25.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
