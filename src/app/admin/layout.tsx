/**
 * Admin Layout
 *
 * 관리자 페이지 레이아웃
 * - Neo-Brutalism 디자인
 * - NextAuth 인증 체크
 * - 사이드바 네비게이션
 */

import { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FolderTree,
  MessageSquare,
  BarChart3,
  Store,
  ChevronRight,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // NextAuth 세션 체크
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/admin');
  }

  // 관리자 권한 체크
  if (session.user.role !== 'admin') {
    redirect('/');
  }

  const navigation = [
    {
      name: '대시보드',
      href: '/admin',
      icon: LayoutDashboard,
      color: 'bg-neo-blue',
    },
    {
      name: '통계 분석',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'bg-neo-purple',
    },
    {
      name: '상품 관리',
      href: '/admin/products',
      icon: Package,
      color: 'bg-neo-green',
    },
    {
      name: '주문 관리',
      href: '/admin/orders',
      icon: ShoppingCart,
      color: 'bg-neo-yellow',
    },
    {
      name: '카테고리 관리',
      href: '/admin/categories',
      icon: FolderTree,
      color: 'bg-neo-orange',
    },
    {
      name: '회원 관리',
      href: '/admin/users',
      icon: Users,
      color: 'bg-neo-pink',
    },
    {
      name: '후기/문의',
      href: '/admin/community',
      icon: MessageSquare,
      color: 'bg-neo-lime',
    },
    {
      name: '설정',
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-neo-cream',
    },
  ];

  return (
    <div className="min-h-screen bg-neo-cream">
      {/* Admin Header - Neo-Brutalism */}
      <header className="bg-neo-black border-b-4 border-neo-black sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-xl font-black text-neo-white uppercase tracking-tight flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-neo-yellow border-2 border-neo-white flex items-center justify-center">
                  <Store className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
                </div>
                VIBE ADMIN
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-neo-blue text-neo-white border-2 border-neo-white font-bold text-sm uppercase hover:bg-neo-blue/80 transition-colors flex items-center gap-2"
              >
                <Store className="w-4 h-4" strokeWidth={2.5} />
                쇼핑몰
              </Link>
              <div className="px-3 py-1 bg-neo-white border-2 border-neo-white text-neo-black text-sm font-bold">
                {session.user.email}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Neo-Brutalism */}
        <aside className="w-64 bg-neo-white border-r-4 border-neo-black min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-3 px-4 py-3 bg-neo-white border-3 border-neo-black font-bold text-neo-black hover:translate-x-1 hover:shadow-neo-sm transition-all"
                >
                  <div className={`w-8 h-8 ${item.color} border-2 border-neo-black flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-neo-black" strokeWidth={2.5} />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-neo-cream">
          <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
