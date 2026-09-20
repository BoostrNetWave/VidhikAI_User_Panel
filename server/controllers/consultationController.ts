import { Response } from 'express';
import LiveConsultation from '../models/LiveConsultation';
import User from '../models/User';
import { sendEmail } from '../utils/emailService';
import Signal from '../models/Signal';

export const createConsultation = async (req: any, res: Response): Promise<void> => {
    try {
        const { lawyerId, title, description, scheduledDate, scheduledTime, totalFee } = req.body;

        if (!lawyerId || !title || !description || !scheduledDate || !scheduledTime || !totalFee) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const lawyerUser = await User.findOne({ _id: lawyerId, role: 'lawyer' });
        if (!lawyerUser) {
            res.status(404).json({ message: 'Lawyer not found' });
            return;
        }

        const roomName = `vidhik-consult-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
        const meetingLink = `https://jitsi.hamburg.ccc.de/${roomName}`;

        const consultation = await LiveConsultation.create({
            title,
            description,
            client: req.user._id,
            lawyer: lawyerId,
            status: 'pending_lawyer_approval',
            scheduledDate: new Date(scheduledDate),
            scheduledTime,
            proposedBy: 'client',
            totalFee: Number(totalFee),
            meetingLink,
            documents: []
        });

        // Send Email to Lawyer
        await sendEmail(
            lawyerUser.email,
            `New Live Consultation Request: ${title}`,
            `<h3>New Live Consultation Request</h3>
             <p>Hello Adv. ${lawyerUser.fullName},</p>
             <p>You have received a new live consultation request from <strong>${req.user.fullName}</strong>.</p>
             <p><strong>Topic:</strong> ${title}</p>
             <p><strong>Description:</strong> ${description}</p>
             <p><strong>Proposed Date:</strong> ${new Date(scheduledDate).toLocaleDateString()}</p>
             <p><strong>Proposed Time:</strong> ${scheduledTime}</p>
             <p><strong>Fee:</strong> ₹${Number(totalFee).toLocaleString()}</p>
             <p>Please log in to your lawyer dashboard under Live Consultations to approve or propose a new time.</p>`
        );

        res.status(201).json(consultation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getConsultationsForClient = async (req: any, res: Response): Promise<void> => {
    try {
        const consultations = await LiveConsultation.find({ client: req.user._id })
            .populate('lawyer', 'fullName email phone location title expertise avatar')
            .sort({ createdAt: -1 });
        res.json(consultations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getConsultationById = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const consultation = await LiveConsultation.findOne({ _id: id, client: req.user._id })
            .populate('lawyer', 'fullName email phone location title expertise avatar')
            .populate('client', 'fullName email phone location');

        if (!consultation) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }
        res.json(consultation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const acceptConsultation = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const consultation = await LiveConsultation.findOne({ _id: id, client: req.user._id });

        if (!consultation) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }

        if (consultation.status !== 'pending_user_approval') {
            res.status(400).json({ message: 'No counter proposal pending client approval' });
            return;
        }

        consultation.status = 'pending_payment';
        await consultation.save();

        const lawyerUser = await User.findById(consultation.lawyer);
        if (lawyerUser) {
            await sendEmail(
                lawyerUser.email,
                `Consultation Counter-Proposal Accepted: ${consultation.title}`,
                `<h3>Counter-Proposal Accepted</h3>
                 <p>Hello Adv. ${lawyerUser.fullName},</p>
                 <p>The client <strong>${req.user.fullName}</strong> has accepted your proposed date and time for the consultation: <strong>${consultation.title}</strong>.</p>
                 <p><strong>Scheduled Date:</strong> ${new Date(consultation.scheduledDate).toLocaleDateString()}</p>
                 <p><strong>Scheduled Time:</strong> ${consultation.scheduledTime}</p>
                 <p>The consultation status is now pending client payment. You will be notified once payment is confirmed.</p>`
            );
        }

        res.json(consultation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const proposeConsultationTime = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { scheduledDate, scheduledTime } = req.body;

        if (!scheduledDate || !scheduledTime) {
            res.status(400).json({ message: 'Proposed date and time are required' });
            return;
        }

        const consultation = await LiveConsultation.findOne({ _id: id, client: req.user._id });
        if (!consultation) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }

        consultation.scheduledDate = new Date(scheduledDate);
        consultation.scheduledTime = scheduledTime;
        consultation.status = 'pending_lawyer_approval';
        consultation.proposedBy = 'client';

        await consultation.save();

        const lawyerUser = await User.findById(consultation.lawyer);
        if (lawyerUser) {
            await sendEmail(
                lawyerUser.email,
                `New Date/Time Proposed for Consultation: ${consultation.title}`,
                `<h3>Counter-Proposal from Client</h3>
                 <p>Hello Adv. ${lawyerUser.fullName},</p>
                 <p>The client <strong>${req.user.fullName}</strong> has proposed a new date and time for the consultation: <strong>${consultation.title}</strong>.</p>
                 <p><strong>Proposed Date:</strong> ${new Date(scheduledDate).toLocaleDateString()}</p>
                 <p><strong>Proposed Time:</strong> ${scheduledTime}</p>
                 <p>Please log in to your dashboard to accept or propose a different slot.</p>`
            );
        }

        res.json(consultation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const payAndConfirmConsultation = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const consultation = await LiveConsultation.findOne({ _id: id, client: req.user._id, status: 'pending_payment' })
            .populate('lawyer', 'fullName email')
            .populate('client', 'fullName email');

        if (!consultation) {
            res.status(404).json({ message: 'Consultation not found or not ready for payment' });
            return;
        }

        consultation.status = 'scheduled';
        await consultation.save();

        // Send confirmation emails
        await sendEmail(
            (consultation.lawyer as any).email,
            `Live Consultation Payment Confirmed: ${consultation.title}`,
            `<h3>Consultation Payment Confirmed</h3>
             <p>Hello Adv. ${(consultation.lawyer as any).fullName},</p>
             <p>The client <strong>${(consultation.client as any).fullName}</strong> has completed the payment for the live consultation: <strong>${consultation.title}</strong>.</p>
             <p><strong>Date:</strong> ${new Date(consultation.scheduledDate).toLocaleDateString()}</p>
             <p><strong>Time:</strong> ${consultation.scheduledTime}</p>
             <p><strong>Meeting Room Link:</strong> <a href="${consultation.meetingLink}">${consultation.meetingLink}</a></p>
             <p>Please log in to your lawyer dashboard at the scheduled time to join the video session.</p>`
        );

        await sendEmail(
            (consultation.client as any).email,
            `Live Consultation Scheduled & Confirmed: ${consultation.title}`,
            `<h3>Consultation Confirmed</h3>
             <p>Hello ${(consultation.client as any).fullName},</p>
             <p>Your payment for the live consultation <strong>${consultation.title}</strong> with Advocate <strong>${(consultation.lawyer as any).fullName}</strong> was confirmed.</p>
             <p><strong>Date:</strong> ${new Date(consultation.scheduledDate).toLocaleDateString()}</p>
             <p><strong>Time:</strong> ${consultation.scheduledTime}</p>
             <p><strong>Meeting Room Link:</strong> <a href="${consultation.meetingLink}">${consultation.meetingLink}</a></p>
             <p>You can join the video conference directly from your Client Dashboard under Live Consultations.</p>`
        );

        res.json(consultation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadConsultationDocument = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const consultation = await LiveConsultation.findOne({ _id: id, client: req.user._id });
        if (!consultation) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }

        const docUrl = `/uploads/${file.filename}`;
        consultation.documents.push({
            name: file.originalname,
            url: docUrl,
            uploadedBy: 'client',
            uploadedAt: new Date()
        });

        await consultation.save();
        res.json(consultation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelConsultation = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const consultation = await LiveConsultation.findOne({ _id: id, client: req.user._id });

        if (!consultation) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }

        consultation.status = 'cancelled';
        await consultation.save();

        const lawyerUser = await User.findById(consultation.lawyer);
        if (lawyerUser) {
            await sendEmail(
                lawyerUser.email,
                `Live Consultation Request Cancelled: ${consultation.title}`,
                `<h3>Consultation Cancelled</h3>
                 <p>Hello Adv. ${lawyerUser.fullName},</p>
                 <p>The client <strong>${req.user.fullName}</strong> has cancelled the consultation request: <strong>${consultation.title}</strong>.</p>`
            );
        }

        res.json(consultation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const sendConsultationSignal = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { sender, type, sdp, candidate } = req.body;

        const signal = await Signal.create({
            consultationId: id,
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

export const getConsultationSignals = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const signals = await Signal.find({ consultationId: id }).sort({ createdAt: 1 });
        res.json(signals);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const clearConsultationSignals = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await Signal.deleteMany({ consultationId: id });
        res.json({ message: 'Signals cleared successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

