/**
 * Toss Payments Webhook Handler
 * @see https://docs.tosspayments.com/guides/webhook
 */

import type { TossWebhookPayload, TossPaymentResponse } from './types';
import { validateWebhook } from './payments';

/**
 * Webhook event handler
 */
export type WebhookEventHandler = (payment: TossPaymentResponse) => Promise<void>;

/**
 * Process Toss Payments webhook
 */
export async function processWebhook(
  payload: TossWebhookPayload,
  handler: WebhookEventHandler
): Promise<{ success: boolean; message: string }> {
  // Validate webhook payload
  if (!validateWebhook(payload)) {
    return {
      success: false,
      message: 'Invalid webhook payload',
    };
  }

  try {
    // Process payment status change
    await handler(payload.data);

    return {
      success: true,
      message: 'Webhook processed successfully',
    };
  } catch (error) {
    console.error('Webhook processing error:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Default webhook handler (update order status)
 */
export async function defaultWebhookHandler(payment: TossPaymentResponse): Promise<void> {
  console.log('Payment status changed:', {
    paymentKey: payment.paymentKey,
    orderId: payment.orderId,
    status: payment.status,
    amount: payment.totalAmount,
  });

  // This should be implemented in the API route
  // Here we just log the event
  // In production, this would:
  // 1. Verify payment with Toss API
  // 2. Update order status in database
  // 3. Create download permissions
  // 4. Send confirmation email
}
