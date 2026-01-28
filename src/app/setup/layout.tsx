import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '초기 설정 - Vibe Store',
  description: 'Vibe Store 쇼핑몰 초기 설정',
};

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vibe-blue/5 via-vibe-violet/5 to-vibe-amber/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Vibe Store 초기 설정
          </h1>
          <p className="text-gray-600">
            쇼핑몰 운영에 필요한 기본 설정을 진행합니다
          </p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
