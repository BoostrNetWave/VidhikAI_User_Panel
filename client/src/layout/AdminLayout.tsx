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
    Video,
    Search
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"


interface AdminLayoutProps {
    children: React.ReactNode;
    userNav: React.ReactNode;
}

export default function AdminLayout({ children, userNav }: AdminLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openCmd, setOpenCmd] = useState(false)

    useEffect(() => {
        document.title = "Vidhik AI - Super Admin Panel";
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpenCmd((open) => !open)
          }
        }
    
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

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
        { path: '/admin/login-history', label: 'Login History', icon: ShieldAlert },
        { path: '/admin/system', label: 'System Health', icon: Activity },
    ];

    const getBreadcrumb = () => {
        const current = adminLinks.find(link => location.pathname === link.path);
        return current ? current.label : 'Overview';
    }

    return (
        <div className="admin-theme flex min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground border-r border-border flex flex-col transition-all duration-300 ease-in-out 
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 
                    ${isCollapsed ? 'lg:w-[64px]' : 'lg:w-[240px]'} w-[240px]`}
            >
                <div className={`h-16 flex items-center border-b border-sidebar-foreground/10 relative ${isCollapsed ? 'lg:justify-center lg:px-0' : 'px-6'} justify-between px-6`}>
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-6 w-6 text-accent" />
                        <span className={`font-semibold text-sm tracking-tight text-white ${isCollapsed ? 'lg:hidden' : 'block'}`}>Vidhik Control</span>
                    </div>

                    {/* Close Button for Mobile */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden p-2 rounded-md hover:bg-sidebar-foreground/10 focus:outline-none"
                        aria-label="Close menu"
                    >
                        <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
                    </button>
                </div>

                <div className="flex-1 py-4 space-y-1 overflow-y-auto px-2">
                    {adminLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                        <button
                            key={link.path}
                            className={`w-full flex items-center gap-3 h-10 px-3 rounded-md transition-all group relative hover:bg-sidebar-foreground/10 hover:text-white
                                ${isActive ? 'text-white font-medium' : 'text-sidebar-foreground'}
                                ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}
                            `}
                            title={isCollapsed ? link.label : ""}
                            onClick={() => navigate(link.path)}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-accent rounded-r-sm" />
                            )}
                            <link.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-accent" : "text-sidebar-foreground group-hover:text-white")} />
                            <span className={`text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>{link.label}</span>
                        </button>
                    )})}

                    <div className="pt-4 mt-4 border-t border-sidebar-foreground/10">
                        <button
                            className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
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
                            <LogOut className="h-4 w-4 shrink-0" />
                            <span className={`text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Logout</span>
                        </button>
                    </div>
                </div>
                
                <div className={`p-4 bg-sidebar/50 border-t border-sidebar-foreground/10 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-sm bg-accent flex items-center justify-center text-accent-foreground font-semibold text-xs">
                            SA
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white leading-none">Super Admin</span>
                            <span className="text-xs text-sidebar-foreground mt-1">System Controller</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`flex flex-col w-full transition-all duration-300 ease-in-out pl-0 ${isCollapsed ? 'lg:pl-[64px]' : 'lg:pl-[240px]'}`}
            >
                {/* Topbar */}
                <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-40 gap-4">
                    <div className="flex items-center gap-4">
                        {/* Mobile Sidebar Toggle */}
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-1.5 rounded-md hover:bg-muted text-muted-foreground focus:outline-none shrink-0"
                            aria-label="Open menu"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <button onClick={toggleSidebar} className="p-1 hover:bg-muted rounded text-foreground">
                                {isCollapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}
                            </button>
                            <span>Admin</span>
                            <span className="text-border">/</span>
                            <span className="text-foreground">{getBreadcrumb()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <button 
                            onClick={() => setOpenCmd(true)}
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 border border-border rounded-md hover:bg-muted transition-colors w-64"
                        >
                            <Search className="h-4 w-4" />
                            <span>Search users, cases...</span>
                            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                        <button onClick={() => setOpenCmd(true)} className="sm:hidden p-2 text-muted-foreground hover:bg-muted rounded-md">
                            <Search className="h-5 w-5" />
                        </button>

                        <div className="h-6 w-px bg-border mx-1" />
                        {userNav}
                    </div>
                </header>

                <main className="flex-1 p-6 bg-background">
                    <div className="max-w-[1280px] mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>

            <CommandDialog open={openCmd} onOpenChange={setOpenCmd}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Quick Actions">
                        <CommandItem onSelect={() => { navigate('/admin/users'); setOpenCmd(false); }}>Go to Users</CommandItem>
                        <CommandItem onSelect={() => { navigate('/admin/cases'); setOpenCmd(false); }}>Go to Cases</CommandItem>
                        <CommandItem onSelect={() => { navigate('/admin/tickets'); setOpenCmd(false); }}>Go to Tickets</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    );
}

