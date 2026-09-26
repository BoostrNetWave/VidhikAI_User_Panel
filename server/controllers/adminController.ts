import { Request, Response } from 'express';
import SystemConfig from '../models/SystemConfig';
import User from '../models/User';
import Case from '../models/Case';
import SupportTicket from '../models/SupportTicket';
import DocumentModel from '../models/Document';
import LiveConsultation from '../models/LiveConsultation';
import LoginHistory from '../models/LoginHistory';
import { emitToUser } from '../socket';
import { sendEmail } from '../utils/emailService';
import CreditService, { PLAN_CREDIT_ALLOCATIONS } from '../services/creditService';
import UsageRecord from '../models/UsageRecord';
import Transaction from '../models/Transaction';
/**
 * Admin Controller
 * Handles all requests from the Super Admin Panel
 */

// @desc    Get all system configurations
// @route   GET /api/admin/config
export const getConfigs = async (_req: Request, res: Response) => {
    try {
        const configs = await SystemConfig.find({});
        res.json(configs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching configurations' });
    }
};

// @desc    Update a specific configuration
// @route   PUT /api/admin/config
export const updateConfig = async (req: Request, res: Response) => {
    try {
        const { key, value } = req.body;
        
        const config = await SystemConfig.findOneAndUpdate(
            { key },
            { value },
            { new: true }
        );

        if (!config) {
            return res.status(404).json({ message: 'Configuration not found' });
        }

        res.json({ message: 'Configuration updated successfully', config });
    } catch (error) {
        res.status(500).json({ message: 'Error updating configuration' });
    }
};

// @desc    Get all users on the platform (Lawyers & Clients)
// @route   GET /api/admin/users
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// @desc    Get pending lawyers for approval
// @route   GET /api/admin/pending-lawyers
export const getPendingLawyers = async (_req: Request, res: Response) => {
    try {
        const lawyers = await User.find({ role: 'lawyer', isApproved: false }).select('-password');
        res.json(lawyers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending lawyers' });
    }
};

// @desc    Approve a lawyer
// @route   POST /api/admin/approve-lawyer/:id
export const approveLawyer = async (req: Request, res: Response) => {
    try {
        const lawyer = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );

        if (!lawyer) {
            return res.status(404).json({ message: 'Lawyer not found' });
        }

        res.json({ message: 'Lawyer approved successfully', lawyer });
    } catch (error) {
        res.status(500).json({ message: 'Error approving lawyer' });
    }
};

// @desc    Manually verify a user (Email verification)
// @route   POST /api/admin/verify-user/:id
export const verifyUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User verified successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying user' });
    }
};

