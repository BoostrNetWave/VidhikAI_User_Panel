import Razorpay from 'razorpay';
import crypto from 'crypto';

class RazorpayService {
    private razorpay: Razorpay | null = null;
    private keyId: string;
    private keySecret: string;
    private webhookSecret: string;

    constructor() {
        this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_SQDQhkqtpziQjS';
        this.keySecret = process.env.RAZORPAY_KEY_SECRET || 's9Rcs7NhSx7bfStIzMk8R34A';
        this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'vidhik_ai_razorpay_webhook_secret_2026';

        try {
            this.razorpay = new Razorpay({
                key_id: this.keyId,
                key_secret: this.keySecret,
            });
            console.log(`[Razorpay Service] Initialized with Key ID: ${this.keyId}`);
        } catch (error) {
            console.error('[Razorpay Service] Initialization Error:', error);
        }
    }

    public getKeyId(): string {
        return this.keyId;
    }

    /**
     * Create a Razorpay Order
     * @param amount Amount in INR (will be converted to paise)
     * @param receipt Receipt identifier
     * @param notes Additional metadata
     */
    public async createOrder(amount: number, receipt: string, notes: Record<string, any> = {}) {
        if (!this.razorpay) {
            throw new Error('Razorpay SDK is not initialized.');
        }

        const amountInPaise = Math.round(amount * 100);

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt,
            notes
        };

        const order = await this.razorpay.orders.create(options);
        return order;
    }

    /**
     * Cryptographically verify payment signature from Razorpay Checkout
     * Uses HMAC-SHA256 with timing-safe comparison
     */
    public verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
        try {
            const hmac = crypto.createHmac('sha256', this.keySecret);
            hmac.update(`${orderId}|${paymentId}`);
            const generatedSignature = hmac.digest('hex');

            const a = Buffer.from(generatedSignature);
            const b = Buffer.from(signature);

            if (a.length !== b.length) {
                return false;
            }

            return crypto.timingSafeEqual(a, b);
        } catch (error) {
            console.error('[Razorpay Service] Signature verification exception:', error);
            return false;
        }
    }

    /**
     * Verify incoming webhook payload signature
     */
    public verifyWebhookSignature(payload: string, signature: string): boolean {
        try {
            const hmac = crypto.createHmac('sha256', this.webhookSecret);
            hmac.update(payload);
            const generatedSignature = hmac.digest('hex');

            return generatedSignature === signature;
        } catch (error) {
            console.error('[Razorpay Service] Webhook signature verification error:', error);
            return false;
        }
    }

    /**
     * Fetch payment details from Razorpay
     */
    public async fetchPayment(paymentId: string) {
        if (!this.razorpay) {
            throw new Error('Razorpay SDK is not initialized.');
        }
        return await this.razorpay.payments.fetch(paymentId);
    }
}

export const razorpayService = new RazorpayService();
export default razorpayService;
