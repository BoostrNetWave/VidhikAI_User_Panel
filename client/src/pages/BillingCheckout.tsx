import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    ArrowLeft, 
    Lock, 
    ShieldCheck, 
    CheckCircle2,
    Gavel,
    Loader2,
    Zap,
    Crown,
    Building2,
    Coins,
    Check,
    CreditCard,
    Smartphone,
    Globe
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from '@/lib/api';
import { toast } from 'sonner';
import {
    UpiLogo,
    GPayLogo,
    PhonePeLogo,
    PaytmLogo,
    VisaLogo,
    MastercardLogo,
    RuPayLogo,
    SbiLogo,
    HdfcLogo,
    IciciLogo,
    AxisLogo,
    CredLogo,
    MobiKwikLogo,
    AmazonPayLogo,
    RazorpayLogo
} from '@/components/billing/PaymentLogos';

// Helper to load Razorpay Checkout Script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
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

export default function BillingCheckout() {
    const navigate = useNavigate();
    const location = useLocation();

    // Support both plan upgrades and extra credit purchases passed through navigation state
    const checkoutType = location.state?.type || 'plan'; // 'plan' | 'package'
    const selectedPlan = location.state?.plan || {
        name: 'Starter',
        priceMonthly: 499,
        priceYearly: 4990,
        monthlyCredits: 150
    };
    const selectedPackage = location.state?.package || null;
    const billingCycle = (location.state?.billingCycle || 'monthly') as 'monthly' | 'yearly';

    const [isProcessing, setIsProcessing] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        loadRazorpayScript().then((loaded) => {
            setIsScriptLoaded(loaded);
        });
    }, []);

    // Calculate amounts in INR
    let itemName = '';
    let itemSubtext = '';
    let totalAmount = 0;
    const isFreePlan = checkoutType === 'plan' && (selectedPlan.name.toLowerCase() === 'free' || selectedPlan.priceMonthly === 0);

    if (checkoutType === 'package' && selectedPackage) {
        itemName = `${selectedPackage.credits.toLocaleString()} Extra AI Credits`;
        itemSubtext = 'Non-expiring rollover credit pack';
        totalAmount = selectedPackage.price;
    } else {
        itemName = `${selectedPlan.name} Plan Subscription`;
        if (isFreePlan) {
            itemSubtext = 'Free Forever tier with 30 monthly AI credits';
            totalAmount = 0;
        } else if (billingCycle === 'yearly') {
            const price = typeof selectedPlan.priceYearly === 'number' ? selectedPlan.priceYearly : 4990;
            itemSubtext = `Billed Annually (₹${Math.round(price / 12).toLocaleString()}/mo equivalent)`;
            totalAmount = price;
        } else {
            const price = typeof selectedPlan.priceMonthly === 'number' ? selectedPlan.priceMonthly : 499;
            itemSubtext = `Billed Monthly (Renews every 30 days)`;
            totalAmount = price;
        }
    }

    const handleInitiatePayment = async () => {
        setIsProcessing(true);

        try {
            // 1. If Free Plan: Activate immediately through backend without Razorpay
            if (isFreePlan) {
                const res = await api.post('/subscription/create-order', {
                    type: 'plan',
                    planName: 'Free',
                    billingCycle: 'monthly'
                });

                if (res.data?.success) {
                    toast.success("Free Plan Activated Successfully!", {
                        description: "Your quota has been reset to 30 monthly AI credits."
                    });

                    // Sync local storage
                    const userStr = localStorage.getItem('user_profile_data');
                    if (userStr) {
                        try {
                            const u = JSON.parse(userStr);
                            u.subscription = 'Free';
                            u.aiCredits = 30;
                            localStorage.setItem('user_profile_data', JSON.stringify(u));
                            window.dispatchEvent(new Event('storage'));
                        } catch (e) {
                            console.error("Local profile update error:", e);
                        }
                    }

                    navigate('/billing');
                    return;
                }
            }

            // 2. Load Razorpay script if not already available
            const loaded = isScriptLoaded || (await loadRazorpayScript());
            if (!loaded) {
                toast.error("Failed to load Razorpay payment gateway. Please check your internet connection.");
                setIsProcessing(false);
                return;
            }

            // 3. Request server to create authoritative Razorpay Order
            const payload = checkoutType === 'package' && selectedPackage
                ? { type: 'package', packageId: selectedPackage.id }
                : { type: 'plan', planName: selectedPlan.name, billingCycle };

            const orderRes = await api.post('/subscription/create-order', payload);

            if (!orderRes.data?.success) {
                throw new Error(orderRes.data?.message || "Failed to initialize payment order.");
            }

            const { order } = orderRes.data;

            // 4. Open Razorpay Checkout Modal
            const options = {
                key: order.keyId,
                amount: order.amount, // in paise
                currency: order.currency || "INR",
                name: "Vidhik AI",
                description: order.description,
                order_id: order.id,
                prefill: order.prefill,
                theme: order.theme || { color: "#0f172a" },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        toast.info("Payment was cancelled.");
                    }
                },
                handler: async (response: any) => {
                    // 5. Send cryptographic signatures for backend verification
                    try {
                        const verifyRes = await api.post('/subscription/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data?.success) {
                            toast.success("Payment Verified & Completed!", {
                                description: verifyRes.data.message
                            });

                            // Sync localStorage
                            const userStr = localStorage.getItem('user_profile_data');
                            if (userStr && verifyRes.data.data) {
                                try {
                                    const u = JSON.parse(userStr);
                                    if (verifyRes.data.data.plan) u.subscription = verifyRes.data.data.plan;
                                    if (verifyRes.data.data.totalCredits !== undefined) u.aiCredits = verifyRes.data.data.totalCredits;
                                    localStorage.setItem('user_profile_data', JSON.stringify(u));
                                    window.dispatchEvent(new Event('storage'));
                                } catch (e) {
                                    console.error("Local profile update error:", e);
                                }
                            }

                            navigate('/billing');
                        } else {
                            toast.error(verifyRes.data?.message || "Payment verification failed.");
                        }
                    } catch (verifyErr: any) {
                        console.error("Payment verification request failed:", verifyErr);
                        toast.error(verifyErr.response?.data?.message || "Payment verification failed on server.");
                    } finally {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', (resp: any) => {
                console.error("Razorpay payment error:", resp.error);
                toast.error(resp.error?.description || "Payment failed. Please try with another payment method.");
                setIsProcessing(false);
            });

            rzp.open();

        } catch (err: any) {
            console.error("Checkout initialization failed:", err);
            toast.error(err.response?.data?.message || err.message || "Failed to initialize checkout. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans mb-12">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-100 py-4 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xl overflow-hidden whitespace-nowrap">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                        <Gavel className="h-5 w-5" />
                    </div>
                    <span className="leading-none text-gray-900">Vidhik AI</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    Razorpay 256-Bit Encrypted
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
                <div className="mb-8">
                    <button 
                        onClick={() => navigate('/billing')} 
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all mb-3 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Back to Subscription Plans
                    </button>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout &amp; Payment</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Secure instant checkout powered by Razorpay Payment Gateway
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Razorpay Payment Gateway Info & Action */}
                    <div className="lg:col-span-7 space-y-6">
                        <Card className="rounded-3xl border-gray-200/80 bg-white shadow-xl shadow-gray-200/40 overflow-hidden">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-2">
                                    <div>
                                        <h2 className="text-base font-bold text-gray-900">Payment Gateway</h2>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-xs text-muted-foreground">Exclusive partner:</span>
                                            <RazorpayLogo className="h-4.5 w-auto" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-xs border border-blue-200 shadow-xs">
                                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                                        <span>Verified Gateway</span>
                                    </div>
                                </div>

                                {isFreePlan ? (
                                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                                        <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                                            <Zap className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Free Plan Activation</h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                No payment is required for the Free plan. Click below to activate your 30 monthly AI credits instantly.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Razorpay Gateway Supported Methods Card */}
                                        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">All Payment Modes Supported:</span>
                                                <Badge variant="outline" className="text-[10px] bg-white text-emerald-700 border-emerald-300 font-semibold shadow-xs">
                                                    Zero Convenience Fee
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                                {/* 1. UPI Instant */}
                                                <div className="bg-white p-3.5 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col items-center justify-between text-center gap-2">
                                                    <div className="h-7 flex items-center justify-center">
                                                        <UpiLogo className="h-5.5 w-auto" />
                                                    </div>
                                                    <div className="w-full">
                                                        <span className="text-[11px] font-bold text-gray-800 block">UPI Instant</span>
                                                        <div className="flex items-center justify-center gap-1.5 mt-1">
                                                            <GPayLogo className="h-3 w-auto" />
                                                            <PhonePeLogo className="h-3.5 w-3.5" />
                                                            <PaytmLogo className="h-2.5 w-auto" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 2. Cards (Visa, Mastercard, RuPay) */}
                                                <div className="bg-white p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col items-center justify-between text-center gap-2">
                                                    <div className="h-7 flex items-center justify-center gap-1.5">
                                                        <VisaLogo className="h-3.5 w-auto" />
                                                        <MastercardLogo className="h-4.5 w-auto" />
                                                    </div>
                                                    <div className="w-full">
                                                        <span className="text-[11px] font-bold text-gray-800 block">Cards</span>
                                                        <div className="flex items-center justify-center gap-1 mt-1">
                                                            <RuPayLogo className="h-3 w-auto" />
                                                            <span className="text-[9px] font-bold text-gray-500">• All Cards</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 3. NetBanking */}
                                                <div className="bg-white p-3.5 rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all flex flex-col items-center justify-between text-center gap-2">
                                                    <div className="h-7 flex items-center justify-center gap-1">
                                                        <HdfcLogo className="h-4 w-4" />
                                                        <SbiLogo className="h-4 w-4" />
                                                        <IciciLogo className="h-4 w-4" />
                                                        <AxisLogo className="h-4 w-4" />
                                                    </div>
                                                    <div className="w-full">
                                                        <span className="text-[11px] font-bold text-gray-800 block">NetBanking</span>
                                                        <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/80 mt-1 inline-block">
                                                            50+ Banks
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 4. Wallets & EMI */}
                                                <div className="bg-white p-3.5 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all flex flex-col items-center justify-between text-center gap-2">
                                                    <div className="h-7 flex items-center justify-center gap-1.5">
                                                        <CredLogo className="h-4 w-4" />
                                                        <MobiKwikLogo className="h-4 w-4" />
                                                        <AmazonPayLogo className="h-3 w-auto" />
                                                    </div>
                                                    <div className="w-full">
                                                        <span className="text-[11px] font-bold text-gray-800 block">Wallets &amp; EMI</span>
                                                        <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 mt-1 inline-block">
                                                            Cred, Mobikwik
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Security Banner */}
                                        <div className="flex items-start gap-3 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                                            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-bold">PCI-DSS Level 1 Compliant:</span>
                                                <span className="text-emerald-800 ml-1">
                                                    Your payment is processed directly inside Razorpay's RBI-regulated infrastructure. Vidhik AI never stores your card or banking credentials.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Main Action Button */}
                                <Button
                                    onClick={handleInitiatePayment}
                                    disabled={isProcessing}
                                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Processing Secure Order...</span>
                                        </>
                                    ) : isFreePlan ? (
                                        <>
                                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                            <span>Activate Free Plan (₹0)</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4 text-emerald-400" />
                                            <span>Pay ₹{totalAmount.toLocaleString()} via Razorpay</span>
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Order Summary Card */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="rounded-3xl border-gray-200/80 bg-white shadow-xl shadow-gray-200/40 overflow-hidden sticky top-24">
                            <CardContent className="p-8 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    Order Summary
                                </h3>

                                <div className="space-y-4 pb-6 border-b">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base">{itemName}</h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">{itemSubtext}</p>
                                        </div>
                                        <span className="font-extrabold text-base text-gray-900 shrink-0">
                                            ₹{totalAmount.toLocaleString()}
                                        </span>
                                    </div>

                                    {checkoutType === 'plan' && (
                                        <div className="bg-slate-50 p-3 rounded-xl border text-xs space-y-1.5">
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Credit Allocation:</span>
                                                <span className="font-bold text-foreground">{selectedPlan.monthlyCredits || 150} Monthly Credits</span>
                                            </div>
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Billing Frequency:</span>
                                                <span className="font-bold text-foreground capitalize">{billingCycle}</span>
                                            </div>
                                        </div>
                                    )}

                                    {checkoutType === 'package' && (
                                        <div className="bg-slate-50 p-3 rounded-xl border text-xs space-y-1.5">
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Extra AI Credits:</span>
                                                <span className="font-bold text-foreground">+{selectedPackage.credits} Credits</span>
                                            </div>
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Expiration:</span>
                                                <span className="font-bold text-emerald-600">Never Expires (Rollover)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-gray-800">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Goods &amp; Services Tax (GST)</span>
                                        <span className="font-semibold text-emerald-600">Included</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Payment Gateway Fee</span>
                                        <span className="font-semibold text-emerald-600">₹0 (Free)</span>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-4 border-t text-sm font-bold text-gray-900">
                                        <span className="text-base">Total Amount Payable</span>
                                        <span className="text-2xl font-black text-primary">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="pt-2 text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>Instant activation upon payment confirmation</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
}
