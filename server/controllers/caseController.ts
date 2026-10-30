import mongoose from 'mongoose';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import Case from '../models/Case';
import User from '../models/User';
import Notification from '../models/Notification';
import Signal from '../models/Signal';
import UsageRecord from '../models/UsageRecord';
import SystemConfig from '../models/SystemConfig';
import Transaction from '../models/Transaction';
import razorpayService from '../services/razorpayService';
import { sendEmail, notifyCaseBookingCreated } from '../utils/emailService';
import { saveFileToGridFS } from '../utils/gridfsStorage';
import { extractTextFromDocument } from './documentController';
import { llmService } from '../services/llmService';
import { getIo, emitToUser } from '../socket';

export const getCasesForClient = async (req: any, res: Response): Promise<void> => {
    try {
        const cases = await Case.find({ client: req.user._id })
            .populate('lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
            .populate('interestedLawyers.lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate bio')
            .populate('aiRecommendedLawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
            .populate('adminRecommendedLawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
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
            .populate('lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
            .populate('interestedLawyers.lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate bio')
            .populate('aiRecommendedLawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
            .populate('adminRecommendedLawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate');

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
        ).populate('lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate');

        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        // Notify lawyer that client approved their action roadmap
        if (kase.lawyer && (kase.lawyer as any)._id) {
            const lawyerId = (kase.lawyer as any)._id.toString();
            await (Notification as any).create({
                userId: lawyerId,
                userRole: 'lawyer',
                title: 'Action Roadmap Approved',
                message: `Client ${req.user.fullName || 'User'} has approved your Action Roadmap for case "${kase.title}".`,
                type: 'case',
                link: `/cases/${kase._id}`
            });
            emitToUser(lawyerId, 'roadmap_approved', { caseId: kase._id });
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

        await notifyCaseBookingCreated({
            clientEmail: req.user.email,
            clientName: req.user.fullName || 'Client',
            lawyerEmail: lawyerUser.email,
            lawyerName: lawyerUser.fullName || 'Lawyer',
            title,
            description,
            bookingDate,
            bookingTime,
            totalFee: Number(totalFee)
        });

        await UsageRecord.create({
            userId: req.user._id,
            featureType: 'lawyer_booking'
        });

        res.status(201).json(newCase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCasePaymentOrder = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const kase = await Case.findOne({ _id: id, client: req.user._id });

        if (!kase) {
            res.status(404).json({ success: false, message: 'Case not found' });
            return;
        }

        const amount = kase.totalFee || 1000;
        if (amount > 500000) {
            res.status(400).json({
                success: false,
                message: `Fee amount (₹${amount.toLocaleString('en-IN')}) exceeds the Razorpay payment gateway limit of ₹5,00,000 per transaction. Please structure fees within ₹5,00,000.`
            });
            return;
        }
        const receiptId = `rcpt_case_${Date.now().toString().slice(-8)}`;
        const notes = {
            userId: req.user._id.toString(),
            caseId: kase._id.toString(),
            type: 'case_booking',
            title: kase.title
        };

        const order = await razorpayService.createOrder(amount, receiptId, notes);

        await Transaction.create({
            userId: req.user._id,
            orderId: order.id,
            caseId: kase._id,
            type: 'case_booking',
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
                name: 'Vidhik AI Legal Services',
                description: `Case Consultation Fee: ${kase.title}`,
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

export const payAndConfirmCase = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

        const kase = await Case.findOne({ _id: id, client: req.user._id })
            .populate('lawyer', 'fullName email phone location title expertise avatar rating experience');

        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
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
            // Test simulated payment fallback
            const simOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            const simPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            await Transaction.create({
                userId: req.user._id,
                orderId: simOrderId,
                paymentId: simPaymentId,
                caseId: kase._id,
                type: 'case_booking',
                amount: kase.totalFee || 1000,
                currency: 'INR',
                status: 'paid',
                paymentMethod: 'simulated_test'
            });
        }

        kase.status = 'active';
        await kase.save();

        // Real-time notification & Socket emit to lawyer
        if (kase.lawyer && (kase.lawyer as any)._id) {
            const lawyerUser = kase.lawyer as any;
            await (Notification as any).create({
                userId: lawyerUser._id.toString(),
                userRole: 'lawyer',
                title: 'Payment Received & Case Active',
                message: `Client ${req.user.fullName || 'User'} has completed payment for case "${kase.title}". Case is now Active.`,
                type: 'case',
                link: `/cases/${kase._id}`
            });

            emitToUser(lawyerUser._id.toString(), 'case_paid', {
                caseId: kase._id,
                status: 'active'
            });

            await sendEmail(
                lawyerUser.email,
                `Booking Payment Confirmed: ${kase.title}`,
                `<h3>Consultation Payment Confirmed</h3>
                 <p>Hello Adv. ${lawyerUser.fullName},</p>
                 <p>The client <strong>${req.user.fullName}</strong> has successfully completed payment for <strong>${kase.title}</strong>.</p>
                 <p>This engagement is now <strong>Active</strong>. You can now submit your Action Roadmap or join the consultation.</p>`
            );
        }

        // Notify client
        await (Notification as any).create({
            userId: req.user._id.toString(),
            userRole: 'user',
            title: 'Case Confirmed & Active',
            message: `Your payment for case "${kase.title}" has been successfully processed. Work is now underway.`,
            type: 'case',
            link: `/cases`
        });

        res.json(kase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Enhanced Case Creation with Document Uploads & AI Summarization
 * Dynamically broadcasts new cases to all lawyers & admin
 */
export const createCase = async (req: any, res: Response): Promise<void> => {
    try {
        const { 
            title, 
            description, 
            category, 
            court, 
            filingNumber, 
            nextHearingDate, 
            priority, 
            budget, 
            totalFee,
            lawyerId 
        } = req.body;

        if (!title || !title.trim()) {
            res.status(400).json({ message: 'Case title is required' });
            return;
        }

        // Process uploaded files
        const documents: any[] = [];
        let extractedTexts: string[] = [];
        const imageFiles: { mimeType: string; base64: string; filename: string }[] = [];

        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                try {
                    // Sync to central GridFS
                    await saveFileToGridFS(file.filename, file.path, file.mimetype);

                    const fileUrl = `/uploads/${file.filename}`;
                    const isImg = /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.originalname) || (file.mimetype && file.mimetype.startsWith('image/'));
                    const isPdf = /\.pdf$/i.test(file.originalname) || (file.mimetype && file.mimetype.includes('pdf'));
                    const isWord = /\.(doc|docx)$/i.test(file.originalname) || (file.mimetype && file.mimetype.includes('word'));

                    documents.push({
                        name: file.originalname,
                        url: fileUrl,
                        size: file.size,
                        uploadedAt: new Date(),
                        docType: isPdf ? 'PDF' : isWord ? 'Word' : isImg ? 'Image' : 'Document'
                    });

                    const fileBuffer = fs.readFileSync(file.path);

                    if (isImg) {
                        imageFiles.push({
                            mimeType: file.mimetype || 'image/png',
                            base64: fileBuffer.toString('base64'),
                            filename: file.originalname
                        });
                        extractedTexts.push(`[Attached Document Image: "${file.originalname}" (${file.mimetype || 'image'}) - Attached for visual inspection]`);
                    } else {
                        // Extract text for AI analysis
                        const docText = await extractTextFromDocument({
                            originalname: file.originalname,
                            mimetype: file.mimetype,
                            buffer: fileBuffer
                        });
                        if (docText && typeof docText === 'string') {
                            const cleaned = docText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ').replace(/\s+/g, ' ').trim();
                            if (cleaned.length > 0) {
                                extractedTexts.push(`--- Document: ${file.originalname} ---\n${cleaned.slice(0, 4000)}`);
                            }
                        }
                    }
                } catch (fileErr) {
                    console.warn(`[Case Upload] Error processing file ${file.originalname}:`, fileErr);
                }
            }
        }

        // Fetch verified lawyers to evaluate for AI recommendation
        const availableLawyers = await User.find({ role: 'lawyer' })
            .select('_id fullName expertise rating experience bio specializations casesWon location hourlyRate')
            .limit(20);

        const lawyersContext = availableLawyers.map(l => ({
            id: l._id.toString(),
            name: l.fullName,
            expertise: l.expertise || 'General Law',
            rating: l.rating || 5.0,
            experience: l.experience || '5+ years',
            casesWon: l.casesWon || 50,
            location: l.location || 'Pan India'
        }));

        // AI Summarization & Legal Relevance Verification
        let aiSummary = '';
        let aiKeyFacts: string[] = [];
        let aiRecommendedSpecialization = category || 'General Legal';
        let aiRecommendedLawyerId: string | undefined = undefined;
        let aiRecommendationReason = '';
        let isLegalRelated = true;
        let nonLegalReason = '';

        try {
            const combinedContext = [
                `Title: ${title}`,
                `Category: ${category || 'General Legal'}`,
                `User Description: ${description || 'Not provided'}`,
                extractedTexts.length > 0 ? `Uploaded Case Documents Content:\n${extractedTexts.join('\n\n')}` : 'No document attachments or readable text.'
            ].join('\n\n');

            const systemPrompt = getCaseAISystemPrompt(lawyersContext);

            const aiResp = await llmService.generate({
                userPrompt: combinedContext,
                systemPrompt,
                feature: 'case_summary',
                temperature: 0.2,
                images: imageFiles.slice(0, 3)
            });

            if (aiResp && aiResp.content) {
                try {
                    const cleaned = aiResp.content.replace(/```json|```/g, '').trim();
                    const parsed = JSON.parse(cleaned);
                    if (typeof parsed.isLegalRelated === 'boolean') isLegalRelated = parsed.isLegalRelated;
                    if (parsed.nonLegalReason) nonLegalReason = parsed.nonLegalReason;
                    if (parsed.summary) aiSummary = parsed.summary;
                    if (Array.isArray(parsed.keyFacts)) aiKeyFacts = parsed.keyFacts;
                    if (parsed.recommendedSpecialization) aiRecommendedSpecialization = parsed.recommendedSpecialization;
                    if (isLegalRelated && parsed.recommendedLawyerId && availableLawyers.some(l => l._id.toString() === parsed.recommendedLawyerId)) {
                        aiRecommendedLawyerId = parsed.recommendedLawyerId;
                        aiRecommendationReason = parsed.recommendationReason || 'Highest match for required case specialization and tribunal experience.';
                    }
                } catch {
                    aiSummary = aiResp.content.slice(0, 1000);
                }
            }
        } catch (aiErr) {
            console.warn('[Case AI] Error generating AI summary:', aiErr);
        }

        // Fallback AI summary if model was unavailable
        if (!aiSummary) {
            if (documents.length > 0) {
                aiSummary = `Case Brief: ${title}. ${documents.length} document(s) uploaded. Case file is prepared for advocate review and legal assessment.`;
            } else {
                aiSummary = description 
                    ? `Case Overview: ${description.slice(0, 500)}. Case file uploaded and prepared for review by legal practitioners.`
                    : 'Case details submitted with attached supporting documentation. Ready for review by legal specialists.';
            }
        }
        if (aiKeyFacts.length === 0) {
            aiKeyFacts = isLegalRelated ? [
                `Filed under domain: ${aiRecommendedSpecialization || category || 'General Legal'}`,
                `Priority level: ${priority || 'Medium'}`,
                documents.length > 0 ? `${documents.length} supporting legal document(s) attached` : 'Direct brief submitted by client'
            ] : [
                'Non-legal document or attachment detected',
                'Awaiting submission of valid legal documentation or dispute particulars'
            ];
        }
        if (isLegalRelated && !aiRecommendedLawyerId && availableLawyers.length > 0) {
            const matched = availableLawyers.find(l => 
                (l.expertise || '').toLowerCase().includes((category || '').toLowerCase())
            ) || availableLawyers[0];
            aiRecommendedLawyerId = matched._id.toString();
            aiRecommendationReason = `Adv. ${matched.fullName} is a verified senior advocate with strong experience in ${matched.expertise || 'this domain'}.`;
        }

        const caseStatus = lawyerId ? 'pending_lawyer' : 'open';
        const feeAmount = Number(totalFee) || Number(budget) || 1500;

        const newCase = await Case.create({
            title: title.trim(),
            description: (description || '').trim(),
            client: req.user._id,
            lawyer: lawyerId || undefined,
            category: category || 'General Legal',
            court: court || '',
            filingNumber: filingNumber || `CAS-${Math.floor(100000 + Math.random() * 900000)}`,
            nextHearingDate: nextHearingDate ? new Date(nextHearingDate) : undefined,
            priority: priority || 'medium',
            budget: Number(budget) || feeAmount,
            totalFee: feeAmount,
            status: caseStatus,
            currentProgress: 0,
            planSubmitted: false,
            planApproved: false,
            milestones: [],
            documents,
            isLegalDocument: isLegalRelated !== false,
            nonLegalReason: nonLegalReason || '',
            aiSummary,
            aiKeyFacts,
            aiRecommendedSpecialization,
            aiRecommendedLawyer: isLegalRelated ? (aiRecommendedLawyerId || undefined) : undefined,
            aiRecommendationReason,
            interestedLawyers: [],
            notes: []
        });

        const populated = await Case.findById(newCase._id)
            .populate('lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
            .populate('interestedLawyers.lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate bio')
            .populate('aiRecommendedLawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
            .populate('adminRecommendedLawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate');

        // Broadcast notifications:
        // 1. Notify all active lawyers that an open case is available
        const lawyerUsers = await User.find({ role: 'lawyer' }).select('_id');
        const lawyerNotifications = lawyerUsers.map(l => ({
            userId: l._id.toString(),
            userRole: 'lawyer',
            title: 'New Case Available',
            message: `New case posted: "${title}" in ${category || 'General Legal'}. Review summary & express interest.`,
            type: 'case',
            link: `/cases`
        }));
        if (lawyerNotifications.length > 0) {
            await (Notification as any).insertMany(lawyerNotifications);
        }

        // 2. Notify Admins
        const adminUsers = await User.find({ role: 'admin' }).select('_id');
        const adminNotifications = adminUsers.map(a => ({
            userId: a._id.toString(),
            userRole: 'admin',
            title: 'New Case Posted',
            message: `Client ${req.user.fullName || 'User'} posted a new case: "${title}".`,
            type: 'case',
            link: `/admin/cases`
        }));
        if (adminNotifications.length > 0) {
            await (Notification as any).insertMany(adminNotifications);
        }

        // Socket.IO instant broadcast to lawyer and admin pools
        try {
            const io = getIo();
            io.emit('new_open_case', populated);
        } catch {}

        res.status(201).json(populated);
    } catch (error: any) {
        console.error('[createCase Error]:', error);
        res.status(500).json({ message: error.message || 'Failed to create case' });
    }
};

/**
 * User selects which lawyer they want for their case
 * Moves status to 'pending_lawyer' and sends approval request to the lawyer
 */
export const selectLawyer = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { lawyerId } = req.body;

        if (!lawyerId) {
            res.status(400).json({ message: 'lawyerId is required' });
            return;
        }

        const kase = await Case.findOne({ _id: id, client: req.user._id });
        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        // Support string, object ID, or subdoc ID
        const targetLawyerId = (typeof lawyerId === 'object' && lawyerId?._id) 
            ? lawyerId._id.toString() 
            : lawyerId.toString().trim();

        // Find user by _id or userId
        let lawyerUser = await User.findById(targetLawyerId);
        if (!lawyerUser) {
            lawyerUser = await User.findOne({ userId: targetLawyerId });
        }
        if (!lawyerUser && mongoose.isValidObjectId(targetLawyerId)) {
            lawyerUser = await User.findById(new mongoose.Types.ObjectId(targetLawyerId));
        }

        if (!lawyerUser) {
            res.status(404).json({ message: 'Selected lawyer not found' });
            return;
        }

        // Ensure user has lawyer role assigned so they have full access in lawyer portal
        if (lawyerUser.role !== 'lawyer' && lawyerUser.role !== 'admin') {
            lawyerUser.role = 'lawyer';
            await lawyerUser.save();
        }

        // Check if lawyer had submitted a proposed fee in interestedLawyers
        const applicant = kase.interestedLawyers?.find((i: any) => {
            const iLawyerId = i.lawyer?._id ? i.lawyer._id.toString() : i.lawyer?.toString();
            return iLawyerId === targetLawyerId || iLawyerId === lawyerUser!._id.toString();
        });

        if (applicant && applicant.proposedFee) {
            kase.totalFee = applicant.proposedFee;
        }

        // Update interested lawyers status: mark selected, reject other applied
        if (kase.interestedLawyers && kase.interestedLawyers.length > 0) {
            kase.interestedLawyers.forEach((i: any) => {
                const iLawyerId = i.lawyer?._id ? i.lawyer._id.toString() : i.lawyer?.toString();
                if (iLawyerId === targetLawyerId || iLawyerId === lawyerUser!._id.toString()) {
                    i.status = 'selected';
                } else if (i.status === 'applied') {
                    i.status = 'rejected';
                }
            });
        }

        kase.lawyer = lawyerUser._id as any;
        kase.status = 'pending_lawyer';
        await kase.save();

        const populated = await Case.findById(kase._id)
            .populate('lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
            .populate('interestedLawyers.lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate bio')
            .populate('aiRecommendedLawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
            .populate('adminRecommendedLawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate');

        // Notify the selected lawyer (safe try/catch)
        try {
            await (Notification as any).create({
                userId: lawyerUser._id.toString(),
                userRole: 'lawyer',
                title: 'Client Selected You for Case',
                message: `Client ${req.user.fullName || 'User'} selected you for case "${kase.title}". Please accept to initiate engagement.`,
                type: 'case',
                link: `/cases`
            });
        } catch (notifErr) {
            console.warn('[selectLawyer] Notification creation error:', notifErr);
        }

        try {
            emitToUser(lawyerUser._id.toString(), 'lawyer_selected', {
                caseId: kase._id,
                title: kase.title,
                clientName: req.user.fullName || 'User'
            });
        } catch (socketErr) {
            console.warn('[selectLawyer] Socket emit error:', socketErr);
        }

        // Email lawyer (safe try/catch)
        if (lawyerUser.email) {
            try {
                await sendEmail(
                    lawyerUser.email,
                    `You Have Been Selected: ${kase.title}`,
                    `<h3>Congratulations Adv. ${lawyerUser.fullName}!</h3>
                     <p>The client <strong>${req.user.fullName || 'Client'}</strong> has reviewed the applicants and selected you to represent their case: <strong>${kase.title}</strong>.</p>
                     <p>Please log in to your Lawyer Portal under <strong>Case Management</strong> to accept the engagement.</p>`
                );
            } catch (emailErr) {
                console.warn('[selectLawyer] Email send error:', emailErr);
            }
        }

        res.json(populated);
    } catch (error: any) {
        console.error('[selectLawyer] Error:', error);
        res.status(500).json({ message: error.message || 'Failed to select lawyer' });
    }
};

/**
 * Lawyer applies / expresses interest in an open case
 */
export const applyToCase = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { proposalNote, proposedFee, estimatedTimeline } = req.body;
        const lawyerId = req.user._id || req.user.id;

        let lawyerUser = await User.findById(lawyerId);
        if (!lawyerUser) {
            lawyerUser = await User.findOne({ userId: lawyerId });
        }
        if (!lawyerUser) {
            res.status(404).json({ message: 'Lawyer profile not found' });
            return;
        }

        if (lawyerUser.role !== 'lawyer' && lawyerUser.role !== 'admin') {
            lawyerUser.role = 'lawyer';
            await lawyerUser.save();
        }

        const kase = await Case.findById(id);
        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        if (kase.status !== 'open') {
            res.status(400).json({ message: 'This case is no longer accepting new applications' });
            return;
        }

        // Check if already applied
        const alreadyApplied = kase.interestedLawyers.some(
            (i: any) => (i.lawyer?._id || i.lawyer)?.toString() === lawyerUser!._id.toString()
        );

        if (alreadyApplied) {
            res.status(400).json({ message: 'You have already applied to this case' });
            return;
        }

        kase.interestedLawyers.push({
            lawyer: lawyerUser._id,
            appliedAt: new Date(),
            proposalNote: proposalNote || 'I am interested in taking this case and can provide dedicated legal representation.',
            proposedFee: Number(proposedFee) || kase.budget || kase.totalFee || 1500,
            estimatedTimeline: estimatedTimeline || 'Standard Timeline',
            status: 'applied'
        });

        await kase.save();

        const populated = await Case.findById(kase._id)
            .populate('lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
            .populate('interestedLawyers.lawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate bio')
            .populate('aiRecommendedLawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate')
            .populate('adminRecommendedLawyer', 'fullName email phone location title expertise avatar rating experience casesWon hourlyRate');

        // Notify client that a lawyer has approved / applied
        const clientUserId = kase.client.toString();
        await (Notification as any).create({
            userId: clientUserId,
            userRole: 'user',
            title: 'Lawyer Applied to Your Case',
            message: `Adv. ${lawyerUser.fullName} has expressed interest in taking your case "${kase.title}".`,
            type: 'case',
            link: `/cases`
        });

        emitToUser(clientUserId, 'lawyer_applied', {
            caseId: kase._id,
            lawyerName: lawyerUser.fullName,
            proposedFee
        });

        // Notify Admins
        try {
            const io = getIo();
            io.emit('case_lawyer_applied', {
                caseId: kase._id,
                lawyerId,
                lawyerName: lawyerUser.fullName
            });
        } catch {}

        res.json(populated);
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

export const requestMilestonePayout = async (req: any, res: Response): Promise<void> => {
    try {
        const { id, index } = req.params;
        const milestoneIndex = parseInt(index as string);
        const userId = req.user._id || req.user.id;

        const kase = await Case.findOne({ _id: id, lawyer: userId });
        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        if (isNaN(milestoneIndex) || milestoneIndex < 0 || milestoneIndex >= kase.milestones.length) {
            res.status(400).json({ message: 'Invalid milestone index' });
            return;
        }

        const milestone = kase.milestones[milestoneIndex];
        if (milestone.status !== 'completed') {
            res.status(400).json({ message: 'Milestone must be completed before requesting payout.' });
            return;
        }

        milestone.payoutStatus = 'requested';
        await kase.save();
        res.json({ message: 'Payout request for milestone submitted successfully', kase });
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


/**
 * Re-run AI Analysis & Document Verification for an existing case
 */
export const reanalyzeCase = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const kase = await Case.findById(id);
        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        const availableLawyers = await User.find({ role: 'lawyer' })
            .select('_id fullName expertise rating experience bio specializations casesWon location hourlyRate')
            .limit(20);

        const lawyersContext = availableLawyers.map(l => ({
            id: l._id.toString(),
            name: l.fullName,
            expertise: l.expertise || 'General Law',
            rating: l.rating || 5.0,
            experience: l.experience || '5+ years'
        }));

        const imageFiles: { mimeType: string; base64: string; filename: string }[] = [];
        const extractedTexts: string[] = [];

        if (kase.documents && kase.documents.length > 0) {
            for (const doc of kase.documents) {
                try {
                    const clean = doc.url.split('?')[0].split('#')[0];
                    const filename = clean.split('/').filter(Boolean).pop();
                    if (!filename) continue;

                    const possiblePaths = [
                        path.resolve(__dirname, '../uploads', filename),
                        path.resolve(__dirname, '../../uploads', filename),
                        path.resolve(__dirname, '../../../uploads', filename),
                        path.resolve(process.cwd(), 'uploads', filename),
                        path.resolve(process.cwd(), 'server/uploads', filename),
                        path.resolve('d:/BooterNetWave/VidhikAI/user-admin2/server/uploads', filename),
                        path.resolve('d:/BooterNetWave/VidhikAI/user-admin2/uploads', filename)
                    ];

                    const foundPath = possiblePaths.find(p => fs.existsSync(p));
                    if (foundPath) {
                        const fileBuffer = fs.readFileSync(foundPath);
                        const isImg = /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(filename) || (doc.docType === 'Image');
                        if (isImg) {
                            const ext = filename.split('.').pop()?.toLowerCase();
                            imageFiles.push({
                                mimeType: ext === 'png' ? 'image/png' : 'image/jpeg',
                                base64: fileBuffer.toString('base64'),
                                filename: doc.name || filename
                            });
                            extractedTexts.push(`[Attached Document Image: "${doc.name || filename}"]`);
                        } else {
                            const docText = await extractTextFromDocument({
                                originalname: doc.name || filename,
                                mimetype: doc.docType?.toLowerCase().includes('pdf') ? 'application/pdf' : 'application/octet-stream',
                                buffer: fileBuffer
                            });
                            if (docText && docText.trim().length > 0) {
                                extractedTexts.push(`--- Document: ${doc.name || filename} ---\n${docText.slice(0, 4000)}`);
                            }
                        }
                    } else {
                        extractedTexts.push(`[Attached Document: "${doc.name || filename}"]`);
                    }
                } catch (e) {
                    console.warn('[Reanalyze Case] Error processing doc:', e);
                }
            }
        }

        const combinedContext = [
            `Title: ${kase.title}`,
            `Category: ${kase.category || 'General Legal'}`,
            `User Description: ${kase.description || 'Not provided'}`,
            extractedTexts.length > 0 ? `Uploaded Case Documents Content:\n${extractedTexts.join('\n\n')}` : 'No readable document text available.'
        ].join('\n\n');

        const systemPrompt = getCaseAISystemPrompt(lawyersContext);

        const aiResp = await llmService.generate({
            userPrompt: combinedContext,
            systemPrompt,
            feature: 'case_summary',
            temperature: 0.2,
            images: imageFiles.slice(0, 3)
        });

        if (aiResp && aiResp.content) {
            try {
                const cleaned = aiResp.content.replace(/```json|```/g, '').trim();
                const parsed = JSON.parse(cleaned);
                if (typeof parsed.isLegalRelated === 'boolean') kase.isLegalDocument = parsed.isLegalRelated;
                if (parsed.nonLegalReason) kase.nonLegalReason = parsed.nonLegalReason;
                if (parsed.summary) kase.aiSummary = parsed.summary;
                if (Array.isArray(parsed.keyFacts)) kase.aiKeyFacts = parsed.keyFacts;
                if (parsed.recommendedSpecialization) kase.aiRecommendedSpecialization = parsed.recommendedSpecialization;
                if (kase.isLegalDocument && parsed.recommendedLawyerId && availableLawyers.some(l => l._id.toString() === parsed.recommendedLawyerId)) {
                    kase.aiRecommendedLawyer = parsed.recommendedLawyerId;
                    kase.aiRecommendationReason = parsed.recommendationReason || 'Highest match for required case specialization and tribunal experience.';
                }
            } catch {
                kase.aiSummary = aiResp.content.slice(0, 1000);
            }
        }

        await kase.save();
        res.status(200).json(kase);
    } catch (error: any) {
        console.error('[Reanalyze Error]:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Upload additional documents to an existing case and re-analyze
 */
export const uploadCaseDocuments = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const kase = await Case.findById(id);
        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({ message: 'No documents provided' });
            return;
        }

        const newDocs: any[] = [];
        const imageFiles: { mimeType: string; base64: string; filename: string }[] = [];
        const extractedTexts: string[] = [];

        for (const file of req.files) {
            try {
                await saveFileToGridFS(file.filename, file.path, file.mimetype);
                const fileUrl = `/uploads/${file.filename}`;
                const isImg = /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.originalname) || (file.mimetype && file.mimetype.startsWith('image/'));
                const isPdf = /\.pdf$/i.test(file.originalname) || (file.mimetype && file.mimetype.includes('pdf'));
                const isWord = /\.(doc|docx)$/i.test(file.originalname) || (file.mimetype && file.mimetype.includes('word'));

                newDocs.push({
                    name: file.originalname,
                    url: fileUrl,
                    size: file.size,
                    uploadedAt: new Date(),
                    docType: isPdf ? 'PDF' : isWord ? 'Word' : isImg ? 'Image' : 'Document'
                });

                const fileBuffer = fs.readFileSync(file.path);
                if (isImg) {
                    imageFiles.push({
                        mimeType: file.mimetype || 'image/png',
                        base64: fileBuffer.toString('base64'),
                        filename: file.originalname
                    });
                    extractedTexts.push(`[Attached Document Image: "${file.originalname}" (${file.mimetype || 'image'})]`);
                } else {
                    const docText = await extractTextFromDocument({
                        originalname: file.originalname,
                        mimetype: file.mimetype,
                        buffer: fileBuffer
                    });
                    if (docText && docText.trim().length > 0) {
                        extractedTexts.push(`--- Document: ${file.originalname} ---\n${docText.slice(0, 4000)}`);
                    }
                }
            } catch (err) {
                console.warn('[Add Case Doc] File processing error:', err);
            }
        }

        kase.documents.push(...newDocs);

        // Re-analyze
        const availableLawyers = await User.find({ role: 'lawyer' })
            .select('_id fullName expertise rating experience bio specializations casesWon location hourlyRate')
            .limit(20);

        const lawyersContext = availableLawyers.map(l => ({
            id: l._id.toString(),
            name: l.fullName,
            expertise: l.expertise || 'General Law',
            rating: l.rating || 5.0,
            experience: l.experience || '5+ years'
        }));

        const combinedContext = [
            `Title: ${kase.title}`,
            `Category: ${kase.category || 'General Legal'}`,
            `User Description: ${kase.description || 'Not provided'}`,
            extractedTexts.length > 0 ? `Newly Uploaded Documents:\n${extractedTexts.join('\n\n')}` : ''
        ].join('\n\n');

        try {
            const aiResp = await llmService.generate({
                userPrompt: combinedContext,
                systemPrompt: getCaseAISystemPrompt(lawyersContext),
                feature: 'case_summary',
                temperature: 0.2,
                images: imageFiles.slice(0, 3)
            });

            if (aiResp && aiResp.content) {
                const cleaned = aiResp.content.replace(/```json|```/g, '').trim();
                const parsed = JSON.parse(cleaned);
                if (typeof parsed.isLegalRelated === 'boolean') kase.isLegalDocument = parsed.isLegalRelated;
                if (parsed.nonLegalReason) kase.nonLegalReason = parsed.nonLegalReason;
                if (parsed.summary) kase.aiSummary = parsed.summary;
                if (Array.isArray(parsed.keyFacts)) kase.aiKeyFacts = parsed.keyFacts;
                if (parsed.recommendedSpecialization) kase.aiRecommendedSpecialization = parsed.recommendedSpecialization;
            }
        } catch (aiErr) {
            console.warn('[Re-analysis] Error:', aiErr);
        }

        await kase.save();
        res.status(200).json(kase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
