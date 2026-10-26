import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Lock, 
    CreditCard, 
    ShieldCheck, 
    CheckCircle2,
    User,
    Calendar,
    Clock,
    Smartphone,
    Building2,
    AlertCircle,
    Gavel,
    Star,
    MapPin,
    Award,
    Languages
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { lawyerService } from '@/services/lawyerService';
import { consultationService } from '@/services/consultationService';
import { launchRazorpayCheckout, createSimulatedTestResponse } from '@/services/razorpayHelper';

export default function LawyerBooking() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    // Lawyer & Booking State
    const [lawyer, setLawyer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    
    // Case Info State
    const [caseTitle, setCaseTitle] = useState('');
    const [description, setDescription] = useState('');

    // Slot Selection State
    const [bookingDate, setBookingDate] = useState<Date | null>(null);
    const [bookingTime, setBookingTime] = useState<string>("");

    const getNext7Days = () => {
        const days = [];
        for (let i = 1; i <= 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const timeSlots = ["09:30 AM", "11:00 AM", "02:30 PM", "04:00 PM"];
    
    // Form Validation Errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchLawyer = async () => {
            if (!id) return;
            try {
                const data = await lawyerService.getPublicLawyerById(id);
                setLawyer(data);
            } catch (error) {
                console.error("Failed to fetch lawyer details", error);
                toast.error("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };
        fetchLawyer();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans items-center justify-center gap-4">
                <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-semibold">Loading booking page...</p>
            </div>
        );
    }

    if (!lawyer) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans items-center justify-center gap-4">
                <h3 className="text-xl font-bold text-foreground">Lawyer profile not found</h3>
                <Button onClick={() => navigate('/lawyers')} className="bg-primary text-primary-foreground font-bold rounded-xl">
                    Back to Lawyer List
                </Button>
            </div>
        );
    }

    const hourlyRate = lawyer.hourlyRate || 1000;
    const serviceFee = 150;
    const gst = hourlyRate * 0.18;
    const totalAmount = hourlyRate + serviceFee + gst;

    const handlePayment = async (simulateDirect = false) => {
        const newErrors: Record<string, string> = {};
        if (!caseTitle.trim()) {
            newErrors.caseTitle = "Case title / request topic is required";
        }
        if (!description.trim()) {
            newErrors.description = "Case description of legal needs is required";
        }
        if (!bookingDate) {
            newErrors.bookingDate = "Consultation date is required";
        }
        if (!bookingTime) {
            newErrors.bookingTime = "Consultation time slot is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please fill in your case details and select a consultation slot.");
            return;
        }

        setErrors({});
        setIsBooking(true);

        try {
            toast.info("Submitting booking & initializing Razorpay order...");
            
            // 1. Create Live Consultation record
            const consultation = await consultationService.createConsultation({
                lawyerId: lawyer._id,
                title: caseTitle.trim(),
                description: description.trim(),
                scheduledDate: bookingDate!.toISOString(),
                scheduledTime: bookingTime,
                totalFee: totalAmount
            });

            // 2. Create Razorpay Payment Order on backend
            const orderRes = await consultationService.createPaymentOrder(consultation._id);
            const { order } = orderRes;

            const completeBookingConfirmation = (lawyerName: string) => {
                toast.success("Consultation & Payment Confirmed!");
                navigate('/lawyers/booking-success', {
                    state: {
                        lawyerName: lawyerName,
                        specialization: lawyer.expertise || "General Practice",
                        avatar: lawyer.avatar,
                        bookingDate: bookingDate!.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                        bookingTime: bookingTime
                    }
                });
            };

            // Option A: Direct Simulation Mode
            if (simulateDirect) {
                const simResp = createSimulatedTestResponse(order.id);
                await consultationService.payAndConfirm(consultation._id, simResp);
                completeBookingConfirmation(lawyer.fullName);
                return;
            }

            // Option B: Open Razorpay Standard Checkout Modal
            const launched = await launchRazorpayCheckout({
                order,
                onSuccess: async (paymentResp) => {
                    await consultationService.payAndConfirm(consultation._id, paymentResp);
                    completeBookingConfirmation(lawyer.fullName);
                },
                onError: (err) => {
                    console.error("Razorpay Payment Error:", err);
                    toast.error(err?.message || "Razorpay payment encountered an error.");
                    setIsBooking(false);
                },
                onDismiss: () => {
                    setIsBooking(false);
                    toast.info("Payment was cancelled.");
                }
            });

            if (!launched) {
                setIsBooking(false);
            }

        } catch (error: any) {
            console.error("Booking error:", error);
            if (error.response?.status === 403 && error.response?.data?.error === 'limit_reached') {
                toast.error('Booking Restricted', {
                    description: error.response.data.message || 'Capacity limit reached.',
                    action: {
                        label: 'View Billing',
                        onClick: () => window.location.href = '/user/billing'
                    }
                });
            } else {
                toast.error(error.response?.data?.message || error.message || "Failed to process booking payment");
            }
            setIsBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans mb-12">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-150 py-4 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xl overflow-hidden whitespace-nowrap">
                    <div className="h-8 w-8 bg-violet-750 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                        <Gavel className="h-5 w-5" />
                    </div>
                    <span className="leading-none text-gray-900">Vidhik AI</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-semibold text-sm">
                    <Lock className="w-4 h-4 text-primary" />
                    Secure Checkout
                </div>
            </header>

            {/* Steps tracker */}
            <div className="bg-slate-50 border-b border-slate-200/50 py-3.5">
                <div className="max-w-6xl mx-auto px-4 flex justify-center items-center gap-2 sm:gap-6 text-xs sm:text-sm font-bold text-gray-500">
                    <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={16} /> Choose Expert</span>
                    <span className="w-8 h-[2px] bg-emerald-500"></span>
                    <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={16} /> Select Slot</span>
                    <span className="w-8 h-[2px] bg-emerald-500"></span>
                    <span className="flex items-center gap-1.5 text-primary bg-secondary border border-border px-3 py-1 rounded-full"><span className="h-5 w-5 bg-primary rounded-full flex items-center justify-center text-white text-[10px]">3</span> Payment & Confirmation</span>
                </div>
            </div>

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
                <div className="mb-6">
                    <button 
                        onClick={() => navigate(`/lawyers/${lawyer._id}`)} 
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-violet-850 transition-all mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Lawyer Profile
                    </button>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Confirm Your Consultation Booking</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Column - Lawyer Profile, Slots, and Request details */}
                    <div className="flex-1 space-y-6 w-full">
                        {/* Lawyer Details Card (All details shown here) */}
                        <Card className="rounded-2xl border-border bg-card shadow-sm overflow-hidden">
                            <CardContent className="p-6 md:p-8 space-y-6">
                                <div className="flex flex-col sm:flex-row gap-5 pb-5 border-b border-border items-start">
                                    <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center border border-border shrink-0 overflow-hidden shadow-sm">
                                        {lawyer.avatar ? (
                                            <img 
                                                src={lawyer.avatar.startsWith('http') ? lawyer.avatar : (lawyer.avatar.startsWith('/') ? `/lawyer${lawyer.avatar}` : `/lawyer/${lawyer.avatar}`)} 
                                                alt={lawyer.fullName} 
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-10 w-10 text-muted-foreground/40" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-xl font-bold text-foreground leading-none">{lawyer.fullName}</h2>
                                            {lawyer.isVerified && <ShieldCheck className="h-4.5 w-4.5 text-primary" />}
                                            <Badge className="bg-secondary text-primary border border-border hover:bg-secondary text-[9px] font-extrabold uppercase py-0.5 rounded-full px-2">
                                                {lawyer.expertise || "General Practice"}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
                                            <div className="flex items-center gap-1"><Star size={13} className="text-amber-500 fill-amber-500" /> <span className="text-slate-900 font-bold">{lawyer.rating || "5.0"}</span> ({lawyer.reviews || "0"} reviews)</div>
                                            <div className="flex items-center gap-1"><Clock size={13} /> {lawyer.experience || "10+"} Experience</div>
                                            <div className="flex items-center gap-1"><MapPin size={13} /> {lawyer.location || "Remote"}</div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {(lawyer.practiceAreas || ["Legal Consult"]).map((tag: string) => (
                                                <Badge key={tag} variant="secondary" className="bg-secondary/60 text-muted-foreground border-none font-semibold text-[8px] px-2 rounded-md uppercase tracking-wider">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Advocate Biography</span>
                                        <p className="font-medium text-slate-650 bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl">{lawyer.bio || "No professional biography provided."}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-2.5">
                                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1"><Award size={12} className="text-violet-750" /> Bar Memberships</span>
                                            <div className="flex flex-col gap-1.5 text-slate-700">
                                                <span className="flex items-center gap-1.5">✓ Bar Council of India</span>
                                                <span className="flex items-center gap-1.5">✓ Supreme Court Bar Association</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1"><Languages size={12} className="text-violet-750" /> Languages</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(lawyer.languages && lawyer.languages.length > 0 ? lawyer.languages : ["English", "Hindi"]).map((l: string) => (
                                                    <Badge key={l} variant="outline" className="font-semibold text-[10px]">{l}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Select Slot Card */}
                        <Card className="rounded-2xl border-border bg-card shadow-sm">
                            <CardContent className="p-6 md:p-8 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-border">
                                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Select Consultation Slot</h2>
                                        <p className="text-xs text-muted-foreground">Select the preferred date and time slot for your 1-hour consultation.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Date selection */}
                                    <div className="space-y-2">
                                        <Label className="font-bold text-sm">Select Date</Label>
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
                                        {errors.bookingDate && (
                                            <p className="text-xs font-bold text-destructive flex items-center gap-1 mt-1 animate-pulse">
                                                <AlertCircle className="h-3 w-3" /> {errors.bookingDate}
                                            </p>
                                        )}
                                    </div>

                                    {/* Time slot selection */}
                                    <div className="space-y-2">
                                        <Label className="font-bold text-sm">Available Slots</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {timeSlots.map((slot) => {
                                                const isSelected = bookingTime === slot;
                                                return (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => setBookingTime(slot)}
                                                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
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
                                        {errors.bookingTime && (
                                            <p className="text-xs font-bold text-destructive flex items-center gap-1 mt-1 animate-pulse">
                                                <AlertCircle className="h-3 w-3" /> {errors.bookingTime}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Legal Case Details Card */}
                        <Card className="rounded-2xl border-border bg-card shadow-sm">
                            <CardContent className="p-6 md:p-8 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-border">
                                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                                        <Gavel className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Legal Request Details</h2>
                                        <p className="text-xs text-muted-foreground">Describe your legal requirements to set up the case roadmap.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="case-title" className="font-bold text-sm">Case Title / Topic</Label>
                                        <Input 
                                            id="case-title"
                                            placeholder="e.g. Property Title Verification, LLC Registration, NDA Drafting" 
                                            className={`h-12 rounded-xl focus-visible:ring-primary ${errors.caseTitle ? 'border-destructive ring-destructive/20' : ''}`}
                                            value={caseTitle}
                                            onChange={(e) => setCaseTitle(e.target.value)}
                                        />
                                        {errors.caseTitle && (
                                            <p className="text-xs font-bold text-destructive flex items-center gap-1 animate-pulse">
                                                <AlertCircle className="h-3 w-3" /> {errors.caseTitle}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="case-desc" className="font-bold text-sm">Brief Description of Legal Needs</Label>
                                        <textarea 
                                            id="case-desc"
                                            placeholder="Describe the background of your dispute, what stages/steps you expect, or specific legal questions you have..." 
                                            className={`w-full bg-background border rounded-xl p-4 text-sm font-medium outline-none focus:ring-1 focus:ring-primary min-h-[140px] ${
                                                errors.description ? 'border-destructive focus:ring-destructive' : 'border-input'
                                            }`}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        {errors.description && (
                                            <p className="text-xs font-bold text-destructive flex items-center gap-1 animate-pulse">
                                                <AlertCircle className="h-3 w-3" /> {errors.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Official Razorpay Gateway Indicator Card */}
                        <Card className="rounded-2xl border-border bg-card shadow-sm">
                            <CardContent className="p-6 md:p-8 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-border">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Razorpay Secure Checkout</h2>
                                        <p className="text-xs text-muted-foreground">Direct instant redirection to official Razorpay payment modal.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                        Clicking <strong>Pay & Confirm</strong> directly launches the official Razorpay payment gateway modal. You can choose any payment method securely:
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-background/50 text-center gap-1.5">
                                            <Smartphone className="w-5 h-5 text-primary" />
                                            <span className="text-xs font-bold">UPI / QR</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">GPay, PhonePe, Paytm</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-background/50 text-center gap-1.5">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                            <span className="text-xs font-bold">Cards</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">Credit & Debit Cards</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-background/50 text-center gap-1.5">
                                            <Building2 className="w-5 h-5 text-primary" />
                                            <span className="text-xs font-bold">Net Banking</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">50+ Indian Banks</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-background/50 text-center gap-1.5">
                                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                            <span className="text-xs font-bold">Wallets</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">PayLater & Wallets</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-secondary/50 border border-border rounded-xl flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                                        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                                        <span>End-to-end 256-bit bank grade encryption & RBI compliance.</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-row items-center justify-center gap-8 py-4 opacity-50">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <ShieldCheck className="w-4 h-4" />
                                PCI DSS COMPLIANT
                            </div>
                            <div className="flex flex-row items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4" />
                                SSL SECURE 256-BIT
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-[420px]">
                        <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-gray-200/50 sticky top-24 overflow-hidden">
                            <CardContent className="p-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Booking Summary</h3>
                                
                                <div className="space-y-6 pb-8 border-b border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-slate-100 relative overflow-hidden">
                                            {lawyer.avatar ? (
                                                <img 
                                                    src={lawyer.avatar.startsWith('http') ? lawyer.avatar : (lawyer.avatar.startsWith('/') ? `/lawyer${lawyer.avatar}` : `/lawyer/${lawyer.avatar}`)} 
                                                    alt={lawyer.fullName} 
                                                    className="h-full w-full object-cover" 
                                                />
                                            ) : (
                                                <User className="h-7 w-7 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-black text-gray-905 text-gray-900 text-base tracking-tight leading-none">{lawyer.fullName}</p>
                                            <p className="text-[10px] text-primary font-extrabold uppercase tracking-widest">{lawyer.expertise || "General Practice"}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                                <Calendar className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="uppercase tracking-wider">
                                                {bookingDate 
                                                    ? bookingDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) 
                                                    : "Select Date Above"
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                                <Clock className="w-4 h-4 text-primary" />
                                            </div>
                                            <span>{bookingTime || "Select Time Slot Above"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 py-8 border-b border-slate-100">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Consultation (1 hr)</p>
                                        <p className="text-gray-900">₹{hourlyRate.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Vidhik Platform Fee</p>
                                        <p className="text-gray-900">₹{serviceFee.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Taxes (GST 18%)</p>
                                        <p className="text-gray-900">₹{gst.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="py-8">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Total Amount</p>
                                    <div className="flex items-center">
                                        <p className="text-4xl font-black text-gray-909 text-gray-900 tracking-tighter">
                                            ₹{Math.round(totalAmount).toLocaleString()}
                                        </p>
                                        <span className="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded font-black tracking-wide ml-2.5">
                                            INCLUDES ALL TAXES
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button 
                                        className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all font-black text-base flex items-center justify-center gap-3 uppercase tracking-wider active:scale-[0.98]"
                                        onClick={() => handlePayment(false)}
                                        disabled={isBooking}
                                    >
                                        <Lock className="w-4 h-4" />
                                        {isBooking ? "Initializing Order..." : `Pay ₹${Math.round(totalAmount).toLocaleString()}`}
                                    </Button>
                                </div>

                                <div className="flex flex-row justify-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-5 pb-2 border-b border-slate-100">
                                    <span>🛡️ SECURE PAYMENT</span>
                                    <span>•</span>
                                    <span>🔄 MONEY-BACK GUARANTEE</span>
                                </div>

                                <p className="text-center text-[9px] font-medium text-muted-foreground mt-4 leading-relaxed px-4">
                                    By confirming, you agree to setup a case registry with the lawyer in accordance with the platform's booking terms.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-[10px] tracking-wide font-medium text-muted-foreground mt-auto">
                © 2026 Vidhik A.I. Central Case Gateway.
            </footer>
        </div>
    );
}
