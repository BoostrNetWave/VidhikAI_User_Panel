import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { CreditUsageHistory } from "@/components/billing/CreditUsageHistory";
import { BuyCreditsModal } from "@/components/dashboard/BuyCreditsModal";
import { SupportTicketModal } from "@/components/support/SupportTicketModal";
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
    Mail,
    Plus,
    MessageSquare,
    ShieldCheck,
    FileText,
    Zap,
    Crown,
    Building2,
    Calendar,
    Coins,
    ArrowUpRight,
    RefreshCw,
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCircle
} from "lucide-react";
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
                    {trend}
                </span>
            )}
        </div>
    );
};

export default function BillingPlans() {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [activeTab, setActiveTab] = useState<'plans' | 'usage'>('plans');

    // Modals
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    // Plans & Balances
    const [plans, setPlans] = useState<any[]>([]);
    const [extraPackages, setExtraPackages] = useState<any[]>([]);
    const [userSub, setUserSub] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadBillingData = async (manual: boolean = false) => {
        if (manual) setIsRefreshing(true);
        try {
            const [plansRes, statsRes] = await Promise.all([
                api.get('/subscription/plans'),
                api.get('/dashboard/stats')
            ]);

            let totalBal: number | undefined;
            let activePlan: string | undefined;

            if (plansRes.data?.success) {
                setPlans(plansRes.data.data.plans || []);
                setExtraPackages(plansRes.data.data.extraCreditPackages || []);
                setUserSub(plansRes.data.data.userSubscription || null);
                totalBal = plansRes.data.data.userSubscription?.totalCredits;
                activePlan = plansRes.data.data.userSubscription?.plan;
            }

            if (statsRes.data?.success) {
                setStats(statsRes.data.data);
                if (totalBal === undefined) totalBal = statsRes.data.data.aiCredits;
                if (!activePlan) activePlan = statsRes.data.data.plan;
            }

            // Sync user_profile_data in localStorage so header balances reflect live database values
            const userStr = localStorage.getItem('user_profile_data');
            if (userStr && totalBal !== undefined) {
                try {
                    const u = JSON.parse(userStr);
                    u.aiCredits = totalBal;
                    if (activePlan) u.subscription = activePlan;
                    localStorage.setItem('user_profile_data', JSON.stringify(u));
                    window.dispatchEvent(new Event('storage'));
                } catch (e) {
                    console.error('Error syncing localStorage profile:', e);
                }
            }

            if (manual) {
                toast.success("Live credit & resource metrics updated!");
            }
        } catch (error) {
            console.error("Failed to load subscription data:", error);
            if (manual) toast.error("Failed to refresh live metrics.");
        } finally {
            setLoading(false);
            if (manual) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadBillingData();
    }, []);



    const currentPlanName = userSub?.plan || stats?.plan || 'Free';
    const activePlanObj = plans.find(p => p.name.toLowerCase() === currentPlanName.toLowerCase()) || plans[0] || {
        name: 'Free',
        priceMonthly: 0,
        priceYearly: 0,
        monthlyCredits: 30,
        desc: 'Perfect for getting started with AI legal assistance'
    };

    const monthlyAllowance = userSub?.monthlyAllowance || stats?.monthlyAllowance || 30;
    const monthlyCreditsRemaining = userSub?.monthlyCredits ?? stats?.monthlyCreditsRemaining ?? 30;
    const extraCreditsRemaining = userSub?.extraCredits ?? stats?.extraCreditsRemaining ?? 0;
    const totalCredits = userSub?.totalCredits ?? stats?.aiCredits ?? (monthlyCreditsRemaining + extraCreditsRemaining);
    const creditsUsedThisMonth = userSub?.creditsUsedThisMonth ?? stats?.creditsUsedThisMonth ?? 0;

    const renewsAtDate = userSub?.renewsAt ? new Date(userSub.renewsAt) : (stats?.renewsAt ? new Date(stats.renewsAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    const formattedRenewal = renewsAtDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const paymentMethods = [
        { brand: "Visa", last4: "4242", expiry: "12/26", isDefault: true }
    ];

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Crown': return <Crown className="h-5 w-5 text-amber-500" />;
            case 'Building2': return <Building2 className="h-5 w-5 text-indigo-500" />;
            default: return <Zap className="h-5 w-5 text-primary" />;
        }
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-7xl mx-auto -mt-4">
                {/* Top Header/Nav */}
                <div className="flex items-center justify-between mb-8 py-4 border-b border-border px-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-foreground">Billing & AI Credits</h1>
                        <p className="text-sm text-muted-foreground">Manage your subscription tier, track real-time AI credit consumption, and purchase top-up credits.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={() => setIsTopUpModalOpen(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 shadow-sm rounded-xl"
                        >
                            <Coins className="h-4 w-4" />
                            Buy Extra Credits
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setIsTicketModalOpen(true)}
                            className="rounded-xl"
                            title="Help & Support"
                        >
                            <HelpCircle className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-8 mb-8 border-b border-border px-4">
                    {['plans', 'usage'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 text-sm font-bold transition-all relative capitalize ${activeTab === tab ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {tab === 'plans' ? 'Subscription Plans' : 'Credits & Resource Usage'}
                        </button>
                    ))}
                </div>

                {activeTab === 'plans' && (
                    <div className="px-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                <p className="text-sm text-muted-foreground font-semibold">Loading official subscription plans...</p>
                            </div>
                        ) : (
                            <>
                                {/* Current Active Plan Banner */}
                                <div className="relative overflow-hidden rounded-3xl mb-12 border border-border bg-card shadow-sm">
                                    <div className="absolute inset-0 bg-primary/5"></div>
                                    
                                    <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="space-y-4 text-left">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary" className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary border-primary/20">
                                                    CURRENT ACTIVE PLAN
                                                </Badge>
                                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    Resets on: {formattedRenewal}
                                                </span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                                                {activePlanObj.name} Plan
                                            </h2>
                                            <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
                                                {activePlanObj.desc || "Includes full access to AI legal chat, document generation, and document review."}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                                <div className="bg-background/80 border border-border px-4 py-2 rounded-xl">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">Monthly Quota</span>
                                                    <span className="text-sm font-bold text-foreground">{monthlyCreditsRemaining} / {monthlyAllowance} Credits</span>
                                                </div>
                                                <div className="bg-background/80 border border-border px-4 py-2 rounded-xl">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">Extra Credits</span>
                                                    <span className="text-sm font-bold text-primary">+{extraCreditsRemaining} Credits</span>
                                                </div>
                                                <div className="bg-background/80 border border-border px-4 py-2 rounded-xl">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">Total Balance</span>
                                                    <span className="text-sm font-black text-foreground">{totalCredits} Available</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center md:items-end gap-5">
                                            <div className="text-foreground text-right">
                                                <div className="text-4xl md:text-5xl font-black">
                                                    {activePlanObj.priceMonthly === 0 ? '₹0' : `₹${activePlanObj.priceMonthly.toLocaleString()}`}
                                                </div>
                                                <span className="text-xs font-medium text-muted-foreground">/month</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button 
                                                    onClick={() => setIsTopUpModalOpen(true)}
                                                    variant="outline"
                                                    className="rounded-xl px-5 font-bold border-border hover:bg-accent"
                                                >
                                                    <Plus className="h-4 w-4 mr-1.5" />
                                                    Add Extra Credits
                                                </Button>
                                                {currentPlanName.toLowerCase() === 'free' ? (
                                                    <Button 
                                                        onClick={() => {
                                                            const starter = plans.find(p => p.name.toLowerCase() === 'starter') || plans[1];
                                                            navigate('/billing/checkout', { state: { plan: starter, billingCycle } });
                                                        }}
                                                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 font-bold shadow-sm"
                                                    >
                                                        Upgrade to Starter
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        onClick={() => setActiveTab('usage')}
                                                        className="bg-secondary text-foreground hover:bg-secondary/80 rounded-xl px-6 font-bold"
                                                    >
                                                        View Resource Usage
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tiers Header */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground">Available Subscription Tiers</h3>
                                        <p className="text-xs text-muted-foreground mt-1">Select the tier that fits your legal workload. Free plan is always available.</p>
                                    </div>
                                    <div className="bg-secondary p-1 rounded-xl flex border border-border">
                                        <button 
                                            onClick={() => setBillingCycle('monthly')}
                                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Monthly
                                        </button>
                                        <button 
                                            onClick={() => setBillingCycle('yearly')}
                                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Yearly
                                            <span className="bg-emerald-500/10 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded font-black">2 MO FREE</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Official Plans Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                    {plans.map((tier, idx) => {
                                        const isCurrent = tier.name.toLowerCase() === currentPlanName.toLowerCase();
                                        const displayPrice = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly;
                                        const priceText = typeof displayPrice === 'number' 
                                            ? (displayPrice === 0 ? '₹0' : `₹${displayPrice.toLocaleString()}`) 
                                            : displayPrice;

                                        return (
                                            <div 
                                                key={idx} 
                                                className={`relative bg-card rounded-3xl p-8 border ${
                                                    isCurrent 
                                                        ? 'border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]' 
                                                        : 'border-border hover:border-muted-foreground/30'
                                                } flex flex-col transition-all duration-300 hover:shadow-md`}
                                            >
                                                {isCurrent && (
                                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap tracking-wider uppercase">
                                                        YOUR CURRENT PLAN
                                                    </div>
                                                )}
                                                {tier.popular && !isCurrent && (
                                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap tracking-wider uppercase">
                                                        MOST POPULAR
                                                    </div>
                                                )}
                                                
                                                <div className="mb-6">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-xl font-bold text-foreground">{tier.name}</h4>
                                                        {getIcon(tier.iconName)}
                                                    </div>
                                                    
                                                    <div className="flex flex-col items-start gap-1">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-4xl font-black text-foreground">{priceText}</span>
                                                            <span className="text-xs font-medium text-muted-foreground ml-1">
                                                                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                                            </span>
                                                        </div>
                                                        {billingCycle === 'yearly' && typeof displayPrice === 'number' && displayPrice > 0 && (
                                                            <span className="text-[11px] font-semibold text-primary mt-0.5">
                                                                ₹{Math.round(displayPrice / 12).toLocaleString()}/mo equivalent
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="mt-3 inline-flex items-center bg-secondary px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-foreground">
                                                        <span>{tier.monthlyCredits} Monthly AI Credits</span>
                                                    </div>

                                                    {tier.desc && (
                                                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                                                            {tier.desc}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-3 mb-8 flex-1 border-t border-border pt-6">
                                                    {(tier.features || []).map((feature: string, fIdx: number) => (
                                                        <div key={fIdx} className="flex items-start gap-3">
                                                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                                <Check className="h-3 w-3 text-primary" />
                                                            </div>
                                                            <span className="text-xs text-muted-foreground leading-snug">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <Button 
                                                    onClick={() => {
                                                        if (!isCurrent) {
                                                            navigate('/billing/checkout', { state: { plan: tier, billingCycle } });
                                                        }
                                                    }}
                                                    variant={isCurrent ? "secondary" : "default"}
                                                    disabled={isCurrent}
                                                    className={`w-full rounded-2xl py-6 font-bold text-sm transition-all ${
                                                        isCurrent 
                                                            ? 'bg-secondary text-muted-foreground cursor-default' 
                                                            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                                                    }`}
                                                >
                                                    {isCurrent ? "Current Active Plan" : `Upgrade to ${tier.name}`}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Extra Credit Packages Showcase */}
                                <div className="bg-card rounded-3xl p-8 border border-border mb-16 shadow-sm">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Coins className="h-5 w-5 text-primary" />
                                                <h4 className="text-xl font-bold text-foreground">Need More AI Credits?</h4>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Purchase top-up packs anytime. Extra credits roll over automatically and never expire at the end of the billing cycle.
                                            </p>
                                        </div>
                                        <Button 
                                            onClick={() => setIsTopUpModalOpen(true)}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl"
                                        >
                                            Buy Top-Up Pack
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                        {extraPackages.map((pkg) => (
                                            <div 
                                                key={pkg.id} 
                                                onClick={() => setIsTopUpModalOpen(true)}
                                                className="bg-secondary/30 rounded-2xl p-4 border border-border text-center hover:border-primary/50 transition-all cursor-pointer group"
                                            >
                                                <div className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                                                    {pkg.credits}
                                                </div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Credits</div>
                                                <div className="text-sm font-bold text-foreground">₹{pkg.price.toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
                
                {activeTab === 'usage' && (
                    <div className="flex flex-col lg:flex-row gap-8 px-4 w-full">
                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 bg-card rounded-3xl border border-border">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                <p className="text-sm text-muted-foreground font-semibold">Loading real-time usage metrics...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 space-y-8">
                                    {/* Low Credit Balance Alert */}
                                    {totalCredits <= 10 && (
                                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-amber-500/20 text-amber-600 rounded-xl shrink-0">
                                                    <AlertTriangle className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-foreground">AI Credits Running Low ({totalCredits} Remaining)</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        You are close to your credit limit. Purchase a top-up pack or upgrade your subscription plan to avoid interruptions.
                                                    </p>
                                                </div>
                                            </div>
                                            <Button 
                                                size="sm"
                                                onClick={() => setIsTopUpModalOpen(true)}
                                                className="bg-amber-500 text-white hover:bg-amber-600 font-bold rounded-xl text-xs whitespace-nowrap shadow-xs"
                                            >
                                                <Coins className="h-3.5 w-3.5 mr-1" />
                                                Top Up Now
                                            </Button>
                                        </div>
                                    )}

                                    {/* Real-time Credit Dashboard Header */}
                                    <div className="bg-card rounded-3xl p-8 border border-border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Active Plan & Renewal</span>
                                                <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 border-primary/30 text-primary uppercase">
                                                    {stats?.billingCycle || 'Monthly'}
                                                </Badge>
                                            </div>
                                            <h3 className="text-2xl font-black text-foreground capitalize">{currentPlanName} Plan</h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Monthly quota resets on <span className="font-semibold text-foreground">{formattedRenewal}</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Button 
                                                variant="outline"
                                                onClick={() => loadBillingData(true)}
                                                disabled={isRefreshing}
                                                className="rounded-xl font-bold gap-2 text-xs"
                                                title="Sync live credit balance from database"
                                            >
                                                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
                                                {isRefreshing ? 'Syncing...' : 'Sync Live Balance'}
                                            </Button>
                                            <Button 
                                                onClick={() => setIsTopUpModalOpen(true)}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold gap-2 text-xs"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Buy Extra Credits
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                onClick={() => setActiveTab('plans')}
                                                className="rounded-xl font-bold text-xs"
                                            >
                                                Change Plan
                                            </Button>
                                        </div>
                                    </div>

                                    {/* 4 Real-time Metric Cards (Section 14 Compliant) */}
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-foreground">Resource Consumption</h3>
                                            <span className="text-xs text-muted-foreground">Server-authoritative live balance</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                            {/* 1. Monthly Plan Credits */}
                                            <Card className="border-border rounded-3xl p-6 text-center flex flex-col items-center justify-between bg-card shadow-sm">
                                                {(() => {
                                                    const used = Math.max(0, monthlyAllowance - monthlyCreditsRemaining);
                                                    const percent = Math.min(Math.round((used / monthlyAllowance) * 100), 100);
                                                    return (
                                                        <CircularProgress 
                                                            value={percent} 
                                                            label="Monthly Subscription Quota" 
                                                            sublabel={`${monthlyCreditsRemaining} / ${monthlyAllowance} credits remaining`}
                                                            color={percent > 85 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                                                        />
                                                    );
                                                })()}
                                            </Card>

                                            {/* 2. Extra Credits Balance */}
                                            <Card className="border-border rounded-3xl p-6 text-center flex flex-col items-center justify-center bg-card shadow-sm">
                                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                                    <Coins className="h-8 w-8" />
                                                </div>
                                                <div className="text-3xl font-black text-foreground mb-1">
                                                    +{extraCreditsRemaining}
                                                </div>
                                                <h5 className="font-bold text-foreground text-sm mb-1">Extra Top-Up Credits</h5>
                                                <p className="text-xs text-muted-foreground mb-4">Non-expiring rollover balance</p>
                                                <Button 
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setIsTopUpModalOpen(true)}
                                                    className="w-full rounded-xl text-xs font-bold"
                                                >
                                                    Top Up
                                                </Button>
                                            </Card>

                                            {/* 3. Total Available AI Credits */}
                                            <Card className="border-border rounded-3xl p-6 text-center flex flex-col items-center justify-center bg-card shadow-sm">
                                                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
                                                    <Coins className="h-8 w-8" />
                                                </div>
                                                <div className="text-3xl font-black text-foreground mb-1">
                                                    {totalCredits}
                                                </div>
                                                <h5 className="font-bold text-foreground text-sm mb-1">Total Available Credits</h5>
                                                <p className="text-xs text-muted-foreground mb-4">Combined balance across all tools</p>
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Ready to Use
                                                </span>
                                            </Card>

                                            {/* 4. Total Credits Used This Month */}
                                            <Card className="border-border rounded-3xl p-6 text-center flex flex-col items-center justify-center bg-card shadow-sm">
                                                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
                                                    <FileText className="h-8 w-8" />
                                                </div>
                                                <div className="text-3xl font-black text-foreground mb-1">
                                                    {creditsUsedThisMonth}
                                                </div>
                                                <h5 className="font-bold text-foreground text-sm mb-1">Consumed This Cycle</h5>
                                                <p className="text-xs text-muted-foreground mb-4">Across chat, drafts & reviews</p>
                                                <span className="text-[10px] font-semibold text-muted-foreground">
                                                    Cycle resets {formattedRenewal}
                                                </span>
                                            </Card>
                                        </div>
                                    </div>

                                    {/* AI Feature Consumption Breakdown */}
                                    <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h4 className="text-lg font-bold text-foreground">AI Feature Usage & Limits</h4>
                                                <p className="text-xs text-muted-foreground mt-0.5">Real-time breakdown of credits deducted and activity metrics for this billing cycle.</p>
                                            </div>
                                            <Badge variant="outline" className="text-xs font-mono">
                                                Plan: {currentPlanName}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {/* 1. Legal Chat */}
                                            <div className="bg-secondary/30 rounded-2xl p-5 border border-border flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-bold text-muted-foreground uppercase">AI Legal Chat</span>
                                                        <MessageSquare className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="text-2xl font-black text-foreground mb-1">
                                                        {stats?.usage?.researchCredits ?? 0} <span className="text-xs font-normal text-muted-foreground">Credits</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-3">{stats?.usage?.research ?? 0} queries performed</p>
                                                </div>
                                                <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
                                                    <span className="font-semibold text-foreground">Limit:</span> Up to {stats?.limits?.maxChatWords?.toLocaleString() || '5,000'} words/query
                                                </div>
                                            </div>

                                            {/* 2. Document Generation */}
                                            <div className="bg-secondary/30 rounded-2xl p-5 border border-border flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-bold text-muted-foreground uppercase">Doc Generation</span>
                                                        <FileText className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="text-2xl font-black text-foreground mb-1">
                                                        {stats?.usage?.documentsCredits ?? 0} <span className="text-xs font-normal text-muted-foreground">Credits</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-3">{stats?.usage?.documents ?? 0} contracts generated</p>
                                                </div>
                                                <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
                                                    <span className="font-semibold text-foreground">Limit:</span> Up to {stats?.limits?.maxDocGenWords?.toLocaleString() || '2,000'} words/doc
                                                </div>
                                            </div>

                                            {/* 3. Document Review */}
                                            <div className="bg-secondary/30 rounded-2xl p-5 border border-border flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-bold text-muted-foreground uppercase">Document Review</span>
                                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="text-2xl font-black text-foreground mb-1">
                                                        {stats?.usage?.reviewsCredits ?? 0} <span className="text-xs font-normal text-muted-foreground">Credits</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-3">{stats?.usage?.reviews ?? 0} audits conducted</p>
                                                </div>
                                                <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
                                                    <span className="font-semibold text-foreground">Limit:</span> Up to {stats?.limits?.maxDocReviewWords?.toLocaleString() || '5,000'} words/review
                                                </div>
                                            </div>

                                            {/* 4. Lawyer Consultations */}
                                            <div className="bg-secondary/30 rounded-2xl p-5 border border-border flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-bold text-muted-foreground uppercase">Consultations</span>
                                                        <Building2 className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="text-2xl font-black text-foreground mb-1">
                                                        {stats?.activeConsultations ?? 0} <span className="text-xs font-normal text-muted-foreground">Active</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-3">{stats?.totalConsultations ?? stats?.activeConsultations ?? 0} total bookings</p>
                                                </div>
                                                <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
                                                    <span className="font-semibold text-foreground">Marketplace:</span> Verified Lawyer Access
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Credit Usage History Ledger */}
                                    <div className="mt-8 mb-8">
                                        <CreditUsageHistory />
                                    </div>

                                    {/* Payment Methods */}
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-foreground">Payment Methods</h3>
                                            <Button 
                                                onClick={() => toast.info("To add a new payment method, upgrade or purchase a credit package at checkout.")}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2 font-bold px-6"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add New Method
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {paymentMethods.map((method, idx) => (
                                                <div key={idx} className={`bg-card rounded-3xl p-6 border ${method.isDefault ? 'border-primary shadow-sm' : 'border-border'} flex flex-col gap-6`}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-16 bg-secondary border border-border rounded-xl flex items-center justify-center">
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
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Sidebar */}
                                <div className="w-full lg:w-80 space-y-8">
                                    <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                                        <h4 className="text-lg font-bold text-foreground mb-6">Credit FAQs</h4>
                                        <Accordion type="single" collapsible className="w-full space-y-4">
                                            <AccordionItem value="item-1" className="border-none">
                                                <AccordionTrigger className="text-left text-sm font-bold py-0 hover:no-underline text-foreground">
                                                    How are AI credits consumed?
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-3 text-xs text-muted-foreground leading-relaxed">
                                                    Legal Chat consumes 1 to 5 credits based on context length. Document generation consumes 5 to 30 credits by document type. Document review consumes 5 to 30 credits based on extracted word count.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-2" className="border-none">
                                                <AccordionTrigger className="text-left text-sm font-bold py-0 hover:no-underline text-foreground">
                                                    Do unused credits roll over?
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-3 text-xs text-muted-foreground leading-relaxed">
                                                    Monthly subscription credits reset on your billing renewal date. Purchased Extra Credits roll over indefinitely until consumed.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-3" className="border-none">
                                                <AccordionTrigger className="text-left text-sm font-bold py-0 hover:no-underline text-foreground">
                                                    Are lawyer fees included?
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-3 text-xs text-muted-foreground leading-relaxed">
                                                    No. Legal consultations with verified lawyers operate as an independent marketplace and do not consume AI credits.
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>

                                    <div className="bg-primary text-primary-foreground rounded-3xl p-8 text-center relative overflow-hidden group">
                                        <div className="h-12 w-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6">
                                            <MessageSquare className="h-6 w-6" />
                                        </div>
                                        <h4 className="text-lg font-bold mb-2">Need Billing Help?</h4>
                                        <p className="text-primary-foreground/70 text-xs mb-8">Our support team is available 24/7 for account queries.</p>
                                        <Button 
                                            onClick={() => setIsTicketModalOpen(true)}
                                            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold h-12 rounded-2xl"
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

                {/* Support Ticket Modal with file upload */}
                <SupportTicketModal
                    isOpen={isTicketModalOpen}
                    onClose={() => setIsTicketModalOpen(false)}
                    defaultCategory="Billing & Payments"
                />

                {/* Buy Extra Credits Modal */}
                <BuyCreditsModal 
                    isOpen={isTopUpModalOpen}
                    onClose={() => setIsTopUpModalOpen(false)}
                    onSuccess={() => {
                        loadBillingData();
                    }}
                />
            </div>
        </DashboardLayout>
    );
}
