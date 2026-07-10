import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { 
    LayoutDashboard, 
    Users, 
    CreditCard, 
    ShieldAlert, 
    Globe, 
    Gavel, 
    ChevronLeft, 
    ChevronRight,
    LogOut,
    Activity,
    Briefcase,
    MessageSquare,
    FileText,
    Video
} from "lucide-react"
import { useLocation, useNavigate } from 'react-router-dom';


interface AdminLayoutProps {
    children: React.ReactNode;
    userNav: React.ReactNode;
}

export default function AdminLayout({ children, userNav }: AdminLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        document.title = "Vidhik AI - Super Admin Panel";
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const adminLinks = [
        { path: '/admin', label: 'Admin Overview', icon: LayoutDashboard },
        { path: '/admin/content', label: 'Website Content', icon: Globe },
        { path: '/admin/lawyers', label: 'Lawyer Approval', icon: Gavel },
        { path: '/admin/cases', label: 'Cases & Payouts', icon: Briefcase },
        { path: '/admin/consultations', label: 'Live Consultations', icon: Video },
        { path: '/admin/users', label: 'User Management', icon: Users },
        { path: '/admin/tickets', label: 'Support Tickets', icon: MessageSquare },
        { path: '/admin/documents', label: 'Client Documents', icon: FileText },
        { path: '/admin/payments', label: 'Financials', icon: CreditCard },
        { path: '/admin/system', label: 'System Health', icon: Activity },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-[#1e293b] text-slate-300 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out 
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 
                    ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
            >
                <div className={`h-24 flex items-center border-b border-slate-800 relative ${isCollapsed ? 'lg:justify-center lg:px-0' : 'px-6'} justify-between px-6`}>
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-purple-400" />
                        <span className={`font-bold text-lg text-white tracking-tight uppercase ${isCollapsed ? 'lg:hidden' : 'block'}`}>Admin Central</span>
                    </div>

                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-[#1e293b] border border-slate-700 rounded-full p-1 shadow-md hover:bg-slate-800 transition-all focus:outline-none z-50 lg:flex hidden"
                    >
                        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                    </button>

                    {/* Close Button for Mobile */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden p-2 rounded-md hover:bg-slate-800 focus:outline-none"
                        aria-label="Close menu"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 py-6 space-y-1 overflow-y-auto px-3">
                    <div className="px-3 mb-2">
                        <p className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest ${isCollapsed ? 'lg:hidden' : 'block'}`}>Management</p>
                    </div>
                    {adminLinks.map((link) => (
                        <Button
                            key={link.path}
                            variant="ghost"
                            className={`w-full justify-start gap-3 h-11 px-3 rounded-lg transition-all ${location.pathname === link.path
                                ? 'bg-purple-600/20 text-purple-400 border-l-2 border-purple-500'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                            title={isCollapsed ? link.label : ""}
                            onClick={() => navigate(link.path)}
                        >
                            <link.icon className="h-5 w-5 shrink-0" />
                            <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>{link.label}</span>
                        </Button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start gap-3 h-11 px-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                            onClick={() => {
                                localStorage.removeItem('user_auth_token');
                                localStorage.removeItem('user_profile_data');
                                localStorage.removeItem('vidhik_auth_token');
                                localStorage.removeItem('vidhik_user_data');
                                localStorage.removeItem('user_token');
                                localStorage.removeItem('user_data');
                                window.location.href = '/user/login';
                            }}
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Logout</span>
                        </Button>
                    </div>
                </div>
                
                <div className={`p-4 bg-slate-900/50 border-t border-slate-800 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs">
                            SA
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white leading-none">Super Admin</span>
                            <span className="text-[10px] text-slate-500 mt-1">System Controller</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`flex flex-col w-full transition-all duration-300 ease-in-out pl-0 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}
            >
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 gap-4">
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Mobile Sidebar Toggle */}
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-600 focus:outline-none shrink-0"
                            aria-label="Open menu"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="text-xs sm:text-sm font-medium text-slate-500">Global System Control Panel</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="hidden sm:inline">SYSTEM ONLINE</span>
                            <span className="sm:hidden">ONLINE</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 mx-0.5 sm:mx-1" />
                        {userNav}
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-8 bg-slate-50">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
