import { Response } from 'express';
import SupportTicket from '../models/SupportTicket';
import { saveFileToGridFS } from '../utils/gridfsStorage';
import { getEmailConfig, sendEmail } from '../utils/emailService';

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
            await saveFileToGridFS(req.file.filename, req.file.path, req.file.mimetype);
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
            await saveFileToGridFS(req.file.filename, req.file.path, req.file.mimetype);
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

/**
 * Submit Contact Us / Custom Plan Inquiry
 * Sends email directly to official SMTP mail and sends confirmation to user
 */
export const submitContactInquiry = async (req: any, res: Response) => {
    try {
        const {
            fullName,
            email,
            phone,
            organization,
            teamSize,
            creditRequirement,
            billingPreference,
            message,
            planName
        } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: 'Full name and email are required.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        const emailConfig = getEmailConfig();
        const officialEmail = emailConfig.user || 'noreply.vidhikai@gmail.com';

        const inquiryPlan = planName || 'Custom Enterprise Plan';
        const inquiryTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // 1. Email to Official SMTP Mail ID
        const adminSubject = `[Custom Plan / Billing Inquiry] New Request from ${fullName} - ${organization || 'Vidhik AI'}`;
        const adminHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
                    <h2 style="color: #0f172a; margin: 0; font-size: 22px;">New Custom Plan & Billing Inquiry</h2>
                    <p style="color: #64748b; margin: 6px 0 0 0; font-size: 13px;">Received via Vidhik AI Contact Portal on ${inquiryTime} IST</p>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                    <h3 style="color: #1e293b; margin: 0 0 14px 0; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Customer & Organization Details</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; width: 40%; font-weight: 600;">Full Name:</td>
                            <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Work Email:</td>
                            <td style="padding: 6px 0; color: #2563eb;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone / WhatsApp:</td>
                            <td style="padding: 6px 0; color: #0f172a;">${phone || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Organization / Law Firm:</td>
                            <td style="padding: 6px 0; color: #0f172a;">${organization || 'Individual / Not specified'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Team Size / Lawyers:</td>
                            <td style="padding: 6px 0; color: #0f172a;">${teamSize || 'Not specified'}</td>
                        </tr>
                    </table>
                </div>

                <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
                    <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 14px;">Billing & Resource Requirements</h3>
                    <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Plan of Interest:</strong> ${inquiryPlan}</p>
                    <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Preferred Billing Cycle:</strong> ${billingPreference || 'Standard / Flexible'}</p>
                    <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Estimated AI Usage:</strong> ${creditRequirement || 'Custom Volume'}</p>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="color: #1e293b; font-size: 14px; margin-bottom: 8px;">Customer Message / Specific Requirements:</h3>
                    <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px; font-size: 13px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">
                        ${message || 'No additional notes provided. Customer requested contact for custom billing.'}
                    </div>
                </div>

                <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 11px;">
                    This notification was automatically dispatched to official SMTP: ${officialEmail} by Vidhik AI Enterprise Gateway.
                </div>
            </div>
        `;

        // 2. Email Receipt to the Customer
        const customerSubject = `We Received Your Custom Plan Inquiry — Vidhik AI Enterprise Team`;
        const customerHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
                    <h2 style="color: #0f172a; margin: 0; font-size: 22px;">Thank You for Reaching Out</h2>
                    <p style="color: #64748b; margin: 6px 0 0 0; font-size: 13px;">Vidhik AI Enterprise & Custom Billing</p>
                </div>

                <p style="font-size: 14px; color: #334155; line-height: 1.6;">
                    Hello <strong>${fullName}</strong>,
                </p>
                <p style="font-size: 14px; color: #334155; line-height: 1.6;">
                    We have successfully received your inquiry regarding our <strong>${inquiryPlan}</strong>. Our enterprise billing and legal operations desk is reviewing your requirements and will reach out to you within 2–4 business hours.
                </p>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;">Summary of Submitted Details:</p>
                    <p style="margin: 4px 0; font-size: 13px; color: #1e293b;">• <strong>Organization:</strong> ${organization || 'Individual'}</p>
                    <p style="margin: 4px 0; font-size: 13px; color: #1e293b;">• <strong>Team Size:</strong> ${teamSize || 'N/A'}</p>
                    <p style="margin: 4px 0; font-size: 13px; color: #1e293b;">• <strong>Estimated Usage:</strong> ${creditRequirement || 'Custom Volume'}</p>
                </div>

                <p style="font-size: 13px; color: #475569; line-height: 1.5;">
                    If you have any immediate questions or additional documents to share, feel free to reply directly to this email or reach us at <a href="mailto:${officialEmail}" style="color: #2563eb;">${officialEmail}</a>.
                </p>

                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
                    Warm regards,<br/>
                    <strong>The Vidhik AI Enterprise Team</strong><br/>
                    <a href="https://vidhikai.com" style="color: #2563eb; text-decoration: none;">vidhikai.com</a>
                </div>
            </div>
        `;

        // Dispatch emails in parallel
        await Promise.allSettled([
            sendEmail(officialEmail, adminSubject, adminHtml),
            sendEmail(email, customerSubject, customerHtml)
        ]);

        // 3. Create a ticket in SupportTicket so admins can track it in AdminTickets.tsx
        try {
            const ticketId = `BILL-${Math.floor(100000 + Math.random() * 900000)}`;
            const ticketData: any = {
                ticketId,
                userId: req.user?._id ? req.user._id.toString() : 'guest',
                userName: fullName,
                userEmail: email,
                category: 'Billing & Payments',
                priority: 'High',
                subject: `[Custom Plan] ${fullName} - ${organization || 'Enterprise'}`,
                description: `Custom Plan Inquiry:\nOrganization: ${organization || 'N/A'}\nTeam Size: ${teamSize || 'N/A'}\nPlan: ${inquiryPlan}\nPhone: ${phone || 'N/A'}\nEstimated Usage: ${creditRequirement || 'N/A'}\nPreference: ${billingPreference || 'N/A'}\nMessage: ${message || 'N/A'}`,
                status: 'Open',
                messages: [{
                    sender: 'user',
                    senderName: fullName,
                    message: message || `Inquiry for ${inquiryPlan}`,
                    createdAt: new Date()
                }],
                statusHistory: [{
                    status: 'Open',
                    changedBy: 'user',
                    changedAt: new Date(),
                    note: 'Custom Plan Inquiry submitted'
                }]
            };
            await SupportTicket.create(ticketData);
        } catch (dbErr) {
            console.warn('[Contact Controller] Could not create ticket document:', dbErr);
        }

        return res.json({
            success: true,
            message: 'Your custom plan inquiry has been sent to our team. We will get back to you shortly!'
        });
    } catch (error: any) {
        console.error('[Contact Controller] Error processing contact inquiry:', error);
        return res.status(500).json({
            success: false,
            message: error?.message || 'Failed to submit inquiry. Please try again or email us directly.'
        });
    }
};
