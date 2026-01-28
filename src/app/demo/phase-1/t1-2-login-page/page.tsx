/**
 * Demo: Login Page States
 *
 * P1-T1.2: 로그인 페이지 상태별 데모
 * - default: 기본 상태
 * - loading: 로딩 중 (Google/Magic Link)
 * - error: 에러 상태
 * - success-redirect: 성공 메시지
 */

'use client';

import { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';

type DemoState = 'default' | 'loading-google' | 'loading-magic' | 'error' | 'success';

export default function LoginPageDemo() {
  const [demoState, setDemoState] = useState<DemoState>('default');

  return (
    <div className="min-h-screen bg-neo-cream p-8">
      {/* Demo Controls */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-neo-black mb-4">
          P1-T1.2: Login Page Demo
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setDemoState('default')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'default'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            Default
          </button>
          <button
            onClick={() => setDemoState('loading-google')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'loading-google'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            Loading (Google)
          </button>
          <button
            onClick={() => setDemoState('loading-magic')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'loading-magic'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            Loading (Magic Link)
          </button>
          <button
            onClick={() => setDemoState('error')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'error'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            Error
          </button>
          <button
            onClick={() => setDemoState('success')}
            className={`
              px-4 py-2
              border-2 border-neo-black
              shadow-neo-sm
              font-bold text-sm
              transition-all duration-150
              ${
                demoState === 'success'
                  ? 'bg-neo-blue text-white'
                  : 'bg-white text-neo-black hover:bg-neo-cream'
              }
            `}
          >
            Success
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
                <LoginPagePreview state={demoState} />
              </div>
            </div>
          </div>

          {/* Desktop Preview */}
          <div>
            <h2 className="text-xl font-bold mb-4">Desktop (1024px+)</h2>
            <div className="bg-white border-3 border-neo-black shadow-neo p-4">
              <div className="bg-neo-white overflow-y-auto" style={{ height: '667px' }}>
                <LoginPagePreview state={demoState} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPagePreview({ state }: { state: DemoState }) {
  const isGoogleLoading = state === 'loading-google';
  const isMagicLinkLoading = state === 'loading-magic';
  const showError = state === 'error';
  const showSuccess = state === 'success';

  return (
    <div className="min-h-full bg-neo-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-neo-black uppercase tracking-tight mb-2">
            로그인
          </h1>
          <p className="text-base text-neo-black/70">Vibe Store에 오신 것을 환영합니다</p>
        </div>

        {/* Login Card */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 sm:p-8">
          {/* Error Message */}
          {showError && (
            <div className="mb-6 p-4 bg-[#FFE6E6] border-3 border-[#FF3333] shadow-neo-pink">
              <p className="text-sm font-medium text-neo-black">
                OAuth error occurred. Please try again.
              </p>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-[#F0FFB3] border-3 border-neo-black shadow-neo-sm">
              <p className="text-sm font-medium text-neo-black">
                이메일을 확인해주세요! 로그인 링크를 보냈습니다.
              </p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            disabled={isGoogleLoading || isMagicLinkLoading}
            className="
              w-full
              px-6 py-3
              mb-6
              bg-neo-white
              text-neo-black
              border-3 border-neo-black
              shadow-neo
              font-bold
              flex items-center justify-center gap-3

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
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                <span>로그인 중...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google로 로그인</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-neo-black"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-neo-white px-4 text-sm font-bold text-neo-black">또는</span>
            </div>
          </div>

          {/* Email Magic Link Form */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold uppercase tracking-wide text-neo-black mb-2"
                >
                  이메일
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  disabled={isGoogleLoading || isMagicLinkLoading}
                  className="
                    w-full px-4 py-3
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

              <button
                type="submit"
                disabled={isGoogleLoading || isMagicLinkLoading}
                className="
                  w-full
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
                {isMagicLinkLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                    <span>전송 중...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" strokeWidth={2.5} />
                    <span>매직 링크 보내기</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Help Text */}
          <p className="mt-6 text-center text-sm text-neo-black/60">
            이메일로 로그인 링크를 보내드립니다.
            <br />
            비밀번호 없이 간편하게 로그인하세요!
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neo-black/70">
            로그인하면{' '}
            <a href="/terms" className="font-bold text-neo-blue underline">
              이용약관
            </a>
            과{' '}
            <a href="/privacy" className="font-bold text-neo-blue underline">
              개인정보처리방침
            </a>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
