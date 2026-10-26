import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "@/layout/DashboardLayout"
import { UserNav } from "@/components/dashboard/UserNav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Bell, 
    Briefcase, 
    Video, 
    Coins, 
    LifeBuoy, 
    ShieldCheck, 
    Check, 
    Trash2, 
    ExternalLink, 
    Clock, 
    Filter, 
    CheckCheck,
    BellOff,
    Loader2
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { getSocket } from "@/lib/socket"
import { INotificationItem } from "@/components/dashboard/Notifications"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<INotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('all');
    const [selectedNotification, setSelectedNotification] = useState<INotificationItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/notifications');
            if (res.data?.success && Array.isArray(res.data.notifications)) {
                setNotifications(res.data.notifications);
            }
        } catch (err: any) {
            console.error('Error fetching notifications:', err);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();

        const socket = getSocket();
        if (socket) {
            const handleNewNotif = (notif: INotificationItem) => {
                setNotifications(prev => [notif, ...prev]);
            };
            socket.on('NEW_NOTIFICATION', handleNewNotif);
            return () => {
                socket.off('NEW_NOTIFICATION', handleNewNotif);
            };
        }
    }, [fetchNotifications]);

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        try {
            await api.post('/notifications/mark-all-read');
            toast.success("All notifications marked as read");
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotificationItem = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n._id !== id));
        try {
            await api.delete(`/notifications/${id}`);
            toast.success("Notification removed");
        } catch (err) {
            console.error(err);
        }
    };

    const handleNotificationClick = (notification: INotificationItem) => {
        if (!notification.read) {
            setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, read: true } : n));
            api.patch(`/notifications/${notification._id}/read`).catch(console.error);
        }

        if (notification.link) {
            navigate(notification.link);
        } else {
            setSelectedNotification(notification);
            setIsDialogOpen(true);
        }
    };

    const getIconInfo = (type: string) => {
        switch (type) {
            case 'case':
                return {
                    icon: Briefcase,
                    label: 'Case Management',
                    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    iconBg: 'bg-indigo-100 text-indigo-600'
                };
            case 'consultation':
                return {
                    icon: Video,
                    label: 'Consultation',
                    badge: 'bg-violet-50 text-violet-700 border-violet-200',
                    iconBg: 'bg-violet-100 text-violet-600'
                };
            case 'credit':
                return {
                    icon: Coins,
                    label: 'Credits & Billing',
                    badge: 'bg-amber-50 text-amber-700 border-amber-200',
                    iconBg: 'bg-amber-100 text-amber-600'
                };
            case 'support':
                return {
                    icon: LifeBuoy,
                    label: 'Support',
                    badge: 'bg-sky-50 text-sky-700 border-sky-200',
                    iconBg: 'bg-sky-100 text-sky-600'
                };
            default:
                return {
                    icon: ShieldCheck,
                    label: 'System',
                    badge: 'bg-slate-50 text-slate-700 border-slate-200',
                    iconBg: 'bg-slate-100 text-slate-600'
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
            return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return '';
        }
    };

    const filtered = filterType === 'all' 
        ? notifications 
        : notifications.filter(n => n.type === filterType);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900">Notifications</h1>
                            {unreadCount > 0 && (
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
                                    {unreadCount} Unread
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                            Real-time updates regarding your active cases, live consultations, and AI credits.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="rounded-xl text-xs font-bold gap-1.5 h-9"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark All Read
                        </Button>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {[
                        { key: 'all', label: 'All Notifications', count: notifications.length },
                        { key: 'case', label: 'Cases', count: notifications.filter(n => n.type === 'case').length },
                        { key: 'consultation', label: 'Consultations', count: notifications.filter(n => n.type === 'consultation').length },
                        { key: 'credit', label: 'Credits', count: notifications.filter(n => n.type === 'credit').length },
                        { key: 'support', label: 'Support', count: notifications.filter(n => n.type === 'support').length }
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilterType(f.key)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                                filterType === f.key
                                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                            }`}
                        >
                            <span>{f.label}</span>
                            {f.count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                                    filterType === f.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {f.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                <p className="text-xs text-slate-400 font-semibold">Loading real-time notifications...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20 px-4 space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200/50">
                                    <BellOff className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">No notifications found</h3>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                    {filterType === 'all' 
                                        ? "You're all caught up! New alerts regarding your cases, video consultations, and credit usage will appear here." 
                                        : `No notifications found under the "${filterType}" category.`}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filtered.map((notification) => {
                                    const { icon: ItemIcon, label, badge, iconBg } = getIconInfo(notification.type);
                                    return (
                                        <div
                                            key={notification._id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-5 flex items-start gap-4 transition-all cursor-pointer group ${
                                                !notification.read 
                                                    ? 'bg-primary/[0.025] hover:bg-primary/[0.05]' 
                                                    : 'hover:bg-slate-50/80'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/50 ${iconBg} shadow-xs`}>
                                                <ItemIcon className="w-5 h-5" />
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={`text-sm tracking-tight ${!notification.read ? 'font-black text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge}`}>
                                                            {label}
                                                        </span>
                                                        {!notification.read && (
                                                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatRelativeTime(notification.createdAt)}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                                                    {notification.message}
                                                </p>

                                                {notification.link && (
                                                    <div className="pt-2">
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                                                            Open Details <ExternalLink className="w-3 h-3" />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={(e) => deleteNotificationItem(notification._id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0"
                                                title="Delete notification"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Inspection Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[440px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900">
                            {selectedNotification?.title}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-400">
                            {selectedNotification ? formatRelativeTime(selectedNotification.createdAt) : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {selectedNotification?.message}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
