import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | Vibe Store',
  description: 'Vibe Store 서비스 이용약관',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neo-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-neo-black uppercase mb-3">
            이용약관
          </h1>
          <p className="text-neo-black/60 text-sm md:text-base">
            마지막 업데이트: 2026년 1월 1일
          </p>
        </div>

        {/* 콘텐츠 카드 */}
        <div className="bg-neo-white border-3 border-neo-black shadow-neo p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                제1조 (목적)
              </h2>
              <p className="text-neo-black/80 leading-relaxed">
                본 약관은 Vibe Store(이하 &quot;사이트&quot;)가 제공하는 디지털 상품 판매 서비스(이하 &quot;서비스&quot;)의
                이용 조건 및 절차, 회원과 사이트의 권리·의무 및 책임사항을 규정하는 것을 목적으로 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                제2조 (서비스 이용 조건)
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li>만 14세 이상의 개인 또는 법인만 서비스를 이용할 수 있습니다</li>
                <li>회원 가입 시 제공한 정보는 정확하고 최신의 것이어야 합니다</li>
                <li>타인의 정보를 도용하여 가입한 경우 법적 책임을 질 수 있습니다</li>
                <li>계정 정보는 본인만 사용해야 하며, 타인과 공유할 수 없습니다</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                제3조 (회원 가입 및 탈퇴)
              </h2>
              <h3 className="text-xl font-bold text-neo-black mb-3 mt-4">3.1 회원 가입</h3>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li>이메일 주소와 비밀번호를 입력하여 가입할 수 있습니다</li>
                <li>소셜 로그인(Google, GitHub 등)을 통해 가입할 수 있습니다</li>
                <li>가입 시 본 약관 및 개인정보처리방침에 동의해야 합니다</li>
              </ul>

              <h3 className="text-xl font-bold text-neo-black mb-3 mt-4">3.2 회원 탈퇴</h3>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li>회원은 언제든지 마이페이지에서 탈퇴를 신청할 수 있습니다</li>
                <li>탈퇴 시 모든 개인정보는 즉시 삭제됩니다 (법령에 의한 보관 제외)</li>
                <li>구매한 디지털 상품은 탈퇴 후 다운로드 및 사용이 불가능합니다</li>
                <li>탈퇴 전 환불 가능한 상품에 대해 환불을 진행하시기 바랍니다</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                제4조 (서비스 이용 제한)
              </h2>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                다음의 경우 사이트는 사전 통지 없이 서비스 이용을 제한하거나 회원 자격을 정지·해지할 수 있습니다:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li>타인의 명의를 도용하거나 허위 정보를 등록한 경우</li>
                <li>구매한 디지털 상품을 무단으로 재배포 또는 판매하는 경우</li>
                <li>사이트의 시스템이나 서비스를 악의적으로 공격하거나 방해하는 경우</li>
                <li>다른 회원 또는 제3자의 권리를 침해하는 행위를 하는 경우</li>
                <li>법령 또는 본 약관을 위반하는 행위를 하는 경우</li>
                <li>결제 사기 또는 부정한 방법으로 서비스를 이용하는 경우</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                제5조 (저작권 및 지적재산권)
              </h2>
              <h3 className="text-xl font-bold text-neo-black mb-3 mt-4">5.1 사이트 콘텐츠</h3>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                사이트의 모든 콘텐츠(텍스트, 이미지, 로고, 디자인 등)는 Vibe Store 또는 원저작자의 지적재산입니다.
                무단 복제, 배포, 전송, 수정할 수 없습니다.
              </p>

              <h3 className="text-xl font-bold text-neo-black mb-3 mt-4">5.2 디지털 상품</h3>
              <p className="text-neo-black/80 leading-relaxed">
                구매한 디지털 상품의 저작권은 원저작자에게 있으며, 구매자는 개인적인 사용 목적으로만
                해당 상품을 사용할 수 있습니다. 자세한 내용은 <a href="/license" className="text-neo-blue underline">라이선스 페이지</a>를 참조하세요.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                제6조 (면책 조항)
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li>
                  <strong>서비스 중단:</strong> 천재지변, 시스템 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임지지 않습니다
                </li>
                <li>
                  <strong>디지털 상품:</strong> 상품의 품질 및 내용에 대한 책임은 판매자에게 있습니다
                </li>
                <li>
                  <strong>외부 링크:</strong> 사이트에 게시된 외부 링크의 콘텐츠에 대해 책임지지 않습니다
                </li>
                <li>
                  <strong>회원 간 거래:</strong> 회원 간의 거래나 분쟁에 대해 개입하지 않습니다
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                제7조 (결제 및 환불)
              </h2>
              <p className="text-neo-black/80 leading-relaxed">
                결제는 토스페이먼츠를 통해 안전하게 처리됩니다. 환불 정책은 <a href="/refund" className="text-neo-blue underline">환불 정책 페이지</a>를 참조하세요.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                제8조 (분쟁 해결)
              </h2>
              <p className="text-neo-black/80 leading-relaxed">
                본 약관과 관련된 분쟁은 대한민국 법률에 따라 해결되며, 소송이 필요한 경우
                사이트의 소재지를 관할하는 법원을 전속 관할로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                제9조 (약관의 변경)
              </h2>
              <p className="text-neo-black/80 leading-relaxed">
                사이트는 필요 시 본 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해
                최소 7일 전에 안내합니다. 변경 후에도 서비스를 계속 이용하는 경우
                변경된 약관에 동의한 것으로 간주합니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
