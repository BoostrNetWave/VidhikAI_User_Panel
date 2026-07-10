import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    User, 
    Star, 
    MapPin, 
    ShieldCheck, 
    Clock, 
    MessageSquare, 
    ArrowLeft,
    CheckCircle2,
    Award,
    BookOpen,
    Briefcase,
    Languages,
    Share2
} from 'lucide-react';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { lawyerService } from '@/services/lawyerService';
import { toast } from "sonner";

export default function LawyerProfile() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('about');
    const [lawyer, setLawyer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLawyer = async () => {
            if (!id) return;
            try {
                const data = await lawyerService.getPublicLawyerById(id);
                setLawyer(data);
            } catch (error) {
                console.error("Failed to fetch lawyer details", error);
                toast.error("Failed to load lawyer profile");
            } finally {
                setLoading(false);
            }
        };
        fetchLawyer();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout userNav={<UserNav />}>
                <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                    <div className="h-10 w-10 border-4 border-violet-700 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-semibold">Loading lawyer profile...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!lawyer) {
        return (
            <DashboardLayout userNav={<UserNav />}>
                <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                    <h3 className="text-xl font-bold text-foreground">Lawyer profile not found</h3>
                    <Button onClick={() => navigate('/lawyers')} className="bg-primary text-primary-foreground font-bold rounded-xl">
                        Back to Lawyer List
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const isOnline = (lawyer.status || "Online") === "Online";

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Back Navigation */}
                <Button 
                    variant="ghost" 
                    className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
                    onClick={() => navigate('/lawyers')}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Lawyer List
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Section */}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="relative shrink-0">
                                <div className="h-32 w-32 rounded-3xl bg-secondary flex items-center justify-center border border-border shadow-sm overflow-hidden">
                                    {lawyer.avatar ? (
                                        <img 
                                            src={lawyer.avatar.startsWith('http') ? lawyer.avatar : (lawyer.avatar.startsWith('/') ? `/lawyer${lawyer.avatar}` : `/lawyer/${lawyer.avatar}`)} 
                                            alt={lawyer.fullName} 
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-16 w-16 text-muted-foreground/40" />
                                    )}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-card flex items-center justify-center ${
                                    isOnline ? "bg-green-500" : "bg-gray-300"
                                }`}>
                                    {isOnline && (
                                        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-3xl font-bold text-foreground tracking-tight">{lawyer.fullName}</h1>
                                            {lawyer.isVerified && (
                                                <ShieldCheck className="h-6 w-6 text-primary" />
                                            )}
                                        </div>
                                        <p className="text-primary font-semibold uppercase tracking-wider text-xs">{lawyer.expertise || "General Practice"}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" size="icon" className="rounded-xl border-border">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold px-6">
                                            Contact Now
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-medium">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-primary fill-primary" />
                                        <span className="text-foreground font-bold">{lawyer.rating || "5.0"}</span>
                                        <span>({lawyer.reviews || "0"} Reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{lawyer.experience || "10+"} Experience</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{lawyer.location || "Remote"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs for Detailed Info */}
                        <div className="w-full">
                            <div className="bg-secondary/50 border border-border p-1 rounded-xl w-full flex items-center justify-start h-12 mb-6">
                                <button 
                                    onClick={() => setActiveTab('about')}
                                    className={`rounded-lg font-bold px-6 h-full transition-all ${activeTab === 'about' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    About
                                </button>
                                <button 
                                    onClick={() => setActiveTab('expertise')}
                                    className={`rounded-lg font-bold px-6 h-full transition-all ${activeTab === 'expertise' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Expertise
                                </button>
                                <button 
                                    onClick={() => setActiveTab('credentials')}
                                    className={`rounded-lg font-bold px-6 h-full transition-all ${activeTab === 'credentials' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Credentials
                                </button>
                            </div>

                            {activeTab === 'about' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                                        <h3 className="text-lg font-bold text-foreground mb-4">Professional Bio</h3>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {lawyer.bio || "No professional biography provided yet."}
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Languages className="h-5 w-5 text-primary" />
                                                <h4 className="font-bold">Languages</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {(lawyer.languages && lawyer.languages.length > 0 ? lawyer.languages : ["English", "Hindi"]).map((lang: string) => (
                                                    <Badge key={lang} variant="secondary" className="font-semibold">{lang}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Briefcase className="h-5 w-5 text-primary" />
                                                <h4 className="font-bold">Work Status</h4>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                <span className="text-sm font-semibold text-foreground">Available for Consultations</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'expertise' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                                        <h3 className="text-lg font-bold text-foreground mb-6">Core Practice Areas</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                            {(lawyer.practiceAreas && lawyer.practiceAreas.length > 0 ? lawyer.practiceAreas : [lawyer.expertise || "General Practice"]).map((exp: string) => (
                                                <div key={exp} className="flex items-center gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                                    <span className="text-sm font-medium text-muted-foreground">{exp}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'credentials' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                                        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                            Education
                                        </h3>
                                        <div className="space-y-6">
                                            {lawyer.education && lawyer.education.length > 0 ? (
                                                lawyer.education.map((edu: any, idx: number) => (
                                                    <div key={idx} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-border last:before:hidden">
                                                        <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-primary"></div>
                                                        <h4 className="font-bold text-foreground">{edu.degree}</h4>
                                                        <p className="text-sm text-muted-foreground">{edu.school || edu.institution || "N/A"} • {edu.year || "N/A"}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground">Education details not listed.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                                        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                                            <Award className="h-5 w-5 text-primary" />
                                            Memberships
                                        </h3>
                                        <div className="space-y-4">
                                            {(lawyer.memberships && lawyer.memberships.length > 0 ? lawyer.memberships : ["Bar Council of India", "Supreme Court Bar Association"]).map((member: string) => (
                                                <div key={member} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40"></div>
                                                    {member}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="space-y-6">
                        <Card className="rounded-3xl border border-border bg-card shadow-lg sticky top-8">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold">Book a Consultation</CardTitle>
                                <p className="text-sm text-muted-foreground">Start your legal journey today.</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Consultation Fee</p>
                                    <p className="text-3xl font-black text-foreground">₹{lawyer.hourlyRate || 1000}/hr</p>
                                    <p className="text-[10px] text-muted-foreground mt-2 font-medium leading-relaxed">
                                        Includes a 30-minute video/audio session and initial document review.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <ShieldCheck className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Verified Professional</p>
                                            <p className="text-[10px] text-muted-foreground">Identity & License confirmed</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <MessageSquare className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Priority Messaging</p>
                                            <p className="text-[10px] text-muted-foreground">Direct access after booking</p>
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                    className="w-full bg-violet-700 text-white hover:bg-violet-800 rounded-2xl h-14 font-bold text-base shadow-sm transition-all active:scale-[0.98]"
                                    onClick={() => navigate('/cases', { state: { startBookingWithLawyer: lawyer } })}
                                >
                                    Proceed to Booking
                                </Button>

                                <Button 
                                    variant="outline"
                                    className="w-full border-violet-700 text-violet-700 hover:bg-violet-50 rounded-2xl h-14 font-bold text-base shadow-sm transition-all active:scale-[0.98]"
                                    onClick={() => navigate('/consultations', { state: { startConsultationWithLawyer: lawyer } })}
                                >
                                    Request Live Consultation
                                </Button>
                                
                                <div className="flex flex-col items-center gap-4 pt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center overflow-hidden">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Join 500+ satisfied clients</span>
                                    </div>
                                    <Separator className="w-full" />
                                    <p className="text-[10px] text-center text-muted-foreground px-4 leading-relaxed font-medium">
                                        By booking, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
