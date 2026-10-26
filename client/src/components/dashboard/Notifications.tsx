import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
    Bell, 
    Briefcase, 
    Video, 
    Coins, 
    LifeBuoy, 
    ShieldCheck, 
    Check, 
    ExternalLink, 
    Loader2, 
    Clock, 
    Sparkles 
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { getSocket } from "@/lib/socket"
import { toast } from "sonner"

export interface INotificationItem {
    _id: string;
    userId: string;
    title: string;
    message: string;
    type: 'case' | 'consultation' | 'credit' | 'support' | 'system';
    link?: string;
    metadata?: Record<string, any>;
    read: boolean;
    createdAt: string;
}

export function Notifications() {
    const [notifications, setNotifications] = useState<INotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<INotificationItem | null>(null);
    const [isInternalOpen, setIsInternalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await api.get('/notifications');
            if (res.data?.success && Array.isArray(res.data.notifications)) {
                setNotifications(res.data.notifications);
            }
        } catch (err) {
            console.warn('[Notifications] Could not fetch real-time alerts:', err);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();

        // Listen to live WebSocket alerts
        const socket = getSocket();
        if (socket) {
            const handleNewNotif = (notif: INotificationItem) => {
                setNotifications(prev => [notif, ...prev]);
                toast.info(notif.title, {
                    description: notif.message,
                    action: notif.link ? {
                        label: 'View',
                        onClick: () => navigate(notif.link!)
                    } : undefined
                });
            };

            socket.on('NEW_NOTIFICATION', handleNewNotif);
            return () => {
                socket.off('NEW_NOTIFICATION', handleNewNotif);
            };
        }
    }, [fetchNotifications, navigate]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = async (notif: INotificationItem) => {
        // Optimistically mark as read
        if (!notif.read) {
            setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
            api.patch(`/notifications/${notif._id}/read`).catch(console.error);
        }

        if (notif.link) {
            navigate(notif.link);
        } else {
            setSelectedNotification(notif);
            setIsInternalOpen(true);
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        try {
            await api.post('/notifications/mark-all-read');
            toast.success('All notifications marked as read');
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const getIconInfo = (type: string) => {
        switch (type) {
            case 'case':
                return {
                    icon: Briefcase,
                    color: 'text-indigo-600',
                    bgColor: 'bg-indigo-50 border-indigo-200'
                };
            case 'consultation':
                return {
                    icon: Video,
                    color: 'text-violet-600',
                    bgColor: 'bg-violet-50 border-violet-200'
                };
            case 'credit':
                return {
                    icon: Coins,
                    color: 'text-amber-600',
                    bgColor: 'bg-amber-50 border-amber-200'
                };
            case 'support':
                return {
                    icon: LifeBuoy,
                    color: 'text-sky-600',
                    bgColor: 'bg-sky-50 border-sky-200'
                };
            default:
                return {
                    icon: ShieldCheck,
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50 border-emerald-200'
                };
        }
    };

    const formatRelativeTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMin = Math.floor(diffMs / (1000 * 60));
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);

            if (diffMin < 1) return 'Just now';
            if (diffMin < 60) return `${diffMin}m ago`;
            if (diffHour < 24) return `${diffHour}h ago`;
            if (diffDay < 7) return `${diffDay}d ago`;
            return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        } catch {
            return '';
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-full relative transition-all"
                        aria-label="View notifications"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-88 sm:w-96 p-0 rounded-2xl shadow-2xl border border-slate-200/80 bg-white" align="end" forceMount>
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm tracking-tight">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                className="text-xs text-primary font-bold hover:underline cursor-pointer transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    markAllAsRead();
                                }}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                            <div className="py-10 px-4 text-center space-y-2">
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-slate-700">All caught up!</p>
                                <p className="text-[11px] text-slate-400">No new alerts for cases, consultations, or credits.</p>
                            </div>
                        ) : (
                            notifications.slice(0, 7).map((item) => {
                                const { icon: ItemIcon, color, bgColor } = getIconInfo(item.type);
                                return (
                                    <DropdownMenuItem
                                        key={item._id}
                                        className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors outline-none ${
                                            !item.read ? 'bg-primary/[0.03] hover:bg-primary/[0.06]' : 'hover:bg-slate-50'
                                        }`}
                                        onSelect={() => handleNotificationClick(item)}
                                    >
                                        <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${bgColor}`}>
                                            <ItemIcon className={`h-4 w-4 ${color}`} />
                                        </div>
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-1">
                                                <p className={`text-xs truncate ${!item.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                                    {item.title}
                                                </p>
                                                {!item.read && (
                                                    <span className="h-1.5 w-1.5 bg-primary rounded-full shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                                {item.message}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5 font-medium">
                                                <Clock className="w-3 h-3" />
                                                <span>{formatRelativeTime(item.createdAt)}</span>
                                                {item.link && (
                                                    <span className="text-primary font-bold ml-auto flex items-center gap-0.5">
                                                        Open <ExternalLink className="w-2.5 h-2.5" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })
                        )}
                    </div>

                    <DropdownMenuSeparator className="m-0" />
                    <div className="p-2.5 bg-slate-50/50 text-center">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-xs font-bold text-slate-600 hover:text-primary hover:bg-white rounded-xl h-9" 
                            onClick={() => navigate('/notifications')}
                        >
                            View All Notifications
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Inspection Dialog if no link */}
            <Dialog open={isInternalOpen} onOpenChange={setIsInternalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            {selectedNotification && (() => {
                                const { icon: DialogIcon, color, bgColor } = getIconInfo(selectedNotification.type);
                                return (
                                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${bgColor}`}>
                                        <DialogIcon className={`h-5 w-5 ${color}`} />
                                    </div>
                                );
                            })()}
                            <DialogTitle className="text-base font-bold text-slate-900">
                                {selectedNotification?.title}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {selectedNotification ? formatRelativeTime(selectedNotification.createdAt) : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {selectedNotification?.message}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsInternalOpen(false)} className="rounded-xl">
                            Dismiss
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
