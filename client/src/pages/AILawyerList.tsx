import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    User as UserIcon, 
    Star, 
    MapPin, 
    ShieldCheck, 
    Clock, 
    MessageSquare, 
    ArrowRight,
    Filter,
    Award} from 'lucide-react';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { lawyerService } from '@/services/lawyerService';

export default function AILawyerList() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [lawyers, setLawyers] = useState<any[]>([]);

    const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});

    const getAvatarSrc = (avatar?: string) => {
        if (!avatar) return "";
        if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
            return avatar;
        }
        const clean = avatar.startsWith('/') ? avatar : `/${avatar}`;
        if (clean.startsWith('/lawyer/')) {
            return clean;
        }
        return `/lawyer${clean}`;
    };

    const getInitials = (name?: string) => {
        if (!name) return "L";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    useEffect(() => {
        const fetchLawyers = async () => {
            try {
                const data = await lawyerService.getPublicLawyers();
                setLawyers(data);
            } catch (error) {
                console.error("Failed to fetch lawyers", error);
            }
        };
        fetchLawyers();
    }, []);

    const categories = ["All", "Corporate", "Criminal", "Family", "Civil", "IP Law", "Taxation"];

    const filteredLawyers = lawyers.filter(lawyer => {
        const matchesSearch = 
            (lawyer.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lawyer.expertise || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lawyer.location || "").toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === "All" || 
            (lawyer.expertise || "").toLowerCase().includes(selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Lawyer List</h1>
                        <p className="text-muted-foreground font-medium">Connect with verified legal experts powered by AI matching.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl border-border font-semibold h-11">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                        <Button 
                            className="bg-primary text-white hover:bg-violet-800 rounded-xl font-bold h-11 shadow-sm"
                            onClick={() => navigate('/consultations', { state: { showNewRequest: true } })}
                        >
                            Book Consultation
                        </Button>
                    </div>
                </div>

                {/* Lawyer Search Box - Redesigned as per image intent with Shadcn colors */}
                <div className="relative group max-w-4xl mx-auto">
                    <div className="relative bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4 transition-all duration-300">
                        <div className="flex-1 flex items-center gap-4 w-full">
                            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Input 
                                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg font-semibold placeholder:text-muted-foreground/60"
                                placeholder="Lawyer Search (Find by name, specialization, or location...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="h-8 w-[1px] bg-border mx-2 hidden md:block"></div>
                            <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 px-8 font-bold transition-all shadow-sm">
                                Search Experts
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            className={`rounded-xl font-semibold h-9 px-5 whitespace-nowrap transition-all ${
                                selectedCategory === cat 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Lawyer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredLawyers.length > 0 ? (
                        filteredLawyers.map((lawyer) => (
                            <Card key={lawyer._id || lawyer.id} className="rounded-2xl border border-border bg-card hover:shadow-md transition-all duration-300 group overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Profile Image / Avatar Placeholder */}
                                        <div className="relative shrink-0">
                                            <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center border border-border shadow-sm overflow-hidden">
                                                {lawyer.avatar && !failedAvatars[lawyer._id || lawyer.id] ? (
                                                    <img 
                                                        src={getAvatarSrc(lawyer.avatar)} 
                                                        alt={lawyer.fullName} 
                                                        className="h-full w-full object-cover"
                                                        onError={() => {
                                                            setFailedAvatars(prev => ({ ...prev, [lawyer._id || lawyer.id]: true }));
                                                        }}
                                                    />
                                                ) : lawyer.fullName ? (
                                                    <div className="h-full w-full flex items-center justify-center bg-violet-100 text-primary font-bold text-lg select-none">
                                                        {getInitials(lawyer.fullName)}
                                                    </div>
                                                ) : (
                                                    <UserIcon className="h-10 w-10 text-muted-foreground/40" />
                                                )}
                                            </div>
                                             <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-card flex items-center justify-center ${
                                                 lawyer.isApproved ? "bg-green-500" : "bg-gray-300"
                                             }`}>
                                                 {lawyer.isApproved && (
                                                     <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                                                 )}
                                             </div>
                                         </div>

                                         {/* Details */}
                                         <div className="flex-1 space-y-4">
                                             <div className="flex items-start justify-between">
                                                 <div className="space-y-1">
                                                     <div className="flex items-center gap-2">
                                                         <h3 className="text-xl font-bold text-foreground">{lawyer.fullName}</h3>
                                                         {lawyer.isVerified && (
                                                             <ShieldCheck className="h-4 w-4 text-primary" />
                                                         )}
                                                     </div>
                                                     <p className="text-primary font-semibold uppercase tracking-wider text-[10px]">{lawyer.expertise || "Expert Lawyer"}</p>
                                                 </div>
                                                 <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-lg border border-border">
                                                     <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                                                     <span className="font-bold text-foreground text-xs">{lawyer.rating || "5.0"}</span>
                                                 </div>
                                             </div>

                                             <div className="grid grid-cols-2 gap-4">
                                                 <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                                     <Clock className="h-4 w-4 text-muted-foreground/60" />
                                                     {lawyer.experience || "10+"} exp.
                                                 </div>
                                                 <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                                     <MapPin className="h-4 w-4 text-muted-foreground/60" />
                                                     {lawyer.location || "Remote"}
                                                 </div>
                                             </div>

                                             <div className="flex flex-wrap gap-2 pt-1">
                                                 {(lawyer.practiceAreas || ["Legal Consult"]).map((tag: string) => (
                                                     <Badge key={tag} variant="secondary" className="bg-secondary/50 text-muted-foreground border-none font-semibold text-[9px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                                                         {tag}
                                                     </Badge>
                                                 ))}
                                             </div>

                                             <div className="pt-5 flex items-center justify-between border-t border-border mt-5">
                                                 <div className="space-y-0.5">
                                                     <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Consultation Fee</p>
                                                     <p className="text-base font-bold text-foreground">₹{lawyer.hourlyRate || "1000"}/hr</p>
                                                 </div>
                                                 <Button 
                                                     className="rounded-xl h-10 px-5 bg-primary text-white hover:bg-violet-800 font-bold gap-2 transition-all"
                                                  onClick={() => navigate(`/lawyers/${lawyer._id}`)}
                                                 >
                                                     View Profile
                                                     <ArrowRight className="h-4 w-4" />
                                                 </Button>
                                             </div>
                                         </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
                                <Search className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No lawyers found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                            <Button 
                                variant="link" 
                                className="mt-4 text-primary font-bold"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Bottom CTA / Premium Section */}
                <div className="bg-primary text-primary-foreground rounded-3xl p-10 relative overflow-hidden shadow-sm">
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-5 max-w-xl text-center md:text-left">
                            <Badge variant="outline" className="text-primary-foreground border-primary-foreground/30 font-bold text-[10px] px-3 py-1 rounded-full tracking-widest uppercase">Premium Membership</Badge>
                            <h2 className="text-3xl font-bold leading-tight">Join the network of top legal professionals.</h2>
                            <p className="text-primary-foreground/80 font-medium text-base leading-relaxed">List your practice on Vidhik AI and reach thousands of potential clients looking for expert legal assistance.</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-5 pt-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/20">
                                        <Award className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-sm">Expert Verification</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/20">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-sm">Priority Support</span>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-2xl h-16 px-10 font-bold text-lg shadow-sm transition-all">
                                List Your Practice
                            </Button>
                            <p className="text-center text-primary-foreground/60 text-[10px] font-bold uppercase tracking-widest">Trusted by 5,000+ Lawyers</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
