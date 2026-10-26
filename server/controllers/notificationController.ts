import { Response } from 'express';
import Notification, { INotification } from '../models/Notification';
import Case from '../models/Case';
import LiveConsultation from '../models/LiveConsultation';
import Transaction from '../models/Transaction';
import UsageRecord from '../models/UsageRecord';
import SupportTicket from '../models/SupportTicket';
import { emitToUser } from '../socket';

/**
 * Creates and saves a notification, then emits it in real-time via Socket.io
 */
export const createNotification = async (payload: {
    userId: string;
    userRole?: 'user' | 'lawyer' | 'admin';
    title: string;
    message: string;
    type: 'case' | 'consultation' | 'credit' | 'support' | 'system';
    link?: string;
    metadata?: Record<string, any>;
}): Promise<INotification | null> => {
    try {
        const notif = await Notification.create({
            userId: payload.userId.toString(),
            userRole: payload.userRole || 'user',
            title: payload.title,
            message: payload.message,
            type: payload.type,
            link: payload.link || '',
            metadata: payload.metadata || {},
            read: false
        });

        // Emit real-time WebSocket event
        emitToUser(payload.userId.toString(), 'NEW_NOTIFICATION', notif);

        return notif;
    } catch (err) {
        console.error('[Notification] Error creating notification:', err);
        return null;
    }
};

/**
 * Get all notifications for the authenticated user.
 * Intelligently synchronizes recent real activity (cases, consultations, credits, support)
 * so that users always see their accurate, real-time status.
 */
export const getNotifications = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();
        const userEmail = req.user?.email;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        // 1. Fetch existing stored notifications
        let stored = await Notification.find({
            $or: [{ userId }, { userId: userEmail }]
        }).sort({ createdAt: -1 }).limit(50);

        // 2. If stored count is low, auto-sync from real cases, consultations, and credit events
        if (stored.length < 5) {
            const syncedNotifs: any[] = [];

            // A. Cases
            const userCases = await Case.find({
                $or: [{ client: userId }, { clientEmail: userEmail }]
            }).sort({ updatedAt: -1 }).limit(5);

            for (const c of userCases) {
                const caseId = c._id.toString();
                const exists = stored.some(n => n.metadata?.caseId === caseId);
                if (!exists) {
                    const activeMilestone = c.milestones?.find((m: any) => m.status === 'in_progress' || m.status === 'under_review');
                    syncedNotifs.push({
                        userId,
                        userRole: 'user',
                        title: `Case: ${c.title || 'Legal Case'}`,
                        message: activeMilestone 
                            ? `Milestone "${activeMilestone.title}" is currently ${activeMilestone.status.replace('_', ' ')}.` 
                            : `Case status is currently ${c.status || 'Active'}.`,
                        type: 'case',
                        link: '/cases',
                        metadata: { caseId },
                        read: false,
                        createdAt: c.updatedAt || c.createdAt || new Date()
                    });
                }
            }

            // B. Live Consultations
            const consultations = await LiveConsultation.find({
                client: userId
            }).sort({ updatedAt: -1 }).limit(5);

            for (const consult of consultations) {
                const consultId = consult._id.toString();
                const exists = stored.some(n => n.metadata?.consultationId === consultId);
                if (!exists) {
                    const lawyerName = (consult.lawyer as any)?.fullName || 'Advocate';
                    const isLive = (consult.status as string) === 'in-progress' || (consult.status as string) === 'in_progress';
                    syncedNotifs.push({
                        userId,
                        userRole: 'user',
                        title: `Consultation: ${consult.title || 'Legal Session'}`,
                        message: isLive 
                            ? `Your video consultation with Adv. ${lawyerName} is currently LIVE. Join now!`
                            : `Consultation scheduled for ${consult.scheduledTime || 'Upcoming'}. Status: ${consult.status}.`,
                        type: 'consultation',
                        link: `/consultation-room/${consultId}`,
                        metadata: { consultationId: consultId },
                        read: false,
                        createdAt: consult.updatedAt || consult.createdAt || new Date()
                    });
                }
            }

            // C. Credits & Transactions
            const recentTransactions = await Transaction.find({
                userId
            }).sort({ createdAt: -1 }).limit(3);

            for (const tx of recentTransactions) {
                const txId = tx._id.toString();
                const exists = stored.some(n => n.metadata?.transactionId === txId);
                if (!exists) {
                    const isCredits = tx.type === 'extra_credits';
                    syncedNotifs.push({
                        userId,
                        userRole: 'user',
                        title: isCredits ? 'AI Credits Added' : 'Plan Upgrade / Payment',
                        message: `Successfully processed ${tx.creditsGranted || 0} AI credits (${tx.planName || 'Credits Refill'}).`,
                        type: 'credit',
                        link: '/billing',
                        metadata: { transactionId: txId },
                        read: true,
                        createdAt: tx.createdAt || new Date()
                    });
                }
            }

            // D. Support Tickets
            const userTickets = await SupportTicket.find({
                userId
            }).sort({ updatedAt: -1 }).limit(3);

            for (const ticket of userTickets) {
                const ticketId = ticket._id.toString();
                const exists = stored.some(n => n.metadata?.ticketId === ticketId);
                if (!exists) {
                    syncedNotifs.push({
                        userId,
                        userRole: 'user',
                        title: `Support Ticket #${ticket.ticketId || ticketId.slice(-6)}`,
                        message: `Ticket "${ticket.subject}" is currently marked as ${ticket.status}.`,
                        type: 'support',
                        link: '/support',
                        metadata: { ticketId },
                        read: ticket.status === 'Closed',
                        createdAt: ticket.updatedAt || ticket.createdAt || new Date()
                    });
                }
            }

            // Bulk insert newly synced notifications
            if (syncedNotifs.length > 0) {
                await Notification.insertMany(syncedNotifs);
                stored = await Notification.find({
                    $or: [{ userId }, { userId: userEmail }]
                }).sort({ createdAt: -1 }).limit(50);
            }
        }

        const unreadCount = stored.filter(n => !n.read).length;

        res.json({
            success: true,
            count: stored.length,
            unreadCount,
            notifications: stored
        });
    } catch (error: any) {
        console.error('[Notification Controller] getNotifications error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?._id?.toString();

        const notif = await Notification.findOneAndUpdate(
            { _id: id, userId },
            { read: true },
            { new: true }
        );

        if (!notif) {
            res.status(404).json({ success: false, message: 'Notification not found' });
            return;
        }

        res.json({ success: true, notification: notif });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Mark all notifications as read for the current user
 */
export const markAllAsRead = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();
        const userEmail = req.user?.email;

        await Notification.updateMany(
            { $or: [{ userId }, { userId: userEmail }], read: false },
            { read: true }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?._id?.toString();

        await Notification.findOneAndDelete({ _id: id, userId });
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
