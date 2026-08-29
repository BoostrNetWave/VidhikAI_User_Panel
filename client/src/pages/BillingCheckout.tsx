import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Lock, 
    CreditCard, 
    HelpCircle, 
    ShieldCheck, 
    CheckCircle2,
    Gavel
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BillingCheckout() {
    const navigate = useNavigate();
    const [saveCard, setSaveCard] = useState(true);

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

                                {/* Saved Card Selector - Refined B&W */}
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
                                            className="h-14 rounded-xl bg-gray-50 border-none font-bold placeholder:text-gray-300 focus-visible:ring-2 focus-visible:ring-gray-900"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Card Number</Label>
                                        <div className="relative">
                                            <Input 
                                                placeholder="0000 0000 0000 0000" 
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
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>MM</option>
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <option key={i} value={(i + 1).toString().padStart(2, '0')}>{(i + 1).toString().padStart(2, '0')}</option>
                                                    ))}
                                                </select>
                                                <select 
                                                    className="flex-1 h-14 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-gray-900"
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>YYYY</option>
                                                    <option value="2024">2024</option>
                                                    <option value="2025">2025</option>
                                                    <option value="2026">2026</option>
                                                    <option value="2027">2027</option>
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
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-10">Order Summary</h3>
                                
                                <div className="space-y-8 pb-10 border-b border-gray-100">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <p className="font-black text-gray-900 text-lg tracking-tight leading-none uppercase">Professional Plan</p>
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Billed Annually (₹8,299/mo)</p>
                                        </div>
                                        <p className="font-black text-xl text-gray-900 tracking-tighter">₹99,588.00</p>
                                    </div>
                                </div>

                                <div className="space-y-5 py-10 border-b border-gray-100">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Subtotal</p>
                                        <p className="text-gray-900">₹99,588.00</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Taxes (0%)</p>
                                        <p className="text-gray-900">₹0.00</p>
                                    </div>
                                </div>

                                <div className="py-12">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Total Amount Due</p>
                                    <p className="text-5xl font-black text-gray-900 tracking-tighter">
                                        ₹99,588.00
                                    </p>
                                </div>

                                <Button 
                                    className="w-full h-16 rounded-2xl bg-gray-900 text-white hover:bg-black shadow-2xl shadow-gray-200 transition-all font-black text-base flex items-center justify-center gap-3 uppercase tracking-widest active:scale-[0.98]"
                                    onClick={() => navigate('/billing')}
                                >
                                    <Lock className="w-4 h-4" />
                                    Confirm & Pay
                                </Button>

                                <p className="text-center text-[8px] font-black uppercase tracking-widest text-gray-600 mt-8 leading-loose px-6">
                                    Protected by Vidhik Secure Encryption
                                </p>
                            </CardContent>

                            {/* Guarantee Footer */}
                            <div className="bg-white/5 p-8 flex gap-5 items-start border-t border-white/10">
                                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4 text-gray-900" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Money-Back Guarantee</p>
                                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed">Cancel anytime within 14 days for a full refund.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <footer className="py-12 text-center text-[8px] tracking-[0.3em] font-black uppercase text-gray-300 mt-auto">
                Vidhik Secure Checkout System v2.0
            </footer>
        </div>
    );
}