// @desc    Get all APPROVED lawyers for public list
// @route   GET /api/admin/public/lawyers
export const getPublicLawyers = async (_req: Request, res: Response) => {
    try {
        const lawyers = await User.find({ role: 'lawyer' }).select('-password');
        res.json(lawyers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lawyers' });
    }
};

// @desc    Get all cases on the platform
// @route   GET /api/admin/cases
export const getAllCases = async (_req: Request, res: Response) => {
    try {
        const cases = await Case.find({})
            .populate('client', 'fullName email')
            .populate('lawyer', 'fullName email bankName accountNumber ifsc')
            .sort({ createdAt: -1 });
        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cases' });
    }
};

// @desc    Approve payout for a case milestone
// @route   POST /api/admin/cases/:id/milestones/:index/approve-payout
export const approveMilestonePayout = async (req: Request, res: Response) => {
    try {
        const { id, index } = req.params;
        const milestoneIndex = parseInt(index);

        const kase = await Case.findById(id);
        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        if (isNaN(milestoneIndex) || milestoneIndex < 0 || milestoneIndex >= kase.milestones.length) {
            res.status(400).json({ message: 'Invalid milestone index' });
            return;
        }

        kase.milestones[milestoneIndex].payoutStatus = 'approved';
        await kase.save();

        res.json({ message: 'Payout approved successfully', kase });
    } catch (error) {
        res.status(500).json({ message: 'Error approving milestone payout' });
    }
};

// @desc    Reject payout for a case milestone
// @route   POST /api/admin/cases/:id/milestones/:index/reject-payout
export const rejectMilestonePayout = async (req: Request, res: Response) => {
    try {
        const { id, index } = req.params;
        const milestoneIndex = parseInt(index);

        const kase = await Case.findById(id);
        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        if (isNaN(milestoneIndex) || milestoneIndex < 0 || milestoneIndex >= kase.milestones.length) {
            res.status(400).json({ message: 'Invalid milestone index' });
            return;
        }

        kase.milestones[milestoneIndex].payoutStatus = 'rejected';
        await kase.save();

        res.json({ message: 'Payout rejected successfully', kase });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting milestone payout' });
    }
};

// @desc    Get single lawyer profile by ID
// @route   GET /api/admin/public/lawyers/:id
export const getPublicLawyerById = async (req: Request, res: Response) => {
    try {
        const lawyer = await User.findOne({ 
            _id: req.params.id, 
            role: 'lawyer'
        }).select('-password');
        if (!lawyer) {
            res.status(404).json({ message: 'Lawyer not found' });
            return;
        }
        res.json(lawyer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lawyer profile' });
    }
};

// @desc    Get all support tickets
// @route   GET /api/admin/tickets
export const getAllTickets = async (_req: Request, res: Response) => {
    try {
        const tickets = await SupportTicket.find({}).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching support tickets' });
    }
};

// @desc    Reply to a support ticket and update status
// @route   POST /api/admin/tickets/:id/reply
export const replyToTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { adminReply, text, status } = req.body;
        const replyMessage = (text || adminReply || '').trim();

        const ticket = await SupportTicket.findById(id);

        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        if (replyMessage) {
            ticket.messages.push({
                sender: 'admin',
                senderName: 'Support Team',
                message: replyMessage,
                createdAt: new Date()
            } as any);
            ticket.adminReply = replyMessage;
        }

        if (status && status !== ticket.status) {
            ticket.status = status;
            ticket.statusHistory.push({
                status: status as any,
                changedBy: 'admin',
                changedAt: new Date(),
                note: replyMessage ? 'Status updated with admin reply' : 'Status updated by admin'
            } as any);
        }

        ticket.updatedAt = new Date();
        const savedTicket = await ticket.save();

        // Emit real-time notification to the customer
        if (ticket.userId) {
            emitToUser(ticket.userId.toString(), 'TICKET_UPDATED', savedTicket);
            emitToUser(ticket.userId.toString(), 'NEW_TICKET_REPLY', {
                ticketId: ticket.ticketId,
                message: replyMessage,
                status: ticket.status
            });
        }

        res.json({ message: 'Ticket updated successfully', ticket: savedTicket });
    } catch (error) {
        console.error('Error updating support ticket:', error);
        res.status(500).json({ message: 'Error updating support ticket' });
    }
};

// @desc    Get all generated documents
// @route   GET /api/admin/documents
export const getAllDocuments = async (_req: Request, res: Response) => {
    try {
        const docs = await DocumentModel.find({})
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents' });
    }
};

// @desc    Get complete details of a single user (including cases, documents)
// @route   GET /api/admin/users/:id/details
export const getUserDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Fetch bookings/cases depending on role
        let cases = [];
        if (user.role === 'lawyer') {
            cases = await Case.find({ lawyer: id }).populate('client', 'fullName email phone');
        } else {
            cases = await Case.find({ client: id }).populate('lawyer', 'fullName email title expertise');
        }

        // Fetch documents
        const documents = await DocumentModel.find({ userId: id }).select('title documentType status createdAt');

        res.json({
            user,
            cases,
            documents
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details' });
    }
};

