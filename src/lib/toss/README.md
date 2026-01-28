# Toss Payments Integration

Vibe Store의 Toss Payments 통합 라이브러리입니다.

## 파일 구조

```
src/lib/toss/
├── index.ts          # 통합 export
├── types.ts          # Toss Payments 타입 정의
├── payments.ts       # 결제 API 클라이언트
├── webhooks.ts       # 웹훅 처리 유틸
└── README.md         # 이 파일
```

## 환경 변수 설정

`.env.local`에 다음 환경 변수를 추가하세요:

```bash
# 테스트 모드 (개발 환경)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_your_test_client_key
TOSS_SECRET_KEY=test_sk_your_test_secret_key

# 프로덕션 모드
# NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_your_live_client_key
# TOSS_SECRET_KEY=live_sk_your_live_secret_key
```

⚠️ **중요**: `TOSS_SECRET_KEY`는 절대 클라이언트에 노출되면 안 됩니다. 서버 측에서만 사용하세요.

## 사용법

### 1. 결제 요청 (클라이언트 측)

```typescript
import { createPaymentRequest } from '@/lib/toss/payments';

// 결제 요청 데이터 생성
const paymentRequest = await createPaymentRequest({
  amount: 10000,
  orderId: 'ORD-20260125-0001',
  orderName: 'Next.js 템플릿',
  customerEmail: 'user@example.com',
  customerName: '홍길동',
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
  failUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/fail`,
});

// Toss Payment Widget 초기화
// (프론트엔드에서 @tosspayments/payment-widget-sdk 사용)
```

### 2. 결제 승인 (서버 측)

결제 위젯이 완료되면 서버에서 승인 처리합니다:

```typescript
// app/api/payments/confirm/route.ts
import { approvePayment } from '@/lib/toss/payments';

export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = await request.json();

  try {
    const payment = await approvePayment({
      paymentKey,
      orderId,
      amount,
    });

    // 결제 성공 후 주문 상태 업데이트
    // ...

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

### 3. 결제 취소

```typescript
import { cancelPayment } from '@/lib/toss/payments';

const canceledPayment = await cancelPayment(
  'payment_key_123',
  '고객 요청',
  10000 // 부분 취소 금액 (선택)
);
```

### 4. 결제 조회

```typescript
import { getPayment } from '@/lib/toss/payments';

const payment = await getPayment('payment_key_123');
console.log(payment.status); // 'DONE', 'CANCELED', etc.
```

### 5. 웹훅 처리

```typescript
// app/api/payments/webhook/route.ts
import { processWebhook } from '@/lib/toss/webhooks';
import type { TossPaymentResponse } from '@/lib/toss/types';

export async function POST(request: Request) {
  const payload = await request.json();

  const result = await processWebhook(payload, async (payment: TossPaymentResponse) => {
    // 결제 상태 변경 시 처리
    if (payment.status === 'DONE') {
      // 주문 완료 처리
      // 다운로드 권한 생성
      // 이메일 발송
    }
  });

  return NextResponse.json(result);
}
```

## 타입

모든 Toss Payments API 응답 타입이 정의되어 있습니다:

- `TossPaymentRequest` - 결제 요청
- `TossPaymentApprovalRequest` - 결제 승인 요청
- `TossPaymentResponse` - 결제 응답
- `TossWebhookPayload` - 웹훅 페이로드
- `TossCardInfo` - 카드 결제 정보
- `TossVirtualAccountInfo` - 가상계좌 정보
- 기타 등등...

## 테스트 모드

테스트 키를 사용하면 실제 결제 없이 테스트할 수 있습니다:

```bash
# 테스트 키는 'test_'로 시작
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
```

테스트 카드 번호:
- 카드번호: 4242-4242-4242-4242
- 유효기간: 임의의 미래 날짜
- CVC: 임의의 3자리 숫자

## 보안 주의사항

1. **Secret Key 보호**
   - `TOSS_SECRET_KEY`는 절대 클라이언트 코드에 포함하지 마세요
   - 환경 변수로만 관리하세요
   - `.env.local`은 반드시 `.gitignore`에 추가하세요

2. **결제 승인**
   - 클라이언트에서 직접 승인하지 마세요
   - 반드시 서버 API Route를 통해 승인하세요

3. **금액 검증**
   - 클라이언트에서 전달받은 금액을 그대로 사용하지 마세요
   - 서버에서 주문 금액을 재계산하고 검증하세요

4. **웹훅 검증**
   - 웹훅 요청이 Toss에서 왔는지 검증하세요
   - IP 화이트리스트 또는 서명 검증 사용

## 참고 문서

- [Toss Payments 개발자 문서](https://docs.tosspayments.com/)
- [결제 위젯 SDK](https://docs.tosspayments.com/reference/widget-sdk)
- [API 레퍼런스](https://docs.tosspayments.com/reference)
- [웹훅 가이드](https://docs.tosspayments.com/guides/webhook)

## 에러 처리

모든 함수는 에러 발생 시 `Error`를 throw합니다:

```typescript
try {
  const payment = await approvePayment(request);
} catch (error) {
  console.error('결제 승인 실패:', error.message);
  // 에러 처리
}
```

일반적인 에러 코드:
- `INVALID_PAYMENT_KEY` - 유효하지 않은 결제 키
- `PAYMENT_NOT_FOUND` - 결제 정보를 찾을 수 없음
- `ALREADY_PROCESSED` - 이미 처리된 결제
- `INVALID_REQUEST` - 잘못된 요청

## 라이센스

MIT
