/**
 * Careers Page - Neo-Brutalism 디자인
 * 채용 정보 페이지
 */

import { Briefcase, MapPin, Mail } from 'lucide-react';

const jobs = [
  {
    title: 'Frontend Developer',
    type: '정규직',
    location: '서울 / 원격',
    description: 'React, Next.js를 활용한 웹 서비스 개발',
  },
  {
    title: 'Backend Developer',
    type: '정규직',
    location: '서울 / 원격',
    description: 'Node.js, Supabase를 활용한 API 개발',
  },
  {
    title: 'Product Designer',
    type: '정규직',
    location: '서울',
    description: 'UI/UX 디자인 및 디자인 시스템 구축',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-neo-cream">
      {/* 히어로 섹션 */}
      <section className="bg-neo-pink border-b-3 border-neo-black">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white mb-4">
            함께 일할 동료를 찾습니다
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            바이브랩스는 즐겁게 일하고 함께 성장하는 문화를 만들어갑니다
          </p>
        </div>
      </section>

      {/* 회사 소개 섹션 */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-neo-white border-3 border-neo-black shadow-neo-lg p-8 sm:p-12">
          <h2 className="text-3xl font-black uppercase text-neo-black mb-6">
            Vibe Store에서 함께하기
          </h2>
          <div className="space-y-4 text-lg text-neo-black/70 leading-relaxed">
            <p>
              바이브랩스는 디지털 크리에이터를 위한 최고의 마켓플레이스를 만들고 있습니다.
              우리는 기술을 통해 창작자들이 더 많은 사람들에게 가치를 전달할 수 있도록 돕습니다.
            </p>
            <p>
              빠르게 변화하는 환경에서 함께 배우고 성장하며, 사용자에게 진정한 가치를 제공하는 것에
              집중합니다. 작은 팀이지만 큰 임팩트를 만들어가고 있습니다.
            </p>
          </div>

          {/* 혜택 */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-neo-blue mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-neo-black">유연한 근무 환경</h3>
                <p className="text-sm text-neo-black/70">원격 근무 및 자율 출퇴근</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-neo-pink mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-neo-black">성장 지원</h3>
                <p className="text-sm text-neo-black/70">교육비 및 컨퍼런스 지원</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-neo-lime mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-neo-black">최신 장비</h3>
                <p className="text-sm text-neo-black/70">MacBook Pro 및 듀얼 모니터</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-neo-purple mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-neo-black">스톡옵션</h3>
                <p className="text-sm text-neo-black/70">함께 성장하는 보상</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 채용 공고 목록 */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-black uppercase text-neo-black mb-8">
          현재 채용중인 포지션
        </h2>

        <div className="space-y-6">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-neo-white border-3 border-neo-black shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-neo-black mb-2">
                      {job.title}
                    </h3>
                    <p className="text-neo-black/70">{job.description}</p>
                  </div>
                  <a
                    href={`mailto:careers@vibestore.com?subject=지원: ${job.title}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neo-blue text-white border-3 border-neo-black shadow-neo font-bold uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all whitespace-nowrap self-start"
                  >
                    <Mail className="w-5 h-5" strokeWidth={2.5} />
                    지원하기
                  </a>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-neo-black/50" strokeWidth={2.5} />
                    <span className="text-sm font-medium text-neo-black">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-neo-black/50" strokeWidth={2.5} />
                    <span className="text-sm font-medium text-neo-black">{job.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-neo-yellow border-y-3 border-neo-black py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black uppercase text-neo-black mb-4">
            지원 방법
          </h2>
          <p className="text-lg text-neo-black/70 mb-8">
            원하는 포지션이 없더라도 언제든 연락주세요. <br />
            이력서와 포트폴리오를 <strong>careers@vibestore.com</strong>으로 보내주시면
            검토 후 연락드리겠습니다.
          </p>
          <a
            href="mailto:careers@vibestore.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neo-black text-white border-3 border-neo-black shadow-neo font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all"
          >
            <Mail className="w-5 h-5" strokeWidth={2.5} />
            이메일 보내기
          </a>
        </div>
      </section>
    </div>
  );
}
