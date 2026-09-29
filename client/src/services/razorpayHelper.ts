// Utility helper to manage Razorpay Checkout integration and test mode simulation

export interface IRazorpayOrder {
    id: string;
    amount: number; // in paise
    currency: string;
    keyId: string;
    name?: string;
    description?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
}

export interface IRazorpayPaymentResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;

        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });
};

export const launchRazorpayCheckout = async (params: {
    order: IRazorpayOrder;
    onSuccess: (response: IRazorpayPaymentResponse) => void | Promise<void>;
    onError?: (error: any) => void;
    onDismiss?: () => void;
}): Promise<boolean> => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
        if (params.onError) {
            params.onError(new Error("Failed to load Razorpay payment gateway script. Please check connection."));
        }
        return false;
    }

    const { order, onSuccess, onError, onDismiss } = params;

    const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: order.name || 'Vidhik AI',
        description: order.description || 'Legal Services Payment',
        order_id: order.id,
        prefill: order.prefill || {},
        theme: order.theme || { color: '#0f172a' },
        modal: {
            ondismiss: () => {
                if (onDismiss) onDismiss();
            }
        },
        handler: async (response: IRazorpayPaymentResponse) => {
            try {
                await onSuccess(response);
            } catch (err) {
                if (onError) onError(err);
            }
        }
    };

    try {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
            console.error('[Razorpay Checkout] Payment Failed:', resp.error);
            if (onError) onError(resp.error || new Error('Payment failed.'));
        });
        rzp.open();
        return true;
    } catch (err) {
        console.error('[Razorpay Checkout] Exception launching modal:', err);
        if (onError) onError(err);
        return false;
    }
};

/**
 * Creates dummy payment response parameters for 1-click Test Mode simulation
 */
export const createSimulatedTestResponse = (orderId: string): IRazorpayPaymentResponse => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return {
        razorpay_order_id: orderId || `order_sim_${timestamp}_${randomSuffix}`,
        razorpay_payment_id: `pay_sim_${timestamp}_${randomSuffix}`,
        razorpay_signature: `sig_sim_${timestamp}_${randomSuffix}`
    };
};
