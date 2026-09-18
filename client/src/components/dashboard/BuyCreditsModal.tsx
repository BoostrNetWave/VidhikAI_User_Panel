import { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, CreditCard, Coins, Loader2, Check } from "lucide-react";
import api from '@/lib/api';
import { toast } from 'sonner';

interface BuyCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const BuyCreditsModal = ({ isOpen, onClose, onSuccess }: BuyCreditsModalProps) => {
    const [packages, setPackages] = useState<any[]>([
        { id: "extra-50", credits: 50, price: 199, desc: "50 Extra AI Credits", popular: false },
        { id: "extra-100", credits: 100, price: 349, desc: "100 Extra AI Credits", popular: true },
        { id: "extra-250", credits: 250, price: 749, desc: "250 Extra AI Credits", popular: false },
        { id: "extra-500", credits: 500, price: 1299, desc: "500 Extra AI Credits", popular: false },
        { id: "extra-1000", credits: 1000, price: 2299, desc: "1,000 Extra AI Credits", popular: false }
    ]);
    const [selectedPackageId, setSelectedPackageId] = useState<string>("extra-100");
    const [currentCredits, setCurrentCredits] = useState<number>(0);
    const [isPurchasing, setIsPurchasing] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const loadInfo = async () => {
            try {
                const res = await api.get('/subscription/plans');
                if (res.data?.success) {
                    if (res.data.data.extraCreditPackages) {
                        setPackages(res.data.data.extraCreditPackages);
                    }
                    if (res.data.data.userSubscription) {
                        setCurrentCredits(res.data.data.userSubscription.totalCredits ?? 0);
                    }
                }
            } catch (err) {
                console.error("Failed to load subscription info:", err);
            }
        };

        loadInfo();
    }, [isOpen]);

    const activePkg = packages.find(p => p.id === selectedPackageId) || packages[1] || packages[0];
    const addedCredits = activePkg?.credits || 100;
    const price = activePkg?.price || 349;

    const handlePurchase = async () => {
        setIsPurchasing(true);
        try {
            // 1. Ensure Razorpay checkout script is loaded
            if (!(window as any).Razorpay) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.async = true;
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            }

            // 2. Create authoritative order on server
            const orderRes = await api.post('/subscription/create-order', {
                type: 'package',
                packageId: activePkg.id
            });

            if (!orderRes.data?.success) {
                throw new Error(orderRes.data?.message || "Failed to initialize order.");
            }

            const { order } = orderRes.data;

            // 3. Open Razorpay Checkout modal
            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency || "INR",
                name: "Vidhik AI",
                description: order.description,
                order_id: order.id,
                prefill: order.prefill,
                theme: order.theme || { color: "#0f172a" },
                modal: {
                    ondismiss: () => {
                        setIsPurchasing(false);
                    }
                },
                handler: async (response: any) => {
                    try {
                        const verifyRes = await api.post('/subscription/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data?.success) {
                            toast.success(`Successfully added ${addedCredits} Extra AI Credits!`, {
                                description: `New total balance: ${verifyRes.data.data.totalCredits} Credits.`
                            });

                            // Sync localStorage
                            const userStr = localStorage.getItem('user_profile_data');
                            if (userStr && verifyRes.data.data.totalCredits !== undefined) {
                                try {
                                    const u = JSON.parse(userStr);
                                    u.aiCredits = verifyRes.data.data.totalCredits;
                                    localStorage.setItem('user_profile_data', JSON.stringify(u));
                                    window.dispatchEvent(new Event('storage'));
                                } catch (e) {
                                    console.error("Local profile update error:", e);
                                }
                            }

                            onSuccess?.();
                            onClose();
                        } else {
                            toast.error(verifyRes.data?.message || "Payment verification failed.");
                        }
                    } catch (verifyErr: any) {
                        toast.error(verifyErr.response?.data?.message || "Payment verification failed.");
                    } finally {
                        setIsPurchasing(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', (resp: any) => {
                toast.error(resp.error?.description || "Payment failed.");
                setIsPurchasing(false);
            });
            rzp.open();

        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || "Failed to purchase extra credits. Please try again.");
            setIsPurchasing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="p-8 bg-card relative">
                    <DialogClose className="absolute right-6 top-6 rounded-full p-2 hover:bg-secondary transition-colors">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </DialogClose>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <Coins className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">Buy Extra AI Credits</h2>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Non-expiring credits that roll over automatically. Perfect for high-volume research and large document reviews.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                        {packages.map((pkg) => {
                            const isSelected = selectedPackageId === pkg.id;
                            return (
                                <div 
                                    key={pkg.id}
                                    onClick={() => setSelectedPackageId(pkg.id)}
                                    className={`relative cursor-pointer transition-all duration-200 rounded-2xl p-5 border-2 flex flex-col items-center text-center ${
                                        isSelected 
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm scale-[1.02]' 
                                        : 'border-border bg-card hover:border-muted-foreground/30'
                                    }`}
                                >
                                    {pkg.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                                            POPULAR
                                        </div>
                                    )}
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Package</span>
                                    <div className="text-2xl font-black text-foreground mb-0.5">{pkg.credits.toLocaleString()}</div>
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase mb-3">AI Credits</span>
                                    <div className="h-px w-full bg-border mb-3" />
                                    <div className="text-lg font-bold text-primary">₹{pkg.price.toLocaleString()}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-secondary/40 rounded-2xl p-5 flex items-center justify-between mb-6 border border-border">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center text-primary">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">New Balance</p>
                                <div className="text-xl font-black text-foreground">
                                    {(currentCredits + addedCredits).toLocaleString()} 
                                    <span className="text-xs font-bold text-muted-foreground ml-2">Total Credits</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Total Charge</p>
                            <div className="text-2xl font-black text-foreground">₹{price.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="flex-1 rounded-xl h-12 font-bold"
                            disabled={isPurchasing}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handlePurchase}
                            className="flex-1 rounded-xl h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm"
                            disabled={isPurchasing}
                        >
                            {isPurchasing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Confirming Payment...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4" />
                                    Confirm & Pay ₹{price.toLocaleString()}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
