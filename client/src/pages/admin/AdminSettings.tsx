import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from "@/layout/AdminLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { 
    ShieldAlert, 
    Users, 
    Save, 
    RefreshCcw,
    Info,
    CheckCircle,
    Gavel,
    Activity,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Briefcase,
    Coins,
    FileText,
    ExternalLink,
    MessageSquare,
    Eye,
    Send,
    Globe,
    Video
} from "lucide-react";

const PANEL_SECTIONS = {
    landing: [
        { id: 'hero', name: 'Hero Section', keys: ['LANDING_HERO_TITLE', 'LANDING_HERO_SUBTITLE', 'LANDING_LOGO_URL', 'LANDING_HERO_IMAGE'] },
        { id: 'how_it_works', name: 'How It Works', keys: ['LANDING_HOW_IT_WORKS_STEPS'] },
        { id: 'features', name: 'Core Features', keys: ['LANDING_FEATURES'] },
        { id: 'pricing', name: 'Pricing Plans', keys: ['LANDING_PRICING_PLANS'] },
        { id: 'contact', name: 'Contact Info', keys: ['LANDING_CONTACT_INFO'] },
        { id: 'faqs', name: 'FAQs List', keys: ['LANDING_FAQS'] }
    ],
    user: [
        { id: 'doc_generator', name: 'AI Document Generator', keys: ['USER_DOC_GENERATOR_TITLE', 'USER_DOC_GENERATOR_DESC', 'USER_DOC_GENERATOR_LIMIT_FREE', 'USER_DOC_GENERATOR_ACTIVE'] },
        { id: 'doc_review', name: 'Document Review', keys: ['USER_DOC_REVIEW_TITLE', 'USER_DOC_REVIEW_DESC', 'USER_DOC_REVIEW_MAX_FILE_SIZE_MB', 'USER_DOC_REVIEW_ACTIVE'] },
        { id: 'legal_assistant', name: 'AI Legal Assistant', keys: ['USER_LEGAL_ASSISTANT_TITLE', 'USER_LEGAL_ASSISTANT_DESC', 'USER_LEGAL_ASSISTANT_DAILY_LIMIT', 'USER_LEGAL_ASSISTANT_ACTIVE'] },
        { id: 'lawyer_booking', name: 'Lawyer Booking', keys: ['USER_LAWYER_BOOKING_TITLE', 'USER_LAWYER_BOOKING_DESC', 'USER_LAWYER_BOOKING_BASE_COMMISSION_PERCENT', 'USER_LAWYER_BOOKING_ACTIVE'] },
        { id: 'pricing', name: 'Subscription Plans', keys: ['USER_PRICING_PLANS'] }
    ],
    lawyer: [
        { id: 'dashboard', name: 'Lawyer Dashboard', keys: ['LAWYER_DASHBOARD_TITLE', 'LAWYER_DASHBOARD_WELCOME_MSG', 'LAWYER_DASHBOARD_ANNOUNCEMENT'] },
        { id: 'cases_appointments', name: 'Cases & Appointments', keys: ['LAWYER_CASES_MAX_ACTIVE_PER_LAWYER', 'LAWYER_APPOINTMENT_MIN_NOTICE_HOURS', 'LAWYER_APPOINTMENT_ACTIVE'] },
        { id: 'blog_articles', name: 'Blog & Articles', keys: ['LAWYER_BLOG_MAX_POSTS_PER_WEEK', 'LAWYER_BLOG_AUTO_APPROVE', 'LAWYER_BLOG_ACTIVE'] },
        { id: 'payouts_commission', name: 'Payouts & Commission', keys: ['LAWYER_PAYMENT_MIN_PAYOUT_AMOUNT', 'LAWYER_PAYMENT_TDS_PERCENT', 'LAWYER_PAYMENT_ACTIVE'] },
        { id: 'support', name: 'Lawyer Support', keys: ['LAWYER_SUPPORT_CONTACT_PHONE', 'LAWYER_SUPPORT_ACTIVE'] },
        { id: 'pricing', name: 'Subscription Plans', keys: ['LAWYER_PRICING_PLANS'] }
    ]
};

