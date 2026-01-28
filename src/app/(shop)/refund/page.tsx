import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '환불 정책 | Vibe Store',
  description: 'Vibe Store 디지털 상품 환불 정책 및 절차 안내',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-neo-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-neo-black uppercase mb-3">
            환불 정책
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
                디지털 상품 환불 조건
              </h2>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                Vibe Store의 모든 상품은 <strong>디지털 콘텐츠</strong>로 즉시 다운로드가 가능합니다.
                디지털 상품의 특성상, 다음 조건을 충족하는 경우에만 환불이 가능합니다:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li>상품 다운로드 전에 환불을 요청한 경우</li>
                <li>상품에 치명적인 오류가 있어 사용이 불가능한 경우</li>
                <li>상품 설명과 실제 내용이 현저히 다른 경우</li>
                <li>구매 후 7일 이내 요청 시 (단, 다운로드하지 않은 경우)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                환불 절차
              </h2>
              <ol className="list-decimal pl-6 space-y-3 text-neo-black/80">
                <li>
                  <strong>환불 요청 제출</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>마이페이지 {'>'} 주문내역에서 해당 상품 선택</li>
                    <li>&quot;환불 요청&quot; 버튼 클릭 후 사유 작성</li>
                    <li>또는 고객센터 이메일(support@vibestore.com)로 문의</li>
                  </ul>
                </li>
                <li>
                  <strong>검토 및 승인</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>영업일 기준 3일 이내 환불 사유 검토</li>
                    <li>필요 시 추가 자료 요청 가능</li>
                    <li>승인 시 이메일로 안내 발송</li>
                  </ul>
                </li>
                <li>
                  <strong>환불 처리</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>승인 후 5~7 영업일 내 결제 수단으로 환불</li>
                    <li>신용카드: 카드사 정책에 따라 1~2주 소요</li>
                    <li>계좌이체: 입금 계좌로 직접 송금</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                환불 제외 사항
              </h2>
              <p className="text-neo-black/80 leading-relaxed mb-4">
                다음의 경우 환불이 <strong>불가능</strong>합니다:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neo-black/80">
                <li>상품을 이미 다운로드하여 사용한 경우</li>
                <li>단순 변심 또는 구매 실수 (다운로드 후)</li>
                <li>시스템 요구사항 미확인으로 인한 호환성 문제</li>
                <li>구매자의 귀책사유로 인한 사용 불가</li>
                <li>프로모션 또는 할인가로 구매한 상품 (특정 조건 명시 시)</li>
                <li>구매 후 7일 경과 (다운로드 여부 무관)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                부분 환불
              </h2>
              <p className="text-neo-black/80 leading-relaxed">
                번들 상품의 경우, 일부 파일만 다운로드한 경우 미다운로드 파일에 대해서만 부분 환불이 가능할 수 있습니다.
                자세한 내용은 고객센터로 문의해 주세요.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                문의 방법
              </h2>
              <div className="bg-neo-cream border-2 border-neo-black p-4 rounded">
                <p className="text-neo-black font-semibold mb-2">환불 관련 문의</p>
                <ul className="space-y-1 text-neo-black/80">
                  <li><strong>이메일:</strong> support@vibestore.com</li>
                  <li><strong>운영 시간:</strong> 평일 10:00 ~ 18:00 (KST)</li>
                  <li><strong>응답 시간:</strong> 영업일 기준 24시간 이내</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-neo-black uppercase mb-4">
                소비자 보호
              </h2>
              <p className="text-neo-black/80 leading-relaxed">
                본 환불 정책은 <strong>전자상거래법</strong> 및 <strong>소비자보호법</strong>에 따라 운영됩니다.
                분쟁 발생 시 <a href="https://www.ecmc.or.kr" target="_blank" rel="noopener noreferrer" className="text-neo-blue underline">한국소비자원</a> 또는
                <a href="https://www.consumer.go.kr" target="_blank" rel="noopener noreferrer" className="text-neo-blue underline"> 공정거래위원회</a>에
                분쟁조정을 신청할 수 있습니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
