/**
 * Admin Community Page
 *
 * 관리자 후기/문의 관리 페이지
 * - Neo-Brutalism 디자인
 */

import Link from 'next/link';
import { MessageSquare, Star, HelpCircle, ArrowRight } from 'lucide-react';

export default function AdminCommunityPage() {
  const sections = [
    {
      title: '상품 후기',
      description: '고객이 작성한 상품 후기를 관리합니다',
      href: '/admin/reviews',
      icon: Star,
      color: 'bg-neo-yellow',
      count: 0,
    },
    {
      title: '1:1 문의',
      description: '고객 문의를 확인하고 답변합니다',
      href: '/admin/inquiries',
      icon: HelpCircle,
      color: 'bg-neo-blue',
      count: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neo-lime border-3 border-neo-black flex items-center justify-center shadow-neo">
          <MessageSquare className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-neo-black uppercase tracking-tight">
            후기/문의 관리
          </h1>
          <p className="text-neo-black/60 font-medium">
            고객 후기와 문의를 관리합니다
          </p>
        </div>
      </div>

      {/* 섹션 카드 */}
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.title}
              href={section.href}
              className="group block bg-neo-white border-3 border-neo-black p-6 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-neo-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 ${section.color} border-3 border-neo-black flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-neo-black" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-neo-black uppercase">
                      {section.title}
                    </h2>
                    <ArrowRight className="w-5 h-5 text-neo-black opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                  </div>
                  <p className="text-neo-black/60 mt-1">{section.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 안내 */}
      <div className="bg-neo-cream border-3 border-neo-black p-6">
        <h3 className="font-black text-neo-black uppercase mb-2">관리 팁</h3>
        <ul className="space-y-2 text-sm text-neo-black/70">
          <li>• 후기에 답변하면 고객 신뢰도가 높아집니다</li>
          <li>• 문의는 24시간 이내 답변을 권장합니다</li>
          <li>• 부적절한 후기는 삭제할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}