export default function AdminSettings() {
    const { tab } = useParams();
    const [configs, setConfigs] = useState<any[]>([]);
    const [selectedPanel, setSelectedPanel] = useState<'landing' | 'user' | 'lawyer'>('landing');
    const [selectedSection, setSelectedSection] = useState<string>('hero');
    const [paymentSubTab, setPaymentSubTab] = useState<'user' | 'lawyer'>('user');
    const [users, setUsers] = useState<any[]>([]);
    const [pendingLawyers, setPendingLawyers] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // User details modal state
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState<any | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [loadingUserDetails, setLoadingUserDetails] = useState(false);
    const [updatingSubscription, setUpdatingSubscription] = useState(false);

    const openUserDetails = async (user: any) => {
        try {
            setSelectedUserId(user._id);
            setIsUserModalOpen(true);
            setLoadingUserDetails(true);
            const data = await adminService.getUserDetails(user._id);
            setSelectedUserDetails(data);
        } catch (error) {
            toast.error("Failed to load user details");
            setIsUserModalOpen(false);
        } finally {
            setLoadingUserDetails(false);
        }
    };

    const handleUpdateSubscription = async (subscription: string) => {
        if (!selectedUserId) return;
        try {
            setUpdatingSubscription(true);
            await adminService.updateUserSubscription(selectedUserId, subscription);
            toast.success("User subscription updated successfully");
            // Refresh details
            const data = await adminService.getUserDetails(selectedUserId);
            setSelectedUserDetails(data);
            // Refresh main users list
            fetchData();
        } catch (error) {
            toast.error("Failed to update subscription");
        } finally {
            setUpdatingSubscription(false);
        }
    };

    // Tickets support state
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [replyText, setReplyText] = useState("");
    const [ticketReplyStatus, setTicketReplyStatus] = useState("Closed");
    const [ticketSearch, setTicketSearch] = useState("");
    const [ticketPriorityFilter, setTicketPriorityFilter] = useState("All");
    const [ticketStatusFilter, setTicketStatusFilter] = useState("All");

    // Client documents state
    const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
    const [docSearch, setDocSearch] = useState("");

    // JSON editing state
    const [editingJsonConfig, setEditingJsonConfig] = useState<{[key: string]: any}>({});

    const updateArrayField = (key: string, index: number, field: string, value: any) => {
        setEditingJsonConfig(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            if (copy[key] && copy[key][index] !== undefined) {
                copy[key][index][field] = value;
            }
            return copy;
        });
    };

    const addArrayItem = (key: string, defaultItem: any) => {
        setEditingJsonConfig(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            if (!copy[key]) {
                copy[key] = [];
            }
            copy[key].push(defaultItem);
            return copy;
        });
    };

    const deleteArrayItem = (key: string, index: number) => {
        setEditingJsonConfig(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            if (copy[key]) {
                copy[key].splice(index, 1);
            }
            return copy;
        });
    };

    const moveArrayItem = (key: string, index: number, direction: 'up' | 'down') => {
        setEditingJsonConfig(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            const arr = copy[key];
            if (!arr) return prev;
            
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex >= 0 && targetIndex < arr.length) {
                const temp = arr[index];
                arr[index] = arr[targetIndex];
                arr[targetIndex] = temp;
            }
            return copy;
        });
    };
    
    const handlePanelChange = (panel: 'landing' | 'user' | 'lawyer') => {
        setSelectedPanel(panel);
        if (panel === 'landing') setSelectedSection('hero');
        else if (panel === 'user') setSelectedSection('doc_generator');
        else if (panel === 'lawyer') setSelectedSection('dashboard');
    };

    // Map URL tab to internal tab state
    const activeTab = tab || 'overview';

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'content' || activeTab === 'payments' || activeTab === 'system' || activeTab === 'overview') {
                const configData = await adminService.getConfigs();
                setConfigs(configData);
                
                // Initialize JSON configs in local state
                const jsonConfigs: {[key: string]: any} = {};
                configData.forEach((c: any) => {
                    if (typeof c.value === 'object' && c.value !== null) {
                        jsonConfigs[c.key] = JSON.parse(JSON.stringify(c.value));
                    }
                });
                setEditingJsonConfig(jsonConfigs);
            }
            
            if (activeTab === 'users' || activeTab === 'overview') {
                const userData = await adminService.getAllUsers();
                setUsers(userData);
            }

            if (activeTab === 'lawyers' || activeTab === 'overview') {
                const pendingData = await adminService.getPendingLawyers();
                setPendingLawyers(pendingData);
            }

            if (activeTab === 'cases' || activeTab === 'overview') {
                const casesData = await adminService.getAllCases();
                setCases(casesData);
            }

            if (activeTab === 'tickets' || activeTab === 'overview') {
                const ticketData = await adminService.getAllTickets();
                setTickets(ticketData);
            }

            if (activeTab === 'documents' || activeTab === 'overview') {
                const docData = await adminService.getAllDocuments();
                setDocuments(docData);
            }

            if (activeTab === 'consultations' || activeTab === 'overview') {
                const consultationsData = await adminService.getAllConsultations();
                setConsultations(consultationsData);
            }
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (key: string, value: any) => {
        try {
            const originalConfig = configs.find(c => c.key === key);
            let parsedValue = value;
            if (originalConfig && typeof originalConfig.value === 'number') {
                parsedValue = Number(value);
                if (isNaN(parsedValue)) {
                    toast.error("Value must be a valid number");
                    return;
                }
            }
            await adminService.updateConfig(key, parsedValue);
            toast.success("Updated successfully");
            fetchData();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await adminService.approveLawyer(id);
            toast.success("Lawyer approved successfully!");
            fetchData();
        } catch (error) {
            toast.error("Approval failed");
        }
    };

    const renderOverview = () => {
        const activeTicketsCount = tickets.filter(t => t.status !== 'Closed').length;
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Users</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{users.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                            <Gavel className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pending Lawyers</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingLawyers.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-100 rounded-xl text-violet-650">
                            <Video className="h-6 w-6 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Consultations</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{consultations.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Tickets</p>
                            <h3 className="text-2xl font-bold text-rose-600 mt-1">{activeTicketsCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Client Docs</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{documents.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">System Status</p>
                            <h3 className="text-2xl font-bold text-emerald-600 mt-1">Healthy</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderLawyerApproval = () => (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900">Pending Lawyer Approvals</h3>
                <p className="text-sm text-slate-500">Review and approve new lawyer registrations.</p>
            </div>
            {pendingLawyers.length === 0 ? (
                <div className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No pending approvals at the moment.</p>
                </div>
            ) : (
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Lawyer Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Specialization</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pendingLawyers.map((lawyer) => (
                            <tr key={lawyer._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{lawyer.fullName}</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-tighter">New Registration</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{lawyer.expertise || "General Practice"}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{lawyer.email}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleApprove(lawyer._id)}
                                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                                        >
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            Approve
                                        </button>
                                        <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors">
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    const renderUserManagement = () => (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900">Master User List</h3>
                <p className="text-sm text-slate-500">View and manage all accounts on the platform.</p>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">User</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Join Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <button 
                                    onClick={() => openUserDetails(user)}
                                    className="font-semibold text-slate-900 hover:text-purple-600 hover:underline text-left block focus:outline-none"
                                >
                                    {user.fullName}
                                </button>
                                <div className="text-xs text-slate-400">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                    user.role === 'lawyer' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {user.role === 'lawyer' ? (
                                    <div className="space-y-1">
                                        <span className={`flex items-center gap-1.5 text-xs font-medium ${user.isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            {user.isApproved ? 'Approved' : 'Pending Approval'}
                                        </span>
                                        {!user.isVerified && (
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        await adminService.verifyUser(user._id);
                                                        toast.success("User verified manually");
                                                        fetchData();
                                                    } catch (e) { toast.error("Verification failed"); }
                                                }}
                                                className="text-[10px] text-blue-600 font-bold hover:underline"
                                            >
                                                Verify Manually
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Active
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 text-right">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderStepsEditor = (key: string) => {
        const steps = editingJsonConfig[key] || [];
        return (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Steps List</span>
                    <button 
                        onClick={() => addArrayItem(key, { num: "0" + (steps.length + 1), title: "New Step", desc: "Step description", iconName: "Zap" })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Step
                    </button>
                </div>
                
                {steps.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No steps defined. Add some steps above.</p>
                ) : (
                    <div className="space-y-3">
                        {steps.map((step: any, index: number) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                                <div className="flex gap-2 items-center sm:self-center">
                                    <button 
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem(key, index, 'up')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors animate-pulse-subtle"
                                    >
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                        disabled={index === steps.length - 1}
                                        onClick={() => moveArrayItem(key, index, 'down')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-3 flex-1 w-full">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">No.</label>
                                        <input 
                                            type="text" 
                                            value={step.num || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'num', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon (Lucide)</label>
                                        <input 
                                            type="text" 
                                            value={step.iconName || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'iconName', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-7">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
                                        <input 
                                            type="text" 
                                            value={step.title || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'title', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-semibold"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                                        <textarea 
                                            value={step.desc || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'desc', e.target.value)}
                                            rows={2}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => deleteArrayItem(key, index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:self-center transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderFeaturesEditor = (key: string) => {
        const features = editingJsonConfig[key] || [];
        return (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Features List</span>
                    <button 
                        onClick={() => addArrayItem(key, { iconName: "Sparkles", title: "New Feature", desc: "Feature description", color: "from-purple-500/20 to-violet-500/20" })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Feature
                    </button>
                </div>
                
                {features.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No features defined. Add some features above.</p>
                ) : (
                    <div className="space-y-3">
                        {features.map((feature: any, index: number) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                                <div className="flex gap-2 items-center sm:self-center">
                                    <button 
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem(key, index, 'up')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                        disabled={index === features.length - 1}
                                        onClick={() => moveArrayItem(key, index, 'down')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-3 flex-1 w-full">
                                    <div className="col-span-4">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
                                        <input 
                                            type="text" 
                                            value={feature.title || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'title', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-semibold"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon (Lucide)</label>
                                        <input 
                                            type="text" 
                                            value={feature.iconName || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'iconName', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Color Gradient (Tailwind)</label>
                                        <input 
                                            type="text" 
                                            value={feature.color || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'color', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                                        <textarea 
                                            value={feature.desc || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'desc', e.target.value)}
                                            rows={2}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => deleteArrayItem(key, index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:self-center transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderPricingEditor = (key: string) => {
        const plans = editingJsonConfig[key] || [];
        const defaultPlan = key === 'USER_PRICING_PLANS' 
            ? { name: "New User Plan", priceMonthly: 1999, priceYearly: 19990, desc: "Plan description", features: ["Feature 1"], gradient: "from-purple-500 to-indigo-600", popular: false, iconName: "Zap", limits: { documents: 30, reviews: 10, research: 20, bookings: 5 } }
            : { name: "New Lawyer Plan", priceMonthly: 1999, priceYearly: 19990, desc: "Plan description", features: ["Feature 1"], gradient: "from-purple-500 to-indigo-600", popular: false, iconName: "Zap", limits: { activeCases: 15, blogsPerWeek: 5, commissionPercent: 10 } };
            
        return (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pricing Plans</span>
                    <button 
                        onClick={() => addArrayItem(key, defaultPlan)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Plan
                    </button>
                </div>
                
                {plans.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No plans defined. Add some pricing plans above.</p>
                ) : (
                    <div className="space-y-3">
                        {plans.map((plan: any, index: number) => {
                            const featuresText = (plan.features || []).join('\n');
                            return (
                                <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                                    <div className="flex gap-2 items-center sm:self-center">
                                        <button 
                                            disabled={index === 0}
                                            onClick={() => moveArrayItem(key, index, 'up')}
                                            className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                        >
                                            <ChevronUp className="h-3.5 w-3.5" />
                                        </button>
                                        <button 
                                            disabled={index === plans.length - 1}
                                            onClick={() => moveArrayItem(key, index, 'down')}
                                            className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                        >
                                            <ChevronDown className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-12 gap-3 flex-1 w-full">
                                        <div className="col-span-4">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plan Name</label>
                                            <input 
                                                type="text" 
                                                value={plan.name || ''} 
                                                onChange={(e) => updateArrayField(key, index, 'name', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-semibold"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                                Monthly Price {key.startsWith('USER') ? '(₹)' : '($)'}
                                            </label>
                                            <input 
                                                type="text" 
                                                value={plan.priceMonthly !== undefined ? plan.priceMonthly : ''} 
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const num = Number(val);
                                                    updateArrayField(key, index, 'priceMonthly', isNaN(num) || val === '' ? val : num);
                                                }}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                                Yearly Price {key.startsWith('USER') ? '(₹)' : '($)'}
                                            </label>
                                            <input 
                                                type="text" 
                                                value={plan.priceYearly !== undefined ? plan.priceYearly : ''} 
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const num = Number(val);
                                                    updateArrayField(key, index, 'priceYearly', isNaN(num) || val === '' ? val : num);
                                                }}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon (Lucide)</label>
                                            <input 
                                                type="text" 
                                                value={plan.iconName || ''} 
                                                onChange={(e) => updateArrayField(key, index, 'iconName', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                            />
                                        </div>
                                        <div className="col-span-2 flex items-center pt-5">
                                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                                                <input 
                                                    type="checkbox" 
                                                    checked={plan.popular || false} 
                                                    onChange={(e) => updateArrayField(key, index, 'popular', e.target.checked)}
                                                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                                                />
                                                Popular
                                            </label>
                                        </div>
                                        <div className="col-span-6">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                                            <input 
                                                type="text" 
                                                value={plan.desc || ''} 
                                                onChange={(e) => updateArrayField(key, index, 'desc', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                            />
                                        </div>
                                        <div className="col-span-6">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gradient Class (Tailwind)</label>
                                            <input 
                                                type="text" 
                                                value={plan.gradient || ''} 
                                                onChange={(e) => updateArrayField(key, index, 'gradient', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                            />
                                        </div>
                                        <div className="col-span-6">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CTA Button Text</label>
                                            <input 
                                                type="text" 
                                                value={plan.cta || ''} 
                                                onChange={(e) => updateArrayField(key, index, 'cta', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                            />
                                        </div>
                                        <div className="col-span-2 flex items-center pt-5">
                                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                                                <input 
                                                    type="checkbox" 
                                                    checked={plan.disabled || false} 
                                                    onChange={(e) => updateArrayField(key, index, 'disabled', e.target.checked)}
                                                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                                                />
                                                Disabled
                                            </label>
                                        </div>
                                        <div className="col-span-2 flex items-center pt-5">
                                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                                                <input 
                                                    type="checkbox" 
                                                    checked={plan.current || false} 
                                                    onChange={(e) => updateArrayField(key, index, 'current', e.target.checked)}
                                                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                                                />
                                                Current Active
                                            </label>
                                        </div>
                                        <div className="col-span-2 flex items-center pt-5">
                                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                                                <input 
                                                    type="checkbox" 
                                                    checked={plan.bestValue || false} 
                                                    onChange={(e) => updateArrayField(key, index, 'bestValue', e.target.checked)}
                                                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                                                />
                                                Best Value
                                            </label>
                                        </div>
                                        <div className="col-span-12">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Features (one per line)</label>
                                            <textarea 
                                                value={featuresText} 
                                                onChange={(e) => {
                                                    const lines = e.target.value.split('\n').map(l => l.trim()).filter(l => l !== '');
                                                    updateArrayField(key, index, 'features', lines);
                                                }}
                                                rows={4}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                            />
                                        </div>
                                        {/* Limits Configuration */}
                                        <div className="col-span-12 border-t border-slate-100 pt-3 mt-1">
                                            <span className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2">Subscription Limits</span>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                {(key === 'USER_PRICING_PLANS' || key === 'LANDING_PRICING_PLANS') && (
                                                    <>
                                                        <div>
                                                            <label className="block text-[9px] font-bold text-slate-500 mb-1">Docs / Month</label>
                                                            <input 
                                                                type="number"
                                                                value={plan.limits?.documents !== undefined ? plan.limits.documents : ''}
                                                                onChange={(e) => {
                                                                    const limits = { ...(plan.limits || {}), documents: Number(e.target.value) };
                                                                    updateArrayField(key, index, 'limits', limits);
                                                                }}
                                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[9px] font-bold text-slate-500 mb-1">Reviews / Month</label>
                                                            <input 
                                                                type="number"
                                                                value={plan.limits?.reviews !== undefined ? plan.limits.reviews : ''}
                                                                onChange={(e) => {
                                                                    const limits = { ...(plan.limits || {}), reviews: Number(e.target.value) };
                                                                    updateArrayField(key, index, 'limits', limits);
                                                                }}
                                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[9px] font-bold text-slate-500 mb-1">Research Queries / Day</label>
                                                            <input 
                                                                type="number"
                                                                value={plan.limits?.research !== undefined ? plan.limits.research : ''}
                                                                onChange={(e) => {
                                                                    const limits = { ...(plan.limits || {}), research: Number(e.target.value) };
                                                                    updateArrayField(key, index, 'limits', limits);
                                                                }}
                                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[9px] font-bold text-slate-500 mb-1">Bookings / Month</label>
                                                            <input 
                                                                type="number"
                                                                value={plan.limits?.bookings !== undefined ? plan.limits.bookings : ''}
                                                                onChange={(e) => {
                                                                    const limits = { ...(plan.limits || {}), bookings: Number(e.target.value) };
                                                                    updateArrayField(key, index, 'limits', limits);
                                                                }}
                                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                {key === 'LAWYER_PRICING_PLANS' && (
                                                    <>
                                                        <div>
                                                            <label className="block text-[9px] font-bold text-slate-500 mb-1">Max Active Cases</label>
                                                            <input 
                                                                type="number"
                                                                value={plan.limits?.activeCases !== undefined ? plan.limits.activeCases : ''}
                                                                onChange={(e) => {
                                                                    const limits = { ...(plan.limits || {}), activeCases: Number(e.target.value) };
                                                                    updateArrayField(key, index, 'limits', limits);
                                                                }}
                                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[9px] font-bold text-slate-500 mb-1">Blogs / Week</label>
                                                            <input 
                                                                type="number"
                                                                value={plan.limits?.blogsPerWeek !== undefined ? plan.limits.blogsPerWeek : ''}
                                                                onChange={(e) => {
                                                                    const limits = { ...(plan.limits || {}), blogsPerWeek: Number(e.target.value) };
                                                                    updateArrayField(key, index, 'limits', limits);
                                                                }}
                                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[9px] font-bold text-slate-500 mb-1">Commission Percent (%)</label>
                                                            <input 
                                                                type="number"
                                                                value={plan.limits?.commissionPercent !== undefined ? plan.limits.commissionPercent : ''}
                                                                onChange={(e) => {
                                                                    const limits = { ...(plan.limits || {}), commissionPercent: Number(e.target.value) };
                                                                    updateArrayField(key, index, 'limits', limits);
                                                                }}
                                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                                            />
                                                        </div>
                                                        <div className="flex items-center text-slate-400 text-[10px] pt-4 italic font-medium">
                                                            Platform commission rate
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => deleteArrayItem(key, index)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:self-center transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const renderContactEditor = (key: string) => {
        const cards = editingJsonConfig[key] || [];
        return (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info Cards</span>
                    <button 
                        onClick={() => addArrayItem(key, { iconName: "Mail", title: "New Info", detail: "info@example.com", desc: "Description", color: "from-blue-500 to-indigo-600" })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Info Card
                    </button>
                </div>
                
                {cards.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No contact info cards defined. Add some cards above.</p>
                ) : (
                    <div className="space-y-3">
                        {cards.map((card: any, index: number) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                                <div className="flex gap-2 items-center sm:self-center">
                                    <button 
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem(key, index, 'up')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                        disabled={index === cards.length - 1}
                                        onClick={() => moveArrayItem(key, index, 'down')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-3 flex-1 w-full">
                                    <div className="col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
                                        <input 
                                            type="text" 
                                            value={card.title || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'title', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-semibold"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon (Lucide)</label>
                                        <input 
                                            type="text" 
                                            value={card.iconName || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'iconName', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Details</label>
                                        <input 
                                            type="text" 
                                            value={card.detail || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'detail', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Color Gradient (Tailwind)</label>
                                        <input 
                                            type="text" 
                                            value={card.color || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'color', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                                        <textarea 
                                            value={card.desc || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'desc', e.target.value)}
                                            rows={2}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => deleteArrayItem(key, index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:self-center transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderFaqsEditor = (key: string) => {
        const faqs = editingJsonConfig[key] || [];
        return (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FAQs List</span>
                    <button 
                        onClick={() => addArrayItem(key, { q: "New Question?", a: "Answer details." })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add FAQ
                    </button>
                </div>
                
                {faqs.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No FAQs defined. Add some FAQs above.</p>
                ) : (
                    <div className="space-y-3">
                        {faqs.map((faq: any, index: number) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                                <div className="flex gap-2 items-center sm:self-center">
                                    <button 
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem(key, index, 'up')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                        disabled={index === faqs.length - 1}
                                        onClick={() => moveArrayItem(key, index, 'down')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-3 flex-1 w-full">
                                    <div className="col-span-12">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Question</label>
                                        <input 
                                            type="text" 
                                            value={faq.q || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'q', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Answer</label>
                                        <textarea 
                                            value={faq.a || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'a', e.target.value)}
                                            rows={3}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => deleteArrayItem(key, index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:self-center transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };    const renderContentSettings = () => {
        let filteredConfigs = [];
        if (activeTab === 'content') {
            const currentSectionKeys = PANEL_SECTIONS[selectedPanel].find(s => s.id === selectedSection)?.keys || [];
            filteredConfigs = configs.filter(c => currentSectionKeys.includes(c.key));
        } else if (activeTab === 'payments') {
            if (paymentSubTab === 'user') {
                filteredConfigs = configs.filter(c => c.key === 'USER_PRICING_PLANS' || c.category === 'payments');
            } else {
                filteredConfigs = configs.filter(c => c.key === 'LAWYER_PRICING_PLANS');
            }
        } else {
            filteredConfigs = configs.filter(c => c.category === 'system');
        }

        const sectionsList = activeTab === 'content' ? PANEL_SECTIONS[selectedPanel] : [];

        if (activeTab !== 'content') {
            return (
                <div className="space-y-6">
                    {activeTab === 'payments' && (
                        <div className="flex flex-col sm:flex-row gap-3 p-1.5 bg-slate-100 rounded-xl border border-slate-200 w-fit">
                            <button
                                onClick={() => setPaymentSubTab('user')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-205 ${
                                    paymentSubTab === 'user' 
                                        ? 'bg-white text-purple-600 shadow-sm' 
                                        : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50/50'
                                }`}
                            >
                                <Users className="h-4 w-4" />
                                User Subscription & Fees
                            </button>
                            <button
                                onClick={() => setPaymentSubTab('lawyer')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-205 ${
                                    paymentSubTab === 'lawyer' 
                                        ? 'bg-white text-purple-600 shadow-sm' 
                                        : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50/50'
                                }`}
                            >
                                <Gavel className="h-4 w-4" />
                                Lawyer Subscription Management
                            </button>
                        </div>
                    )}
                    <div className="grid gap-6">
                        {filteredConfigs.map((config) => {
                            const isJson = typeof config.value === 'object' && config.value !== null;
                            const isLongText = config.key.endsWith('_DESC') || config.key.endsWith('_SUBTITLE') || config.key.endsWith('_ANNOUNCEMENT') || config.key.endsWith('_WELCOME_MSG');

                            return (
                                <div key={config._id} className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4 ${isJson ? 'items-stretch' : 'md:flex-row md:items-center justify-between'}`}>
                                    <div className="space-y-1 flex-1">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            {config.key.replace(/_/g, ' ')}
                                            <Info className="h-3.5 w-3.5 text-slate-400" />
                                        </h3>
                                        <p className="text-sm text-slate-500">{config.description}</p>
                                    </div>

                                    {isJson ? (
                                        <div className="w-full flex flex-col">
                                            {(config.key === 'LANDING_PRICING_PLANS' || config.key === 'USER_PRICING_PLANS' || config.key === 'LAWYER_PRICING_PLANS') && renderPricingEditor(config.key)}
                                            
                                            <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
                                                <button 
                                                    onClick={() => handleUpdate(config.key, editingJsonConfig[config.key])}
                                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm"
                                                >
                                                    <Save className="h-4 w-4" />
                                                    Save {config.key.replace(/_/g, ' ').toLowerCase()} Changes
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-4 items-center">
                                            {typeof config.value === 'boolean' ? (
                                                <button 
                                                    onClick={() => handleUpdate(config.key, !config.value)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                        config.value ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                    }`}
                                                >
                                                    {config.value ? 'Turn OFF' : 'Turn ON'}
                                                </button>
                                            ) : (
                                                <div className="flex gap-2 items-start w-full md:w-auto">
                                                    {isLongText ? (
                                                        <textarea
                                                            defaultValue={config.value}
                                                            id={`input-${config.key}`}
                                                            rows={3}
                                                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-64 md:w-96 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-medium"
                                                        />
                                                    ) : (
                                                        <input 
                                                            type={typeof config.value === 'number' ? 'number' : 'text'}
                                                            defaultValue={config.value}
                                                            id={`input-${config.key}`}
                                                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-64 md:w-80 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-medium"
                                                        />
                                                    )}
                                                    <button 
                                                        onClick={() => {
                                                            const val = (document.getElementById(`input-${config.key}`) as HTMLInputElement | HTMLTextAreaElement).value;
                                                            handleUpdate(config.key, val);
                                                        }}
                                                        className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* 3 Option Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div 
                        onClick={() => handlePanelChange('landing')}
                        className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                            selectedPanel === 'landing' 
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-500/20 scale-[1.02]' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:shadow-md'
                        }`}
                    >
                        <div className={`p-3 rounded-xl ${selectedPanel === 'landing' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'}`}>
                            <Globe className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className={`font-bold text-base ${selectedPanel === 'landing' ? 'text-white' : 'text-slate-900'}`}>Landing Page</h3>
                            <p className={`text-xs mt-1 leading-snug ${selectedPanel === 'landing' ? 'text-purple-100' : 'text-slate-500'}`}>
                                Edit landing page content, steps, features, and FAQs.
                            </p>
                        </div>
                    </div>

                    <div 
                        onClick={() => handlePanelChange('user')}
                        className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                            selectedPanel === 'user' 
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-500/20 scale-[1.02]' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:shadow-md'
                        }`}
                    >
                        <div className={`p-3 rounded-xl ${selectedPanel === 'user' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'}`}>
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className={`font-bold text-base ${selectedPanel === 'user' ? 'text-white' : 'text-slate-900'}`}>User Panel</h3>
                            <p className={`text-xs mt-1 leading-snug ${selectedPanel === 'user' ? 'text-purple-100' : 'text-slate-500'}`}>
                                Configure limits, descriptions, and toggles for clients.
                            </p>
                        </div>
                    </div>

                    <div 
                        onClick={() => handlePanelChange('lawyer')}
                        className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                            selectedPanel === 'lawyer' 
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-500/20 scale-[1.02]' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:shadow-md'
                        }`}
                    >
                        <div className={`p-3 rounded-xl ${selectedPanel === 'lawyer' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'}`}>
                            <Gavel className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className={`font-bold text-base ${selectedPanel === 'lawyer' ? 'text-white' : 'text-slate-900'}`}>Lawyer Panel</h3>
                            <p className={`text-xs mt-1 leading-snug ${selectedPanel === 'lawyer' ? 'text-purple-100' : 'text-slate-500'}`}>
                                Manage welcome banners, blog approvals, and payouts.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-12 gap-6 items-start">
                    {/* Left Navigation Sidebar */}
                    <div className="col-span-12 md:col-span-3 space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Sections</span>
                        {sectionsList.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setSelectedSection(section.id)}
                                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                                    selectedSection === section.id 
                                    ? 'bg-purple-50 text-purple-700 shadow-sm border-l-2 border-purple-500' 
                                    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {section.name}
                                {selectedSection === section.id && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Right Editor Area */}
                    <div className="col-span-12 md:col-span-9 space-y-6">
                        {filteredConfigs.length === 0 ? (
                            <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center text-slate-400">
                                <Info className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm font-semibold">No configurations found in this section.</p>
                            </div>
                        ) : (
                            filteredConfigs.map((config) => {
                                const isJson = typeof config.value === 'object' && config.value !== null;
                                const isImageKey = config.key.includes('IMAGE') || config.key.includes('LOGO_URL');
                                const isLongText = config.key.endsWith('_DESC') || config.key.endsWith('_SUBTITLE') || config.key.endsWith('_ANNOUNCEMENT') || config.key.endsWith('_WELCOME_MSG');

                                return (
                                    <div key={config._id} className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4 ${isJson ? 'items-stretch' : 'md:flex-row md:items-center justify-between'}`}>
                                        <div className="space-y-1 flex-1">
                                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                                {config.key.replace(/_/g, ' ')}
                                                <Info className="h-3.5 w-3.5 text-slate-400" />
                                            </h3>
                                            <p className="text-sm text-slate-555">{config.description}</p>
                                        </div>

                                        {isJson ? (
                                            <div className="w-full flex flex-col">
                                                {config.key === 'LANDING_HOW_IT_WORKS_STEPS' && renderStepsEditor(config.key)}
                                                {config.key === 'LANDING_FEATURES' && renderFeaturesEditor(config.key)}
                                                {(config.key === 'LANDING_PRICING_PLANS' || config.key === 'USER_PRICING_PLANS' || config.key === 'LAWYER_PRICING_PLANS') && renderPricingEditor(config.key)}
                                                {config.key === 'LANDING_CONTACT_INFO' && renderContactEditor(config.key)}
                                                {config.key === 'LANDING_FAQS' && renderFaqsEditor(config.key)}
                                                
                                                <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
                                                    <button 
                                                        onClick={() => handleUpdate(config.key, editingJsonConfig[config.key])}
                                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                        Save {config.key.replace(/_/g, ' ').toLowerCase()} Changes
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-4 items-center">
                                                {isImageKey && config.value && (
                                                    <div className="h-10 w-10 rounded border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                                                        <img src={config.value} alt="Preview" className="max-h-full max-w-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                                    </div>
                                                )}

                                                {typeof config.value === 'boolean' ? (
                                                    <button 
                                                        onClick={() => handleUpdate(config.key, !config.value)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                            config.value ? 'bg-red-55 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-605 border border-emerald-200'
                                                        }`}
                                                    >
                                                        {config.value ? 'Turn OFF' : 'Turn ON'}
                                                    </button>
                                                ) : (
                                                    <div className="flex gap-2 items-start w-full md:w-auto">
                                                        {isLongText ? (
                                                            <textarea
                                                                defaultValue={config.value}
                                                                id={`input-${config.key}`}
                                                                rows={3}
                                                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-64 md:w-96 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-medium"
                                                            />
                                                        ) : (
                                                            <input 
                                                                type={typeof config.value === 'number' ? 'number' : 'text'}
                                                                defaultValue={config.value}
                                                                id={`input-${config.key}`}
                                                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-64 md:w-80 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-medium"
                                                            />
                                                        )}
                                                        <button 
                                                            onClick={() => {
                                                                const val = (document.getElementById(`input-${config.key}`) as HTMLInputElement | HTMLTextAreaElement).value;
                                                                handleUpdate(config.key, val);
                                                            }}
                                                            className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                                                        >
                                                            <Save className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const handleApprovePayout = async (caseId: string, index: number) => {
        try {
            await adminService.approvePayout(caseId, index);
            toast.success("Payout approved and released successfully!");
            fetchData();
        } catch (error) {
            toast.error("Failed to approve payout");
        }
    };

    const handleRejectPayout = async (caseId: string, index: number) => {
        try {
            await adminService.rejectPayout(caseId, index);
            toast.success("Payout request rejected");
            fetchData();
        } catch (error) {
            toast.error("Failed to reject payout");
        }
    };

    const renderCasesAndPayouts = () => {
        // Extract all pending payout requests
        const payoutRequests: any[] = [];
        let totalPaidOut = 0;
        
        cases.forEach(c => {
            c.milestones.forEach((m: any, mIdx: number) => {
                if (m.payoutStatus === 'requested') {
                    payoutRequests.push({
                        caseId: c._id,
                        caseTitle: c.title,
                        clientName: c.client?.fullName || 'Client',
                        lawyerId: c.lawyer?._id,
                        lawyerName: c.lawyer?.fullName || 'Lawyer',
                        bankName: c.lawyer?.bankName || 'Not Provided',
                        accountNumber: c.lawyer?.accountNumber || 'Not Provided',
                        ifsc: c.lawyer?.ifsc || 'Not Provided',
                        milestoneTitle: m.title,
                        milestoneIndex: mIdx,
                        amount: m.payoutAmount,
                        proofDocs: m.proofDocs || []
                    });
                }
                if (m.payoutStatus === 'approved') {
                    totalPaidOut += m.payoutAmount;
                }
            });
        });

        const activeCasesCount = cases.filter(c => c.status === 'active').length;

        return (
            <div className="space-y-8">
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Active Cases</p>
                                <h3 className="text-2xl font-bold text-slate-900">{activeCasesCount} / {cases.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                                <Coins className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Payout Requests</p>
                                <h3 className="text-2xl font-bold text-slate-900">{payoutRequests.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                                <Coins className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Total Paid Out</p>
                                <h3 className="text-2xl font-bold text-emerald-600">₹{totalPaidOut.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payout requests list */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-900">Pending Milestone Payout Requests</h3>
                        <p className="text-sm text-slate-500">Verify uploaded proof documents and lawyer bank details before releasing funds.</p>
                    </div>

                    {payoutRequests.length === 0 ? (
                        <div className="p-12 text-center">
                            <CheckCircle className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No pending payout requests.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Case / Milestone</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Lawyer & Payout details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Verification Documents</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payoutRequests.map((req, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm">{req.caseTitle}</div>
                                            <div className="text-xs text-slate-500 mt-1">Milestone: <span className="font-semibold">{req.milestoneTitle}</span></div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Client: {req.clientName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900 text-sm">{req.lawyerName}</div>
                                            <div className="text-[11px] text-slate-500 mt-1 font-mono">
                                                Bank: {req.bankName} • A/C: {req.accountNumber} • IFSC: {req.ifsc}
                                            </div>
                                            <div className="text-xs font-bold text-primary mt-1.5 flex items-center gap-1">
                                                <Coins className="h-3.5 w-3.5" />
                                                Payout Amount: ₹{req.amount.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.proofDocs.length === 0 ? (
                                                <span className="text-xs text-red-500 font-bold">No Proof Uploaded</span>
                                            ) : (
                                                <div className="space-y-2">
                                                    {req.proofDocs.map((doc: any, dIdx: number) => {
                                                        const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.url);
                                                        return (
                                                            <div key={dIdx} className="space-y-1">
                                                                <a
                                                                                                    href={`/lawyer${doc.url}`}
                                                                                                    target="_blank"
                                                                                                    rel="noreferrer"
                                                                                                    className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1.5"
                                                                                                >
                                                                                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                                                                                    <span className="truncate max-w-[120px]">{doc.name}</span>
                                                                                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                                                                                </a>
                                                                {isImg && (
                                                                    <div className="mt-1 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 w-24 h-16 shadow-sm relative group">
                                                                        <img 
                                                                            src={`/lawyer${doc.url}`} 
                                                                            alt={doc.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                            <a 
                                                                                href={`/lawyer${doc.url}`}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="text-[8px] bg-white text-slate-900 px-1 py-0.5 rounded shadow-sm font-bold"
                                                                            >
                                                                                View
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprovePayout(req.caseId, req.milestoneIndex)}
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    Approve Payout
                                                </button>
                                                <button
                                                    onClick={() => handleRejectPayout(req.caseId, req.milestoneIndex)}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Master cases list */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-900">Cases Registry</h3>
                        <p className="text-sm text-slate-500">Track the overall progress and roadmap stats for all active engagements.</p>
                    </div>

                    {cases.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">No cases recorded yet.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Case Title</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Lawyer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Verification Progress</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Meeting Summary</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Fee</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cases.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm">{c.title}</div>
                                            <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Status: {c.status}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{c.client?.fullName || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{c.lawyer?.fullName || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 w-40">
                                                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${c.currentProgress}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 shrink-0">{c.currentProgress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.meetingSummaryUrl ? (
                                                <a 
                                                    href={`/lawyer${c.meetingSummaryUrl}`}
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-bold hover:underline"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    <span>View Summary</span>
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium">Pending Call</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900 text-sm">
                                            ₹{c.totalFee.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    };

    const handleReplyTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket) return;
        try {
            await adminService.replyToTicket(selectedTicket._id, replyText, ticketReplyStatus);
            toast.success("Replied to ticket successfully!");
            setSelectedTicket(null);
            setReplyText("");
            fetchData();
        } catch (error) {
            toast.error("Failed to reply to ticket");
        }
    };

    const renderTickets = () => {
        // Filter tickets
        const filteredTickets = tickets.filter(t => {
            const matchesSearch = 
                t.ticketId.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                t.description.toLowerCase().includes(ticketSearch.toLowerCase());
            
            const matchesPriority = ticketPriorityFilter === 'All' || t.priority === ticketPriorityFilter;
            const matchesStatus = ticketStatusFilter === 'All' || t.status === ticketStatusFilter;
            
            return matchesSearch && matchesPriority && matchesStatus;
        });

        const getPriorityColor = (p: string) => {
            switch(p) {
                case 'Urgent': return 'bg-red-50 text-red-700 border-red-200';
                case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
                case 'Medium': return 'bg-blue-50 text-blue-700 border-blue-200';
                default: return 'bg-slate-50 text-slate-600 border-slate-200';
            }
        };

        const getStatusColor = (s: string) => {
            switch(s) {
                case 'Open': return 'bg-purple-50 text-purple-700 border-purple-200';
                case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
                case 'Closed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                default: return 'bg-slate-50 text-slate-700 border-slate-200';
            }
        };

        return (
            <div className="space-y-6">
                {/* Search & Filter row */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                        <input 
                            type="text" 
                            placeholder="Search tickets by ID, subject..."
                            value={ticketSearch}
                            onChange={(e) => setTicketSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-medium"
                        />
                        <MessageSquare className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <select 
                            value={ticketPriorityFilter}
                            onChange={(e) => setTicketPriorityFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-slate-700"
                        >
                            <option value="All">All Priorities</option>
                            <option value="Urgent">Urgent</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <select 
                            value={ticketStatusFilter}
                            onChange={(e) => setTicketStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-slate-700"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Open">Open</option>
                            <option value="Pending">Pending</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Support Ticketing Desk</h3>
                            <p className="text-sm text-slate-500">Respond to platform operational and billing tickets from lawyers and clients.</p>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-150">
                            {filteredTickets.length} Tickets Found
                        </span>
                    </div>

                    {filteredTickets.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-medium">No support tickets match the filters.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Ticket ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Subject & Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Priority</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredTickets.map((t) => (
                                    <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono font-bold text-slate-900 text-xs">{t.ticketId}</div>
                                            <div className="text-[10px] text-slate-400 mt-1 font-semibold">{new Date(t.updatedAt || t.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 font-bold">{t.category}</td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="text-sm text-slate-900 font-bold truncate">{t.subject}</div>
                                            <div className="text-xs text-slate-500 truncate mt-0.5">{t.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityColor(t.priority)}`}>
                                                {t.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(t.status)}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => {
                                                    setSelectedTicket(t);
                                                    setReplyText(t.adminReply || "");
                                                    setTicketReplyStatus(t.status);
                                                }}
                                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ml-auto shadow-sm"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View & Reply
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Reply Modal */}
                {selectedTicket && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] overflow-y-auto">
                        <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSelectedTicket(null)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative my-8">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600 border border-purple-100">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">Resolve Ticket</h3>
                                        <p className="text-xs text-slate-400 font-mono font-bold">{selectedTicket.ticketId}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedTicket(null)}
                                    className="p-1.5 text-slate-400 hover:bg-white rounded-lg border border-slate-200 transition-colors shadow-sm"
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleReplyTicket} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Category</span>
                                        <span className="text-sm font-semibold text-slate-700">{selectedTicket.category}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Priority</span>
                                        <span className="text-sm font-semibold text-slate-700">{selectedTicket.priority}</span>
                                    </div>
                                    <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Subject</span>
                                        <span className="text-sm font-semibold text-slate-800">{selectedTicket.subject}</span>
                                    </div>
                                    <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100 max-h-40 overflow-y-auto">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</span>
                                        <span className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{selectedTicket.description}</span>
                                    </div>
                                </div>

                                {selectedTicket.attachment && (
                                    <div className="flex items-center justify-between bg-purple-50/50 p-3 rounded-lg border border-purple-100/50">
                                        <span className="text-xs text-purple-700 font-semibold flex items-center gap-1.5">
                                            <FileText className="h-4 w-4" /> Attached Document
                                        </span>
                                        <a 
                                            href={`/user/lawyer/${selectedTicket.attachment.replace(/\\/g, '/')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                                        >
                                            View Attachment <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                )}

                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin Reply Response</label>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-slate-400 font-medium">Update Status:</label>
                                            <select 
                                                value={ticketReplyStatus}
                                                onChange={(e) => setTicketReplyStatus(e.target.value)}
                                                className="px-2 py-1 border border-slate-200 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-purple-500 font-bold text-slate-700 cursor-pointer"
                                            >
                                                <option value="Open">Open</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>
                                    </div>
                                    <textarea 
                                        rows={4}
                                        placeholder="Type the resolution message here to send to the lawyer..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-medium"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedTicket(null)}
                                        className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Send className="h-4 w-4" />
                                        Submit Reply
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderDocuments = () => {
        const filteredDocs = documents.filter(d => {
            const clientName = d.userId?.fullName || '';
            const clientEmail = d.userId?.email || '';
            
            return (
                d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
                d.documentType.toLowerCase().includes(docSearch.toLowerCase()) ||
                clientName.toLowerCase().includes(docSearch.toLowerCase()) ||
                clientEmail.toLowerCase().includes(docSearch.toLowerCase())
            );
        });

        return (
            <div className="space-y-6">
                {/* Search bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96">
                        <input 
                            type="text" 
                            placeholder="Search documents by title, type, or client..."
                            value={docSearch}
                            onChange={(e) => setDocSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-medium"
                        />
                        <FileText className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-150 shrink-0">
                        {filteredDocs.length} Documents
                    </span>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-900">Client Legal Document Vault</h3>
                        <p className="text-sm text-slate-500">Inspect AI-generated legal agreements and questionnaires submitted by users.</p>
                    </div>

                    {filteredDocs.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-medium">No documents found.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Document Title</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Agreement Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Generated Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredDocs.map((d) => (
                                    <tr key={d._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                                <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                                                {d.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-semibold text-slate-650 bg-slate-100 px-2 py-0.5 rounded">
                                                {d.documentType.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700 font-semibold">{d.userId?.fullName || 'Anonymous Client'}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">{d.userId?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                                                d.status === 'final' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                d.status === 'draft' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                                            }`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {new Date(d.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedDoc(d)}
                                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ml-auto shadow-sm"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Inspect
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Document Inspector Modal */}
                {selectedDoc && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] overflow-y-auto">
                        <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSelectedDoc(null)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-4xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[90vh] relative my-8">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600 border border-purple-100">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{selectedDoc.title}</h3>
                                        <p className="text-xs text-slate-400">Client: {selectedDoc.userId?.fullName || 'N/A'} ({selectedDoc.userId?.email || 'N/A'})</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedDoc(null)}
                                    className="p-1.5 text-slate-400 hover:bg-white rounded-lg border border-slate-200 transition-colors shadow-sm"
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </button>
                            </div>
                            
                            {/* Modal Body (Scrollable) */}
                            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left/Main side - Document content */}
                                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-h-[70vh] overflow-y-auto font-serif">
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: selectedDoc.content }} 
                                        className="prose max-w-none text-slate-800 leading-relaxed text-sm select-text" 
                                    />
                                </div>

                                {/* Right side - Form inputs and Metadata */}
                                <div className="space-y-4">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metadata</h4>
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="block text-slate-400 font-semibold">Type</span>
                                                <span className="font-bold text-slate-700">{selectedDoc.documentType}</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-400 font-semibold">Status</span>
                                                <span className="font-bold text-slate-700 uppercase">{selectedDoc.status}</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-400 font-semibold">Created</span>
                                                <span className="font-bold text-slate-700">{new Date(selectedDoc.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-400 font-semibold">Last Updated</span>
                                                <span className="font-bold text-slate-700">{new Date(selectedDoc.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 max-h-[40vh] overflow-y-auto">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Questionnaire Inputs</h4>
                                        {selectedDoc.formData && Object.keys(selectedDoc.formData).length > 0 ? (
                                            <div className="space-y-2">
                                                {Object.entries(selectedDoc.formData).map(([k, v]: any) => (
                                                    <div key={k} className="border-b border-slate-100 pb-1.5 text-xs">
                                                        <span className="block font-bold text-slate-500 uppercase tracking-tight text-[10px]">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        <span className="font-semibold text-slate-800 leading-snug block mt-0.5">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic font-medium">No input fields saved.</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 bg-white border-t border-slate-100 flex justify-end shrink-0">
                                <button 
                                    onClick={() => setSelectedDoc(null)}
                                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                                >
                                    Close Inspector
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (loading) return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <RefreshCcw className="h-8 w-8 text-purple-300 animate-spin" />
                <p className="text-slate-400 font-medium">Syncing with Central Database...</p>
            </div>
        );

        switch(activeTab) {
            case 'overview': return renderOverview();
            case 'lawyers': return renderLawyerApproval();
            case 'cases': return renderCasesAndPayouts();
            case 'consultations': return renderConsultations();
            case 'users': return renderUserManagement();
            case 'tickets': return renderTickets();
            case 'documents': return renderDocuments();
            case 'content': 
            case 'payments':
            case 'system': return renderContentSettings();
            default: return renderOverview();
        }
    };

    const renderConsultations = () => (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg text-slate-900">Live Video Consultations</h3>
                    <p className="text-sm text-slate-500">Track and audit lawyer-client direct scheduled consultations.</p>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-150">
                    {consultations.length} Booked
                </span>
            </div>

            {consultations.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-medium">No live consultations recorded.</div>
            ) : (
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Topic & Inquiry</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Lawyer</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Scheduled Time</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Shared Documents</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {consultations.map((c) => (
                            <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900 text-sm">{c.title}</div>
                                    <div className="text-[11px] text-slate-550 mt-1 max-w-[200px] truncate font-medium">{c.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-800 text-sm">{c.client?.fullName}</div>
                                    <div className="text-xs text-slate-400">{c.client?.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-800 text-sm">{c.lawyer?.fullName}</div>
                                    <div className="text-xs text-slate-400">{c.lawyer?.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="font-bold text-slate-800">{new Date(c.scheduledDate).toLocaleDateString()}</div>
                                    <div className="text-[11px] text-slate-400 font-extrabold">{c.scheduledTime}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {(!c.documents || c.documents.length === 0) ? (
                                        <span className="text-xs text-slate-400">No uploads</span>
                                    ) : (
                                        <div className="space-y-1">
                                            {c.documents.map((doc: any, dIdx: number) => (
                                                <div key={dIdx}>
                                                    <a 
                                                        href={`/lawyer${doc.url}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                                                    >
                                                        <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                        <span className="truncate max-w-[120px]">{doc.name}</span>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                                        c.status === 'scheduled' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        c.status === 'pending_payment' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                        c.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        {c.status?.replace(/_/g, ' ')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    return (
        <AdminLayout userNav={<UserNav />}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-purple-600" />
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {activeTab === 'overview' ? 'Global overview of the Vidhik AI ecosystem.' : 
                         activeTab === 'lawyers' ? 'Manage and verify lawyer credentials for the platform.' :
                         activeTab === 'tickets' ? 'Manage, reply to, and resolve platform support tickets.' :
                         activeTab === 'documents' ? 'Inspect and audit AI-generated client documents.' :
                         'Modify system settings and configurations.'}
                    </p>
                </div>
                <button 
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Sync Data
                </button>
            </div>

            <div className="space-y-8">
                {renderContent()}
            </div>

            {/* User Details Inspector Modal */}
            {isUserModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] overflow-y-auto">
                    <div className="absolute inset-0 bg-slate-900/40" onClick={() => { setIsUserModalOpen(false); setSelectedUserDetails(null); }}></div>
                    <div className="bg-white rounded-2xl w-full max-w-4xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[90vh] relative my-8">
                        {loadingUserDetails ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3">
                                <RefreshCcw className="h-10 w-10 text-purple-600 animate-spin" />
                                <p className="text-sm font-semibold text-slate-500">Retrieving profile data...</p>
                            </div>
                        ) : selectedUserDetails ? (
                            <>
                                {/* Modal Header */}
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                                            {selectedUserDetails.user.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-slate-900">{selectedUserDetails.user.fullName}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    selectedUserDetails.user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                    selectedUserDetails.user.role === 'lawyer' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {selectedUserDetails.user.role}
                                                </span>
                                                {selectedUserDetails.user.isVerified && (
                                                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                                                        <CheckCircle className="h-3 w-3" /> Verified
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400">{selectedUserDetails.user.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { setIsUserModalOpen(false); setSelectedUserDetails(null); }}
                                        className="p-1.5 text-slate-400 hover:bg-white rounded-lg border border-slate-200 transition-colors shadow-sm"
                                    >
                                        <ChevronDown className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Modal Body (Scrollable) */}
                                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col md:flex-row gap-6">
                                    {/* Left Column: Profile & Subscription */}
                                    <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
                                        {/* Profile details card */}
                                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                                            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Account Profile</h4>
                                            <div className="space-y-3 text-sm">
                                                {selectedUserDetails.user.phone && (
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 block">PHONE</span>
                                                        <span className="font-semibold text-slate-700">{selectedUserDetails.user.phone}</span>
                                                    </div>
                                                )}
                                                {selectedUserDetails.user.location && (
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 block">LOCATION</span>
                                                        <span className="font-semibold text-slate-700">{selectedUserDetails.user.location}</span>
                                                    </div>
                                                )}
                                                {selectedUserDetails.user.designation && (
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 block">DESIGNATION</span>
                                                        <span className="font-semibold text-slate-700">{selectedUserDetails.user.designation}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 block">MEMBER SINCE</span>
                                                    <span className="font-semibold text-slate-700">{new Date(selectedUserDetails.user.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                
                                                {selectedUserDetails.user.role === 'lawyer' && (
                                                    <>
                                                        {selectedUserDetails.user.title && (
                                                            <div>
                                                                <span className="text-[10px] font-bold text-slate-400 block">TITLE</span>
                                                                <span className="font-semibold text-slate-700">{selectedUserDetails.user.title}</span>
                                                            </div>
                                                        )}
                                                        {selectedUserDetails.user.expertise && (
                                                            <div>
                                                                <span className="text-[10px] font-bold text-slate-400 block">EXPERTISE</span>
                                                                <span className="font-semibold text-slate-700">{selectedUserDetails.user.expertise}</span>
                                                            </div>
                                                        )}
                                                        {selectedUserDetails.user.hourlyRate !== undefined && (
                                                            <div>
                                                                <span className="text-[10px] font-bold text-slate-400 block">HOURLY RATE</span>
                                                                <span className="font-bold text-purple-600">₹{selectedUserDetails.user.hourlyRate}/hr</span>
                                                            </div>
                                                        )}
                                                        {selectedUserDetails.user.experience && (
                                                            <div>
                                                                <span className="text-[10px] font-bold text-slate-400 block">EXPERIENCE</span>
                                                                <span className="font-semibold text-slate-700">{selectedUserDetails.user.experience}</span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Subscription Plan details & Control */}
                                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                                            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Subscription Billing</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 block mb-1">CURRENT PLAN</span>
                                                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-xs font-bold inline-block uppercase">
                                                        {selectedUserDetails.user.subscription || "Professional"}
                                                    </span>
                                                </div>
                                                
                                                {/* Control Dropdown/Selector */}
                                                <div className="pt-2 border-t border-slate-100">
                                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">CHANGE PLAN</label>
                                                    <select
                                                        disabled={updatingSubscription}
                                                        value={selectedUserDetails.user.subscription || "Professional"}
                                                        onChange={(e) => handleUpdateSubscription(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-purple-500"
                                                    >
                                                        <option value="Free">Free</option>
                                                        <option value="Starter">Starter</option>
                                                        <option value="Professional">Professional</option>
                                                        <option value="Enterprise">Enterprise</option>
                                                    </select>
                                                    {updatingSubscription && (
                                                        <span className="text-[9px] text-purple-600 animate-pulse font-bold mt-1 block">Updating plan...</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Area: Case Bookings & Documents */}
                                    <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                                        {/* Bio / About (If present) */}
                                        {selectedUserDetails.user.bio && (
                                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Biography</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedUserDetails.user.bio}"</p>
                                            </div>
                                        )}

                                        {/* Bookings/Cases section */}
                                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col max-h-[300px]">
                                            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                                                <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-purple-500" />
                                                    Case Consultations ({selectedUserDetails.cases.length})
                                                </h4>
                                            </div>
                                            <div className="flex-1 overflow-y-auto">
                                                {selectedUserDetails.cases.length === 0 ? (
                                                    <div className="p-8 text-center text-slate-400 text-sm">
                                                        No case bookings recorded for this user.
                                                    </div>
                                                ) : (
                                                    <table className="w-full text-left text-sm">
                                                        <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase shrink-0 sticky top-0 z-10">
                                                            <tr>
                                                                <th className="px-4 py-2">Title / Subject</th>
                                                                <th className="px-4 py-2">{selectedUserDetails.user.role === 'lawyer' ? 'Client' : 'Lawyer'}</th>
                                                                <th className="px-4 py-2">Consultation Date</th>
                                                                <th className="px-4 py-2">Fee</th>
                                                                <th className="px-4 py-2 text-right">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {selectedUserDetails.cases.map((c: any) => {
                                                                const party = selectedUserDetails.user.role === 'lawyer' ? c.client : c.lawyer;
                                                                return (
                                                                    <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                                                                        <td className="px-4 py-3 font-semibold text-slate-800">
                                                                            {c.title}
                                                                            <div className="text-[10px] text-slate-400 max-w-[200px] truncate">{c.description}</div>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-slate-600">
                                                                            {party?.fullName || 'N/A'}
                                                                            <div className="text-[10px] text-slate-400">{party?.email || ''}</div>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-slate-500">
                                                                            {c.bookingDate ? new Date(c.bookingDate).toLocaleDateString() : 'N/A'}
                                                                            <div className="text-[10px] text-slate-400">{c.bookingTime || ''}</div>
                                                                        </td>
                                                                        <td className="px-4 py-3 font-bold text-slate-700">₹{c.totalFee?.toLocaleString()}</td>
                                                                        <td className="px-4 py-3 text-right">
                                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                                                                c.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                                                                c.status === 'pending_payment' ? 'bg-amber-100 text-amber-700' :
                                                                                c.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                                                            }`}>
                                                                                {c.status?.replace('_', ' ')}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        </div>

                                        {/* Documents section */}
                                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col max-h-[300px]">
                                            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                                                <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-purple-500" />
                                                    Generated & Uploaded Documents ({selectedUserDetails.documents.length})
                                                </h4>
                                            </div>
                                            <div className="flex-1 overflow-y-auto">
                                                {selectedUserDetails.documents.length === 0 ? (
                                                    <div className="p-8 text-center text-slate-400 text-sm">
                                                        No documents generated by this user.
                                                    </div>
                                                ) : (
                                                    <table className="w-full text-left text-sm">
                                                        <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase shrink-0 sticky top-0 z-10">
                                                            <tr>
                                                                <th className="px-4 py-2">Document Title</th>
                                                                <th className="px-4 py-2">Type</th>
                                                                <th className="px-4 py-2">Date Created</th>
                                                                <th className="px-4 py-2 text-right">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {selectedUserDetails.documents.map((d: any) => (
                                                                <tr key={d._id} className="hover:bg-slate-50/50 transition-colors">
                                                                    <td className="px-4 py-3 font-semibold text-slate-800">{d.title}</td>
                                                                    <td className="px-4 py-3 text-slate-600 text-xs">{d.documentType}</td>
                                                                    <td className="px-4 py-3 text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-100 text-slate-700`}>
                                                                            {d.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                No user details loaded.
                            </div>
                        )}

                        {/* Modal Footer */}
                        <div className="p-4 bg-white border-t border-slate-100 flex justify-end shrink-0">
                            <button 
                                onClick={() => { setIsUserModalOpen(false); setSelectedUserDetails(null); }}
                                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
