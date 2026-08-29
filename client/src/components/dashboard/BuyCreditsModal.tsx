import { useState } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CreditCard, HelpCircle } from "lucide-react";

interface BuyCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BuyCreditsModal = ({ isOpen, onClose }: BuyCreditsModalProps) => {
    const [selectedPackage, setSelectedPackage] = useState<'starter' | 'growth' | 'professional' | 'custom'>('growth');
    const [customAmount, setCustomAmount] = useState<string>('');

    const packages = {
        starter: { credits: 500, price: 49, bestValue: false },
        growth: { credits: 2000, price: 149, bestValue: true },
        professional: { credits: 5000, price: 299, bestValue: false },
    };

    const getPricePerCredit = () => 0.12;

    const currentCredits = 1240;
    const addedCredits = selectedPackage === 'custom' 
        ? (parseInt(customAmount) || 0) 
        : packages[selectedPackage as keyof typeof packages].credits;
    
    const totalPrice = selectedPackage === 'custom'
        ? (addedCredits * getPricePerCredit()).toFixed(2)
        : packages[selectedPackage as keyof typeof packages].price.toFixed(2);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="p-8 bg-white relative">
                    <DialogClose className="absolute right-6 top-6 rounded-full p-2 hover:bg-gray-100 transition-colors">
                        <X className="h-5 w-5 text-gray-400" />
                    </DialogClose>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Buy Extra Credits</h2>
                        <p className="text-gray-500 text-sm">Select a package to top up your resource balance instantly.</p>
                    </div>

                    <div className="flex bg-gray-50 p-1 rounded-xl mb-8 w-fit mx-auto">
                        <button className="px-6 py-2 text-sm font-semibold text-primary bg-white rounded-lg shadow-sm">AI Document Credits</button>
                        <button className="px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700">Notary Sessions</button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {Object.entries(packages).map(([key, pkg]) => (
                            <div 
                                key={key}
                                onClick={() => setSelectedPackage(key as any)}
                                className={`relative cursor-pointer transition-all duration-300 rounded-2xl p-6 border-2 flex flex-col items-center text-center ${
                                    selectedPackage === key 
                                    ? 'border-primary bg-secondary/30' 
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                            >
                                {pkg.bestValue && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                                        BEST VALUE
                                    </div>
                                )}
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{key}</span>
                                <div className="text-2xl font-black text-gray-900 mb-1">{pkg.credits.toLocaleString()}</div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase mb-4">Credits</span>
                                <div className="h-px w-full bg-gray-100 mb-4" />
                                <div className="text-xl font-bold text-primary">${pkg.price}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-px flex-1 bg-gray-100" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Or Enter Custom Amount</span>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>
                        
                        <div 
                            className={`flex items-center gap-4 bg-gray-50 p-4 rounded-xl border-2 transition-all ${
                                selectedPackage === 'custom' ? 'border-primary ring-2 ring-violet-50' : 'border-transparent'
                            }`}
                        >
                            <Input 
                                type="number"
                                placeholder="Enter number of credits (min. 100)"
                                className="bg-transparent border-none shadow-none focus-visible:ring-0 text-sm font-medium"
                                value={customAmount}
                                onChange={(e) => {
                                    setCustomAmount(e.target.value);
                                    setSelectedPackage('custom');
                                }}
                                onFocus={() => setSelectedPackage('custom')}
                            />
                            <div className="text-xs font-bold text-primary whitespace-nowrap font-mono tracking-tight bg-secondary px-3 py-1.5 rounded-lg">
                                ${getPricePerCredit()} / credit
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50/80 rounded-2xl p-6 flex items-center justify-between mb-8 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">New Balance</p>
                                <div className="text-xl font-black text-gray-900">
                                    {(currentCredits + addedCredits).toLocaleString()} 
                                    <span className="text-xs font-bold text-gray-400 ml-2">Credits</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Charge</p>
                            <div className="text-2xl font-black text-primary">${totalPrice}</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 mb-8 bg-secondary/30 p-4 rounded-xl border border-border/50">
                        <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-primary leading-relaxed font-medium">
                            Charges will be applied to your default card ending in 4242. You can manage your payment methods in the billing dashboard.
                        </p>
                    </div>

                    <Button className="w-full h-14 bg-primary hover:bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        Confirm Purchase
                    </Button>
                    
                    <p className="text-center mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Secure 256-bit SSL Encrypted Payment
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};
