import { Response } from 'express';
import LiveConsultation from '../models/LiveConsultation';
import User from '../models/User';
import Transaction from '../models/Transaction';
import razorpayService from '../services/razorpayService';
import { 
    sendEmail, 
    notifyConsultationCreated, 
    notifyConsultationConfirmed, 
    notifyConsultationStatusChange 
} from '../utils/emailService';
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

        // Send Email to Both Lawyer and Client
        await notifyConsultationCreated({
            clientEmail: req.user.email,
            clientName: req.user.fullName || 'Client',
            lawyerEmail: lawyerUser.email,
            lawyerName: lawyerUser.fullName || 'Lawyer',
            title,
            description,
            scheduledDate,
            scheduledTime,
            totalFee: Number(totalFee)
        });

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
        const userId = req.user._id || req.user.id;
        const query = req.user.role === 'admin'
            ? { _id: id }
            : { _id: id, $or: [{ client: userId }, { lawyer: userId }] };

        const consultation = await LiveConsultation.findOne(query)
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
            await notifyConsultationStatusChange({
                clientEmail: req.user.email,
                clientName: req.user.fullName || 'Client',
                lawyerEmail: lawyerUser.email,
                lawyerName: lawyerUser.fullName || 'Lawyer',
                title: consultation.title,
                status: 'accepted_by_client',
                scheduledDate: consultation.scheduledDate,
                scheduledTime: consultation.scheduledTime
            });
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
            await notifyConsultationStatusChange({
                clientEmail: req.user.email,
                clientName: req.user.fullName || 'Client',
                lawyerEmail: lawyerUser.email,
                lawyerName: lawyerUser.fullName || 'Lawyer',
                title: consultation.title,
                status: 'rescheduled_by_client',
                scheduledDate: consultation.scheduledDate,
                scheduledTime: consultation.scheduledTime
            });
        }

        res.json(consultation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createConsultationPaymentOrder = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const consultation = await LiveConsultation.findOne({ _id: id, client: req.user._id });

        if (!consultation) {
            res.status(404).json({ success: false, message: 'Consultation not found' });
            return;
        }

        const amount = consultation.totalFee || 1000;
        const receiptId = `rcpt_vdo_${Date.now().toString().slice(-8)}`;
        const notes = {
            userId: req.user._id.toString(),
            consultationId: consultation._id.toString(),
            type: 'video_consultation',
            title: consultation.title
        };

        const order = await razorpayService.createOrder(amount, receiptId, notes);

        await Transaction.create({
            userId: req.user._id,
            orderId: order.id,
            consultationId: consultation._id,
            type: 'video_consultation',
            amount,
            currency: 'INR',
            status: 'created',
            notes
        });

        res.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency || 'INR',
                keyId: razorpayService.getKeyId(),
                name: 'Vidhik AI Legal Consultations',
                description: `Live Video Consultation Fee: ${consultation.title}`,
                prefill: {
                    name: req.user.fullName,
                    email: req.user.email,
                    contact: req.user.phone || ''
                }
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const payAndConfirmConsultation = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

        const consultation = await LiveConsultation.findOne({ _id: id, client: req.user._id, status: 'pending_payment' })
            .populate('lawyer', 'fullName email')
            .populate('client', 'fullName email');

        if (!consultation) {
            res.status(404).json({ message: 'Consultation not found or not ready for payment' });
            return;
        }

        if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
            const isValid = razorpayService.verifyPaymentSignature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            );

            if (!isValid) {
                res.status(400).json({ message: 'Invalid Razorpay payment signature' });
                return;
            }

            await Transaction.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    status: 'paid',
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature,
                    paymentMethod: 'razorpay'
                }
            );
        } else {
            // Simulated test payment fallback
            const simOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            const simPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            await Transaction.create({
                userId: req.user._id,
                orderId: simOrderId,
                paymentId: simPaymentId,
                consultationId: consultation._id,
                type: 'video_consultation',
                amount: consultation.totalFee || 1000,
                currency: 'INR',
                status: 'paid',
                paymentMethod: 'simulated_test'
            });
        }

        consultation.status = 'scheduled';
        consultation.isPaidByUser = true;
        consultation.payoutStatus = 'pending';
        await consultation.save();

        // Send confirmation emails to both lawyer and client
        if (consultation.lawyer && consultation.client) {
            await notifyConsultationConfirmed({
                clientEmail: (consultation.client as any).email,
                clientName: (consultation.client as any).fullName || 'Client',
                lawyerEmail: (consultation.lawyer as any).email,
                lawyerName: (consultation.lawyer as any).fullName || 'Lawyer',
                title: consultation.title,
                scheduledDate: consultation.scheduledDate,
                scheduledTime: consultation.scheduledTime,
                meetingLink: consultation.meetingLink || ''
            });
        }

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
            await notifyConsultationStatusChange({
                clientEmail: req.user.email,
                clientName: req.user.fullName || 'Client',
                lawyerEmail: lawyerUser.email,
                lawyerName: lawyerUser.fullName || 'Lawyer',
                title: consultation.title,
                status: 'cancelled',
                cancelledBy: 'client'
            });
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

