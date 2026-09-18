import { Response } from 'express';
import SupportTicket from '../models/SupportTicket';

/**
 * Create a new support ticket (with optional attachment)
 */
export const createSupportTicket = async (req: any, res: Response) => {
    try {
        const { subject, category, priority, description } = req.body;
        const userId = req.user._id.toString();
        const userName = req.user.fullName || req.user.name || 'Customer';
        const userEmail = req.user.email || '';

        if (!subject || !description) {
            return res.status(400).json({
                success: false,
                error: 'Missing fields',
                message: 'Subject and description are required.'
            });
        }

        let attachment: string | undefined = undefined;
        let attachmentName: string | undefined = undefined;
        if (req.file) {
            attachment = `/uploads/${req.file.filename}`;
            attachmentName = req.file.originalname;
        }

        // Generate a clean ticket ID like TKT-829104
        const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

        const initialMessage = {
            sender: 'user' as const,
            senderName: userName,
            message: description.trim(),
            attachment,
            attachmentName,
            createdAt: new Date()
        };

        const initialHistory = {
            status: 'Open' as const,
            changedBy: 'user' as const,
            changedAt: new Date(),
            note: 'Ticket submitted by customer'
        };

        const newTicket = new SupportTicket({
            ticketId,
            userId,
            userName,
            userEmail,
            subject: subject.trim(),
            category: category || 'General',
            priority: priority || 'Medium',
            description: description.trim(),
            attachment,
            attachmentName,
            status: 'Open',
            messages: [initialMessage],
            statusHistory: [initialHistory]
        });

        const savedTicket = await newTicket.save();

        res.status(201).json({
            success: true,
            message: 'Support ticket submitted successfully.',
            data: savedTicket
        });
    } catch (error: any) {
        console.error('[Create Support Ticket] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create support ticket',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Get all support tickets submitted by the logged-in user
 */
export const getUserSupportTickets = async (req: any, res: Response) => {
    try {
        const userId = req.user._id.toString();
        const tickets = await SupportTicket.find({ userId }).sort({ updatedAt: -1, createdAt: -1 });

        res.json({
            success: true,
            data: tickets
        });
    } catch (error: any) {
        console.error('[Get Support Tickets] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch support tickets',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Get a single support ticket by Mongo ID or Ticket ID
 */
export const getTicketById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        let ticket = await SupportTicket.findById(id);
        if (!ticket) {
            ticket = await SupportTicket.findOne({ ticketId: id });
        }

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Support ticket not found.'
            });
        }

        // Verify customer ownership unless admin
        if (!isAdmin && ticket.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to this support ticket.'
            });
        }

        res.json({
            success: true,
            data: ticket
        });
    } catch (error: any) {
        console.error('[Get Ticket By Id] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch ticket details',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Customer replies to an existing support ticket
 */
export const replyToTicketAsCustomer = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const userId = req.user._id.toString();
        const userName = req.user.fullName || req.user.name || 'Customer';

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required to reply.'
            });
        }

        const ticket = await SupportTicket.findOne({
            $or: [{ _id: id }, { ticketId: id }],
            userId
        });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found or unauthorized.'
            });
        }

        if (ticket.status === 'Closed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot reply to a closed ticket. Please open a new ticket.'
            });
        }

        let attachment: string | undefined = undefined;
        let attachmentName: string | undefined = undefined;
        if (req.file) {
            attachment = `/uploads/${req.file.filename}`;
            attachmentName = req.file.originalname;
        }

        const newReply = {
            sender: 'user' as const,
            senderName: userName,
            message: message.trim(),
            attachment,
            attachmentName,
            createdAt: new Date()
        };

        ticket.messages.push(newReply as any);

        // If ticket was Waiting for Customer, auto transition back to In Progress
        if (ticket.status === 'Waiting for Customer') {
            ticket.status = 'In Progress';
            ticket.statusHistory.push({
                status: 'In Progress',
                changedBy: 'user',
                changedAt: new Date(),
                note: 'Customer replied - updated to In Progress'
            });
        }

        ticket.updatedAt = new Date();
        const savedTicket = await ticket.save();

        res.json({
            success: true,
            message: 'Reply sent successfully.',
            data: savedTicket
        });
    } catch (error: any) {
        console.error('[Reply to Ticket] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send reply',
            message: error?.message || 'Unknown error'
        });
    }
};
