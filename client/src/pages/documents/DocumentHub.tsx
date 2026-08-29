import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import {
    FileText,
    Briefcase,
    Lock,
    Handshake,
    Building,
    Home,
    Users,
    TrendingUp,
    Copyright,
    Mail,
    ArrowRight,
    Search,
    Loader2,
    Cloud,
    AlertTriangle,
    Slash,
    UserPlus,
    UserMinus,
    Shuffle,
    UserCheck,
    Award,
    BookOpen,
    AlertCircle,
    Code,
    Truck,
    Percent,
    Globe,
    Wrench,
    HardHat,
    Stamp,
    Hand,
    Gift,
    Scissors,
    LogOut,
    User,
    Gavel,
    AlertOctagon,
    CheckCircle,
    Cpu,
    Share2,
    ShieldCheck,
    Link,
    ShoppingBag,
    ClipboardCheck,
    Ghost,
    Layers,
    ArrowDownCircle,
    Eye,
    Combine,
    Coins,
    Target,
    Network,
    Rocket,
    X
} from 'lucide-react';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';

interface DocumentType {
    id: string;
    name: string;
    category: string;
    description: string;
    icon: string;
    complexity: string;
    applicableLaws: string[];
    isLocked?: boolean;
}

const iconMap: Record<string, any> = {
    FileText, Briefcase, Lock, Handshake, Building, Home,
    Users, TrendingUp, Copyright, Mail, Cloud,
    AlertTriangle, Slash, UserPlus, UserMinus,
    Shuffle, UserCheck, Award, BookOpen, AlertCircle,
    Code, Truck, Percent, Globe, Wrench, HardHat,
    Stamp, Hand, Gift, Scissors, LogOut, User,
    Gavel, AlertOctagon, CheckCircle, Cpu, Share2,
    ShieldCheck, Link, ShoppingBag, ClipboardCheck, Ghost,
    Layers, ArrowDownCircle, Eye, Combine, Coins, Target, Network, Rocket
};

