/**
 * Toss Payments API Types
 * @see https://docs.tosspayments.com/reference
 */

export interface TossPaymentRequest {
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
  successUrl: string;
  failUrl: string;
  flowMode?: 'DEFAULT' | 'DIRECT';
  easyPay?: string;
  maxCardInstallmentPlan?: number;
}

export interface TossPaymentApprovalRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface TossPaymentResponse {
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED';
  requestedAt: string;
  approvedAt?: string;
  method?: 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER' | 'MOBILE_PHONE' | 'CULTURE_GIFT_CERTIFICATE' | 'FOREIGN_EASY_PAY';
  totalAmount: number;
  balanceAmount: number;
  suppliedAmount: number;
  vat: number;
  cultureExpense: boolean;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  card?: TossCardInfo;
  virtualAccount?: TossVirtualAccountInfo;
  transfer?: TossTransferInfo;
  mobilePhone?: TossMobilePhoneInfo;
  giftCertificate?: TossGiftCertificateInfo;
  receipt?: {
    url: string;
  };
  checkout?: {
    url: string;
  };
  currency: string;
  discount?: {
    amount: number;
  };
  cancels?: TossCancelInfo[];
  secret?: string;
  type: 'NORMAL' | 'BILLING' | 'BRANDPAY';
  easyPay?: {
    provider: string;
    amount: number;
    discountAmount: number;
  };
  country: string;
  failure?: {
    code: string;
    message: string;
  };
  isPartialCancelable: boolean;
  lastTransactionKey?: string;
}

export interface TossCardInfo {
  amount: number;
  issuerCode: string;
  acquirerCode?: string;
  number: string;
  installmentPlanMonths: number;
  approveNo: string;
  useCardPoint: boolean;
  cardType: 'CREDIT' | 'DEBIT' | 'GIFT';
  ownerType: 'INDIVIDUAL' | 'CORPORATE';
  acquireStatus: 'READY' | 'REQUESTED' | 'COMPLETED' | 'CANCEL_REQUESTED' | 'CANCELED';
  isInterestFree: boolean;
  interestPayer?: 'BUYER' | 'CARD_COMPANY' | 'MERCHANT';
}

export interface TossVirtualAccountInfo {
  accountType: 'NORMAL' | 'FIXED';
  accountNumber: string;
  bankCode: string;
  customerName: string;
  dueDate: string;
  refundStatus: 'NONE' | 'PENDING' | 'FAILED' | 'COMPLETED';
  expired: boolean;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
  refundReceiveAccount?: {
    bankCode: string;
    accountNumber: string;
    holderName: string;
  };
}

export interface TossTransferInfo {
  bankCode: string;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
}

export interface TossMobilePhoneInfo {
  customerMobilePhone: string;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
  receiptUrl: string;
}

export interface TossGiftCertificateInfo {
  approveNo: string;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
}

export interface TossCancelInfo {
  cancelAmount: number;
  cancelReason: string;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  refundableAmount: number;
  easyPayDiscountAmount: number;
  canceledAt: string;
  transactionKey: string;
  receiptKey?: string;
}

export interface TossWebhookPayload {
  eventType: 'PAYMENT_STATUS_CHANGED';
  createdAt: string;
  data: TossPaymentResponse;
}

export interface TossErrorResponse {
  code: string;
  message: string;
}

export type TossPaymentStatus = TossPaymentResponse['status'];
export type TossPaymentMethod = TossPaymentResponse['method'];
