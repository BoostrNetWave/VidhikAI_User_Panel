import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
    Card, 
    CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    Bell, 
    HelpCircle, 
    Check, 
    Download, 
    Mail,
    Plus,
    MessageSquare,
    ShieldCheck,
    ShoppingCart,
    MoreVertical,
    FileText,
    ChevronDown,
    Loader2
} from "lucide-react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface CircularProgressProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    label: string;
    sublabel: string;
    color?: string;
    trend?: string;
    isUnlimited?: boolean;
}

const CircularProgress = ({ value, size = 120, strokeWidth = 10, label, sublabel, color = "hsl(var(--primary))", trend, isUnlimited }: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center text-center">
            <div className="relative mb-4" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="hsl(var(--muted))"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={isUnlimited ? 0 : offset}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{isUnlimited ? "∞" : `${value}%`}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">{isUnlimited ? "Unlimited" : "Used"}</span>
                </div>
            </div>
            <h5 className="font-bold text-foreground mb-1">{label}</h5>
            <p className="text-xs text-muted-foreground mb-2">{sublabel}</p>
            {trend && (
                <span className={`text-[10px] font-bold ${trend.startsWith('-') ? 'text-destructive' : 'text-green-600'}`}>
                    {trend} from last month
                </span>
            )}
        </div>
    );
};

