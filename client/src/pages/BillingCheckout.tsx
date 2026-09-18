import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    ArrowLeft, 
    Lock, 
    CreditCard, 
    HelpCircle, 
    ShieldCheck, 
    CheckCircle2,
    Gavel,
    Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from '@/lib/api';
import { toast } from 'sonner';

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

    const [saveCard, setSaveCard] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate amounts in INR
    let itemName = '';
    let itemSubtext = '';
    let totalAmount = 0;

    if (checkoutType === 'package' && selectedPackage) {
        itemName = `${selectedPackage.credits.toLocaleString()} Extra AI Credits`;
        itemSubtext = 'Non-expiring rollover credit pack';
        totalAmount = selectedPackage.price;
    } else {
        itemName = `${selectedPlan.name} Plan Subscription`;
        if (billingCycle === 'yearly') {
            const price = typeof selectedPlan.priceYearly === 'number' ? selectedPlan.priceYearly : 4990;
            itemSubtext = `Billed Annually (₹${Math.round(price / 12).toLocaleString()}/mo equivalent)`;
            totalAmount = price;
        } else {
            const price = typeof selectedPlan.priceMonthly === 'number' ? selectedPlan.priceMonthly : 499;
            itemSubtext = `Billed Monthly (Renews every 30 days)`;
            totalAmount = price;
        }
    }

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        try {
            if (checkoutType === 'package' && selectedPackage) {
                const res = await api.post('/subscription/purchase-extra-credits', {
                    packageId: selectedPackage.id
                });
                if (res.data?.success) {
                    toast.success(`Payment Successful! Added ${selectedPackage.credits} Extra AI Credits.`, {
                        description: `Your new total balance is ${res.data.data.totalCredits} credits.`
                    });
                    navigate('/billing');
                }
            } else {
                const res = await api.post('/subscription/change-plan', {
                    planName: selectedPlan.name,
                    billingCycle
                });
                if (res.data?.success) {
                    toast.success(`Successfully activated ${selectedPlan.name} Plan!`, {
                        description: `Your quota has been set to ${res.data.data.monthlyCredits} monthly credits.`
                    });
                    navigate('/billing');
                }
            }
        } catch (err: any) {
            console.error('Checkout failed:', err);
            toast.error(err.response?.data?.message || 'Payment processing failed. Please try again.');
        } finally {
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
                    <Lock className="w-3 h-3" />
                    Secure Checkout
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
                <div className="mb-12">
                    <button 
                        onClick={() => navigate('/billing')} 
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all mb-4 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Back to Subscription
                    </button>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* Left Column - Payment Information */}
                    <div className="flex-1 space-y-8 w-full">
                        <Card className="rounded-[2rem] border-gray-100 bg-white shadow-2xl shadow-gray-200/50 overflow-hidden">
                            <CardContent className="p-10">
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-10">Payment Details</h2>

                                {/* Saved Card Selector - Refined */}
                                <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-10 cursor-pointer hover:bg-gray-100 transition-colors group">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-[10px] font-black italic text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors">
                                            VISA
                                        </div>
                                        <span className="font-bold text-sm text-gray-900">Visa ending in 4242</span>
                                    </div>
                                    <div className="w-12 h-7 bg-gray-900 rounded-full relative p-1 transition-colors">
                                        <div className="w-5 h-5 bg-white rounded-full absolute right-1"></div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cardholder Name</Label>
                                        <Input 
                                            placeholder="Enter full name" 
                                            defaultValue="Client Account"
                                            className="h-14 rounded-xl bg-gray-50 border-none font-bold placeholder:text-gray-300 focus-visible:ring-2 focus-visible:ring-gray-900"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Card Number</Label>
                                        <div className="relative">
                                            <Input 
                                                placeholder="•••• •••• •••• 4242" 
                                                defaultValue="4242 •••• •••• 4242"
                                                className="h-14 rounded-xl bg-gray-50 border-none font-bold placeholder:text-gray-300 pr-14 focus-visible:ring-2 focus-visible:ring-gray-900"
                                            />
                                            <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Expiry Date</Label>
                                            <div className="flex gap-2">
                                                <select 
                                                    className="flex-1 h-14 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-gray-900"
                                                    defaultValue="12"
                                                >
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <option key={i} value={(i + 1).toString().padStart(2, '0')}>{(i + 1).toString().padStart(2, '0')}</option>
                                                    ))}
                                                </select>
                                                <select 
                                                    className="flex-1 h-14 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-gray-900"
                                                    defaultValue="2026"
                                                >
                                                    <option value="2025">2025</option>
                                                    <option value="2026">2026</option>
                                                    <option value="2027">2027</option>
                                                    <option value="2028">2028</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">CVV</Label>
                                            <div className="relative">
                                                <Input 
                                                    placeholder="***" 
                                                    type="password" 
                                                    maxLength={3}
                                                    defaultValue="888"
                                                    className="h-14 rounded-xl bg-gray-50 border-none font-bold placeholder:text-gray-300 pr-14 focus-visible:ring-2 focus-visible:ring-gray-900"
                                                />
                                                <HelpCircle className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 cursor-help" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex items-center space-x-3 pt-8 border-t border-gray-50">
                                    <Checkbox id="save-payment" checked={saveCard} onCheckedChange={(c) => setSaveCard(c as boolean)} className="rounded-md h-5 w-5 border-gray-200 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900" />
                                    <label htmlFor="save-payment" className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none cursor-pointer">
                                        Save for future billing
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-row items-center justify-center gap-12 py-8 opacity-30">
                            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-gray-900">
                                <ShieldCheck className="w-3 h-3" />
                                PCI DSS COMPLIANT
                            </div>
                            <div className="flex flex-row items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-gray-900">
                                <CheckCircle2 className="w-3 h-3" />
                                SSL SECURE 256-BIT
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-[420px]">
                        <Card className="rounded-[2rem] border border-gray-200 bg-white shadow-xl shadow-gray-200/50 sticky top-24 overflow-hidden">
                            <CardContent className="p-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Order Summary</h3>
                                
                                <div className="space-y-4 pb-8 border-b border-gray-100">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <p className="font-black text-gray-900 text-lg tracking-tight leading-none uppercase">{itemName}</p>
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{itemSubtext}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                                        <Check className="h-3.5 w-3.5" />
                                        <span>Instant Activation upon Payment</span>
                                    </div>
                                </div>

                                <div className="space-y-4 py-8 border-b border-gray-100">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                        <p>Subtotal</p>
                                        <p className="text-gray-900 font-bold">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                        <p>Platform Taxes (0%)</p>
                                        <p className="text-gray-900 font-bold">₹0.00</p>
                                    </div>
                                </div>

                                <div className="py-8">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Total Amount Due</p>
                                    <p className="text-4xl font-black text-gray-900 tracking-tight">
                                        ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>

                                <Button 
                                    className="w-full h-16 rounded-2xl bg-gray-900 text-white hover:bg-black shadow-xl transition-all font-black text-sm flex items-center justify-center gap-3 uppercase tracking-widest active:scale-[0.98]"
                                    onClick={handleConfirmPayment}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing Payment...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            Confirm & Activate
                                        </>
                                    )}
                                </Button>

                                <p className="text-center text-[8px] font-black uppercase tracking-widest text-gray-500 mt-6 leading-loose px-4">
                                    Protected by Vidhik 256-Bit Bank Grade Encryption
                                </p>
                            </CardContent>

                            {/* Guarantee Footer */}
                            <div className="bg-gray-50 p-6 flex gap-4 items-start border-t border-gray-100">
                                <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-900 mb-1">Satisfaction Guarantee</p>
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Cancel anytime with 1-click in your user billing dashboard.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-[8px] tracking-[0.3em] font-black uppercase text-gray-400 mt-auto">
                Vidhik Secure Checkout System v3.0
            </footer>
        </div>
    );
}
