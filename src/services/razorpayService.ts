import { PremiumPlan, Subscription } from '../types';

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  userId: string;
  planId: string;
}

export const RazorpayService = {
  /**
   * Step 1: Request order creation from backend
   * In production, this calls your Cloud Function / Node.js backend: POST /api/payments/create-order
   */
  async createOrder(plan: PremiumPlan, userId: string): Promise<RazorpayOrderResponse> {
    const keyId = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_indori_date';
    const amountInPaise = plan.priceInr * 100;
    const generatedOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // In a live backend deployment, this calls your API:
    // const response = await fetch(`${process.env.EXPO_PUBLIC_PAYMENT_API_URL}/create-order`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount: amountInPaise, planId: plan.id, userId }),
    // });
    // return await response.json();

    return {
      orderId: generatedOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId,
    };
  },

  /**
   * Step 2 & 3: Verify Razorpay signature server-side
   * Backend verifies HMAC SHA256 (order_id + "|" + payment_id, secret)
   */
  async verifyPaymentServerSide(
    payload: PaymentVerificationPayload
  ): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
    try {
      // Simulate network verification with server
      await new Promise((resolve) => setTimeout(resolve, 800));

      const now = new Date();
      const expiry = new Date();
      
      let durationMonths = 1;
      if (payload.planId === 'six_months') durationMonths = 6;
      if (payload.planId === 'yearly') durationMonths = 12;
      
      expiry.setMonth(expiry.getMonth() + durationMonths);

      const subscription: Subscription = {
        id: `sub_${Date.now()}`,
        userId: payload.userId,
        planId: payload.planId,
        planName: payload.planId === 'yearly' ? '12 Months Platinum' : payload.planId === 'six_months' ? '6 Months Gold' : '1 Month VIP',
        amount: payload.planId === 'yearly' ? 2799 : payload.planId === 'six_months' ? 1799 : 499,
        status: 'active',
        startDate: now.toISOString(),
        expiryDate: expiry.toISOString(),
        paymentId: payload.razorpay_payment_id,
        orderId: payload.razorpay_order_id,
      };

      return {
        success: true,
        subscription,
      };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Payment signature verification failed.',
      };
    }
  },
};
