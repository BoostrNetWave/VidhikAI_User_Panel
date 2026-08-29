import DashboardLayout from "@/layout/DashboardLayout"
import { UserNav } from "@/components/dashboard/UserNav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MessageSquare, Calendar, Trash2, Check, BellOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"

const initialNotifications = [
    {
        id: 1,
        title: "AI Review Complete for NDA_Draft.pdf",
        description: "3 risk factors identified and resolved. The document is now compliant with current regulations.",
        time: "12 minutes ago",
        type: "success",
        icon: CheckCircle2,
        color: "text-green-500",
        bgColor: "bg-green-100",
        read: false,
        fullDetails: "The AI system has completed the review of 'NDA_Draft.pdf'. We identified 3 potential risk factors regarding liability clauses and jurisdiction. These have been automatically resolved based on your configured preferences. You can review the changes in the Document Review section."
    },
    {
        id: 2,
        title: "New Message from Adv. Mehta",
        description: "\"Please check the updated clause 4.2 regarding the termination period...\"",
        time: "45 minutes ago",
        type: "info",
        icon: MessageSquare,
        color: "text-primary",
        bgColor: "bg-secondary/80",
        read: false,
        fullDetails: "Adv. Mehta sent: \"Please check the updated clause 4.2 regarding the termination period. I believe we should extend it to 60 days to better protect our interests. Let me know your thoughts.\""
    },
    {
        id: 3,
        title: "Consultation in 1 hour",
        description: "Client: Rajesh Kumar regarding IP registration. Prepare the initial filing documents.",
        time: "1 hour ago",
        type: "warning",
        icon: Calendar,
        color: "text-purple-500",
        bgColor: "bg-purple-100",
        read: false,
        fullDetails: "Upcoming video consultation with Rajesh Kumar regarding Intellectual Property registration for his new startup. Please ensure all preliminary documents are reviewed."
    },
    {
        id: 4,
        title: "Subscription Renewal Due",
        description: "Your Vidhik AI Pro subscription will renew in 3 days. Ensure payment method is up to date.",
        time: "2 days ago",
        type: "alert",
        icon: Calendar,
        color: "text-primary",
        bgColor: "bg-secondary",
        read: true,
        fullDetails: "Your Vidhik AI Pro subscription is set to renew automatically in 3 days. Please ensure your payment method on file is up to date to avoid any service interruption."
    },
    {
        id: 5,
        title: "Document Shared: Case_Brief_v1.docx",
        description: "Adv. Sharma has shared a new document for your review.",
        time: "3 days ago",
        type: "info",
        icon: MessageSquare,
        color: "text-primary",
        bgColor: "bg-secondary/80",
        read: true,
        fullDetails: "Adv. Sharma has shared 'Case_Brief_v1.docx' with you. Please review the document and provide your comments by the end of the week."
    }
]

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [selectedNotification, setSelectedNotification] = useState<typeof initialNotifications[0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updatedNotifications);
        toast.success("All notifications marked as read");
    };

    const clearAllRead = () => {
        const unreadNotifications = notifications.filter(n => !n.read);
        const readCount = notifications.length - unreadNotifications.length;

        if (readCount === 0) {
            toast.info("No read notifications to clear");
            return;
        }

        setNotifications(unreadNotifications);
        toast.success(`Cleared ${readCount} read notification${readCount !== 1 ? 's' : ''}`);
    };

    const handleNotificationClick = (notification: typeof initialNotifications[0]) => {
        // Mark as read if not already read
        if (!notification.read) {
            const updatedNotifications = notifications.map(n =>
                n.id === notification.id ? { ...n, read: true } : n
            );
            setNotifications(updatedNotifications);
        }

        setSelectedNotification(notification);
        setIsDialogOpen(true);
    };

    const hasReadNotifications = notifications.some(n => n.read);

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Notifications</h1>
                        <p className="text-gray-500">Stay updated with your latest alerts and activities.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={notifications.length === 0 || notifications.every(n => n.read)}>
                            <Check className="mr-2 h-4 w-4" />
                            Mark all as read
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={clearAllRead}
                            disabled={!hasReadNotifications}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear All
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {notifications.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                            <div className="flex justify-center mb-4">
                                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <BellOff className="h-6 w-6 text-gray-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-2">
                                You're all caught up! Check back later for new alerts and updates.
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`transition-all hover:shadow-md cursor-pointer ${!notification.read ? 'border-l-4 border-l-violet-500 bg-secondary/10' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notification.bgColor}`}>
                                        <notification.icon className={`h-5 w-5 ${notification.color}`} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-base font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {notification.title}
                                                {!notification.read && <Badge variant="secondary" className="ml-2 bg-secondary/80 text-primary hover:bg-secondary/80">New</Badge>}
                                            </p>
                                            <span className="text-xs text-gray-500">{notification.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                            {notification.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )))}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-4">
                            {selectedNotification && (
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${selectedNotification.bgColor}`}>
                                    <selectedNotification.icon className={`h-6 w-6 ${selectedNotification.color}`} />
                                </div>
                            )}
                            <DialogTitle>{selectedNotification?.title}</DialogTitle>
                        </div>
                        <DialogDescription>
                            {selectedNotification?.time}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {selectedNotification?.fullDetails || selectedNotification?.description}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
