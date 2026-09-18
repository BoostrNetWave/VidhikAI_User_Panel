import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    Briefcase, 
    AlertCircle, 
    Clock, 
    User, 
    Coins, 
    FileText, 
    ExternalLink,
    ShieldAlert,
    Search,
    Calendar,
    MapPin,
    Award,
    ShieldCheck,
    CreditCard,
    Smartphone,
    Building2,
    ArrowRight,
    Star,
    ArrowLeft,
    Lock,
    Video,
    Download,
    CheckCircle2,
    Languages
} from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { caseService, ICase } from "@/services/caseService";
import { lawyerService } from "@/services/lawyerService";
import { toast } from "sonner";

export default function CasesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cases, setCases] = useState<ICase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCase, setSelectedCase] = useState<ICase | null>(null);
    const [caseSearchQuery, setCaseSearchQuery] = useState("");

    // Start New Case Flow States
    const [showNewCaseFlow, setShowNewCaseFlow] = useState<boolean>(false);
    const [lawyers, setLawyers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedLawyer, setSelectedLawyer] = useState<any>(null);

    // Scheduling States
    const [caseTitle, setCaseTitle] = useState("");
    const [caseDesc, setCaseDesc] = useState("");
    const [bookingDate, setBookingDate] = useState<Date | null>(null);
    const [bookingTime, setBookingTime] = useState<string>("");
    const [submittingBooking, setSubmittingBooking] = useState(false);

    // Checkout Payment States
    const [isPayingForCaseId, setIsPayingForCaseId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
    const [cardData, setCardData] = useState({ name: '', number: '', expiryMonth: '', expiryYear: '', cvv: '' });
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('State Bank of India');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

    const fetchCases = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const data = await caseService.getClientCases();
            setCases(data);
            setSelectedCase(prevSelected => {
                if (!prevSelected) return null;
                const updated = data.find(c => c._id === prevSelected._id);
                return updated || prevSelected;
            });
        } catch (err: any) {
            console.error(err);
            if (!isSilent) {
                toast.error(err.response?.data?.message || "Failed to load cases");
            }
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, []);

    const fetchLawyers = async () => {
        try {
            const data = await lawyerService.getPublicLawyers();
            setLawyers(data);
        } catch (error) {
            console.error("Failed to fetch lawyers", error);
            toast.error("Failed to load lawyers list");
        }
    };

    useEffect(() => {
        fetchCases();
        fetchLawyers();

        const interval = setInterval(() => {
            fetchCases(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchCases]);

    useEffect(() => {
        if (location.state) {
            if (location.state.startBookingWithLawyer) {
                setSelectedLawyer(location.state.startBookingWithLawyer);
                setShowNewCaseFlow(true);
                setSelectedCase(null);
                window.history.replaceState({}, document.title);
            } else if (location.state.startBookingFlow) {
                setSelectedLawyer(null);
                setShowNewCaseFlow(true);
                setSelectedCase(null);
                window.history.replaceState({}, document.title);
            }
        }
    }, [location.state]);

    const handleApprovePlan = async () => {
        if (!selectedCase) return;

        try {
            const updated = await caseService.approvePlan(selectedCase._id);
            toast.success("Roadmap approved successfully! Work can now begin.");
            fetchCases();
            setSelectedCase(updated);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to approve plan");
        }
    };

    const filteredLawyers = lawyers.filter(lawyer => {
        const matchesSearch = 
            (lawyer.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lawyer.expertise || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lawyer.location || "").toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === "All" || 
            (lawyer.expertise || "").toLowerCase().includes(selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    const filteredCases = cases.filter(c => 
        (c.title || "").toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
        (c.lawyer?.fullName || "").toLowerCase().includes(caseSearchQuery.toLowerCase())
    );

    const handleSendBookingRequest = async () => {
        if (!selectedLawyer) return;
        if (!caseTitle.trim() || !caseDesc.trim() || !bookingDate || !bookingTime) {
            toast.error("Please fill in all details, choose a date, and select a time slot.");
            return;
        }

        setSubmittingBooking(true);
        try {
            const hourlyRate = selectedLawyer.hourlyRate || 1000;
            const serviceFee = 150;
            const gst = hourlyRate * 0.18;
            const totalAmount = hourlyRate + serviceFee + gst;

            await caseService.bookLawyer({
                lawyerId: selectedLawyer._id,
                title: caseTitle.trim(),
                description: caseDesc.trim(),
                bookingDate: bookingDate.toISOString(),
                bookingTime,
                totalFee: totalAmount
            });

            toast.success("Booking request sent successfully! Awaiting lawyer's response.");
            setShowNewCaseFlow(false);
            setSelectedLawyer(null);
            setCaseTitle("");
            setCaseDesc("");
            setBookingDate(null);
            setBookingTime("");
            fetchCases();
        } catch (error: any) {
            console.error("Booking error:", error);
            toast.error(error.response?.data?.message || "Failed to submit booking request.");
        } finally {
            setSubmittingBooking(false);
        }
    };

    const handleCheckoutPayment = async () => {
        if (!isPayingForCaseId) return;
        setIsProcessingPayment(true);
        try {
            await caseService.payAndConfirm(isPayingForCaseId);
            toast.success("Payment completed & Booking Confirmed!");
            setIsPayingForCaseId(null);
            fetchCases();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Payment processing failed.");
        } finally {
            setIsProcessingPayment(false);
        }
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Case Management</h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Track case progress, verify lawyer roadmaps, monitor milestone payments, or schedule a new case consultation.
                        </p>
                    </div>
                    {!showNewCaseFlow && !isPayingForCaseId && (
                        <Button 
                            onClick={() => {
                                setShowNewCaseFlow(true);
                                setSelectedCase(null);
                            }}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold px-6 py-5 shadow-sm flex items-center gap-2 transition-all duration-200"
                        >
                            <span>+ Start New Case</span>
                        </Button>
                    )}
                </div>

                {showNewCaseFlow ? (
                    /* WIZARD FOR STARTING A NEW CASE */
                    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <button 
                                onClick={() => {
                                    if (selectedLawyer) {
                                        setSelectedLawyer(null);
                                    } else {
                                        setShowNewCaseFlow(false);
                                    }
                                }}
                                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                {selectedLawyer ? "Back to Lawyer List" : "Cancel & Back to Cases"}
                            </button>
                            <h2 className="text-xl font-black text-slate-900">
                                {selectedLawyer ? "Schedule Case Consultation" : "Choose Your Legal Specialist"}
                            </h2>
                        </div>

                        {!selectedLawyer ? (
                            /* STEP 1: LAWYER LIST & DISCOVERY GRID */
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

                                {/* Filters */}
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
                                            <Card key={lawyer._id} className="rounded-2xl border border-border bg-white hover:shadow-md transition-all duration-300 overflow-hidden">
                                                <CardContent className="p-6">
                                                    <div className="flex gap-4">
                                                        <div className="relative shrink-0">
                                                            <Avatar className="h-16 w-16 rounded-2xl border border-border shrink-0">
                                                                <AvatarImage 
                                                                    src={lawyer.avatar ? `/lawyer${lawyer.avatar}` : ""} 
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
                                                                    className="bg-primary text-white hover:bg-violet-800 rounded-xl font-bold text-xs h-9 px-4 flex items-center gap-1.5"
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
                            /* STEP 2: SCHEDULING DETAILS & SLOTS SELECTION */
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Side: Lawyer Info */}
                                <div className="lg:col-span-4 space-y-6 bg-slate-50/50 border border-border p-6 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16 rounded-2xl border border-border shrink-0">
                                            <AvatarImage 
                                                src={selectedLawyer.avatar ? `/lawyer${selectedLawyer.avatar}` : ""} 
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
                                                {selectedLawyer.isVerified && <ShieldCheck className="h-4 w-4 text-violet-750" />}
                                            </div>
                                            <p className="text-xs text-primary font-extrabold uppercase tracking-widest mt-0.5">{selectedLawyer.expertise || "General Practice"}</p>
                                        </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-4 text-xs font-semibold text-slate-650">
                                        {/* Core Ratings & Metadata */}
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

                                        {/* Biography */}
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Advocate Biography</span>
                                            <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-150 p-3.5 rounded-xl font-medium">{selectedLawyer.bio || "No professional biography provided."}</p>
                                        </div>

                                        {/* Practice Areas / Tags */}
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

                                        {/* Bar Council & Memberships */}
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1"><Award size={12} className="text-violet-750" /> Bar Memberships</span>
                                            <div className="flex flex-col gap-1.5 text-slate-700 font-medium bg-white border border-slate-150 p-3.5 rounded-xl">
                                                <span className="flex items-center gap-1.5">✓ Bar Council of India</span>
                                                <span className="flex items-center gap-1.5">✓ Supreme Court Bar Association</span>
                                            </div>
                                        </div>

                                        {/* Languages */}
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1"><Languages size={12} className="text-violet-750" /> Languages</span>
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
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="case-title" className="font-bold text-xs text-slate-700">Case Title / Legal Topic</Label>
                                                    <Input 
                                                        id="case-title"
                                                        placeholder="e.g. Property Dispute Plot 442-B, NDA Drafting, Trademark Search"
                                                        value={caseTitle}
                                                        onChange={(e) => setCaseTitle(e.target.value)}
                                                        className="h-11 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="case-desc" className="font-bold text-xs text-slate-700">Brief Description of Legal Needs</Label>
                                                    <textarea 
                                                        id="case-desc"
                                                        rows={3}
                                                        placeholder="Describe the details of your legal problem, background context, or specific questions you need answered..."
                                                        value={caseDesc}
                                                        onChange={(e) => setCaseDesc(e.target.value)}
                                                        className="w-full border border-input rounded-xl p-3 text-sm focus:ring-1 focus:ring-ring outline-none min-h-[90px]"
                                                    />
                                                </div>

                                                {/* Calendar Date Picker */}
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-xs text-slate-700">Select Date</Label>
                                                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                                        {getNext7Days().map((day, idx) => {
                                                            const isSelected = bookingDate && bookingDate.toDateString() === day.toDateString();
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    onClick={() => setBookingDate(day)}
                                                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center shrink-0 w-16 transition-all ${
                                                                        isSelected 
                                                                        ? "border-primary bg-secondary text-primary ring-1 ring-violet-700" 
                                                                        : "border-border hover:border-slate-350"
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
                                                    <Label className="font-bold text-xs text-slate-700">Available Slots</Label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {timeSlots.map((slot) => {
                                                            const isSelected = bookingTime === slot;
                                                            return (
                                                                <button
                                                                    key={slot}
                                                                    type="button"
                                                                    onClick={() => setBookingTime(slot)}
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
                                            </div>

                                            {/* Price Details */}
                                            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-2 text-xs font-semibold text-slate-500">
                                                <div className="flex justify-between">
                                                    <span>Consultation Fee (1 hr)</span>
                                                    <span className="text-slate-900 font-bold">₹{(selectedLawyer.hourlyRate || 1000).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Vidhik Service Fee</span>
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
                                                onClick={handleSendBookingRequest}
                                                disabled={submittingBooking}
                                                className="w-full h-12 bg-primary text-white hover:bg-violet-800 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                                            >
                                                <Calendar className="w-4 h-4" />
                                                {submittingBooking ? "Sending Request..." : "Send Booking Request"}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                ) : isPayingForCaseId ? (
                    /* WIZARD FOR SECURE CONSULTATION PAYMENT */
                    (() => {
                        const targetCase = cases.find(c => c._id === isPayingForCaseId);
                        if (!targetCase) return null;
                        const baseFee = targetCase.totalFee - 150;
                        const subtotal = baseFee / 1.18;
                        const gstAmount = subtotal * 0.18;

                        return (
                            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <button 
                                        onClick={() => setIsPayingForCaseId(null)}
                                        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 group"
                                    >
                                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        Back to Case Details
                                    </button>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <Lock className="w-4 h-4 text-primary" />
                                        Secure Checkout
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                    {/* Checkout Form */}
                                    <div className="md:col-span-7 space-y-6">
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
                                            <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Simulated Checkout Active</p>
                                                <p className="text-[11px] text-amber-700/90 mt-1 font-semibold leading-relaxed">
                                                    Enter any dummy credentials below to proceed. Clicking pay will immediately write verification and activate the case.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Select Payment Option</h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                <button
                                                    onClick={() => setPaymentMethod('card')}
                                                    className={`p-3.5 border rounded-2xl flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                                                        paymentMethod === 'card' 
                                                        ? 'border-primary bg-secondary text-primary ring-1 ring-violet-700' 
                                                        : 'border-border bg-white hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <CreditCard size={18} />
                                                    <span>Card</span>
                                                </button>
                                                <button
                                                    onClick={() => setPaymentMethod('upi')}
                                                    className={`p-3.5 border rounded-2xl flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                                                        paymentMethod === 'upi' 
                                                        ? 'border-primary bg-secondary text-primary ring-1 ring-violet-700' 
                                                        : 'border-border bg-white hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <Smartphone size={18} />
                                                    <span>UPI</span>
                                                </button>
                                                <button
                                                    onClick={() => setPaymentMethod('netbanking')}
                                                    className={`p-3.5 border rounded-2xl flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                                                        paymentMethod === 'netbanking' 
                                                        ? 'border-primary bg-secondary text-primary ring-1 ring-violet-700' 
                                                        : 'border-border bg-white hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <Building2 size={18} />
                                                    <span>Net Banking</span>
                                                </button>
                                            </div>
                                        </div>

                                        {paymentMethod === 'card' && (
                                            <div className="space-y-4 animate-in fade-in duration-300">
                                                <div className="space-y-1.5">
                                                    <Label className="font-bold text-xs">Cardholder Name</Label>
                                                    <Input placeholder="John Doe" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value})} className="h-11 rounded-xl" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="font-bold text-xs">Card Number</Label>
                                                    <Input placeholder="4111 2222 3333 4444" value={cardData.number} onChange={(e) => setCardData({...cardData, number: e.target.value})} className="h-11 rounded-xl" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <Label className="font-bold text-xs">Expiry Date</Label>
                                                        <Input placeholder="MM/YY" value={cardData.expiryMonth} onChange={(e) => setCardData({...cardData, expiryMonth: e.target.value})} className="h-11 rounded-xl" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="font-bold text-xs">CVV</Label>
                                                        <Input placeholder="123" type="password" value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value})} className="h-11 rounded-xl" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'upi' && (
                                            <div className="space-y-4 animate-in fade-in duration-300">
                                                <div className="space-y-1.5">
                                                    <Label className="font-bold text-xs">UPI ID</Label>
                                                    <Input placeholder="username@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="h-11 rounded-xl" />
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'netbanking' && (
                                            <div className="space-y-4 animate-in fade-in duration-300">
                                                <div className="space-y-1.5">
                                                    <Label className="font-bold text-xs">Select Bank</Label>
                                                    <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full h-11 bg-background border border-input rounded-xl px-3 text-sm font-semibold outline-none focus:ring-1 focus:ring-ring">
                                                        <option>State Bank of India</option>
                                                        <option>HDFC Bank</option>
                                                        <option>ICICI Bank</option>
                                                        <option>Axis Bank</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="md:col-span-5 bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-6">
                                        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Booking Summary</h3>
                                        <div className="flex gap-3">
                                            <Avatar className="h-12 w-12 rounded-xl border border-border shrink-0">
                                                <AvatarImage 
                                                    src={targetCase.lawyer?.avatar ? `/lawyer${targetCase.lawyer.avatar}` : ""} 
                                                    alt={targetCase.lawyer?.fullName || "Avatar"} 
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="rounded-xl bg-white text-slate-400">
                                                    <User className="h-6 w-6" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{targetCase.lawyer?.fullName}</h4>
                                                <p className="text-[10px] text-violet-750 font-extrabold uppercase mt-0.5">{targetCase.lawyer?.expertise || "General Practice"}</p>
                                                {targetCase.bookingDate && (
                                                    <p className="text-[10px] text-slate-500 font-bold mt-1">
                                                        {new Date(targetCase.bookingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {targetCase.bookingTime}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2 text-xs font-semibold text-slate-500">
                                            <div className="flex justify-between">
                                                <span>Consultation Fee</span>
                                                <span className="text-slate-900">₹{Math.round(subtotal).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Platform Booking Fee</span>
                                                <span className="text-slate-900">₹150</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Taxes (GST 18%)</span>
                                                <span className="text-slate-900">₹{Math.round(gstAmount).toLocaleString()}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                                                <span>Total Price</span>
                                                <span className="text-violet-750">₹{targetCase.totalFee.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleCheckoutPayment}
                                            disabled={isProcessingPayment}
                                            className="w-full h-12 bg-violet-705 text-white hover:bg-violet-800 bg-primary rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                                        >
                                            <Lock size={14} />
                                            {isProcessingPayment ? "Processing..." : "Pay & Confirm Booking"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })()
                ) : (
                    /* CASES LIST & DETAIL VIEWS */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Left Column: Case List (4 Cols) */}
                        <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
                            <div className="flex justify-between items-center">
                                <h3 className="font-extrabold text-slate-900 text-lg">My Cases</h3>
                                <Badge className="bg-secondary text-primary hover:bg-secondary text-[10px] font-black border-none px-2 py-0.5 rounded">
                                    {cases.length} Total
                                </Badge>
                            </div>

                            {/* Search bar inside sidebar */}
                            {cases.length > 0 && (
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input 
                                        className="pl-9 h-10 text-xs rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary font-semibold"
                                        placeholder="Search cases or advocates..."
                                        value={caseSearchQuery}
                                        onChange={(e) => setCaseSearchQuery(e.target.value)}
                                    />
                                </div>
                            )}

                            {loading && cases.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-2 text-xs text-slate-400 font-bold">Loading engagements...</p>
                                </div>
                            ) : cases.length === 0 ? (
                                <div className="py-16 text-center text-slate-400 border border-dashed border-border rounded-2xl bg-slate-50/50 p-6">
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary mb-4 border border-border shadow-sm">
                                        <Briefcase size={24} />
                                    </div>
                                    <p className="font-extrabold text-slate-900 text-base">No active cases</p>
                                    <p className="text-xs text-slate-500 max-w-[220px] mx-auto mt-2 leading-relaxed font-semibold">Once you hire a lawyer for a case or book a consultation, it will show up here.</p>
                                    <Button
                                        onClick={() => setShowNewCaseFlow(true)}
                                        className="mt-5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-700 text-white rounded-xl font-bold text-xs h-10 px-6 shadow-lg shadow-sm/30"
                                    >
                                        + Start First Case
                                    </Button>
                                </div>
                            ) : filteredCases.length === 0 ? (
                                <div className="py-12 text-center text-slate-450">
                                    <Briefcase size={28} className="mx-auto mb-2 text-slate-300" />
                                    <p className="font-bold text-sm text-slate-500">No matching cases</p>
                                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search query.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                                    {filteredCases.map((c) => (
                                        <div
                                            key={c._id}
                                            onClick={() => setSelectedCase(c)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                                selectedCase?._id === c._id
                                                    ? "border-primary bg-secondary/30 shadow-sm"
                                                    : "border-border bg-card hover:border-slate-300 hover:shadow-sm"
                                            }`}
                                        >
                                            <div className="flex gap-3">
                                                <Avatar className="h-10 w-10 rounded-xl border border-slate-150 shrink-0">
                                                    <AvatarImage 
                                                        src={c.lawyer?.avatar ? (c.lawyer.avatar.startsWith('http') ? c.lawyer.avatar : (c.lawyer.avatar.startsWith('/') ? `/lawyer${c.lawyer.avatar}` : `/lawyer/${c.lawyer.avatar}`)) : ""} 
                                                        alt={c.lawyer?.fullName || "Lawyer Avatar"} 
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="rounded-xl bg-slate-50 text-slate-400">
                                                        <User className="h-5 w-5" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex justify-between items-start gap-1.5">
                                                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug truncate">{c.title}</h4>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 font-semibold truncate">
                                                        Adv. {c.lawyer?.fullName || "Legal Counsel"}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 pt-1.5">
                                                        <Badge 
                                                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-none shadow-none ${
                                                                c.status === 'pending_lawyer' 
                                                                ? 'bg-amber-50 text-amber-700 border border-amber-200/50' 
                                                                : c.status === 'pending_payment' 
                                                                    ? 'bg-orange-50 text-orange-700 border border-orange-200/50' 
                                                                    : c.status === 'active'
                                                                        ? 'bg-secondary text-violet-705 border border-primary/20/50'
                                                                        : 'bg-green-50 text-green-700 border border-green-200/50'
                                                            }`}
                                                        >
                                                            {c.status === 'pending_lawyer' ? 'Awaiting Lawyer' : c.status === 'pending_payment' ? 'Awaiting Payment' : c.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Progress bar */}
                                            <div className="mt-4 pt-3 border-t border-slate-50">
                                                <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                                    <span>Verification Progress</span>
                                                    <span className="text-violet-705">{c.currentProgress}%</span>
                                                </div>
                                                <Progress value={c.currentProgress} className="h-1.5 bg-slate-100 [&>div]:bg-primary" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Case Details (8 Cols) */}
                        <div className="lg:col-span-8">
                            {selectedCase ? (
                                <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                                    <CardContent className="p-6 md:p-8 space-y-8">
                                        
                                        {/* Case Title and Status */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{selectedCase.title}</h2>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-xs text-slate-400 font-semibold">Case Reference:</span>
                                                    <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{selectedCase._id}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center gap-6 shrink-0 bg-slate-50 border border-slate-150/40 rounded-2xl px-6 py-4">
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Case Status</p>
                                                    <Badge 
                                                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border-none shadow-none mt-1 ${
                                                            selectedCase.status === 'pending_lawyer' 
                                                            ? 'bg-amber-100 text-amber-800' 
                                                            : selectedCase.status === 'pending_payment' 
                                                                ? 'bg-orange-100 text-orange-800' 
                                                                : selectedCase.status === 'active'
                                                                    ? 'bg-secondary/80 text-primary'
                                                                    : 'bg-green-100 text-green-800'
                                                        }`}
                                                    >
                                                        {selectedCase.status === 'pending_lawyer' ? 'Awaiting Lawyer' : selectedCase.status === 'pending_payment' ? 'Awaiting Payment' : selectedCase.status}
                                                    </Badge>
                                                </div>
                                                <div className="w-px h-8 bg-slate-200" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Contract Fee</p>
                                                    <p className="text-sm font-black text-primary mt-1">₹{selectedCase.totalFee.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
 
                                        {/* Lawyer Details card */}
                                        <div className="bg-slate-50/50 border border-border p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-14 w-14 rounded-xl border border-primary/20 shrink-0">
                                                    <AvatarImage 
                                                        src={selectedCase.lawyer?.avatar ? (selectedCase.lawyer.avatar.startsWith('http') ? selectedCase.lawyer.avatar : (selectedCase.lawyer.avatar.startsWith('/') ? `/lawyer${selectedCase.lawyer.avatar}` : `/lawyer/${selectedCase.lawyer.avatar}`)) : ""} 
                                                        alt={selectedCase.lawyer?.fullName || "Lawyer"} 
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="rounded-xl bg-secondary text-primary">
                                                        <User className="h-7 w-7 text-primary/80" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-extrabold text-slate-900 text-sm">{selectedCase.lawyer?.fullName}</h4>
                                                        <span className="text-[9px] font-bold text-primary bg-secondary px-1.5 py-0.5 rounded border border-border uppercase tracking-wider">VERIFIED ADVOCATE</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-semibold mt-1">{selectedCase.lawyer?.title || "Senior Counsel"} • {selectedCase.lawyer?.expertise || "Corporate Specialist"}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 font-bold">Contact: {selectedCase.lawyer?.email}</p>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                className="rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 h-9 px-4 gap-1.5"
                                                onClick={() => navigate(`/lawyers/${selectedCase.lawyer?._id}`)}
                                            >
                                                <span>View Full Profile</span>
                                                <ExternalLink size={12} />
                                            </Button>
                                        </div>
 
                                        {/* Scheduling/Date Details (if booking request) */}
                                        {selectedCase.bookingDate && (
                                            <div className="grid grid-cols-2 gap-4 bg-slate-55 bg-slate-50 border border-border rounded-2xl p-5 text-xs font-semibold text-slate-600 shadow-sm">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-bold text-slate-405 text-slate-400 uppercase tracking-widest">Scheduled Consultation Date</p>
                                                    <p className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-1.5">
                                                        <Calendar className="h-4 w-4 text-primary" />
                                                        {new Date(selectedCase.bookingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-bold text-slate-405 text-slate-400 uppercase tracking-widest">Scheduled Consultation Time</p>
                                                    <p className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-1.5">
                                                        <Clock className="h-4 w-4 text-primary" />
                                                        {selectedCase.bookingTime}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
 
                                        {/* Case Description */}
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-slate-900 text-sm">Engagement Scope</h4>
                                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/60 rounded-xl p-4">{selectedCase.description}</p>
                                        </div>
 
                                        <Separator />

                                        {selectedCase.status === 'pending_lawyer' && (
                                            /* BOOKING REQUEST SENT - AWAITING LAWYER */
                                            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start gap-4">
                                                <Clock size={24} className="text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                                                <div className="space-y-2">
                                                    <h4 className="font-extrabold text-amber-900 text-sm">Awaiting Lawyer Confirmation</h4>
                                                    <p className="text-xs text-amber-700 leading-relaxed">
                                                        We have sent your consultation details to Advocate <strong>{selectedCase.lawyer?.fullName}</strong>. Once they verify their calendar availability, the booking status will update and request payment details. We will notify you via email!
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedCase.status === 'pending_payment' && (
                                            /* BOOKING ACCEPTED - AWAITING PAYMENT */
                                            <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <ShieldAlert size={24} className="text-orange-600 shrink-0 mt-0.5" />
                                                    <div className="space-y-1">
                                                        <h4 className="font-extrabold text-orange-900 text-sm">Consultation Confirmed! Awaiting Payment</h4>
                                                        <p className="text-xs text-orange-700 leading-relaxed">
                                                            Advocate <strong>{selectedCase.lawyer?.fullName}</strong> has accepted your consultation slot. Please complete the booking fee payment of <strong>₹{selectedCase.totalFee.toLocaleString()}</strong> to activate your case folder.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end pt-2">
                                                    <Button 
                                                        onClick={() => setIsPayingForCaseId(selectedCase._id)}
                                                        className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl px-6 py-2 shadow-lg shadow-orange-100"
                                                    >
                                                        Proceed to Payment & Confirm
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {selectedCase.status === 'active' && (
                                            /* ACTIVE ROADMAP STEPPER & PROGRESS */
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                {/* Meeting Summary Document Card */}
                                                {selectedCase.meetingSummaryUrl && (
                                                    <div className="bg-secondary border border-border rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm animate-in fade-in duration-300">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-secondary/80 rounded-xl text-violet-750 text-violet-750 text-primary">
                                                                <FileText size={24} />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-extrabold text-slate-900 text-sm">Consultation Meeting Summary Document</h4>
                                                                <p className="text-xs text-slate-500 mt-1">Briefing document: <span className="font-bold text-slate-700">{selectedCase.meetingSummaryName}</span></p>
                                                                <p className="text-[10px] text-slate-400 font-semibold">Uploaded on {selectedCase.meetingSummaryUploadedAt ? new Date(selectedCase.meetingSummaryUploadedAt).toLocaleDateString() : 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <a 
                                                            href={`/lawyer${selectedCase.meetingSummaryUrl}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="bg-primary hover:bg-violet-850 hover:bg-violet-800 text-white rounded-xl font-bold px-5 py-2.5 text-xs flex items-center gap-1.5 shadow-sm transition-all text-center shrink-0"
                                                        >
                                                            <Download size={14} />
                                                            Download Summary Briefing
                                                        </a>
                                                    </div>
                                                )}

                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 text-lg">Procedural Action Plan</h3>
                                                        {selectedCase.meetingLink && (
                                                            <Button
                                                                onClick={() => navigate(`/cases/${selectedCase._id}/meet`)}
                                                                className="mt-2 bg-primary hover:bg-violet-800 text-white rounded-xl font-bold px-4 py-2 text-xs flex items-center gap-2 shadow-sm"
                                                            >
                                                                <Video className="w-4 h-4" />
                                                                <span>Join Video Consultation</span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                    
                                                    <Badge variant={
                                                        selectedCase.planApproved ? "default" : selectedCase.planSubmitted ? "secondary" : "destructive"
                                                    } className="text-xs px-3 py-1 font-bold">
                                                        {selectedCase.planApproved 
                                                            ? "Active Plan" 
                                                            : selectedCase.planSubmitted 
                                                                ? "Roadmap Pending Your Approval" 
                                                                : "Awaiting Lawyer Setup"}
                                                    </Badge>
                                                </div>

                                                {!selectedCase.planSubmitted ? (
                                                    /* NO ROADMAP YET - GATE ON MEETING SUMMARY */
                                                    !selectedCase.meetingSummaryUrl ? (
                                                        <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-8 text-center space-y-6">
                                                            <Clock size={36} className="text-amber-600 mx-auto animate-pulse" />
                                                            <div className="space-y-2">
                                                                <h4 className="font-bold text-slate-900 text-sm">Consultation Call Pending</h4>
                                                                <p className="text-xs text-slate-650 max-w-md mx-auto leading-relaxed font-semibold">
                                                                    Consultation Call Pending - Awaiting meeting summary upload from your lawyer to initiate the roadmap.
                                                                </p>
                                                            </div>
                                                            {selectedCase.meetingLink && (
                                                                <div className="flex justify-center pt-2">
                                                                    <Button
                                                                        onClick={() => navigate(`/cases/${selectedCase._id}/meet`)}
                                                                        className="bg-primary hover:bg-violet-850 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-sm"
                                                                    >
                                                                        <Video className="w-4 h-4" />
                                                                        <span>Join Video Consultation Call</span>
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="bg-slate-50 border border-border rounded-2xl p-8 text-center space-y-4">
                                                            <Clock size={36} className="text-slate-350 mx-auto animate-pulse" />
                                                            <div className="space-y-1">
                                                                <h4 className="font-bold text-slate-900 text-sm">Lawyer is mapping out the roadmap...</h4>
                                                                <p className="text-xs text-slate-500 max-w-md mx-auto leading-normal">
                                                                    Advocate {selectedCase.lawyer?.fullName} has completed the consultation and uploaded the summary brief. They are currently structuring the detailed milestones and procedural stages for your work. Once submitted, you will review and approve the roadmap here.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                ) : !selectedCase.planApproved ? (
                                                    /* ROADMAP REQUIRES CLIENT APPROVAL */
                                                    <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 space-y-6">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 mt-1 shrink-0">
                                                                <ShieldAlert size={20} />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <h4 className="font-bold text-amber-900 text-sm">Review & Approve Action Plan</h4>
                                                                <p className="text-xs text-amber-700 leading-relaxed">
                                                                    Your lawyer has proposed the following milestone breakdown. Review the tasks, progress contributions, and payouts. If they align with your expectations, click **Approve Action Plan** to initiate the legal engagement.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Proposed milestones preview */}
                                                        <div className="space-y-3">
                                                            {selectedCase.milestones.map((m, idx) => (
                                                                <div key={idx} className="bg-white border border-amber-150 p-4 rounded-xl flex justify-between items-center gap-4 shadow-sm">
                                                                    <div>
                                                                        <h5 className="font-bold text-slate-900 text-xs">{idx + 1}. {m.title}</h5>
                                                                        <p className="text-[11px] text-slate-500 mt-0.5">{m.description}</p>
                                                                    </div>
                                                                    <div className="text-right shrink-0">
                                                                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">+{m.progressIncrement}% Progress</span>
                                                                        <p className="text-xs font-black text-slate-900 mt-1">₹{m.payoutAmount.toLocaleString()}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex justify-end pt-3">
                                                            <Button 
                                                                onClick={handleApprovePlan}
                                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl px-6 py-2 shadow-lg shadow-indigo-100"
                                                            >
                                                                Approve Action Plan
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* ACTIVE ROADMAP STEPPER & PROGRESS */
                                                    <div className="space-y-6 animate-in fade-in duration-300">
                                                        
                                                        {/* Progress Indicator */}
                                                        <div className="bg-slate-50 border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Verification Progress</p>
                                                                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{selectedCase.currentProgress}% Work Completed</h3>
                                                            </div>
                                                            <div className="flex-1 max-w-md bg-slate-200 rounded-full h-3 overflow-hidden">
                                                                <div 
                                                                    className="bg-primary h-3 rounded-full transition-all duration-700" 
                                                                    style={{ width: `${selectedCase.currentProgress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>

                                                        {/* Milestones Stepper */}
                                                        <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 ml-3 py-2">
                                                            {selectedCase.milestones.map((m, idx) => {
                                                                const isCompleted = m.status === 'completed';
                                                                const isInProgress = m.status === 'in_progress';
                                                                
                                                                return (
                                                                    <div key={idx} className="relative">
                                                                        {/* Dot */}
                                                                        <div className={`absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-white ${
                                                                            isCompleted 
                                                                                ? "bg-green-500 shadow-md ring-4 ring-green-100" 
                                                                                : isInProgress 
                                                                                    ? "bg-primary animate-pulse ring-4 ring-violet-100" 
                                                                                    : "bg-slate-300"
                                                                        }`} />

                                                                        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-3 hover:shadow-md hover:border-slate-300 transition-all duration-200">
                                                                            <div className="flex justify-between items-center gap-4">
                                                                                <div>
                                                                                    <span className="font-mono text-[9px] font-black text-slate-400">STAGE {idx + 1} ({m.progressIncrement}%)</span>
                                                                                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{m.title}</h4>
                                                                                </div>
                                                                                <Badge className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border-none shadow-none ${
                                                                                    isCompleted 
                                                                                    ? "bg-green-50 text-green-700 hover:bg-green-50" 
                                                                                    : isInProgress 
                                                                                        ? "bg-secondary text-primary hover:bg-secondary" 
                                                                                        : "bg-slate-50 text-slate-400 hover:bg-slate-50"
                                                                                }`}>
                                                                                    {m.status.replace('_', ' ')}
                                                                                </Badge>
                                                                            </div>

                                                                            <p className="text-slate-500 text-xs leading-relaxed">{m.description}</p>

                                                                            {/* Proof of Work and verification documents */}
                                                                            {selectedCase.planApproved && (
                                                                                <div className="border-t border-border pt-3 mt-2 space-y-3">
                                                                                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                                                        <div className="space-y-1 w-full">
                                                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verification Proof & Progress Updates</span>
                                                                                            {m.proofDocs.length === 0 ? (
                                                                                                <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                                                                                                    <AlertCircle size={12} />
                                                                                                    Awaiting progress updates or files from lawyer.
                                                                                                </p>
                                                                                            ) : (
                                                                                                <div className="space-y-3 w-full">
                                                                                                    {m.proofDocs.map((doc, dIdx) => {
                                                                                                        const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.url);
                                                                                                        return (
                                                                                                            <div key={dIdx} className="space-y-2 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                                                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                                                    <a 
                                                                                                                        href={`/lawyer${doc.url}`}
                                                                                                                        target="_blank"
                                                                                                                        rel="noreferrer"
                                                                                                                        className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1.5"
                                                                                                                    >
                                                                                                                        <FileText size={12} />
                                                                                                                        <span>{doc.name}</span>
                                                                                                                        <ExternalLink size={10} />
                                                                                                                    </a>
                                                                                                                    <span className="text-[9px] text-slate-400 font-semibold">({new Date(doc.uploadedAt).toLocaleString()})</span>
                                                                                                                </div>
                                                                                                                {doc.details && (
                                                                                                                    <p className="text-[11px] text-slate-600 bg-slate-100/50 border border-slate-200/50 rounded-lg p-2.5 mt-1 leading-relaxed">
                                                                                                                        {doc.details}
                                                                                                                    </p>
                                                                                                                )}
                                                                                                                {isImg && (
                                                                                                                    <div className="mt-2 rounded-xl overflow-hidden border border-border bg-slate-100 max-w-sm shadow-sm relative group">
                                                                                                                        <img 
                                                                                                                            src={`/lawyer${doc.url}`} 
                                                                                                                            alt={doc.name}
                                                                                                                            className="max-h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        );
                                                                                                    })}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Payout status */}
                                                                                    {isCompleted && (
                                                                                        <div className="flex justify-between items-center p-3 rounded-xl border border-border bg-slate-50/30">
                                                                                            <div>
                                                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Milestone Payment</span>
                                                                                                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                                                                                                    <Coins size={12} className="text-orange-500" />
                                                                                                    ₹{m.payoutAmount.toLocaleString()}
                                                                                                </p>
                                                                                            </div>
                                                                                            
                                                                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded ${
                                                                                                m.payoutStatus === 'approved' 
                                                                                                    ? "bg-green-100 text-green-700" 
                                                                                                    : m.payoutStatus === 'requested' 
                                                                                                        ? "bg-amber-100 text-amber-700 animate-pulse" 
                                                                                                        : "bg-slate-100 text-slate-500"
                                                                                            }`}>
                                                                                                {m.payoutStatus === 'approved' 
                                                                                                    ? "Released (Paid)" 
                                                                                                    : m.payoutStatus === 'requested' 
                                                                                                        ? "Awaiting Admin Release" 
                                                                                                        : "Pending Work Completion"}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    {/* Stats grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Cases</span>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                                                    <Briefcase size={20} />
                                                </div>
                                                <span className="text-2xl font-black text-slate-900">{cases.filter(c => c.status === 'active').length}</span>
                                            </div>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pending Actions</span>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                                                    <Clock size={20} />
                                                </div>
                                                <span className="text-2xl font-black text-slate-900">
                                                    {cases.filter(c => c.status === 'pending_payment' || c.status === 'pending_lawyer').length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Completed</span>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <span className="text-2xl font-black text-slate-900">{cases.filter(c => c.status === 'completed').length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Select a Case Hero Panel */}
                                    <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm text-center space-y-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/80 rounded-full blur-3xl -z-10" />
                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/30 rounded-full blur-3xl -z-10" />
                                        
                                        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto text-primary border border-border shadow-sm">
                                            <Briefcase size={32} />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Select a Case from the Sidebar</h3>
                                            <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed font-semibold">
                                                Choose one of your listed active legal engagements or consultation bookings on the left to manage step-by-step roadmaps, join live video meetings, review progress updates, and approve milestones.
                                            </p>
                                        </div>

                                        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-lg mx-auto">
                                            <div className="flex items-start gap-3">
                                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-secondary text-violet-750 font-black text-[10px] shrink-0 border border-border shadow-sm">01</span>
                                                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                                                    Select a case or booking to load the lawyer's professional details and consultation slots.
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-secondary text-violet-750 font-black text-[10px] shrink-0 border border-border shadow-sm">02</span>
                                                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                                                    Follow visual timeline stages, join Jitsi video links, and release payouts once milestones are achieved.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