export default function BillingPlans() {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [activeTab, setActiveTab] = useState<'plans' | 'usage' | 'invoices'>('plans');

    // Top-up Modal State
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [topUpTab, setTopUpTab] = useState<'credits' | 'sessions'>('credits');
    const [selectedPackage, setSelectedPackage] = useState<'starter' | 'growth' | 'professional' | 'custom'>('growth');
    const [customCredits] = useState<number | ''>('');

    // Support Ticket States
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [ticketSubject, setTicketSubject] = useState("");
    const [ticketCategory, setTicketCategory] = useState("General");
    const [ticketPriority, setTicketPriority] = useState("Medium");
    const [ticketDescription, setTicketDescription] = useState("");
    const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketSubject.trim() || !ticketDescription.trim()) {
            toast.error("Subject and description are required.");
            return;
        }

        setIsSubmittingTicket(true);
        try {
            const response = await api.post('/support', {
                subject: ticketSubject,
                category: ticketCategory,
                priority: ticketPriority,
                description: ticketDescription
            });

            if (response.data.success) {
                toast.success("Support ticket created successfully!", {
                    description: `Ticket ID: ${response.data.data.ticketId}`
                });
                setIsTicketModalOpen(false);
                setTicketSubject("");
                setTicketCategory("General");
                setTicketPriority("Medium");
                setTicketDescription("");
            }
        } catch (error: any) {
            console.error("Failed to submit ticket:", error);
            toast.error(error.response?.data?.message || "Failed to submit support ticket");
        } finally {
            setIsSubmittingTicket(false);
        }
    };

    // Predefined Packages for Top-up
    const topUpPackages = {
        starter: { credits: 500, price: 49 },
        growth: { credits: 2000, price: 149 },
        professional: { credits: 5000, price: 299 },
        custom: { pricePerCredit: 0.12 }
    };

    // Derived Logic for Top-up
    let totalCharge = 0;
    let newBalance = 1240; // Base balance

    if (topUpTab === 'credits') {
        if (selectedPackage === 'custom') {
            const validCredits = typeof customCredits === 'number' && customCredits >= 100 ? customCredits : (typeof customCredits === 'number' ? 0 : 0);
            totalCharge = validCredits * topUpPackages.custom.pricePerCredit;
            newBalance += typeof customCredits === 'number' ? customCredits : 0;
        } else {
            const pkg = selectedPackage as 'starter' | 'growth' | 'professional';
            totalCharge = (topUpPackages[pkg] as { credits: number; price: number }).price;
            newBalance += (topUpPackages[pkg] as { credits: number; price: number }).credits;
        }
    } else {
        totalCharge = 0;
        newBalance = 3;
    }

    const subscriptionTiers = [
        {
            name: "Starter",
            priceMonthly: 2499,
            priceYearly: 23990,
            features: [
                "Basic AI tools",
                "50 generations/mo",
                "Email support"
            ],
            cta: "Upgrade to Starter",
            current: false,
            comingSoon: false,
            disabled: false
        },
        {
            name: "Professional",
            priceMonthly: 8299,
            priceYearly: 79670,
            features: [
                "Unlimited AI generations",
                "Standard Support (24h)",
                "Advanced templates"
            ],
            current: true,
            bestValue: true,
            cta: "Current Active Plan",
            disabled: true
        },
        {
            name: "Enterprise",
            priceMonthly: "Custom",
            priceYearly: "Custom",
            features: [
                "Custom Integrations",
                "Priority Lawyer Support",
                "Dedicated account manager"
            ],
            cta: "Contact Sales",
            current: false,
            disabled: false
        }
    ];

        const [plans, setPlans] = useState<any[]>(subscriptionTiers);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            let currentPlanName = 'Free';
            try {
                const statsResponse = await api.get('/dashboard/stats');
                if (statsResponse.data && statsResponse.data.success) {
                    setStats(statsResponse.data.data);
                    currentPlanName = statsResponse.data.data.plan || 'Free';
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoadingStats(false);
            }

            try {
                const response = await api.get('/admin/public/config');
                const userPlansConfig = response.data.find((c: any) => c.key === 'USER_PRICING_PLANS');
                if (userPlansConfig && Array.isArray(userPlansConfig.value)) {
                    const updatedPlans = userPlansConfig.value.map((tier: any) => {
                        const isCurrent = tier.name.toLowerCase() === currentPlanName.toLowerCase();
                        return {
                            ...tier,
                            current: isCurrent,
                            cta: isCurrent ? "Current Active Plan" : (tier.name === 'Enterprise' ? "Contact Sales" : `Upgrade to ${tier.name}`),
                            disabled: isCurrent
                        };
                    });
                    setPlans(updatedPlans);
                }
            } catch (error) {
                console.error("Error fetching user pricing plans from API:", error);
            } finally {
                setLoadingPlans(false);
            }
        };
        fetchData();
    }, []);

    const invoicesList = [
        { date: "Sep 12,\n2024", id: "INV-\n2024-009", plan: "Vidhik\nProfessional", amount: "₹8,299.00", status: "Paid" },
        { date: "Aug 12,\n2024", id: "INV-\n2024-008", plan: "Vidhik\nProfessional", amount: "₹8,299.00", status: "Paid" },
        { date: "Jul 12,\n2024", id: "INV-\n2024-007", plan: "Credit Top-\nup (500)", amount: "₹1,699.00", status: "Paid" },
        { date: "Jun 12,\n2024", id: "INV-\n2024-006", plan: "Vidhik\nProfessional", amount: "₹8,299.00", status: "Paid" }
    ];

    const paymentMethods = [
        { brand: "Visa", last4: "4242", expiry: "12/26", isDefault: true },
        { brand: "Mastercard", last4: "8888", expiry: "08/25", isDefault: false }
    ];

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-7xl mx-auto -mt-4">
                {/* Top Header/Nav */}
                <div className="flex items-center justify-between mb-8 py-4 border-b border-border px-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
                        <p className="text-sm text-muted-foreground">Monitor your account resources and manage payment methods.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search invoices..." 
                                className="pl-10 pr-4 py-2 bg-secondary border-none rounded-lg text-sm w-64 focus:ring-1 focus:ring-ring transition-all outline-none"
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent rounded-lg relative">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent rounded-lg">
                            <HelpCircle className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-8 mb-8 border-b border-border px-4">
                    {['plans', 'usage', 'invoices'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 text-sm font-bold transition-all relative capitalize ${activeTab === tab ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {tab === 'plans' ? 'Subscription Plans' : tab === 'usage' ? 'Usage & Payments' : 'Invoices'}
                        </button>
                    ))}
                </div>

                {activeTab === 'plans' && (
                    <div className="px-4">
                        {loadingPlans ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                <p className="text-sm text-muted-foreground font-semibold">Loading subscription plans...</p>
                            </div>
                        ) : (
                            <>
                        {/* Hero Banner - Dynamic Version */}
                        {(() => {
                            const currentPlan = plans.find(tier => tier.current) || plans.find(p => p.name === 'Professional') || plans[1] || subscriptionTiers[1];
                            const currentPlanPrice = billingCycle === 'monthly' ? currentPlan.priceMonthly : currentPlan.priceYearly;
                            const isCurrentPlanPriceNumeric = typeof currentPlanPrice === 'number';
                            const heroPriceText = isCurrentPlanPriceNumeric
                                ? `₹${currentPlanPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : currentPlanPrice;
                            return (
                                <div className="relative overflow-hidden rounded-2xl mb-12 border border-border bg-card">
                                    <div className="absolute inset-0 bg-primary/5"></div>
                                    
                                    <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="space-y-4 text-left">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary" className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider">
                                                    CURRENT PLAN
                                                </Badge>
                                                <span className="text-sm font-medium text-muted-foreground">• Next billing Nov 12, 2023</span>
                                            </div>
                                            <h2 className="text-4xl font-bold text-foreground tracking-tight">{currentPlan.name} Plan</h2>
                                            <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
                                                {currentPlan.desc || "Your plan includes unlimited AI research generations, standard priority support, and document management."}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center md:items-end gap-6">
                                            <div className="text-foreground text-right">
                                                <span className="text-5xl font-bold">{heroPriceText}</span>
                                                <span className="text-sm font-medium text-muted-foreground ml-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                                                {billingCycle === 'yearly' && isCurrentPlanPriceNumeric && (
                                                    <div className="text-[10px] font-semibold text-primary mt-1 text-right">
                                                        (₹{Math.round(currentPlanPrice / 12).toLocaleString()}/month equivalent)
                                                    </div>
                                                )}
                                            </div>
                                            <Button 
                                                onClick={() => navigate('/billing/checkout')}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-6 h-auto font-bold shadow-sm transition-transform active:scale-95"
                                            >
                                                Manage Subscription
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Tiers Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-foreground">Subscription Tiers</h3>
                            <div className="bg-secondary p-1 rounded-lg flex border border-border">
                                <button 
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${billingCycle === 'monthly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Monthly
                                </button>
                                <button 
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${billingCycle === 'yearly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Yearly (Save 20%)
                                </button>
                            </div>
                        </div>

                        {/* Tier Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {plans.map((tier, idx) => {
                                const displayPrice = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly;
                                const isNumeric = typeof displayPrice === 'number';
                                const priceText = isNumeric ? `₹${displayPrice.toLocaleString()}` : displayPrice;
                                const isCurrent = !!tier.current;
                                const isDisabled = !!tier.disabled;

                                return (
                                    <div 
                                        key={idx} 
                                        className={`relative bg-card rounded-2xl p-8 border ${
                                            isCurrent ? 'border-primary ring-1 ring-primary/20 shadow-md scale-[1.02]' : 'border-border'
                                        } flex flex-col transition-all duration-300 hover:shadow-md`}
                                    >
                                        {isCurrent && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-6 py-2 rounded-xl shadow-sm whitespace-nowrap tracking-wide uppercase">
                                                YOUR CURRENT PLAN
                                            </div>
                                        )}
                                        {tier.bestValue && !isCurrent && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-6 py-2 rounded-xl shadow-sm whitespace-nowrap tracking-wide uppercase">
                                                BEST VALUE
                                            </div>
                                        )}
                                        
                                        <div className="mb-8">
                                            <h4 className="text-lg font-bold text-foreground mb-2">{tier.name}</h4>
                                            <div className="flex flex-col items-start gap-1">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-bold text-foreground">{priceText}</span>
                                                    {isNumeric && (
                                                        <span className="text-sm font-medium text-muted-foreground mb-0.5 ml-1">
                                                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                                        </span>
                                                    )}
                                                </div>
                                                {billingCycle === 'yearly' && isNumeric && (
                                                    <span className="text-xs font-semibold text-primary mt-1">
                                                        ₹{Math.round(displayPrice / 12).toLocaleString()}/mo equivalent
                                                    </span>
                                                )}
                                            </div>
                                            {tier.desc && <p className="text-xs text-muted-foreground mt-2">{tier.desc}</p>}
                                        </div>

                                        <div className="space-y-4 mb-8 flex-1">
                                            {(tier.features || []).map((feature: string, fIdx: number) => (
                                                <div key={fIdx} className="flex items-center gap-3">
                                                    <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button 
                                            onClick={() => {
                                                if (!isCurrent && !isDisabled) {
                                                    navigate('/billing/checkout');
                                                }
                                            }}
                                            variant={isCurrent ? "secondary" : "outline"}
                                            disabled={isDisabled}
                                            className={`w-full rounded-xl py-6 font-bold transition-all ${
                                                isCurrent ? 'bg-secondary text-muted-foreground border-none' : 'border-border text-foreground hover:bg-accent'
                                            }`}
                                        >
                                            {tier.cta || (isCurrent ? "Current Active Plan" : "Upgrade")}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Help Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
                                        <HelpCircle className="h-6 w-6 text-primary" />
                                    </div>
                                    <h4 className="text-lg font-bold text-foreground mb-2">Need billing help?</h4>
                                    <p className="text-muted-foreground text-sm mb-6">Our support team is available 24/7 to help you with any issues related to payments or billing.</p>
                                    <Button 
                                        onClick={() => setIsTicketModalOpen(true)}
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 rounded-xl"
                                    >
                                        Open Support Ticket
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <h4 className="text-lg font-bold text-foreground mb-2">Email Invoices</h4>
                                    <p className="text-muted-foreground text-sm mb-6">Send copies of all billing invoices to your accounting team or other email addresses.</p>
                                    <Button variant="outline" className="w-full border-border text-foreground font-bold h-12 rounded-xl hover:bg-accent">
                                        Configure Email forwarding
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                            </>
                        )}
                    </div>
                )}
                
                {activeTab === 'usage' && (
                    <div className="flex flex-col lg:flex-row gap-8 px-4 w-full">
                        {loadingStats ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 bg-card rounded-2xl border border-border">
                                <Loader2 className="animate-spin h-12 w-12 text-primary" />
                                <p className="text-sm text-muted-foreground font-semibold">Loading usage statistics...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 space-y-8">
                                {/* Overview Card */}
                                <div className="bg-card rounded-2xl p-8 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Current Subscription</p>
                                        <h3 className="text-2xl font-black text-foreground capitalize">{stats?.plan || 'Free'} Plan</h3>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-block uppercase tracking-wider">Active</span>
                                    </div>
                                </div>

                                {/* Resource Consumption */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-foreground">Resource Consumption</h3>
                                        <Button 
                                            variant="ghost" 
                                            className="text-primary hover:bg-transparent p-0 flex items-center gap-1 text-sm font-bold"
                                            onClick={() => setActiveTab('plans')}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Upgrade Subscription
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                                        {/* 1. AI Document Generation */}
                                        <Card className="border-border rounded-2xl p-8 text-center flex flex-col items-center justify-between bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
                                            {(() => {
                                                const used = stats?.usage?.documents ?? 0;
                                                const limit = stats?.limits?.documents ?? 5;
                                                const isUnlimited = limit >= 999999;
                                                const percent = isUnlimited ? 0 : Math.min(Math.round((used / limit) * 100), 100);
                                                const limitStr = isUnlimited ? 'Unlimited' : limit.toString();
                                                return (
                                                    <CircularProgress 
                                                        value={percent} 
                                                        label="AI Document Generation" 
                                                        sublabel={`${used} / ${limitStr} generated`}
                                                        isUnlimited={isUnlimited}
                                                        color={percent > 85 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                                                    />
                                                );
                                            })()}
                                        </Card>

                                        {/* 2. Contract Review */}
                                        <Card className="border-border rounded-2xl p-8 text-center flex flex-col items-center justify-between bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
                                            {(() => {
                                                const used = stats?.usage?.reviews ?? 0;
                                                const limit = stats?.limits?.reviews ?? 2;
                                                const isUnlimited = limit >= 999999;
                                                const percent = isUnlimited ? 0 : Math.min(Math.round((used / limit) * 100), 100);
                                                const limitStr = isUnlimited ? 'Unlimited' : limit.toString();
                                                return (
                                                    <CircularProgress 
                                                        value={percent} 
                                                        label="AI Contract Review" 
                                                        sublabel={`${used} / ${limitStr} reviewed`}
                                                        isUnlimited={isUnlimited}
                                                        color={percent > 85 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                                                    />
                                                );
                                            })()}
                                        </Card>

                                        {/* 3. Legal Research */}
                                        <Card className="border-border rounded-2xl p-8 text-center flex flex-col items-center justify-between bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
                                            {(() => {
                                                const used = stats?.usage?.research ?? 0;
                                                const limit = stats?.limits?.research ?? 5;
                                                const isUnlimited = limit >= 999999;
                                                const percent = isUnlimited ? 0 : Math.min(Math.round((used / limit) * 100), 100);
                                                const limitStr = isUnlimited ? 'Unlimited' : limit.toString();
                                                return (
                                                    <CircularProgress 
                                                        value={percent} 
                                                        label="AI Legal Assistant" 
                                                        sublabel={`${used} / ${limitStr} daily queries`}
                                                        isUnlimited={isUnlimited}
                                                        color={percent > 85 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                                                    />
                                                );
                                            })()}
                                        </Card>

                                        {/* 4. Lawyer Bookings */}
                                        <Card className="border-border rounded-2xl p-8 text-center flex flex-col items-center justify-between bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
                                            {(() => {
                                                const used = stats?.usage?.bookings ?? 0;
                                                const limit = stats?.limits?.bookings ?? 1;
                                                const isUnlimited = limit >= 999999;
                                                const percent = isUnlimited ? 0 : Math.min(Math.round((used / limit) * 100), 100);
                                                const limitStr = isUnlimited ? 'Unlimited' : limit.toString();
                                                return (
                                                    <CircularProgress 
                                                        value={percent} 
                                                        label="Lawyer Bookings" 
                                                        sublabel={`${used} / ${limitStr} booked`}
                                                        isUnlimited={isUnlimited}
                                                        color={percent > 85 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                                                    />
                                                );
                                            })()}
                                        </Card>
                                    </div>
                                </div>

                            {/* Payment Methods */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-foreground">Payment Methods</h3>
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2 font-bold px-6">
                                        <Plus className="h-4 w-4" />
                                        Add New Method
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {paymentMethods.map((method, idx) => (
                                        <div key={idx} className={`bg-card rounded-2xl p-6 border ${method.isDefault ? 'border-primary shadow-sm' : 'border-border'} flex flex-col gap-6`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-16 bg-secondary border border-border rounded flex items-center justify-center">
                                                        <span className="text-[10px] font-black italic text-muted-foreground">{method.brand}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">{method.brand} ending in {method.last4}</p>
                                                        <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                                                    </div>
                                                </div>
                                                {method.isDefault && (
                                                    <Badge variant="secondary" className="text-primary border-none text-[8px] font-black uppercase px-2">DEFAULT</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs">
                                                {!method.isDefault && (
                                                    <button className="text-primary font-bold hover:underline">Set as Default</button>
                                                )}
                                                <button className="text-muted-foreground font-bold hover:underline">Edit</button>
                                                <button className="text-destructive font-bold hover:underline">Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="w-full lg:w-80 space-y-8">
                            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                                <h4 className="text-lg font-bold text-foreground mb-6">Billing FAQ</h4>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    <AccordionItem value="item-1" className="border-none">
                                        <AccordionTrigger className="text-left text-sm font-bold py-0 hover:no-underline text-foreground">
                                            How are credits calculated?
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-3 text-xs text-muted-foreground leading-relaxed">
                                            Credits are billed based on the type of legal document generated and the complexity of the AI analysis.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2" className="border-none">
                                        <AccordionTrigger className="text-left text-sm font-bold py-0 hover:no-underline text-foreground">
                                            Do sessions roll over?
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-3 text-xs text-muted-foreground leading-relaxed">
                                            Unused notary sessions roll over up to a maximum of 20 sessions for Professional plan holders.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3" className="border-none">
                                        <AccordionTrigger className="text-left text-sm font-bold py-0 hover:no-underline text-foreground">
                                            When is my next invoice?
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-3 text-xs text-muted-foreground leading-relaxed">
                                            Your next invoice will be generated on Oct 12, 2024, at 12:00 AM UTC.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                            <div className="bg-primary text-primary-foreground rounded-2xl p-8 text-center relative overflow-hidden group">
                                <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-bold mb-2">Need Billing Help?</h4>
                                <p className="text-primary-foreground/70 text-xs mb-8">Our support team is available 24/7 for account queries.</p>
                                <Button 
                                    onClick={() => setIsTicketModalOpen(true)}
                                    className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold h-12 rounded-xl"
                                >
                                    Contact Support
                                </Button>
                                <div className="mt-8 pt-6 border-t border-primary-foreground/10 flex items-center justify-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-primary-foreground/50" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary-foreground/50">PCI-DSS COMPLIANT</span>
                                </div>
                            </div>
                        </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'invoices' && (
                    <div className="flex flex-col lg:flex-row gap-8 px-4">
                        <div className="flex-1 space-y-8">
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-foreground tracking-tight">Invoices & Transaction History</h2>
                                <p className="text-muted-foreground font-medium text-sm mt-1">View and download your past payments and billing history.</p>
                            </div>

                            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col pt-4">
                                <div className="px-6 pb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Filter by date:</span>
                                        <button className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 text-sm font-bold text-foreground hover:bg-accent">
                                            Last 6 Months <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                    <Button variant="outline" className="border-border text-foreground font-bold px-4 hover:bg-accent flex gap-2">
                                        <Download className="w-4 h-4" /> Export All
                                    </Button>
                                </div>

                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="py-4 font-bold text-foreground text-[11px] tracking-wider">DATE</TableHead>
                                            <TableHead className="py-4 font-bold text-foreground text-[11px] tracking-wider text-left">INVOICE #</TableHead>
                                            <TableHead className="py-4 font-bold text-foreground text-[11px] tracking-wider">PLAN TYPE</TableHead>
                                            <TableHead className="py-4 font-bold text-foreground text-[11px] tracking-wider">AMOUNT</TableHead>
                                            <TableHead className="py-4 font-bold text-foreground text-[11px] tracking-wider">STATUS</TableHead>
                                            <TableHead className="py-4 font-bold text-foreground text-[11px] tracking-wider text-right">ACTION</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoicesList.map((item, idx) => (
                                            <TableRow key={idx} className="hover:bg-accent/50">
                                                <TableCell className="py-5 font-medium text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">{item.date}</TableCell>
                                                <TableCell className="py-5 font-bold text-primary hover:underline cursor-pointer">
                                                    <div className="flex items-start gap-1">
                                                        <span className="whitespace-pre-wrap leading-relaxed">{item.id}</span>
                                                        <FileText className="w-3.5 h-3.5 fill-current opacity-20 text-primary mt-0.5" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5 font-medium text-foreground text-sm whitespace-pre-wrap leading-relaxed">{item.plan}</TableCell>
                                                <TableCell className="py-5 font-black text-foreground">{item.amount}</TableCell>
                                                <TableCell className="py-5 text-left">
                                                    <div className="inline-flex items-center justify-center gap-1.5 bg-secondary text-primary px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-border">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                        {item.status}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5 text-right">
                                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Right Sidebar - Tax & Support */}
                        <div className="w-full lg:w-[320px] space-y-8">
                            <div>
                                <h4 className="text-lg font-black text-foreground tracking-tight mb-6">Tax Information</h4>
                                <div className="space-y-4">
                                    {['BUSINESS NAME', 'GST/VAT NUMBER', 'REGISTERED ADDRESS'].map((label) => (
                                        <div key={label}>
                                            <label className="text-[10px] items-center font-black uppercase text-muted-foreground tracking-widest mb-1.5 block">{label}</label>
                                            {label === 'REGISTERED ADDRESS' ? (
                                                <textarea 
                                                    defaultValue="124 Business District, South Delhi, Delhi 110001, India" 
                                                    rows={2}
                                                    className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:ring-1 focus:ring-ring resize-none"
                                                />
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    defaultValue={label === 'BUSINESS NAME' ? "LegalSolutions Global Pvt Ltd" : "22AAAAA0000A1Z5"} 
                                                    className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm font-bold text-foreground outline-none focus:ring-1 focus:ring-ring"
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <Button className="w-full bg-secondary text-foreground hover:bg-accent shadow-sm font-bold tracking-tight rounded-xl py-6 border border-border">
                                        Update Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-16 pb-12 border-t border-border pt-8 px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                            <span>© 2023 Vidhik AI Intelligence</span>
                            <span className="h-1 w-1 rounded-full bg-muted" />
                            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                            <span className="h-1 w-1 rounded-full bg-muted" />
                            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buy Extra Credits Modal */}
            <Dialog open={isTopUpModalOpen} onOpenChange={setIsTopUpModalOpen}>
                <DialogContent className="max-w-[540px] p-0 overflow-hidden bg-card rounded-3xl border border-border shadow-2xl">
                    <div className="p-10 pb-8">
                        <div className="mb-8">
                            <DialogTitle className="text-2xl font-black text-foreground mb-2 tracking-tight">Buy Extra Credits</DialogTitle>
                            <p className="text-muted-foreground font-medium text-sm">Select a package to top up your resource balance instantly.</p>
                        </div>
                        
                        {/* Tab Switcher */}
                        <div className="flex gap-8 mb-8 border-b border-border">
                            {['credits', 'sessions'].map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setTopUpTab(tab as any)}
                                    className={`pb-4 text-sm font-bold transition-all relative ${topUpTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {tab === 'credits' ? 'AI Document Credits' : 'Notary Sessions'}
                                </button>
                            ))}
                        </div>

                        {topUpTab === 'credits' && (
                            <>
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    {(['starter', 'growth', 'professional'] as const).map((pkg) => (
                                        <button 
                                            key={pkg}
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`p-5 rounded-2xl border transition-all text-center flex flex-col items-center justify-between min-h-[160px] relative
                                            ${selectedPackage === pkg ? 'border-primary bg-primary/5 ring-2 ring-primary/10 shadow-sm' : 'border-border bg-card hover:border-muted-foreground/30'}
                                        `}>
                                            <div className="space-y-1 w-full border-b border-border/50 pb-4">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{pkg}</p>
                                                <p className="text-3xl font-black text-foreground leading-none">{topUpPackages[pkg].credits}</p>
                                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest pt-1">Credits</p>
                                            </div>
                                            <p className="text-primary font-black text-xl pt-4">${topUpPackages[pkg].price}</p>
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-secondary rounded-3xl p-6 mb-8 flex items-center justify-between border border-border">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1.5">New Balance</p>
                                            <p className="text-xl font-black text-foreground leading-none">
                                                {newBalance.toLocaleString()} <span className="text-xs font-bold text-muted-foreground normal-case ml-1">Credits</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1.5">Total Charge</p>
                                        <p className="text-2xl font-black text-primary leading-none">
                                            ${totalCharge.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>

                                <Button 
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-14 font-black text-base shadow-sm transition-all gap-3"
                                    onClick={() => {
                                        alert("Credit purchase initiated!");
                                        setIsTopUpModalOpen(false);
                                    }}
                                >
                                    <ShoppingCart className="w-5 h-5 fill-current" />
                                    Confirm Purchase
                                </Button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Support Ticket Modal */}
            <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary">
                            <HelpCircle className="h-5 w-5" />
                            Open Support Ticket
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateTicket} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Subject</label>
                            <input
                                type="text"
                                placeholder="Brief summary of the issue"
                                value={ticketSubject}
                                onChange={(e) => setTicketSubject(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Category</label>
                                <select
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800"
                                    value={ticketCategory}
                                    onChange={(e) => setTicketCategory(e.target.value)}
                                >
                                    <option value="General">General</option>
                                    <option value="Payments">Billing & Payments</option>
                                    <option value="Booking">Lawyer Booking</option>
                                    <option value="Technical">Technical Issue</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Priority</label>
                                <select
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800"
                                    value={ticketPriority}
                                    onChange={(e) => setTicketPriority(e.target.value)}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none min-h-[120px] text-gray-800"
                                placeholder="Describe your issue in detail..."
                                value={ticketDescription}
                                onChange={(e) => setTicketDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsTicketModalOpen(false)}
                                disabled={isSubmittingTicket}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmittingTicket}
                                className="bg-primary hover:bg-primary text-white font-semibold"
                            >
                                {isSubmittingTicket ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Ticket'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
