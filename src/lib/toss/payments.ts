/**
 * Toss Payments API Client
 * @see https://docs.tosspayments.com/reference
 */

import type {
  TossPaymentRequest,
  TossPaymentApprovalRequest,
  TossPaymentResponse,
  TossErrorResponse,
  TossWebhookPayload,
} from './types';

const TOSS_API_BASE_URL = 'https://api.tosspayments.com/v1';

/**
 * Get Toss Payments credentials
 */
function getCredentials() {
  const clientKey = process.env.TOSS_CLIENT_KEY || process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  const secretKey = process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    throw new Error('TOSS_SECRET_KEY is not configured');
  }

  return { clientKey, secretKey };
}

/**
 * Encode secret key for Basic Auth
 */
function encodeSecretKey(secretKey: string): string {
  return Buffer.from(`${secretKey}:`, 'utf-8').toString('base64');
}

/**
 * Validate payment request
 */
function validatePaymentRequest(request: TossPaymentRequest): void {
  if (!request.orderId || request.orderId.trim() === '') {
    throw new Error('주문번호는 필수입니다');
  }

  if (!request.amount || request.amount <= 0) {
    throw new Error('결제 금액은 0보다 커야 합니다');
  }

  if (!request.orderName || request.orderName.trim() === '') {
    throw new Error('주문명은 필수입니다');
  }

  if (!request.successUrl || !request.failUrl) {
    throw new Error('결제 완료/실패 URL은 필수입니다');
  }
}

/**
 * Validate payment approval request
 */
function validateApprovalRequest(request: TossPaymentApprovalRequest): void {
  if (!request.paymentKey || request.paymentKey.trim() === '') {
    throw new Error('결제 키는 필수입니다');
  }

  if (!request.orderId || request.orderId.trim() === '') {
    throw new Error('주문번호는 필수입니다');
  }

  if (!request.amount || request.amount <= 0) {
    throw new Error('결제 금액은 0보다 커야 합니다');
  }
}

/**
 * Create payment request (Client-side)
 * Returns payment request data for Toss Payment Widget
 */
export async function createPaymentRequest(
  request: TossPaymentRequest
): Promise<TossPaymentRequest> {
  validatePaymentRequest(request);

  // Client-side: just return validated request
  // The actual payment widget will be loaded on the frontend
  return {
    ...request,
    flowMode: request.flowMode || 'DEFAULT',
  };
}

/**
 * Approve payment (Server-side)
 * Must be called after payment widget completion
 */
export async function approvePayment(
  request: TossPaymentApprovalRequest
): Promise<TossPaymentResponse> {
  validateApprovalRequest(request);

  const { secretKey } = getCredentials();
  const encodedKey = encodeSecretKey(secretKey);

  const response = await fetch(`${TOSS_API_BASE_URL}/payments/confirm`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${encodedKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as TossErrorResponse;
    throw new Error(error.message || '결제 승인에 실패했습니다');
  }

  return data as TossPaymentResponse;
}

/**
 * Cancel payment
 */
export async function cancelPayment(
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number
): Promise<TossPaymentResponse> {
  if (!paymentKey || paymentKey.trim() === '') {
    throw new Error('결제 키는 필수입니다');
  }

  if (!cancelReason || cancelReason.trim() === '') {
    throw new Error('취소 사유는 필수입니다');
  }

  const { secretKey } = getCredentials();
  const encodedKey = encodeSecretKey(secretKey);

  const requestBody: any = {
    cancelReason,
  };

  if (cancelAmount) {
    requestBody.cancelAmount = cancelAmount;
  }

  const response = await fetch(
    `${TOSS_API_BASE_URL}/payments/${paymentKey}/cancel`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as TossErrorResponse;
    throw new Error(error.message || '결제 취소에 실패했습니다');
  }

  return data as TossPaymentResponse;
}

/**
 * Get payment information
 */
export async function getPayment(paymentKey: string): Promise<TossPaymentResponse> {
  if (!paymentKey || paymentKey.trim() === '') {
    throw new Error('결제 키는 필수입니다');
  }

  const { secretKey } = getCredentials();
  const encodedKey = encodeSecretKey(secretKey);

  const response = await fetch(`${TOSS_API_BASE_URL}/payments/${paymentKey}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${encodedKey}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as TossErrorResponse;
    throw new Error(error.message || '결제 정보 조회에 실패했습니다');
  }

  return data as TossPaymentResponse;
}

/**
 * Validate webhook payload
 */
export function validateWebhook(payload: TossWebhookPayload): boolean {
  if (!payload) {
    return false;
  }

  if (payload.eventType !== 'PAYMENT_STATUS_CHANGED') {
    return false;
  }

  if (!payload.createdAt || !payload.data) {
    return false;
  }

  if (!payload.data.paymentKey || !payload.data.orderId) {
    return false;
  }

  return true;
}

/**
 * Get Toss Payment Widget client key (for frontend)
 */
export function getTossClientKey(): string {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

  if (!clientKey) {
    throw new Error('NEXT_PUBLIC_TOSS_CLIENT_KEY is not configured');
  }

  return clientKey;
}