export const joinConsultation = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req.user._id || req.user.id).toString();

        const consultation = await LiveConsultation.findById(id);
        if (!consultation) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }

        if (consultation.status === 'completed' || consultation.status === 'cancelled') {
            res.status(400).json({ message: 'This consultation has ended and cannot be rejoined' });
            return;
        }

        const clientObjId = (consultation.client as any)?._id ? (consultation.client as any)._id.toString() : consultation.client.toString();
        const lawyerObjId = (consultation.lawyer as any)?._id ? (consultation.lawyer as any)._id.toString() : consultation.lawyer.toString();

        const isClient = clientObjId === userId;
        const isLawyer = lawyerObjId === userId;

        if (!isClient && !isLawyer && req.user.role !== 'admin') {
            res.status(403).json({ message: 'Unauthorized to join this consultation' });
            return;
        }

        if (isClient) {
            consultation.meetingJoinedByClient = true;
            if (!consultation.clientJoinedAt) {
                consultation.clientJoinedAt = new Date();
            }
        } else if (isLawyer) {
            consultation.meetingJoinedByLawyer = true;
            if (!consultation.lawyerJoinedAt) {
                consultation.lawyerJoinedAt = new Date();
            }
        }

        await consultation.save();

        const updated = await LiveConsultation.findById(id)
            .populate('client', 'fullName email phone location')
            .populate('lawyer', 'fullName email phone location title expertise avatar');

        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const endConsultation = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { meetingNotes, meetingSummary } = req.body;
        const userId = (req.user._id || req.user.id).toString();

        const consultation = await LiveConsultation.findById(id);
        if (!consultation) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }

        const clientObjId = (consultation.client as any)?._id ? (consultation.client as any)._id.toString() : consultation.client.toString();
        const lawyerObjId = (consultation.lawyer as any)?._id ? (consultation.lawyer as any)._id.toString() : consultation.lawyer.toString();

        const isClient = clientObjId === userId;
        const isLawyer = lawyerObjId === userId;

        if (!isClient && !isLawyer && req.user.role !== 'admin') {
            res.status(403).json({ message: 'Unauthorized to end this consultation' });
            return;
        }

        consultation.status = 'completed';
        consultation.completedAt = new Date();

        if (meetingNotes) consultation.meetingNotes = meetingNotes;
        if (meetingSummary) consultation.meetingSummary = meetingSummary;

        const startTime = consultation.clientJoinedAt || consultation.lawyerJoinedAt || consultation.createdAt;
        if (startTime) {
            const diffMs = consultation.completedAt.getTime() - new Date(startTime).getTime();
            consultation.meetingDuration = Math.max(1, Math.round(diffMs / 60000));
        }

        await consultation.save();

        // Clear WebRTC signals from DB
        await Signal.deleteMany({ consultationId: id });

        const updated = await LiveConsultation.findById(id)
            .populate('client', 'fullName email phone location')
            .populate('lawyer', 'fullName email phone location title expertise avatar');

        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const requestConsultationPayout = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user._id || req.user.id;

        const consultation = await LiveConsultation.findOne({
            _id: id,
            lawyer: userId
        });

        if (!consultation) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }

        if (!consultation.isPaidByUser && consultation.status !== 'scheduled' && consultation.status !== 'completed') {
            res.status(400).json({ message: 'Payout can only be requested after client payment is processed.' });
            return;
        }

        consultation.payoutStatus = 'requested';
        consultation.payoutRequestedAt = new Date();
        await consultation.save();

        res.json({ message: 'Payout request submitted to admin successfully', consultation });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


