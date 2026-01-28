/**
 * Login Page - NextAuth.js Credentials Provider
 * Neo-Brutalism 디자인
 */

'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, LogIn, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('이메일을 입력해주세요');
      return;
    }

    if (!password) {
      setError('비밀번호를 입력해주세요');
      return;
    }

    try {
      setIsLoading(true);

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다');
        return;
      }

      // 로그인 성공 - 리다이렉트
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neo-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-neo-black uppercase tracking-tight mb-2">
            로그인
          </h1>
          <p className="text-base text-neo-black/70">
            Vibe Store에 오신 것을 환영합니다
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 sm:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-neo-pink/20 border-3 border-neo-pink">
              <p className="text-sm font-bold text-neo-black">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-black uppercase text-neo-black"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                className="w-full px-4 py-3 bg-neo-white border-3 border-neo-black font-medium text-neo-black placeholder:text-neo-black/40 focus:outline-none focus:ring-2 focus:ring-neo-blue disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-black uppercase text-neo-black"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 bg-neo-white border-3 border-neo-black font-medium text-neo-black placeholder:text-neo-black/40 focus:outline-none focus:ring-2 focus:ring-neo-blue disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-black/60 hover:text-neo-black"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={2.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-neo-blue text-white border-3 border-neo-black shadow-neo font-bold uppercase tracking-wide flex items-center justify-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                  <span>로그인 중...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" strokeWidth={2.5} />
                  <span>로그인</span>
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-neo-black/70">
              아직 회원이 아니신가요?{' '}
              <Link href="/signup" className="font-bold text-neo-blue hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neo-black/70">
            로그인하면{' '}
            <Link href="/terms" className="font-bold text-neo-blue underline">
              이용약관
            </Link>
            과{' '}
            <Link href="/privacy" className="font-bold text-neo-blue underline">
              개인정보처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginPageSkeleton() {
  return (
    <div className="min-h-screen bg-neo-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-neo-black uppercase tracking-tight mb-2">
            로그인
          </h1>
          <p className="text-base text-neo-black/70">Vibe Store에 오신 것을 환영합니다</p>
        </div>
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 sm:p-8 animate-pulse">
          <div className="h-12 bg-neo-cream mb-4 border-2 border-neo-black"></div>
          <div className="h-12 bg-neo-cream mb-4 border-2 border-neo-black"></div>
          <div className="h-12 bg-neo-blue border-2 border-neo-black"></div>
        </div>
      </div>
    </div>
  );
}
