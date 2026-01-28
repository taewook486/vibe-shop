import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | Vibe Store',
  description: 'Vibe Store 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neo-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-neo-black uppercase mb-3">
            개인정보처리방침
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
                Vibe Store(이하 &quot;사이트&quot;)는 이용자의 개인정보를 소중히 여기며, <strong>개인정보보호법</strong> 및
                <strong>정보통신망 이용촉진 및 정보보호 등에 관한 법률</strong>에 따라 개인정보를 처리하고 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                1. 수집하는 개인정보
              </h2>

              <h3 className="text-xl font-bold text-neo-black mb-3 mt-4">1.1 필수 수집 항목</h3>
              <div className="bg-neo-cream border-2 border-neo-black p-4 rounded mb-4">
                <p className="font-semibold text-neo-black mb-2">회원 가입 시</p>
                <ul className="list-disc pl-6 space-y-1 text-neo-black/80">
                  <li>이메일 주소 (계정 ID)</li>
                  <li>비밀번호 (암호화 저장)</li>
                  <li>이름 또는 닉네임</li>
                </ul>
              </div>

              <div className="bg-neo-cream border-2 border-neo-black p-4 rounded mb-4">
                <p className="font-semibold text-neo-black mb-2">결제 시</p>
                <ul className="list-disc pl-6 space-y-1 text-neo-black/80">
                  <li>결제자명</li>
                  <li>결제 정보 (카드 정보는 토스페이먼츠에서 처리하며 사이트에 저장되지 않음)</li>
                  <li>휴대전화번호 (결제 확인 및 환불 처리용)</li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-neo-black mb-3 mt-4">1.2 자동 수집 항목</h3>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li>IP 주소, 브라우저 종류, OS 정보</li>
                <li>서비스 이용 기록, 접속 로그</li>
                <li>쿠키 (Cookie) 정보</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                2. 개인정보 이용 목적
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li><strong>회원 관리:</strong> 회원 가입 및 인증, 서비스 제공, 계정 관리</li>
                <li><strong>상품 판매:</strong> 상품 구매, 결제 처리, 다운로드 링크 제공</li>
                <li><strong>고객 지원:</strong> 문의 응대, 환불 처리, 공지사항 발송</li>
                <li><strong>서비스 개선:</strong> 이용 통계 분석, 신규 기능 개발</li>
                <li><strong>법적 의무:</strong> 법령상 의무 이행, 분쟁 해결</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                3. 개인정보 보관 기간
              </h2>
              <table className="w-full border-2 border-neo-black">
                <thead className="bg-neo-yellow">
                  <tr>
                    <th className="border-2 border-neo-black p-3 text-left font-black">항목</th>
                    <th className="border-2 border-neo-black p-3 text-left font-black">보관 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-2 border-neo-black p-3">회원 정보</td>
                    <td className="border-2 border-neo-black p-3">회원 탈퇴 시까지</td>
                  </tr>
                  <tr className="bg-neo-cream">
                    <td className="border-2 border-neo-black p-3">구매/결제 기록</td>
                    <td className="border-2 border-neo-black p-3">5년 (전자상거래법)</td>
                  </tr>
                  <tr>
                    <td className="border-2 border-neo-black p-3">환불 기록</td>
                    <td className="border-2 border-neo-black p-3">5년 (전자상거래법)</td>
                  </tr>
                  <tr className="bg-neo-cream">
                    <td className="border-2 border-neo-black p-3">접속 로그</td>
                    <td className="border-2 border-neo-black p-3">3개월</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                4. 개인정보 제3자 제공
              </h2>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                사이트는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
                다만, 다음의 경우 예외적으로 제공될 수 있습니다:
              </p>

              <div className="bg-neo-blue/10 border-2 border-neo-blue p-4 rounded mb-4">
                <p className="font-semibold text-neo-black mb-2">결제 처리 업체</p>
                <ul className="list-disc pl-6 space-y-1 text-neo-black/80">
                  <li><strong>제공받는 자:</strong> 토스페이먼츠</li>
                  <li><strong>제공 항목:</strong> 결제자명, 결제 금액, 휴대전화번호</li>
                  <li><strong>이용 목적:</strong> 결제 처리 및 환불</li>
                  <li><strong>보유 기간:</strong> 거래 완료 후 5년</li>
                </ul>
              </div>

              <p className="text-neo-black/80 leading-relaxed">
                그 외 법령에 의해 개인정보 제공이 요구되는 경우, 이용자에게 사전 고지 후 제공합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                5. 이용자의 권리
              </h2>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li><strong>열람권:</strong> 자신의 개인정보를 조회할 수 있습니다</li>
                <li><strong>정정권:</strong> 잘못된 정보를 수정할 수 있습니다</li>
                <li><strong>삭제권:</strong> 개인정보 삭제를 요청할 수 있습니다 (법령에 의한 보관 제외)</li>
                <li><strong>처리 정지권:</strong> 개인정보 처리의 정지를 요청할 수 있습니다</li>
              </ul>
              <p className="text-neo-black/80 leading-relaxed mt-4">
                권리 행사는 마이페이지 또는 고객센터(privacy@vibestore.com)를 통해 신청할 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                6. 개인정보 보호 조치
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li><strong>암호화:</strong> 비밀번호 및 민감 정보는 암호화하여 저장</li>
                <li><strong>접근 통제:</strong> 개인정보 처리 시스템에 대한 접근 권한 제한</li>
                <li><strong>보안 서버:</strong> SSL/TLS 프로토콜을 통한 안전한 데이터 전송</li>
                <li><strong>정기 점검:</strong> 개인정보 처리 시스템에 대한 정기적인 보안 점검</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                7. 쿠키(Cookie) 사용
              </h2>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                사이트는 이용자에게 최적화된 서비스를 제공하기 위해 쿠키를 사용합니다:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li><strong>목적:</strong> 로그인 상태 유지, 이용 통계 분석</li>
                <li><strong>거부 방법:</strong> 브라우저 설정에서 쿠키 차단 가능 (일부 기능 제한될 수 있음)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                8. 개인정보 보호책임자
              </h2>
              <div className="bg-neo-cream border-2 border-neo-black p-4 rounded">
                <p className="font-semibold text-neo-black mb-2">개인정보 보호책임자</p>
                <ul className="space-y-1 text-neo-black/80">
                  <li><strong>이름:</strong> 홍길동</li>
                  <li><strong>직책:</strong> 개인정보보호팀장</li>
                  <li><strong>이메일:</strong> privacy@vibestore.com</li>
                  <li><strong>전화:</strong> 02-1234-5678</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                9. 방침 변경
              </h2>
              <p className="text-neo-black/80 leading-relaxed">
                본 개인정보처리방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며,
                변경 시 최소 7일 전에 공지사항을 통해 안내합니다. 중요한 변경사항은
                이메일로도 개별 통지합니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