// @desc    Update a user's subscription plan
// @route   POST /api/admin/users/:id/subscription
export const updateUserSubscription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { subscription } = req.body;

        // Normalize the plan name to match system plan names (Free, Starter, Growth, Enterprise)
        const planNormalized = (() => {
            const raw = (subscription || '').toString().trim().toLowerCase();
            if (raw === 'free') return 'Free';
            if (raw === 'starter' || raw === 'pro' || raw === 'professional') return 'Starter';
            if (raw === 'growth' || raw === 'business') return 'Growth';
            if (raw === 'enterprise') return 'Enterprise';
            // fallback: capitalize first letter
            return subscription.charAt(0).toUpperCase() + subscription.slice(1);
        })();

        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const previousPlan = user.subscription || 'Free';

        // Allocate the correct credits for the new plan
        const newQuota = PLAN_CREDIT_ALLOCATIONS[planNormalized] ?? 30;

        user.subscription = planNormalized;
        user.monthlyCredits = newQuota;
        user.subscriptionStartedAt = new Date();
        user.subscriptionRenewsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        // Keep extra credits intact; recalculate total
        user.aiCredits = newQuota + (user.extraCredits || 0);
        await user.save();

        // Audit ledger entry
        await UsageRecord.create({
            userId: user._id,
            featureType: 'subscription_grant',
            featureName: `Admin Plan Override: ${previousPlan} -> ${planNormalized}`,
            creditsUsed: 0,
            subscriptionPlan: planNormalized,
            notes: `Admin manually changed plan. Allocated ${newQuota} monthly credits.`
        });

        // Record an admin transaction for auditability
        await Transaction.create({
            userId: user._id,
            orderId: `admin_override_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type: 'plan_subscription',
            planName: planNormalized,
            billingCycle: 'monthly',
            amount: 0,
            currency: 'INR',
            status: 'paid',
            creditsGranted: newQuota,
            paymentMethod: 'admin_override',
            notes: { adminOverride: true, previousPlan }
        });

        // Emit real-time event to the specific user with full credit details
        emitToUser(id, 'SUBSCRIPTION_UPDATED', {
            subscription: planNormalized,
            monthlyCredits: user.monthlyCredits,
            extraCredits: user.extraCredits,
            aiCredits: user.aiCredits,
            renewsAt: user.subscriptionRenewsAt
        });

        const updatedUser = user.toObject();
        delete (updatedUser as any).password;

        res.json({ message: 'User subscription updated successfully', user: updatedUser });
    } catch (error) {
        console.error('[Admin] Error updating user subscription:', error);
        res.status(500).json({ message: 'Error updating user subscription' });
    }
};

// @desc    Suspend or unsuspend a user
// @route   POST /api/admin/users/:id/suspend
export const suspendUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isSuspended } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { isSuspended },
            { new: true }
        ).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (isSuspended) {
            emitToUser(id, 'USER_SUSPENDED', { message: 'Your account has been suspended.' });
        } else {
            emitToUser(id, 'USER_UNSUSPENDED', { message: 'Your account has been reactivated.' });
        }

        res.json({ message: `User ${isSuspended ? 'suspended' : 'unsuspended'} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: 'Error suspending/unsuspending user' });
    }
};

// @desc    Send custom email to user
// @route   POST /api/admin/users/:id/send-email
export const sendDirectEmail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { subject, body } = req.body;

        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Send email via utils
        await sendEmail(user.email, subject, body);

        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
};

// @desc    Request re-verification (Revoke current verification)
// @route   POST /api/admin/users/:id/reverify
export const reverifyUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndUpdate(
            id,
            { isVerified: false },
            { new: true }
        ).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        emitToUser(id, 'USER_VERIFICATION_REVOKED', { message: 'Admin requested re-verification of your account.' });

        // Here we could also generate OTP and send it via email.
        res.json({ message: 'Re-verification requested successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error requesting reverification' });
    }
};

// @desc    Get all live consultations
// @route   GET /api/admin/consultations
export const getAllConsultations = async (_req: Request, res: Response) => {
    try {
        const consultations = await LiveConsultation.find({})
            .populate('client', 'fullName email')
            .populate('lawyer', 'fullName email title expertise')
            .sort({ createdAt: -1 });
        res.json(consultations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultations' });
    }
};

// @desc    Get all login history
// @route   GET /api/admin/login-history
export const getLoginHistory = async (_req: Request, res: Response) => {
    try {
        const history = await LoginHistory.find({}).sort({ createdAt: -1 }).limit(200).populate('user', 'fullName email role');
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching login history' });
    }
};