export default function DocumentHub() {
    const navigate = useNavigate();
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
    const [loadingRecent, setLoadingRecent] = useState(true);

    useEffect(() => {
        fetchDocumentTypes();
        fetchRecentDocuments();
    }, []);

    const fetchRecentDocuments = async () => {
        try {
            setLoadingRecent(true);
            const user = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
            const userId = user._id || user.id;
            
            if (userId) {
                const response = await api.get(`/documents/user/${userId}`);
                if (response.data.success) {
                    // Get only the 5 most recent documents
                    setRecentDocuments(response.data.data.slice(0, 5));
                }
            }
        } catch (error) {
            console.error('Error fetching recent documents:', error);
        } finally {
            setLoadingRecent(false);
        }
    };

    const fetchDocumentTypes = async () => {
        try {
            const response = await api.get('/documents/types');
            const data = response.data.data;
            const swIndex = data.findIndex((doc: DocumentType) => doc.id === 'software-development');
            const docsWithLock = data.map((doc: DocumentType, index: number) => ({
                ...doc,
                isLocked: swIndex !== -1 && index > swIndex
            }));
            setDocumentTypes(docsWithLock);
        } catch (error) {
            console.error('Error fetching document types:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', name: 'All Documents' },
        { id: 'employment', name: 'Employment' },
        { id: 'corporate', name: 'Corporate' },
        { id: 'ip', name: 'Intellectual Property' },
        { id: 'commercial', name: 'Commercial' },
        { id: 'real-estate', name: 'Real Estate' },
        { id: 'financial', name: 'Financial' },
        { id: 'disputes', name: 'Legal Notices' },
        { id: 'tech', name: 'Startup & Tech' },
        { id: 'investment', name: 'Pre-Investment' },
        { id: 'equity', name: 'Advanced Equity' },
        { id: 'debt-funding', name: 'Debt & Hybrid Funding' },
        { id: 'governance', name: 'Shareholder Governance' },
        { id: 'founder-structuring', name: 'Founder & Promoter' },
        { id: 'fdi', name: 'Foreign Investment (FDI)' },
        { id: 'esop', name: 'ESOP & Employee Equity' },
        { id: 'capital-actions', name: 'Corporate Capital Actions' },
        { id: 'vc-advanced', name: 'Advanced VC Documents' }
    ];

    const filteredDocuments = documentTypes.filter(doc => {
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleDocumentSelect = (docId: string) => {
        // Navigate to specific document generation page
        if (docId === 'employment-contract') {
            navigate('/documents/employment-contract-generator');
        } else if (docId === 'consultant-agreement') {
            navigate('/documents/consultant-agreement');
        } else if (docId === 'nda') {
            navigate('/documents/nda');
        } else if (docId === 'moa') {
            navigate('/documents/moa');
        } else if (docId === 'aoa') {
            navigate('/documents/aoa');
        } else if (docId === 'shareholder-resolution') {
            navigate('/documents/shareholder-resolution');
        } else if (docId === 'notice-board-meeting') {
            navigate('/documents/notice-board-meeting');
        } else if (docId === 'minutes-board-meeting') {
            navigate('/documents/minutes-board-meeting');
        } else if (docId === 'offer-letter') {
            navigate('/documents/offer-letter');
        } else if (docId === 'share-subscription') {
            navigate('/documents/share-subscription');
        } else if (docId === 'board-resolution') {
            navigate('/documents/board-resolution');
        } else if (docId === 'copyright-assignment') {
            navigate('/documents/copyright-assignment');
        } else if (docId === 'service-agreement') {
            navigate('/documents/service-agreement');
        } else if (docId === 'msa') {
            navigate('/documents/msa');
        } else if (docId === 'commercial-lease') {
            navigate('/documents/commercial-lease');
        } else if (docId === 'residential-lease') {
            navigate('/documents/residential-lease');
        } else if (docId === 'director-appointment') {
            navigate('/documents/director-appointment');
        } else if (docId === 'director-resignation') {
            navigate('/documents/director-resignation');
        } else if (docId === 'corporate-authorization-letter') {
            navigate('/documents/corporate-authorization-letter');
        } else if (docId === 'power-of-attorney-corporate') {
            navigate('/documents/power-of-attorney-corporate');
        } else if (docId === 'convertible-note') {
            navigate('/documents/convertible-note');
        } else if (docId === 'esop-plan') {
            navigate('/documents/esop-plan');
        } else {
            navigate(`/documents/generate/${docId}`);
        }
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Legal Document Hub</h1>
                    <p className="text-muted-foreground">
                        AI-powered legal document drafting with Indian law compliance
                    </p>
                </div>

                <div className="space-y-8 py-4">
                    {/* Centered Hero Search Box */}
                    <div className="max-w-2xl mx-auto w-full">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl blur opacity-15 group-focus-within:opacity-30 transition duration-500"></div>
                            <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:shadow-xl focus-within:border-violet-400/50 transition-all duration-300">
                                <Search className="ml-5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search from 50+ legal document templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-7 text-lg pl-3 pr-12"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(cat => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`whitespace-nowrap transition-all duration-200 ${selectedCategory === cat.id
                                    ? "shadow-md scale-105"
                                    : "hover:border-primary/20 hover:bg-secondary/50"
                                    }`}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Recent Documents History Section */}
                {!loadingRecent && recentDocuments.length > 0 && selectedCategory === 'all' && !searchQuery && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Recent Generations
                            </h2>
                            <Button variant="ghost" className="text-sm font-medium text-primary hover:bg-primary/5" onClick={() => navigate('/documents/workspace')}>
                                View All History <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                        <ScrollArea className="w-full whitespace-nowrap pb-4">
                            <div className="flex w-max space-x-4">
                                {recentDocuments.map(doc => (
                                    <Card key={doc._id} className="w-[300px] hover:shadow-md transition-shadow cursor-pointer bg-white border-slate-200" onClick={() => navigate('/documents/workspace')}>
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <Badge variant="secondary" className="font-normal text-xs uppercase tracking-wider">
                                                    {doc.documentType.split('-').join(' ')}
                                                </Badge>
                                            </div>
                                            <h3 className="mt-4 font-semibold text-slate-900 truncate" title={doc.title}>{doc.title}</h3>
                                            <div className="flex items-center justify-between mt-4">
                                                <p className="text-xs text-slate-500 font-medium">
                                                    {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                                                </p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${doc.status === 'final' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {doc.status}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>
                )}

                <Separator />

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Loading document templates...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocuments.map(doc => {
                            const IconComponent = iconMap[doc.icon] || FileText;

                            return (
                                <Card
                                    key={doc.id}
                                    className={`group transition-all duration-300 border-muted ${doc.isLocked ? 'opacity-70 cursor-not-allowed bg-slate-50' : 'hover:shadow-lg cursor-pointer hover:border-primary'}`}
                                    onClick={() => !doc.isLocked && handleDocumentSelect(doc.id)}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className={`p-2 rounded-lg transition-colors ${doc.isLocked ? 'bg-slate-200 text-slate-500' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'}`}>
                                            <IconComponent size={24} />
                                        </div>
                                        {doc.isLocked && (
                                            <Badge variant="secondary" className="bg-slate-200 text-slate-600 hover:bg-slate-200 border-none flex gap-1 items-center">
                                                <Lock className="w-3 h-3" />
                                                Coming Soon
                                            </Badge>
                                        )}
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <CardTitle className={`text-xl mb-2 transition-colors ${doc.isLocked ? 'text-slate-600' : 'group-hover:text-primary'}`}>
                                            {doc.name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 mb-4">
                                            {doc.description}
                                        </CardDescription>

                                        {doc.applicableLaws && doc.applicableLaws.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {doc.applicableLaws.slice(0, 2).map((law, idx) => (
                                                    <Badge key={idx} variant="outline" className={`text-xs font-normal ${doc.isLocked ? 'border-slate-300 text-slate-500' : ''}`}>
                                                        {law.split(',')[0]}
                                                    </Badge>
                                                ))}
                                                {doc.applicableLaws.length > 2 && (
                                                    <span className="text-xs text-muted-foreground self-center px-1">
                                                        +{doc.applicableLaws.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        <Button 
                                            className={`w-full ${doc.isLocked ? 'bg-slate-200 text-slate-500 hover:bg-slate-200 cursor-not-allowed border-none' : 'group-hover:bg-primary group-hover:text-white'}`} 
                                            variant={doc.isLocked ? "outline" : "secondary"}
                                            disabled={doc.isLocked}
                                        >
                                            {doc.isLocked ? 'Locked' : 'Generate Document'}
                                            {!doc.isLocked && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {!loading && filteredDocuments.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No documents found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or category filters</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
