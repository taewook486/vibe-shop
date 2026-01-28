import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '라이선스 | Vibe Store',
  description: 'Vibe Store 디지털 상품 사용 라이선스 안내',
};

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-neo-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-neo-black uppercase mb-3">
            라이선스
          </h1>
          <p className="text-neo-black/60 text-sm md:text-base">
            마지막 업데이트: 2026년 1월 1일
          </p>
        </div>

        {/* 콘텐츠 카드 */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <p className="text-neo-black/80 leading-relaxed">
                Vibe Store에서 구매한 디지털 상품은 아래의 <strong>사용 라이선스 조건</strong>에 따라
                이용할 수 있습니다. 라이선스는 상품에 따라 <strong>개인 라이선스</strong> 또는
                <strong>상업 라이선스</strong>로 구분됩니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                1. 디지털 상품 사용권
              </h2>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                구매한 디지털 상품에 대해 다음의 권리를 갖습니다:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li><strong>다운로드:</strong> 구매 후 즉시 다운로드 가능 (재다운로드 허용)</li>
                <li><strong>사용:</strong> 라이선스 유형에 따라 개인 또는 상업 프로젝트에 사용 가능</li>
                <li><strong>수정:</strong> 구매한 상품을 프로젝트에 맞게 수정 및 편집 가능</li>
                <li><strong>영구 사용:</strong> 구매 시점의 라이선스로 영구 사용 (기간 제한 없음)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                2. 개인 사용 라이선스
              </h2>

              <div className="bg-neo-blue/10 border-2 border-neo-blue p-4 rounded mb-4">
                <p className="font-semibold text-neo-black mb-2">개인 라이선스 포함 사항</p>
                <ul className="list-disc pl-6 space-y-1 text-neo-black/80">
                  <li>1인 개발자/디자이너의 개인 프로젝트에 사용</li>
                  <li>포트폴리오, 개인 블로그, 학습 목적 사용</li>
                  <li>오픈소스 프로젝트에 사용 (MIT 라이선스 권장)</li>
                  <li>비영리 프로젝트에 사용</li>
                </ul>
              </div>

              <div className="bg-neo-pink/10 border-2 border-neo-pink p-4 rounded">
                <p className="font-semibold text-neo-black mb-2">개인 라이선스 제외 사항</p>
                <ul className="list-disc pl-6 space-y-1 text-neo-black/80">
                  <li>상업적 목적의 제품 또는 서비스에 사용</li>
                  <li>클라이언트 프로젝트에 사용 (대행, 외주 등)</li>
                  <li>템플릿/테마 마켓플레이스에 재판매</li>
                  <li>여러 명이 협업하는 팀 프로젝트</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                3. 상업 사용 라이선스
              </h2>

              <div className="bg-neo-lime/20 border-2 border-neo-black p-4 rounded mb-4">
                <p className="font-semibold text-neo-black mb-2">상업 라이선스 포함 사항</p>
                <ul className="list-disc pl-6 space-y-1 text-neo-black/80">
                  <li>개인 라이선스의 모든 권리 포함</li>
                  <li>상업적 제품 및 서비스에 사용</li>
                  <li>클라이언트 프로젝트 (대행, 외주, 프리랜서)</li>
                  <li>팀 또는 조직에서 사용 (인원 제한 없음)</li>
                  <li>SaaS, 웹앱, 모바일 앱에 사용</li>
                  <li>무제한 최종 제품 (여러 프로젝트에 재사용 가능)</li>
                </ul>
              </div>

              <div className="bg-neo-pink/10 border-2 border-neo-pink p-4 rounded">
                <p className="font-semibold text-neo-black mb-2">상업 라이선스 제외 사항</p>
                <ul className="list-disc pl-6 space-y-1 text-neo-black/80">
                  <li>구매한 상품을 그대로 또는 약간 수정하여 재판매</li>
                  <li>템플릿/테마 마켓플레이스에 등록하여 판매</li>
                  <li>상품을 공개 저장소에 원본 형태로 업로드</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                4. 재배포 금지
              </h2>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                <strong>모든 라이선스</strong>에서 다음 행위는 엄격히 금지됩니다:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li>구매한 디지털 상품을 제3자에게 재판매, 공유, 배포하는 행위</li>
                <li>토렌트, 파일 공유 사이트 등에 업로드하는 행위</li>
                <li>GitHub 등 공개 저장소에 원본 파일을 업로드하는 행위 (컴파일된 결과물은 가능)</li>
                <li>다른 사람이 다운로드할 수 있는 형태로 제공하는 행위</li>
              </ul>

              <div className="bg-neo-yellow/50 border-2 border-neo-black p-4 rounded mt-4">
                <p className="font-semibold text-neo-black mb-2">⚠️ 위반 시 처벌</p>
                <p className="text-neo-black/80">
                  재배포 금지 조항을 위반하는 경우 법적 조치를 취할 수 있으며,
                  회원 자격이 영구 정지되고 향후 서비스 이용이 불가능합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                5. 저작권 표시
              </h2>

              <h3 className="text-xl font-bold text-neo-black mb-3 mt-4">5.1 개인 라이선스</h3>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                포트폴리오, 블로그 등 공개된 프로젝트에서 사용하는 경우 다음과 같이 표시를 권장합니다:
              </p>
              <div className="bg-neo-black p-4 rounded font-mono text-sm text-neo-lime mb-4">
                Design resources from Vibe Store<br />
                https://vibestore.com
              </div>

              <h3 className="text-xl font-bold text-neo-black mb-3 mt-4">5.2 상업 라이선스</h3>
              <p className="text-neo-black/80 leading-relaxed">
                상업 프로젝트의 경우 저작권 표시는 <strong>선택사항</strong>입니다.
                단, 마케팅 목적으로 &quot;Made with Vibe Store&quot; 배지를 사용하실 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                6. 라이선스 업그레이드
              </h2>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                개인 라이선스로 구매한 상품을 상업 프로젝트에 사용하고 싶은 경우,
                라이선스를 업그레이드할 수 있습니다:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li>마이페이지 {'>'} 구매 내역에서 &quot;라이선스 업그레이드&quot; 선택</li>
                <li>차액만 결제하여 상업 라이선스로 전환</li>
                <li>업그레이드 후 즉시 상업 프로젝트에 사용 가능</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                7. 특별 라이선스
              </h2>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                일부 상품은 <strong>특별 라이선스</strong>가 적용될 수 있습니다:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li><strong>확장 라이선스:</strong> 재판매 가능한 제품 (템플릿 번들 등)</li>
                <li><strong>팀 라이선스:</strong> 팀 단위 구매 (인원 제한 있음)</li>
                <li><strong>기업 라이선스:</strong> 대규모 조직용 (별도 문의)</li>
              </ul>
              <p className="text-neo-black/80 leading-relaxed mt-4">
                특별 라이선스가 필요한 경우 고객센터(license@vibestore.com)로 문의해 주세요.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                8. 문의
              </h2>
              <div className="bg-neo-cream border-2 border-neo-black p-4 rounded">
                <p className="font-semibold text-neo-black mb-2">라이선스 관련 문의</p>
                <ul className="space-y-1 text-neo-black/80">
                  <li><strong>이메일:</strong> license@vibestore.com</li>
                  <li><strong>운영 시간:</strong> 평일 10:00 ~ 18:00 (KST)</li>
                  <li><strong>응답 시간:</strong> 영업일 기준 24시간 이내</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
