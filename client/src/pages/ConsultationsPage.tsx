import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    Video, Calendar, Clock, AlertCircle, CheckCircle, 
    ArrowRight, MessageSquare, Plus, RefreshCcw, 
    Coins, DollarSign, X, FileText, ExternalLink, User,
    Search, ShieldCheck, Star, MapPin, ArrowLeft, Briefcase, Award, Languages
} from 'lucide-react';
import { toast } from 'sonner';
import { consultationService, IConsultation } from '@/services/consultationService';
import { lawyerService } from '@/services/lawyerService';
import { launchRazorpayCheckout, createSimulatedTestResponse } from '@/services/razorpayHelper';

export default function ConsultationsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [consultations, setConsultations] = useState<IConsultation[]>([]);
    const [loading, setLoading] = useState(true);

    // Form/Modal States
    const [showNewRequest, setShowNewRequest] = useState(false);
    const [selectedLawyer, setSelectedLawyer] = useState<any>(null);
    const [lawyers, setLawyers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const categories = ["All", "Corporate", "Criminal", "Family", "Civil", "IP Law", "Taxation"];
    const timeSlots = ["09:30 AM", "11:00 AM", "02:30 PM", "04:00 PM"];

    const getNext7Days = () => {
        const days = [];
        for (let i = 1; i <= 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const filteredLawyers = lawyers.filter(l => {
        const matchesSearch = 
            (l.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (l.expertise || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (l.location || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" ||
            (l.expertise || "").toLowerCase().includes(selectedCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    // Counter Proposal State
    const [counterConsultation, setCounterConsultation] = useState<IConsultation | null>(null);
    const [counterDate, setCounterDate] = useState("");
    const [counterTime, setCounterTime] = useState("");
    const [submittingCounter, setSubmittingCounter] = useState(false);

    // Payment state
    const [isPayingId, setIsPayingId] = useState<string | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Completed consultation summary modal
    const [selectedSummary, setSelectedSummary] = useState<IConsultation | null>(null);

    useEffect(() => {
        fetchConsultations();
        fetchLawyers();

        // Check if lawyer preselected from profile view
        if (location.state && location.state.startConsultationWithLawyer) {
            setSelectedLawyer(location.state.startConsultationWithLawyer);
            setShowNewRequest(true);
        } else if (location.state && location.state.showNewRequest) {
            setShowNewRequest(true);
        }
    }, [location.state]);

    const fetchConsultations = async () => {
        try {
            setLoading(true);
            const data = await consultationService.getConsultations();
            setConsultations(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load consultations");
        } finally {
            setLoading(false);
        }
    };

    const fetchLawyers = async () => {
        try {
            const data = await lawyerService.getPublicLawyers();
            setLawyers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLawyer || !title || !description || !scheduledDate || !scheduledTime) {
            toast.error("All fields are required");
            return;
        }

        setSubmitting(true);
        try {
            await consultationService.createConsultation({
                lawyerId: selectedLawyer._id || selectedLawyer.id,
                title,
                description,
                scheduledDate,
                scheduledTime,
                totalFee: selectedLawyer.hourlyRate || 1000
            });
            toast.success("Consultation request submitted! Awaiting lawyer approval.");
            setShowNewRequest(false);
            setTitle("");
            setDescription("");
            setScheduledDate("");
            setScheduledTime("");
            setSelectedLawyer(null);
            fetchConsultations();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAcceptProposal = async (id: string) => {
        try {
            await consultationService.acceptProposal(id);
            toast.success("Counter-proposal accepted! Status is now pending payment.");
            fetchConsultations();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to accept proposal");
        }
    };

    const handleProposeCounter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!counterConsultation || !counterDate || !counterTime) return;

        setSubmittingCounter(true);
        try {
            await consultationService.proposeNewTime(counterConsultation._id, {
                scheduledDate: counterDate,
                scheduledTime: counterTime
            });
            toast.success("Counter-proposal submitted to lawyer.");
            setCounterConsultation(null);
            fetchConsultations();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to submit counter-proposal");
        } finally {
            setSubmittingCounter(false);
        }
    };

    const handlePayment = async (targetId?: string | any, simulateDirect = false) => {
        const idToPay = (typeof targetId === 'string' && targetId) ? targetId : isPayingId;
        if (!idToPay) return;
        setIsProcessingPayment(true);
        try {
            const orderRes = await consultationService.createPaymentOrder(idToPay);
            const { order } = orderRes;

            const completeConsultationPayment = async (paymentResp: any) => {
                await consultationService.payAndConfirm(idToPay, paymentResp);
                toast.success("Payment successful! Consultation meeting scheduled.");
                setIsPayingId(null);
                fetchConsultations();
            };

            if (simulateDirect) {
                const simResp = createSimulatedTestResponse(order.id);
                await completeConsultationPayment(simResp);
                return;
            }

            const launched = await launchRazorpayCheckout({
                order,
                onSuccess: async (paymentResp) => {
                    await completeConsultationPayment(paymentResp);
                },
                onError: (err) => {
                    console.error("Razorpay Payment Error:", err);
                    toast.error(err?.message || "Razorpay payment encountered an error.");
                    setIsProcessingPayment(false);
                },
                onDismiss: () => {
                    setIsProcessingPayment(false);
                    toast.info("Payment was cancelled.");
                }
            });

            if (!launched) {
                setIsProcessingPayment(false);
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message || "Payment checkout failed");
            setIsProcessingPayment(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!window.confirm("Are you sure you want to cancel/decline this consultation?")) return;
        try {
            await consultationService.cancelConsultation(id);
            toast.success("Consultation cancelled.");
            fetchConsultations();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to cancel consultation");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_lawyer_approval':
                return <Badge className="bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-50">Pending Advocate Approval</Badge>;
            case 'pending_user_approval':
                return <Badge className="bg-secondary text-primary border border-border hover:bg-secondary">Proposed Counter-Time</Badge>;
            case 'pending_payment':
                return <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-50">Awaiting Payment</Badge>;
            case 'scheduled':
                return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-50">Scheduled</Badge>;
            case 'completed':
                return <Badge className="bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-100">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-50 text-red-700 border border-red-100 hover:bg-red-50">Cancelled</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Video Consultations</h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Schedule direct one-off video consultations and coordinate slots with advocates.
                        </p>
                    </div>
                    {!showNewRequest && (
                        <div className="flex items-center gap-3">
                            <Button 
                                onClick={fetchConsultations} 
                                variant="outline" 
                                className="rounded-xl h-11 border-slate-200"
                            >
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button 
                                onClick={() => {
                                    setShowNewRequest(true);
                                    setSelectedLawyer(null);
                                }} 
                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold h-11 shadow-sm"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Book Consultation
                            </Button>
                        </div>
                    )}
                </div>

                {showNewRequest ? (
                    /* STEPPED FLOW: LAWYER DISCOVERY CARD -> SCHEDULING DETAILS */
                    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <button 
                                onClick={() => {
                                    if (selectedLawyer) {
                                        setSelectedLawyer(null);
                                    } else {
                                        setShowNewRequest(false);
                                    }
                                }}
                                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                {selectedLawyer ? "Back to Lawyer List" : "Cancel & Back to Consultations"}
                            </button>
                            <h2 className="text-xl font-black text-slate-900">
                                {selectedLawyer ? "Schedule Video Consultation" : "Choose Your Legal Specialist"}
                            </h2>
                        </div>

                        {!selectedLawyer ? (
                            /* STEP 1: LAWYER LIST SECTION CARDS */
                            <div className="space-y-6">
                                {/* Search Box */}
                                <div className="relative group max-w-3xl mx-auto">
                                    <div className="relative bg-slate-50 border border-border rounded-2xl p-3 shadow-inner flex flex-col sm:flex-row items-center gap-3">
                                        <div className="flex-1 flex items-center gap-3 w-full">
                                            <Search className="h-5 w-5 text-muted-foreground ml-2" />
                                            <Input 
                                                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-base font-semibold placeholder:text-muted-foreground/60"
                                                placeholder="Search lawyers by name, specialization, or location..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Filters */}
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-border">
                                    {categories.map((cat) => (
                                        <Button
                                            key={cat}
                                            variant={selectedCategory === cat ? "default" : "outline"}
                                            className={`rounded-xl font-bold h-9 px-4 text-xs whitespace-nowrap transition-all ${
                                                selectedCategory === cat 
                                                ? "bg-primary text-white hover:bg-violet-800 shadow-sm" 
                                                : "border-border text-muted-foreground hover:bg-slate-50"
                                            }`}
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            {cat}
                                        </Button>
                                    ))}
                                </div>

                                {/* Grid of Lawyers */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredLawyers.length > 0 ? (
                                        filteredLawyers.map((lawyer) => (
                                            <Card key={lawyer._id || lawyer.id} className="rounded-2xl border border-border bg-white hover:shadow-md transition-all duration-300 overflow-hidden">
                                                <CardContent className="p-6">
                                                    <div className="flex gap-4">
                                                        <div className="relative shrink-0">
                                                            <Avatar className="h-16 w-16 rounded-2xl border border-border shrink-0">
                                                                <AvatarImage 
                                                                    src={lawyer.avatar ? (lawyer.avatar.startsWith('http') ? lawyer.avatar : (lawyer.avatar.startsWith('/') ? `/lawyer${lawyer.avatar}` : `/lawyer/${lawyer.avatar}`)) : ""} 
                                                                    alt={lawyer.fullName} 
                                                                    className="object-cover"
                                                                />
                                                                <AvatarFallback className="rounded-2xl bg-slate-100 text-slate-400">
                                                                    <User className="h-8 w-8" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="absolute -bottom-1 -right-1 h-4.5 w-4.5 rounded-full border-2 border-white bg-green-500"></div>
                                                        </div>
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <h3 className="font-extrabold text-slate-900 text-base">{lawyer.fullName}</h3>
                                                                        {lawyer.isVerified && <ShieldCheck className="h-4.5 w-4.5 text-primary" />}
                                                                    </div>
                                                                    <p className="text-[10px] text-primary font-extrabold uppercase tracking-wider">{lawyer.expertise || "General Practice"}</p>
                                                                </div>
                                                                <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-border text-xs font-bold">
                                                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                                    <span>{lawyer.rating || "5.0"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-slate-500 text-xs font-semibold">
                                                                <div className="flex items-center gap-1"><Clock size={13} /> {lawyer.experience || "10+ Yrs"} exp</div>
                                                                <div className="flex items-center gap-1"><MapPin size={13} /> {lawyer.location || "Delhi"}</div>
                                                            </div>
                                                            <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Consultation Fee</p>
                                                                    <p className="text-base font-black text-slate-900 mt-1">₹{(lawyer.hourlyRate || 1000).toLocaleString()}/hr</p>
                                                                </div>
                                                                <Button 
                                                                    onClick={() => setSelectedLawyer(lawyer)}
                                                                    className="bg-primary text-white hover:bg-violet-800 rounded-xl font-bold text-xs h-9 px-4 flex items-center gap-1.5 shadow-sm"
                                                                >
                                                                    <span>Book Now</span>
                                                                    <ArrowRight size={13} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-16 text-center text-slate-400">
                                            <Briefcase size={36} className="mx-auto mb-2 text-slate-350" />
                                            <p className="font-bold text-sm">No lawyers found matching your filters</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* STEP 2: SCHEDULING DETAILS & FORM */
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Side: Lawyer Info */}
                                <div className="lg:col-span-4 space-y-6 bg-slate-50/50 border border-border p-6 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16 rounded-2xl border border-border shrink-0">
                                            <AvatarImage 
                                                src={selectedLawyer.avatar ? (selectedLawyer.avatar.startsWith('http') ? selectedLawyer.avatar : (selectedLawyer.avatar.startsWith('/') ? `/lawyer${selectedLawyer.avatar}` : `/lawyer/${selectedLawyer.avatar}`)) : ""} 
                                                alt={selectedLawyer.fullName} 
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="rounded-2xl bg-slate-50 text-slate-400">
                                                <User className="h-8 w-8" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="font-extrabold text-slate-900 text-base leading-none">{selectedLawyer.fullName}</h3>
                                                {selectedLawyer.isVerified && <ShieldCheck className="h-4 w-4 text-primary" />}
                                            </div>
                                            <p className="text-xs text-primary font-extrabold uppercase tracking-widest mt-0.5">{selectedLawyer.expertise || "General Practice"}</p>
                                        </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-4 text-xs font-semibold text-slate-650">
                                        <div className="grid grid-cols-3 gap-2 py-1 bg-white border border-slate-150 rounded-xl p-3 shadow-sm text-center">
                                            <div className="space-y-0.5">
                                                <span className="text-[8px] uppercase font-bold text-slate-400">Rating</span>
                                                <p className="text-slate-900 font-black flex items-center justify-center gap-1">
                                                    <Star size={11} className="text-amber-500 fill-amber-500" />
                                                    {selectedLawyer.rating || "5.0"}
                                                </p>
                                            </div>
                                            <div className="space-y-0.5 border-x border-slate-100">
                                                <span className="text-[8px] uppercase font-bold text-slate-400">Experience</span>
                                                <p className="text-slate-900 font-black flex items-center justify-center gap-1">
                                                    <Clock size={11} className="text-primary" />
                                                    {selectedLawyer.experience || "10+"}
                                                </p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[8px] uppercase font-bold text-slate-400">Location</span>
                                                <p className="text-slate-900 font-black flex items-center justify-center gap-1 truncate max-w-[80px] mx-auto">
                                                    <MapPin size={11} className="text-primary" />
                                                    {selectedLawyer.location || "Remote"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Advocate Biography</span>
                                            <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-150 p-3.5 rounded-xl font-medium">{selectedLawyer.bio || "No professional biography provided."}</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Practice Areas</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(selectedLawyer.practiceAreas || ["Legal Consult", "Case Representation"]).map((tag: string) => (
                                                    <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 border-none font-semibold text-[8px] px-2 rounded-md uppercase tracking-wider">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1"><Award size={12} className="text-primary" /> Bar Memberships</span>
                                            <div className="flex flex-col gap-1.5 text-slate-700 font-medium bg-white border border-slate-150 p-3.5 rounded-xl">
                                                <span className="flex items-center gap-1.5">✓ Bar Council of India</span>
                                                <span className="flex items-center gap-1.5">✓ High Court Bar Association</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1"><Languages size={12} className="text-primary" /> Languages</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(selectedLawyer.languages && selectedLawyer.languages.length > 0 ? selectedLawyer.languages : ["English", "Hindi"]).map((l: string) => (
                                                    <Badge key={l} variant="outline" className="font-semibold text-[10px]">{l}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Schedule & Details Form */}
                                <div className="lg:col-span-8 space-y-6">
                                    <Card className="rounded-3xl border border-border">
                                        <CardContent className="p-6 md:p-8 space-y-6">
                                            <h3 className="text-lg font-bold text-slate-900 border-b border-border pb-3">Consultation Form</h3>
                                            <form onSubmit={handleCreateRequest} className="space-y-5">
                                                <div className="space-y-2">
                                                    <label htmlFor="consultation-topic" className="font-bold text-xs text-slate-700">Consultation Topic / Subject</label>
                                                    <Input 
                                                        id="consultation-topic"
                                                        placeholder="e.g. Legal Advisory on Founder Agreement, Employment Contract Audit"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        required
                                                        className="h-11 rounded-xl"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label htmlFor="consultation-desc" className="font-bold text-xs text-slate-700">Inquiry details / Description</label>
                                                    <Textarea 
                                                        id="consultation-desc"
                                                        rows={3}
                                                        placeholder="Explain your legal situation and questions you want addressed during the call..."
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        required
                                                        className="rounded-xl p-3 text-sm min-h-[90px]"
                                                    />
                                                </div>

                                                {/* Calendar Date Picker */}
                                                <div className="space-y-2">
                                                    <label className="font-bold text-xs text-slate-700">Select Date</label>
                                                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                                        {getNext7Days().map((day, idx) => {
                                                            const isSelected = scheduledDate === day.toISOString().split('T')[0];
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    onClick={() => setScheduledDate(day.toISOString().split('T')[0])}
                                                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center shrink-0 w-16 transition-all ${
                                                                        isSelected 
                                                                        ? "border-primary bg-secondary text-primary ring-1 ring-violet-700" 
                                                                        : "border-border hover:border-slate-350 bg-white"
                                                                    }`}
                                                                >
                                                                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">
                                                                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                                                    </span>
                                                                    <span className="text-lg font-black mt-1 leading-none">
                                                                        {day.getDate()}
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Time Slots Selector */}
                                                <div className="space-y-2">
                                                    <label className="font-bold text-xs text-slate-700">Available Slots</label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {timeSlots.map((slot) => {
                                                            const isSelected = scheduledTime === slot;
                                                            return (
                                                                <button
                                                                    key={slot}
                                                                    type="button"
                                                                    onClick={() => setScheduledTime(slot)}
                                                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                                                                        isSelected 
                                                                        ? "border-primary bg-secondary text-primary ring-1 ring-violet-700" 
                                                                        : "border-border hover:border-slate-350 bg-white"
                                                                    }`}
                                                                >
                                                                    {slot}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Price Details */}
                                                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-2 text-xs font-semibold text-slate-500">
                                                    <div className="flex justify-between">
                                                        <span>Consultation Fee (1 hr)</span>
                                                        <span className="text-slate-900 font-bold">₹{(selectedLawyer.hourlyRate || 1000).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Vidhik Platform Fee</span>
                                                        <span className="text-slate-900 font-bold">₹150</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Taxes (GST 18%)</span>
                                                        <span className="text-slate-900 font-bold">₹{((selectedLawyer.hourlyRate || 1000) * 0.18).toFixed(2)}</span>
                                                    </div>
                                                    <Separator />
                                                    <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                                                        <span>Total Amount</span>
                                                        <span className="text-primary">
                                                            ₹{Math.round((selectedLawyer.hourlyRate || 1000) + 150 + ((selectedLawyer.hourlyRate || 1000) * 0.18)).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="w-full h-12 bg-primary text-white hover:bg-violet-800 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <Calendar className="w-4 h-4" />
                                                    {submitting ? "Submitting Request..." : "Send Request to Advocate"}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-muted-foreground font-semibold">Loading consultations...</p>
                    </div>
                ) : consultations.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 space-y-6 max-w-xl mx-auto shadow-sm">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                            <Video className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900">No live consultations scheduled</h3>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
                                Reach out to verified advocates for immediate legal counseling via face-to-face video calls.
                            </p>
                        </div>
                        <Button 
                            onClick={() => setShowNewRequest(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-12 px-8 font-bold shadow-sm"
                        >
                            Request First Consultation
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {consultations.map((consultation) => (
                            <Card key={consultation._id} className="rounded-3xl border border-slate-200 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 sm:p-8 space-y-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{consultation.title}</h3>
                                                {getStatusBadge(consultation.status)}
                                                {consultation.status === 'scheduled' && consultation.meetingJoinedByLawyer && (
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold text-[10px] animate-pulse">
                                                        Advocate in Room
                                                    </Badge>
                                                )}
                                                {consultation.status === 'scheduled' && consultation.meetingJoinedByClient && (
                                                    <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20 font-bold text-[10px]">
                                                        You Joined
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                    {new Date(consultation.scheduledDate).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    {consultation.scheduledTime}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Coins className="h-4 w-4 text-primary" />
                                                    ₹{consultation.totalFee}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                                            {consultation.status === 'pending_user_approval' && (
                                                <>
                                                    <Button 
                                                        onClick={() => handleAcceptProposal(consultation._id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs"
                                                    >
                                                        Accept Counter-Proposal
                                                    </Button>
                                                    <Button 
                                                        onClick={() => {
                                                             setCounterConsultation(consultation);
                                                             setCounterDate(consultation.scheduledDate.split('T')[0]);
                                                             setCounterTime(consultation.scheduledTime);
                                                        }}
                                                        variant="outline"
                                                        className="border-slate-200 rounded-xl font-semibold text-xs text-slate-700"
                                                    >
                                                        Propose Counter
                                                    </Button>
                                                </>
                                            )}

                                            {consultation.status === 'pending_payment' && (
                                                <div className="flex items-center gap-2">
                                                    <Button 
                                                        disabled={isProcessingPayment}
                                                        onClick={() => {
                                                            setIsPayingId(consultation._id);
                                                            handlePayment(consultation._id, false);
                                                        }}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-100"
                                                    >
                                                        Pay ₹{consultation.totalFee}
                                                    </Button>
                                                </div>
                                            )}

                                            {consultation.status === 'scheduled' && (
                                                <Button 
                                                    onClick={() => navigate(`/consultations/${consultation._id}/meet`)}
                                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-sm"
                                                >
                                                    <Video className="h-4 w-4" />
                                                    {consultation.meetingJoinedByLawyer ? "Advocate Joined • Join Room" : "Join Video Room"}
                                                </Button>
                                            )}

                                            {consultation.status === 'completed' && (
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Button 
                                                        onClick={() => setSelectedSummary(consultation)}
                                                        variant="outline"
                                                        className="border-primary/30 text-primary hover:bg-primary/10 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        View Summary
                                                    </Button>
                                                    <Button 
                                                        onClick={() => {
                                                            setSelectedLawyer(consultation.lawyer);
                                                            setShowNewRequest(true);
                                                        }}
                                                        className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Book New Consultation
                                                    </Button>
                                                </div>
                                            )}

                                            {consultation.status !== 'completed' && consultation.status !== 'cancelled' && (
                                                <Button 
                                                    onClick={() => handleCancel(consultation._id)}
                                                    variant="ghost" 
                                                    className="text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold"
                                                >
                                                    Cancel Request
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <Separator className="bg-slate-100" />

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2 space-y-3">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Description / Inquiry Topic</span>
                                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-2xl whitespace-pre-wrap">
                                                {consultation.description}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Assigned Legal Expert</span>
                                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                                                <div className="h-10 w-10 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                                                    {consultation.lawyer?.avatar ? (
                                                        <img 
                                                            src={consultation.lawyer.avatar.startsWith('http') ? consultation.lawyer.avatar : `/lawyer/${consultation.lawyer.avatar.replace(/^\//, '')}`} 
                                                            alt={consultation.lawyer.fullName}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold bg-slate-100">
                                                            {consultation.lawyer?.fullName?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 text-sm leading-none">{consultation.lawyer?.fullName}</h4>
                                                    <p className="text-[9px] text-primary font-bold uppercase mt-1.5 tracking-wider">{consultation.lawyer?.expertise || 'Advocate'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Uploaded docs preview if scheduled or completed */}
                                    {['scheduled', 'completed'].includes(consultation.status) && consultation.documents && consultation.documents.length > 0 && (
                                        <div className="border-t border-slate-100 pt-6 space-y-3">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Consultation Shared Files ({consultation.documents.length})</span>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {consultation.documents.map((doc, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-xl">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <FileText className="h-4 w-4 text-primary shrink-0" />
                                                            <div className="truncate">
                                                                <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                                                                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Uploaded by {doc.uploadedBy}</p>
                                                            </div>
                                                        </div>
                                                        <a 
                                                            href={`/lawyer${doc.url}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 shrink-0 shadow-sm"
                                                        >
                                                            <ExternalLink size={13} />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>



            {/* Modal: Pay & Checkout */}
            {isPayingId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden border border-slate-200 shadow-2xl flex flex-col p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                                <Coins className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Checkout Payment</h3>
                            <p className="text-slate-500 text-sm font-semibold">Verify the timing details and pay for your live session.</p>
                        </div>

                        <Separator className="bg-slate-100" />

                        {(() => {
                            const consult = consultations.find(c => c._id === isPayingId);
                            if (!consult) return null;
                            return (
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl space-y-2 text-xs font-semibold text-slate-700">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Consultation Title:</span>
                                            <span className="text-slate-900 font-bold max-w-[200px] truncate">{consult.title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Scheduled Date:</span>
                                            <span className="text-slate-900 font-bold">{new Date(consult.scheduledDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Scheduled Time:</span>
                                            <span className="text-slate-900 font-bold">{consult.scheduledTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Advocate Assigned:</span>
                                            <span className="text-slate-900 font-bold">{consult.lawyer?.fullName}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-secondary/50 p-4 border border-border rounded-2xl text-slate-900">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount Due:</span>
                                        <span className="text-2xl font-black">₹{consult.totalFee}</span>
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="grid grid-cols-2 gap-4">
                            <Button 
                                onClick={() => handlePayment(isPayingId, false)} 
                                disabled={isProcessingPayment}
                                className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl h-12 font-bold shadow-sm transition-colors"
                            >
                                {isProcessingPayment ? "Processing..." : `Pay ₹${consultations.find(c => c._id === isPayingId)?.totalFee || ''}`}
                            </Button>
                            <Button 
                                onClick={() => setIsPayingId(null)}
                                variant="outline" 
                                className="border-slate-200 rounded-2xl h-12 font-bold text-slate-700"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Counter Proposal */}
            {counterConsultation && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden border border-slate-200 shadow-2xl flex flex-col p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Propose Counter Date/Time</h3>
                            <Button onClick={() => setCounterConsultation(null)} variant="ghost" size="icon" className="rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleProposeCounter} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Choose New Date</label>
                                <Input 
                                    type="date"
                                    value={counterDate}
                                    onChange={(e) => setCounterDate(e.target.value)}
                                    required
                                    className="rounded-xl h-11 border-slate-200"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Choose New Time</label>
                                <Input 
                                    type="time"
                                    value={counterTime}
                                    onChange={(e) => setCounterTime(e.target.value)}
                                    required
                                    className="rounded-xl h-11 border-slate-200"
                                />
                            </div>

                            <Button 
                                type="submit"
                                disabled={submittingCounter}
                                className="w-full bg-primary text-white hover:bg-primary/95 rounded-xl h-11 font-bold shadow-sm"
                            >
                                {submittingCounter ? "Submitting..." : "Submit Proposal"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: View Meeting Summary */}
            {selectedSummary && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
                                    Completed Session
                                </span>
                                <h3 className="text-xl font-extrabold text-slate-900">Consultation Summary</h3>
                            </div>
                            <Button 
                                onClick={() => setSelectedSummary(null)}
                                variant="ghost" 
                                size="icon" 
                                className="rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto flex-1 font-sans">
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Topic / Case Title</span>
                                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedSummary.title}</h4>
                                    </div>
                                    <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                                        ₹{selectedSummary.totalFee}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-xs">
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">Advocate</span>
                                        <span className="font-bold text-slate-800">Adv. {selectedSummary.lawyer?.fullName}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">Meeting Duration</span>
                                        <span className="font-bold text-slate-800">{selectedSummary.meetingDuration ? `${selectedSummary.meetingDuration} mins` : "Completed"}</span>
                                    </div>
                                </div>

                                <div className="text-xs text-slate-500 pt-1">
                                    Scheduled: {new Date(selectedSummary.scheduledDate).toLocaleDateString()} at {selectedSummary.scheduledTime}
                                </div>
                            </div>

                            {selectedSummary.meetingNotes ? (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Advocate's Legal Advice & Summary Notes</span>
                                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                                        {selectedSummary.meetingNotes}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-xs text-slate-500 italic text-center">
                                    No additional meeting notes were recorded by counsel for this session.
                                </div>
                            )}

                            {selectedSummary.documents && selectedSummary.documents.length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shared Documents ({selectedSummary.documents.length})</span>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {selectedSummary.documents.map((doc, idx) => (
                                            <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-3 text-xs">
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileText className="h-4 w-4 text-primary shrink-0" />
                                                    <span className="font-bold text-slate-800 truncate">{doc.name}</span>
                                                </div>
                                                <a
                                                    href={`/lawyer${doc.url}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-primary hover:underline font-bold text-[11px] shrink-0"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Repayment and Rejoin Disabled Warning */}
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-900 space-y-1.5">
                                <p className="font-bold flex items-center gap-1.5 text-amber-800">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Session Finalized • Rejoin Disabled
                                </p>
                                <p className="text-[11px] text-amber-700 leading-relaxed">
                                    This consultation has been closed and cannot be reopened or rejoined. If you need further legal counsel or follow-up discussion, please book and pay for a new consultation.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                            <Button 
                                onClick={() => setSelectedSummary(null)}
                                variant="outline"
                                className="flex-1 rounded-xl h-11 text-xs font-bold border-slate-200 text-slate-700"
                            >
                                Close
                            </Button>
                            <Button 
                                onClick={() => {
                                    const advocate = selectedSummary.lawyer;
                                    setSelectedSummary(null);
                                    setSelectedLawyer(advocate);
                                    setShowNewRequest(true);
                                }}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl h-11 text-xs font-bold shadow-md shadow-primary/20"
                            >
                                Book New Consultation
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
