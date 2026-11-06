import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
    Building2, 
    Mail, 
    Phone, 
    User, 
    Users, 
    Coins, 
    Send, 
    CheckCircle2, 
    ArrowLeft, 
    ShieldCheck, 
    Sparkles, 
    Clock, 
    FileText,
    HelpCircle,
    ArrowRight
} from "lucide-react";

export default function ContactUs() {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve pre-passed state or query params (e.g. from Custom Plan button)
    const passedPlan = (location.state as any)?.plan || new URLSearchParams(location.search).get('plan') || 'Custom Enterprise Plan';

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [organization, setOrganization] = useState('');
    const [teamSize, setTeamSize] = useState('6–20 Members');
    const [creditRequirement, setCreditRequirement] = useState('10,000+ Monthly Credits');
    const [billingPreference, setBillingPreference] = useState('Annual Contract (Discounted)');
    const [message, setMessage] = useState('');
    const [planName, setPlanName] = useState(passedPlan);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Pre-fill user profile if logged in
    useEffect(() => {
        try {
            const rawUser = localStorage.getItem('user_profile_data');
            if (rawUser) {
                const u = JSON.parse(rawUser);
                if (u.fullName || u.name) setFullName(u.fullName || u.name);
                if (u.email) setEmail(u.email);
                if (u.phone) setPhone(u.phone);
                if (u.organization) setOrganization(u.organization);
            }
        } catch {
            // Ignore parse errors
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error('Please enter your full name');
            return;
        }

        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please provide a valid work email address');
            return;
        }

        if (!phone.trim()) {
            toast.error('Please enter a contact phone number');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                organization: organization.trim(),
                teamSize,
                creditRequirement,
                billingPreference,
                message: message.trim(),
                planName
            };

            const res = await api.post('/contact', payload).catch(() => {
                // Fallback to /support/contact
                return api.post('/support/contact', payload);
            });

            if (res.data?.success !== false) {
                setIsSubmitted(true);
                toast.success('Your custom plan inquiry has been sent to our enterprise team!');
            } else {
                toast.error(res.data?.message || 'Failed to submit inquiry. Please try again.');
            }
        } catch (error: any) {
            console.error('Contact submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to send inquiry. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-6xl mx-auto -mt-4 pb-16 px-4">
                {/* Back Link */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/billing')}
                        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Billing & Plans
                    </button>
                </div>

                {/* Header */}
                <div className="mb-10 text-left">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
                        <Sparkles className="h-3.5 w-3.5" />
                        Enterprise & Custom Billing Solutions
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                        Contact Us for a Custom Plan
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                        Need bespoke AI credit limits, custom contract templates, team-wide seat management, or corporate GST invoicing? Tell us about your billing requirements and our enterprise desk will structure a plan for your firm.
                    </p>
                </div>

                {isSubmitted ? (
                    <Card className="border border-border bg-card rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm">
                        <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-3">Inquiry Successfully Submitted!</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                            Thank you, <strong className="text-foreground">{fullName}</strong>. Your custom plan details have been dispatched to our official enterprise billing desk. A confirmation email has been sent to <strong className="text-primary">{email}</strong>.
                        </p>

                        <div className="bg-secondary/40 border border-border rounded-2xl p-4 text-left text-xs space-y-2 mb-8">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-semibold">Plan of Interest:</span>
                                <span className="text-foreground font-bold">{planName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-semibold">Organization:</span>
                                <span className="text-foreground font-bold">{organization || 'Individual / Firm'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-semibold">Team Size:</span>
                                <span className="text-foreground font-bold">{teamSize}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-semibold">Estimated Monthly Quota:</span>
                                <span className="text-foreground font-bold">{creditRequirement}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button 
                                onClick={() => navigate('/billing')} 
                                className="w-full sm:w-auto font-bold rounded-xl"
                            >
                                Return to Billing
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setMessage('');
                                }} 
                                className="w-full sm:w-auto font-bold rounded-xl"
                            >
                                Submit Another Request
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Form Column */}
                        <div className="lg:col-span-8">
                            <Card className="border border-border bg-card rounded-3xl shadow-sm overflow-hidden">
                                <CardHeader className="p-6 md:p-8 border-b border-border bg-secondary/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-foreground">Billing & Organization Details</CardTitle>
                                            <CardDescription className="text-xs text-muted-foreground mt-1">
                                                All details are reviewed by our billing specialists and kept strictly confidential.
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="text-xs font-bold border-primary/30 text-primary">
                                            {planName}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Row 1: Name & Email */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5 text-primary" />
                                                    Full Name <span className="text-destructive">*</span>
                                                </label>
                                                <Input 
                                                    value={fullName}
                                                    onChange={e => setFullName(e.target.value)}
                                                    placeholder="e.g. Adv. Rajesh Sharma"
                                                    required
                                                    className="rounded-xl"
                                                />
                                            </div>

                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                    <Mail className="h-3.5 w-3.5 text-primary" />
                                                    Work Email <span className="text-destructive">*</span>
                                                </label>
                                                <Input 
                                                    type="email"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder="rajesh@lawchambers.in"
                                                    required
                                                    className="rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 2: Phone & Organization */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                    <Phone className="h-3.5 w-3.5 text-primary" />
                                                    Phone / WhatsApp Number <span className="text-destructive">*</span>
                                                </label>
                                                <Input 
                                                    type="tel"
                                                    value={phone}
                                                    onChange={e => setPhone(e.target.value)}
                                                    placeholder="+91 98765 43210"
                                                    required
                                                    className="rounded-xl"
                                                />
                                            </div>

                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                    <Building2 className="h-3.5 w-3.5 text-primary" />
                                                    Organization / Law Firm Name
                                                </label>
                                                <Input 
                                                    value={organization}
                                                    onChange={e => setOrganization(e.target.value)}
                                                    placeholder="Sharma & Associates Legal LLP"
                                                    className="rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 3: Team Size & Estimated Usage */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                    <Users className="h-3.5 w-3.5 text-primary" />
                                                    Team Size / Number of Lawyers
                                                </label>
                                                <select
                                                    value={teamSize}
                                                    onChange={e => setTeamSize(e.target.value)}
                                                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                >
                                                    <option value="1–5 Members">1–5 Members (Boutique Practice)</option>
                                                    <option value="6–20 Members">6–20 Members (Growing Law Firm)</option>
                                                    <option value="21–50 Members">21–50 Members (Mid-Sized Firm)</option>
                                                    <option value="50+ Members / Chamber">50+ Members / Enterprise Chamber</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                    <Coins className="h-3.5 w-3.5 text-primary" />
                                                    Estimated Monthly AI Usage
                                                </label>
                                                <select
                                                    value={creditRequirement}
                                                    onChange={e => setCreditRequirement(e.target.value)}
                                                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                >
                                                    <option value="5,000 Monthly Credits">5,000 Monthly Credits (~200 contracts)</option>
                                                    <option value="10,000+ Monthly Credits">10,000+ Monthly Credits (~500 contracts)</option>
                                                    <option value="25,000+ Monthly Credits">25,000+ Monthly Credits (High-Volume Practice)</option>
                                                    <option value="Unlimited / Dedicated API SLA">Unlimited AI / Dedicated API SLA</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Row 4: Billing Preference & Plan */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-foreground">
                                                    Billing Preference
                                                </label>
                                                <select
                                                    value={billingPreference}
                                                    onChange={e => setBillingPreference(e.target.value)}
                                                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                >
                                                    <option value="Annual Contract (Discounted)">Annual Contract (with 20% discount)</option>
                                                    <option value="Monthly Corporate Invoicing">Monthly Corporate Invoicing</option>
                                                    <option value="Custom PO / Bank Wire Transfer">Custom Purchase Order / Bank Wire Transfer</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-foreground">
                                                    Plan Classification
                                                </label>
                                                <Input 
                                                    value={planName}
                                                    onChange={e => setPlanName(e.target.value)}
                                                    placeholder="Custom Enterprise Plan"
                                                    className="rounded-xl font-medium"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 5: Detailed Requirements & Message */}
                                        <div className="space-y-2 text-left">
                                            <label className="text-xs font-bold text-foreground flex items-center justify-between">
                                                <span>Specific Requirements & Billing Notes</span>
                                                <span className="text-[11px] text-muted-foreground font-normal">Optional</span>
                                            </label>
                                            <Textarea 
                                                rows={4}
                                                value={message}
                                                onChange={e => setMessage(e.target.value)}
                                                placeholder="Provide any specific requirements, such as custom document categories, private LLM hosting, GST invoicing details, or onboarding assistance..."
                                                className="rounded-xl text-sm leading-relaxed"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 rounded-xl text-sm shadow-sm"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                    <span>Submitting Inquiry to Billing Desk...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Send className="h-4 w-4" />
                                                    <span>Submit Custom Plan Inquiry</span>
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar Info Cards */}
                        <div className="lg:col-span-4 space-y-6 text-left">
                            <Card className="border border-border bg-card rounded-3xl p-6 shadow-sm">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    What's Included in Custom Plans?
                                </h3>
                                <ul className="space-y-3 text-xs text-muted-foreground">
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>Flexible Credit Quotas:</strong> Scale AI credits to match your monthly drafting & review volume.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>Dedicated Account Manager:</strong> Direct support channel via WhatsApp and email.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>GST & Tax Invoicing:</strong> Official corporate invoices for tax compliance and deductions.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>Custom Document Clauses:</strong> Integrate your firm's specific contract clauses into the AI.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>Enterprise SLA:</strong> Guaranteed 99.9% uptime and priority AI compute queue.</span>
                                    </li>
                                </ul>
                            </Card>

                            <Card className="border border-border bg-secondary/30 rounded-3xl p-6 shadow-sm">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">Need Direct Support?</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                                    Our enterprise support desk is staffed by legal operations specialists available Monday–Saturday, 9:00 AM – 7:00 PM IST.
                                </p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="h-3.5 w-3.5 text-primary" />
                                        <span>noreply.vidhikai@gmail.com</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5 text-primary" />
                                        <span>Response within 2–4 hours</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

