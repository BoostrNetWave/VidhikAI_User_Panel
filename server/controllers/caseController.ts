import { Response } from 'express';
import Case from '../models/Case';
import User from '../models/User';
import Signal from '../models/Signal';
import UsageRecord from '../models/UsageRecord';
import SystemConfig from '../models/SystemConfig';
import { sendEmail } from '../utils/emailService';

export const getCasesForClient = async (req: any, res: Response): Promise<void> => {
    try {
        const cases = await Case.find({ client: req.user._id })
            .populate('lawyer', 'fullName email phone location title expertise avatar')
            .sort({ createdAt: -1 });
        res.json(cases);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCaseById = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const kase = await Case.findOne({ _id: id, client: req.user._id })
            .populate('lawyer', 'fullName email phone location title expertise avatar');

        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }
        res.json(kase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const approvePlan = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const kase = await Case.findOneAndUpdate(
            { _id: id, client: req.user._id },
            { $set: { planApproved: true } },
            { new: true }
        ).populate('lawyer', 'fullName email phone location title expertise avatar');

        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        res.json(kase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const hireLawyer = async (req: any, res: Response): Promise<void> => {
    try {
        const { lawyerId, title, description, totalFee } = req.body;

        if (!lawyerId || !title || !description || !totalFee) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const lawyerUser = await User.findOne({ _id: lawyerId, role: 'lawyer' });
        if (!lawyerUser) {
            res.status(404).json({ message: 'Lawyer not found' });
            return;
        }

        // Subscription limits are disabled: lawyers enjoy unlimited case capacity
        const lawyerPlanName = lawyerUser.subscription || 'Free';
        const plansConfig = await SystemConfig.findOne({ key: 'LAWYER_PRICING_PLANS' });
        let activeCasesLimit = 999999;
        if (plansConfig && Array.isArray(plansConfig.value)) {
            const plan = plansConfig.value.find(
                (p: any) => p.name.toLowerCase() === lawyerPlanName.toLowerCase()
            ) || plansConfig.value.find((p: any) => p.name.toLowerCase() === 'free');
            if (plan && plan.limits && plan.limits.activeCases !== undefined) {
                activeCasesLimit = Number(plan.limits.activeCases);
            }
        }
        // Unlimited mode: no limit block enforced for lawyers

        const newCase = await Case.create({
            title,
            description,
            client: req.user._id,
            lawyer: lawyerId,
            status: 'active',
            totalFee: Number(totalFee),
            currentProgress: 0,
            planSubmitted: false,
            planApproved: false,
            milestones: []
        });

        res.status(201).json(newCase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const bookLawyer = async (req: any, res: Response): Promise<void> => {
    try {
        const { lawyerId, title, description, bookingDate, bookingTime, totalFee } = req.body;

        if (!lawyerId || !title || !description || !bookingDate || !bookingTime || !totalFee) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const lawyerUser = await User.findOne({ _id: lawyerId, role: 'lawyer' });
        if (!lawyerUser) {
            res.status(404).json({ message: 'Lawyer not found' });
            return;
        }

        // Subscription limits are disabled: lawyers enjoy unlimited case capacity
        const lawyerPlanName = lawyerUser.subscription || 'Free';
        const plansConfig = await SystemConfig.findOne({ key: 'LAWYER_PRICING_PLANS' });
        let activeCasesLimit = 999999;
        if (plansConfig && Array.isArray(plansConfig.value)) {
            const plan = plansConfig.value.find(
                (p: any) => p.name.toLowerCase() === lawyerPlanName.toLowerCase()
            ) || plansConfig.value.find((p: any) => p.name.toLowerCase() === 'free');
            if (plan && plan.limits && plan.limits.activeCases !== undefined) {
                activeCasesLimit = Number(plan.limits.activeCases);
            }
        }
        // Unlimited mode: no limit block enforced for lawyers

        const roomName = `vidhik-meet-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
        const meetingLink = `https://jitsi.hamburg.ccc.de/${roomName}`;

        const newCase = await Case.create({
            title,
            description,
            client: req.user._id,
            lawyer: lawyerId,
            status: 'pending_lawyer',
            totalFee: Number(totalFee),
            bookingDate: new Date(bookingDate),
            bookingTime,
            meetingLink,
            currentProgress: 0,
            planSubmitted: false,
            planApproved: false,
            milestones: []
        });

        // Send Email to Lawyer
        await sendEmail(
            lawyerUser.email,
            `New Case Consultation Request: ${title}`,
            `<h3>New Case Booking Request</h3>
             <p>Hello Adv. ${lawyerUser.fullName},</p>
             <p>You have received a new consultation and case booking request from <strong>${req.user.fullName}</strong>.</p>
             <p><strong>Topic:</strong> ${title}</p>
             <p><strong>Description:</strong> ${description}</p>
             <p><strong>Proposed Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</p>
             <p><strong>Proposed Time:</strong> ${bookingTime}</p>
             <p><strong>Fee:</strong> ₹${Number(totalFee).toLocaleString()}</p>
             <p>Please log in to your lawyer dashboard under Case Management to view and confirm this booking request.</p>`
        );

        // Log usage in UsageRecord
        await UsageRecord.create({
            userId: req.user._id,
            featureType: 'lawyer_booking'
        });

        res.status(201).json(newCase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const payAndConfirmCase = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const kase = await Case.findOneAndUpdate(
            { _id: id, client: req.user._id, status: 'pending_payment' },
            { $set: { status: 'active' } },
            { new: true }
        ).populate('lawyer', 'fullName email phone location title expertise avatar');

        if (!kase) {
            res.status(404).json({ message: 'Case not found or not in pending payment status' });
            return;
        }

        // Send confirmation email to lawyer
        await sendEmail(
            (kase.lawyer as any).email,
            `Booking Payment Confirmed: ${kase.title}`,
            `<h3>Consultation Payment Confirmed</h3>
             <p>Hello Adv. ${(kase.lawyer as any).fullName},</p>
             <p>The client <strong>${req.user.fullName}</strong> has successfully completed the payment for the case: <strong>${kase.title}</strong>.</p>
             <p><strong>Proposed Consultation Date:</strong> ${kase.bookingDate ? new Date(kase.bookingDate).toLocaleDateString() : 'N/A'}</p>
             <p><strong>Proposed Consultation Time:</strong> ${kase.bookingTime || 'N/A'}</p>
             <p><strong>Consultation Meeting Link:</strong> <a href="${kase.meetingLink}">${kase.meetingLink}</a></p>
             <p>This engagement is now <strong>Active</strong>. You can now log in to your dashboard to join the consultation or upload your roadmap.</p>`
        );

        // Send confirmation email to client
        await sendEmail(
            req.user.email,
            `Consultation Confirmed: ${kase.title}`,
            `<h3>Consultation Booking Confirmed</h3>
             <p>Hello ${req.user.fullName},</p>
             <p>Your payment for the case: <strong>${kase.title}</strong> with Advocate <strong>${(kase.lawyer as any).fullName}</strong> has been successfully processed.</p>
             <p><strong>Consultation Date:</strong> ${kase.bookingDate ? new Date(kase.bookingDate).toLocaleDateString() : 'N/A'}</p>
             <p><strong>Consultation Time:</strong> ${kase.bookingTime || 'N/A'}</p>
             <p><strong>Consultation Meeting Link:</strong> <a href="${kase.meetingLink}">${kase.meetingLink}</a></p>
             <p>Please click the link above or log in to your dashboard to join the video consultation at the scheduled time.</p>`
        );

        res.json(kase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const joinMeeting = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const kase = await Case.findOneAndUpdate(
            { _id: id, client: req.user._id },
            { $set: { meetingJoinedByClient: true } },
            { new: true }
        ).populate('lawyer', 'fullName email phone location title expertise avatar');

        if (!kase) {
            res.status(404).json({ message: 'Case not found or unauthorized' });
            return;
        }
        res.json(kase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const sendSignal = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { sender, type, sdp, candidate } = req.body;

        if (!sender || !type) {
            res.status(400).json({ message: 'Sender and type are required' });
            return;
        }

        const signal = await Signal.create({
            caseId: id,
            sender,
            type,
            sdp,
            candidate: typeof candidate === 'string' ? candidate : JSON.stringify(candidate)
        });

        res.status(201).json(signal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getSignals = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const signals = await Signal.find({ caseId: id }).sort({ createdAt: 1 });
        res.json(signals);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const clearSignals = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await Signal.deleteMany({ caseId: id });
        res.json({ message: 'Signals cleared successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCase = async (req: any, res: Response): Promise<void> => {
    try {
        const { title, description, category, court, filingNumber, nextHearingDate, priority, lawyerId, totalFee } = req.body;

        if (!title || !description) {
            res.status(400).json({ message: 'Title and description are required to create a case' });
            return;
        }

        const newCase = await Case.create({
            title: title.trim(),
            description: description.trim(),
            client: req.user._id,
            lawyer: lawyerId || undefined,
            category: category || 'General Legal',
            court: court || '',
            filingNumber: filingNumber || `CAS-${Math.floor(100000 + Math.random() * 900000)}`,
            nextHearingDate: nextHearingDate ? new Date(nextHearingDate) : undefined,
            priority: priority || 'medium',
            status: lawyerId ? 'pending_lawyer' : 'active',
            totalFee: Number(totalFee) || 0,
            currentProgress: 0,
            planSubmitted: false,
            planApproved: false,
            milestones: [],
            notes: [],
            documents: []
        });

        const populated = await Case.findById(newCase._id)
            .populate('lawyer', 'fullName email phone location title expertise avatar');

        res.status(201).json(populated);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addCaseNote = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            res.status(400).json({ message: 'Note text cannot be empty' });
            return;
        }

        const kase = await Case.findOne({ _id: id, client: req.user._id })
            .populate('lawyer', 'fullName email phone location title expertise avatar');
        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        kase.notes = kase.notes || [];
        kase.notes.push({
            text: text.trim(),
            createdAt: new Date(),
            createdBy: req.user.fullName || 'Client'
        });

        await kase.save();
        res.json(kase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


