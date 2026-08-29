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
import { Bell, CheckCircle2, MessageSquare, Calendar } from "lucide-react"
import { useState } from "react"

const initialNotifications = [
    {
        id: 1,
        title: "AI Review Complete for NDA_Draft.pdf",
        description: "3 risk factors identified and resolved. The document is now compliant with current regulations.",
        time: "12 minutes ago",
        icon: CheckCircle2,
        color: "text-green-500",
        bgColor: "bg-green-100",
        fullDetails: "The AI system has completed the review of 'NDA_Draft.pdf'. We identified 3 potential risk factors regarding liability clauses and jurisdiction. These have been automatically resolved based on your configured preferences. You can review the changes in the Document Review section.",
        read: false
    },
    {
        id: 2,
        title: "New Message from Adv. Mehta",
        description: "\"Please check the updated clause 4.2...\"",
        time: "45 minutes ago",
        icon: MessageSquare,
        color: "text-primary",
        bgColor: "bg-secondary/80",
        fullDetails: "Adv. Mehta sent: \"Please check the updated clause 4.2 regarding the termination period. I believe we should extend it to 60 days to better protect our interests. Let me know your thoughts.\"",
        read: false
    },
    {
        id: 3,
        title: "Consultation in 1 hour",
        description: "Client: Rajesh Kumar regarding IP registration.",
        time: "1 hour ago",
        icon: Calendar,
        color: "text-purple-500",
        bgColor: "bg-purple-100",
        fullDetails: "Upcoming video consultation with Rajesh Kumar regarding Intellectual Property registration for his new startup. Please ensure all preliminary documents are reviewed.",
        read: false
    },
]

export function Notifications() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [selectedNotification, setSelectedNotification] = useState<typeof initialNotifications[0] | null>(null);
    const [isInternalOpen, setIsInternalOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = (notification: typeof initialNotifications[0]) => {
        // Mark as read
        const updatedNotifications = notifications.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
        );
        setNotifications(updatedNotifications);

        // Open details
        setSelectedNotification(notification);
        setIsInternalOpen(true);
    };

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updatedNotifications);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
                        <span className="font-semibold text-sm">Recent Alerts</span>
                        {unreadCount > 0 && (
                            <span
                                className="text-xs text-primary font-medium cursor-pointer hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    markAllAsRead();
                                }}
                            >
                                MARK ALL AS READ
                            </span>
                        )}
                    </div>
                    <div className="py-2">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`items-start gap-3 p-3 cursor-pointer ${!notification.read ? 'bg-secondary/30' : ''}`}
                                onSelect={() => handleNotificationClick(notification)}
                            >
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notification.bgColor}`}>
                                    <notification.icon className={`h-4 w-4 ${notification.color}`} />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className={`text-sm leading-none ${!notification.read ? 'font-semibold text-black' : 'font-medium text-gray-700'}`}>
                                            {notification.title}
                                        </p>
                                        {!notification.read && <span className="h-1.5 w-1.5 bg-primary/90 rounded-full mt-1"></span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                                    <p className="text-[10px] text-gray-400">{notification.time}</p>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2 text-center">
                        <Button variant="ghost" size="sm" className="w-full text-xs text-gray-500 h-auto py-1.5" asChild>
                            <a href="/notifications">View All Notifications</a>
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isInternalOpen} onOpenChange={setIsInternalOpen}>
                <DialogContent className="sm:max-w-[425px]">
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
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {selectedNotification?.fullDetails || selectedNotification?.description}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsInternalOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
