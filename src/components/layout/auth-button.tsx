/**
 * Auth Button Component
 * 로그인 상태에 따라 다른 버튼 표시
 * 관리자인 경우 관리자 메뉴 표시
 * NextAuth.js 기반
 */

'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { User, LogOut, Settings, Shield, Package, Download } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

export function AuthButton() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  const isLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated';
  const isAdmin = session?.user?.role === 'admin';

  const handleSignOut = async () => {
    setShowMenu(false);
    // 로그아웃 시 장바구니 초기화 (다른 사용자의 장바구니가 남지 않도록)
    clearCart();
    await signOut({ callbackUrl: '/' });
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 sm:px-6 h-10 sm:h-12 bg-neo-black/10 border-3 border-neo-black/30 animate-pulse">
        <User className="w-5 h-5 text-neo-black/30" strokeWidth={2.5} />
      </div>
    );
  }

  // 로그인 상태
  if (isLoggedIn && session?.user) {
    const displayName = session.user.name || session.user.email?.split('@')[0] || '사용자';

    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`flex items-center gap-2 px-3 sm:px-6 h-10 sm:h-12 border-3 border-neo-black shadow-neo font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all ${
            isAdmin ? 'bg-neo-pink text-white' : 'bg-neo-lime text-neo-black'
          }`}
        >
          {isAdmin ? (
            <Shield className="w-5 h-5" strokeWidth={2.5} />
          ) : (
            <User className="w-5 h-5" strokeWidth={2.5} />
          )}
          <span className="hidden sm:inline max-w-[100px] truncate">
            {isAdmin ? 'ADMIN' : displayName}
          </span>
        </button>

        {/* 드롭다운 메뉴 */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-neo-white border-3 border-neo-black shadow-neo z-50">
              {/* 관리자 메뉴 */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 px-4 py-3 font-bold text-white bg-neo-pink hover:bg-neo-pink/80 transition-colors border-b-2 border-neo-black"
                >
                  <Shield className="w-5 h-5" strokeWidth={2.5} />
                  관리자 대시보드
                </Link>
              )}
              <Link
                href="/my"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-2 px-4 py-3 font-bold text-neo-black hover:bg-neo-yellow transition-colors border-b-2 border-neo-black"
              >
                <User className="w-5 h-5" strokeWidth={2.5} />
                마이페이지
              </Link>
              <Link
                href="/my/orders"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-2 px-4 py-3 font-bold text-neo-black hover:bg-neo-yellow transition-colors border-b-2 border-neo-black"
              >
                <Package className="w-5 h-5" strokeWidth={2.5} />
                주문 현황
              </Link>
              <Link
                href="/my/downloads"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-2 px-4 py-3 font-bold text-neo-black hover:bg-neo-yellow transition-colors border-b-2 border-neo-black"
              >
                <Download className="w-5 h-5" strokeWidth={2.5} />
                다운로드 센터
              </Link>
              <Link
                href="/my/settings"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-2 px-4 py-3 font-bold text-neo-black hover:bg-neo-yellow transition-colors border-b-2 border-neo-black"
              >
                <Settings className="w-5 h-5" strokeWidth={2.5} />
                설정
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-3 font-bold text-neo-black hover:bg-neo-black hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" strokeWidth={2.5} />
                로그아웃
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // 비로그인 상태
  return (
    <Link
      href="/login"
      className="flex items-center gap-2 px-3 sm:px-6 h-10 sm:h-12 bg-neo-blue text-white border-3 border-neo-black shadow-neo font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
    >
      <User className="w-5 h-5" strokeWidth={2.5} />
      <span className="hidden sm:inline">로그인</span>
    </Link>
  );
}
