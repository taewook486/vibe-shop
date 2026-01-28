/**
 * Admin Settings Page
 *
 * 관리자 설정 페이지
 * - Neo-Brutalism 디자인
 */

import { Settings, Store, CreditCard, Bell, Shield, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  const settingSections = [
    {
      title: '스토어 정보',
      description: '상점 이름, 로고, 연락처 등 기본 정보를 설정합니다',
      icon: Store,
      color: 'bg-neo-blue',
      status: '설정됨',
    },
    {
      title: '결제 설정',
      description: '토스페이먼츠 연동 및 결제 옵션을 관리합니다',
      icon: CreditCard,
      color: 'bg-neo-green',
      status: '연동됨',
    },
    {
      title: '알림 설정',
      description: '주문, 문의 알림 설정을 관리합니다',
      icon: Bell,
      color: 'bg-neo-yellow',
      status: '활성화',
    },
    {
      title: '보안 설정',
      description: '관리자 계정 및 접근 권한을 관리합니다',
      icon: Shield,
      color: 'bg-neo-pink',
      status: '정상',
    },
    {
      title: '데이터 관리',
      description: '백업, 내보내기, 초기화 옵션',
      icon: Database,
      color: 'bg-neo-purple',
      status: '-',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neo-cream border-3 border-neo-black flex items-center justify-center shadow-neo">
          <Settings className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-neo-black uppercase tracking-tight">
            설정
          </h1>
          <p className="text-neo-black/60 font-medium">
            스토어 설정을 관리합니다
          </p>
        </div>
      </div>

      {/* 설정 섹션 */}
      <div className="space-y-3">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-neo-white border-3 border-neo-black p-5 flex items-center gap-4 hover:bg-neo-cream/30 transition-colors cursor-pointer"
            >
              <div className={`w-12 h-12 ${section.color} border-2 border-neo-black flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h2 className="font-black text-neo-black">{section.title}</h2>
                <p className="text-sm text-neo-black/60">{section.description}</p>
              </div>
              <div className="px-3 py-1 bg-neo-lime border-2 border-neo-black text-sm font-bold">
                {section.status}
              </div>
            </div>
          );
        })}
      </div>

      {/* 버전 정보 */}
      <div className="bg-neo-black text-neo-white p-4 flex items-center justify-between">
        <div>
          <span className="font-black uppercase">Vibe Store</span>
          <span className="ml-2 text-neo-white/60">v1.0.0</span>
        </div>
        <div className="text-sm text-neo-white/60">
          Next.js 15 + Supabase + NextAuth
        </div>
      </div>
    </div>
  );
}
