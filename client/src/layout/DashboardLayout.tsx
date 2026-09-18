import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Mail, Settings, LayoutDashboard, FileText, CheckSquare, Folder, MessageSquare, ChevronLeft, ChevronRight, Users, CreditCard, Briefcase, Video, LifeBuoy } from "lucide-react"
import { useLocation, useNavigate } from 'react-router-dom';
import { Notifications } from "@/components/dashboard/Notifications"
import { DashboardSearch } from "@/components/dashboard/DashboardSearch"
import { Logo } from '@/components/brand/Logo';

interface DashboardLayoutProps {
    children: React.ReactNode;
    userNav: React.ReactNode;
}

export default function DashboardLayout({ children, userNav }: DashboardLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        document.title = "Vidhik AI - Client Dashboard";
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex min-h-screen bg-background overflow-x-hidden">
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white border-r flex flex-col transition-all duration-300 ease-in-out 
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 
                    ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-[248px]'} w-[248px]`}
            >
                <div className={`h-24 flex items-center border-b border-slate-200 relative ${isCollapsed ? 'lg:justify-center px-0' : 'px-4'} justify-between px-4`}>
                    <Logo isCollapsed={isCollapsed} className="h-20 w-full lg:block hidden" />
                    <Logo isCollapsed={false} className="h-20 w-full lg:hidden block" />

                    {/* Toggle Button for Desktop */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 transition-all focus:outline-none z-50 lg:flex hidden"
                    >
                        {isCollapsed ? <ChevronRight className="h-3 w-3 text-slate-600" /> : <ChevronLeft className="h-3 w-3 text-slate-600" />}
                    </button>

                    {/* Close Button for Mobile */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden p-2 rounded-md hover:bg-slate-100 focus:outline-none"
                        aria-label="Close menu"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </button>
                </div>

                <div className="flex-1 py-6 space-y-1 overflow-y-auto px-3">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/dashboard'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={isCollapsed ? "Dashboard" : ""}
                        onClick={() => navigate('/dashboard')}
                    >
                        <LayoutDashboard className="h-5 w-5 shrink-0" />
                        <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Dashboard</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/document-generator'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={isCollapsed ? "AI Document Generator" : ""}
                        onClick={() => navigate('/document-generator')}
                    >
                        <FileText className="h-5 w-5 shrink-0" />
                        <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>AI Document Generator</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/documents/review'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={isCollapsed ? "Document Review" : ""}
                        onClick={() => navigate('/documents/review')}
                    >
                        <CheckSquare className="h-5 w-5 shrink-0" />
                        <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Document Review</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/documents/workspace'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={isCollapsed ? "My Documents" : ""}
                        onClick={() => navigate('/documents/workspace')}
                    >
                        <Folder className="h-5 w-5 shrink-0" />
                        <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>My Documents</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/research'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={isCollapsed ? "Ask Legal Question" : ""}
                        onClick={() => navigate('/research')}
                    >
                        <MessageSquare className="h-5 w-5 shrink-0" />
                        <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Ask Legal Question</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/lawyers'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={isCollapsed ? "Lawyer List" : ""}
                        onClick={() => navigate('/lawyers')}
                    >
                        <Users className="h-5 w-5 shrink-0" />
                        <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Lawyer List</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/cases'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={isCollapsed ? "Case Management" : ""}
                        onClick={() => navigate('/cases')}
                    >
                        <Briefcase className="h-5 w-5 shrink-0" />
                        <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Case Management</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/consultations'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={isCollapsed ? "Live Consultations" : ""}
                        onClick={() => navigate('/consultations')}
                    >
                        <Video className="h-5 w-5 shrink-0" />
                        <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Live Consultations</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/billing'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={isCollapsed ? "Billing & Plans" : ""}
                        onClick={() => navigate('/billing')}
                    >
                        <CreditCard className="h-5 w-5 shrink-0" />
                        <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Billing & Plans</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/support' || location.pathname.startsWith('/support')
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={isCollapsed ? "Support Tickets" : ""}
                        onClick={() => navigate('/support')}
                    >
                        <LifeBuoy className="h-5 w-5 shrink-0" />
                        <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Support Tickets</span>
                    </Button>

                    <div className="pt-4 mt-4 border-t border-slate-200">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/settings'
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                            title={isCollapsed ? "Settings" : ""}
                            onClick={() => navigate('/settings')}
                        >
                            <Settings className="h-5 w-5 shrink-0" />
                            <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Settings</span>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`flex flex-col w-full transition-all duration-300 ease-in-out pl-0 ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[248px]'
                    }`}
            >
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 gap-4">
                    <div className="flex items-center gap-2 lg:gap-0 w-full max-w-md">
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

                        {/* Back Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="mr-2 text-slate-600 hover:bg-slate-100 shrink-0"
                            aria-label="Go Back"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>

                        <div className="relative w-full">
                            <DashboardSearch />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        <Notifications />
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 h-9 w-9 hidden sm:flex">
                            <Mail className="h-5 w-5" />
                        </Button>
                        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-900 leading-none">
                                    {JSON.parse(localStorage.getItem('user_profile_data') || '{}').fullName || 'User'}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium mt-1">
                                    {JSON.parse(localStorage.getItem('user_profile_data') || '{}').designation || 'Legal Member'}
                                </p>
                            </div>
                            {userNav}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-8 bg-background">
                    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
