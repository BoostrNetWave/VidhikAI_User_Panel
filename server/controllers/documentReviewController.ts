import fs from 'fs';
import { Request, Response } from 'express';
import DocumentReviewRequest from '../models/DocumentReviewRequest';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';
import User from '../models/User';
import Signal from '../models/Signal';
import Document from '../models/Document';
import razorpayService from '../services/razorpayService';
import { getEmailConfig, sendEmail } from '../utils/emailService';
import { saveFileToGridFS } from '../utils/gridfsStorage';
import { getIo } from '../socket';

// Helper to notify via socket if socket server is initialized
const emitSocketUpdate = (userId: string, event: string, data: any) => {
    try {
        const io = getIo();
        if (io) {
            io.emit(event, data);
            io.to(userId).emit(event, data);
        }
    } catch {
        // Socket emission is best-effort
    }
};

/**
 * 1. User: Submit a request for expert lawyer review on a generated document
 */
export const createReviewRequest = async (req: any, res: Response) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
        }

        const {
            documentTitle,
            documentType,
            originalContent,
            userNotes,
            urgency,
            documentId,
            userPhone
        } = req.body;

        if (!documentTitle || !originalContent || !userNotes) {
            return res.status(400).json({
                success: false,
                message: 'Document title, content, and review instructions are required.'
            });
        }

        const userName = req.user.fullName || req.user.name || 'Client';
        const userEmail = req.user.email;
        const phone = userPhone || req.user.phone || '';

        // Generate unique review ID like REV-391048
        const requestId = `REV-${Math.floor(100000 + Math.random() * 900000)}`;

        const newRequest = new DocumentReviewRequest({
            requestId,
            userId,
            userName,
            userEmail,
            userPhone: phone,
            documentId: documentId || null,
            documentTitle: documentTitle.trim(),
            documentType: documentType || 'custom',
            originalContent,
            userNotes: userNotes.trim(),
            urgency: urgency === 'urgent' ? 'urgent' : 'standard',
            status: 'pending_quote',
            statusHistory: [{
                status: 'pending_quote',
                changedBy: 'user',
                changedAt: new Date(),
                note: 'Review requested by user'
            }]
        });

        await newRequest.save();

        // Create in-app notification for user
        try {
            await Notification.create({
                userId: userId.toString(),
                userRole: 'user',
                title: 'Lawyer Review Requested',
                message: `Your request for expert review of "${documentTitle}" has been submitted. Our legal team will review your instructions and send a fee proposal shortly.`,
                type: 'case',
                link: `/documents/workspace`
            });
        } catch (notifErr) {
            console.warn('[Review Controller] Failed to create user notification:', notifErr);
        }

        // Notify admin via official email
        try {
            const emailConfig = getEmailConfig();
            const officialAdminEmail = emailConfig.user || 'noreply.vidhikai@gmail.com';
            const adminSubject = `[Action Required] New Lawyer Document Review Request: ${documentTitle} (${requestId})`;
            const adminHtml = `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 16px;">
                        <h2 style="color: #0f172a; margin: 0; font-size: 20px;">New Document Review Request</h2>
                        <span style="display: inline-block; background-color: #e0e7ff; color: #4338ca; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-top: 6px;">ID: ${requestId}</span>
                    </div>

                    <p style="font-size: 14px; color: #334155; line-height: 1.6;">
                        A client has requested an expert lawyer review for a generated legal document. Please review their document and submit a fee quote in the admin panel.
                    </p>

                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Client:</strong> ${userName} (${userEmail})</p>
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Document:</strong> ${documentTitle} (${documentType})</p>
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Urgency:</strong> ${urgency === 'urgent' ? 'High / Urgent' : 'Standard'}</p>
                        <p style="margin: 8px 0 0 0; font-size: 13px;"><strong>Review Instructions:</strong></p>
                        <div style="background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 12.5px; color: #1e293b; margin-top: 4px; white-space: pre-wrap;">${userNotes}</div>
                    </div>

                    <p style="font-size: 13px; color: #64748b;">
                        Go to <strong>Admin Panel &gt; Document Reviews</strong> to propose a review fee and initiate the workflow.
                    </p>
                </div>
            `;
            sendEmail(officialAdminEmail, adminSubject, adminHtml).catch(() => {});
        } catch {
            // Non-blocking email dispatch
        }

        // Notify through sockets
        emitSocketUpdate(userId.toString(), 'DOCUMENT_REVIEW_CREATED', newRequest);

        return res.status(201).json({
            success: true,
            message: 'Your document review request has been sent to our legal desk!',
            data: newRequest
        });
    } catch (error: any) {
        console.error('[Review Controller] Error creating review request:', error);
        return res.status(500).json({
            success: false,
            message: error?.message || 'Failed to submit review request'
        });
    }
};

/**
 * 2. User: Get all review requests for the authenticated user
 */
export const getUserReviewRequests = async (req: any, res: Response) => {
    try {
        const userId = req.user?._id;
        const requests = await DocumentReviewRequest.find({ userId })
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            data: requests
        });
    } catch (error: any) {
        console.error('[Review Controller] Error fetching user review requests:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch review requests'
        });
    }
};

/**
 * 3. User / Admin: Get a single review request by ID or requestId
 */
export const getReviewRequestById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const query = id.startsWith('REV-') ? { requestId: id } : { _id: id };

        const request = await DocumentReviewRequest.findOne(query);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Review request not found' });
        }

        // Check permission if not admin
        const isAdmin = req.user?.role === 'admin' || req.user?.role === 'superadmin';
        if (!isAdmin && request.userId.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        return res.json({
            success: true,
            data: request
        });
    } catch (error: any) {
        console.error('[Review Controller] Error fetching review request:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch review request'
        });
    }
};

/**
 * 4. User: Create Razorpay Payment Order for Quoted Review Fee
 */
export const createReviewPaymentOrder = async (req: any, res: Response) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const request = await DocumentReviewRequest.findById(id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Review request not found' });
        }

        if (request.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        if (request.status !== 'payment_pending' || !request.quoteAmount || request.quoteAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No pending payment quote found for this review request.'
            });
        }

        const amount = request.quoteAmount;
        const receiptId = `rcpt_${request.requestId}_${Date.now()}`.substring(0, 40);

        const orderNotes = {
            reviewRequestId: request._id.toString(),
            requestId: request.requestId,
            userId: userId.toString(),
            documentTitle: request.documentTitle,
            type: 'document_review'
        };

        const order = await razorpayService.createOrder(amount, receiptId, orderNotes);
        if (!order) {
            res.status(500).json({ success: false, message: 'Failed to create payment order' });
            return;
        }

        // Record transaction
        try {
            await Transaction.create({
                userId,
                orderId: order.id,
                type: 'document_review',
                reviewRequestId: request._id,
                amount,
                currency: 'INR',
                status: 'created',
                creditsGranted: 0,
                notes: `Razorpay Order for Document Review: ${request.documentTitle} (${request.requestId})`
            });
        } catch (txErr) {
            console.warn('[Review Controller] Failed to record transaction pre-order:', txErr);
        }

        return res.json({
            success: true,
            order,
            keyId: razorpayService.getKeyId(),
            amount,
            currency: 'INR'
        });
    } catch (error: any) {
        console.error('[Review Controller] Error creating payment order:', error);
        return res.status(500).json({
            success: false,
            message: error?.message || 'Failed to initialize payment gateway'
        });
    }
};

/**
 * 5. User: Verify Razorpay Payment Signature and initiate review
 */
export const verifyReviewPayment = async (req: any, res: Response) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const request = await DocumentReviewRequest.findById(id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Review request not found' });
        }

        if (request.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
            const isValid = razorpayService.verifyPaymentSignature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            );

            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Cryptographic signature verification failed. Payment could not be validated.'
                });
            }
        }

        // Update request state
        request.status = 'in_review';
        request.paymentDetails = {
            orderId: razorpay_order_id || '',
            paymentId: razorpay_payment_id || `sim_${Date.now()}`,
            signature: razorpay_signature || '',
            amount: request.quoteAmount,
            paidAt: new Date()
        };
        request.statusHistory.push({
            status: 'in_review',
            changedBy: 'user',
            changedAt: new Date(),
            note: `Payment of ₹${request.quoteAmount} verified via Razorpay (${razorpay_payment_id || 'confirmed'})`
        });

        await request.save();

        // Update transaction record
        if (razorpay_order_id) {
            await Transaction.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    status: 'paid',
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature,
                    paymentMethod: 'razorpay'
                }
            ).catch(() => {});
        }

        // Create user in-app notification
        try {
            await Notification.create({
                userId: userId.toString(),
                userRole: 'user',
                title: 'Payment Confirmed — Review Underway',
                message: `Payment of ₹${request.quoteAmount} for "${request.documentTitle}" review was confirmed. Our advocate is actively reviewing your document.`,
                type: 'credit',
                link: `/documents/workspace`
            });
        } catch {}

        // Notify admin via email
        try {
            const emailConfig = getEmailConfig();
            const adminEmail = emailConfig.user || 'noreply.vidhikai@gmail.com';
            const adminSubject = `[Payment Confirmed] Review Started for: ${request.documentTitle} (${request.requestId})`;
            const adminHtml = `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #059669; margin: 0 0 12px 0; font-size: 20px;">Review Payment Confirmed</h2>
                    <p style="font-size: 14px; color: #334155; line-height: 1.6;">
                        The client <strong>${request.userName}</strong> has successfully completed payment of <strong>₹${request.quoteAmount}</strong> via Razorpay.
                    </p>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Request ID:</strong> ${request.requestId}</p>
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Document:</strong> ${request.documentTitle}</p>
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Razorpay Payment ID:</strong> ${razorpay_payment_id || 'N/A'}</p>
                    </div>
                    <p style="font-size: 13px; color: #64748b;">
                        Please perform the document review and upload the revised draft in the Admin Panel.
                    </p>
                </div>
            `;
            sendEmail(adminEmail, adminSubject, adminHtml).catch(() => {});
        } catch {}

        emitSocketUpdate(userId.toString(), 'DOCUMENT_REVIEW_PAID', request);

        return res.json({
            success: true,
            message: 'Payment verified! Your document is now being reviewed by our expert lawyer.',
            data: request
        });
    } catch (error: any) {
        console.error('[Review Controller] Error verifying payment:', error);
        return res.status(500).json({
            success: false,
            message: error?.message || 'Payment verification failed'
        });
    }
};

/**
 * 6. User: Accept completed document review or submit feedback
 */
export const acceptReview = async (req: any, res: Response) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        const { feedbackText } = req.body;

        const request = await DocumentReviewRequest.findById(id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Review request not found' });
        }

        if (request.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        request.userFeedback = {
            accepted: true,
            feedbackText: feedbackText || 'Client accepted revised document',
            updatedAt: new Date()
        };
        request.statusHistory.push({
            status: request.status,
            changedBy: 'user',
            changedAt: new Date(),
            note: 'Client accepted reviewed document'
        });

        await request.save();

        emitSocketUpdate(userId.toString(), 'DOCUMENT_REVIEW_ACCEPTED', request);

        return res.json({
            success: true,
            message: 'Thank you for your feedback! The review is finalized.',
            data: request
        });
    } catch (error: any) {
        console.error('[Review Controller] Error accepting review:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to record acceptance'
        });
    }
};

/**
 * 7. Admin: Get all review requests with filters and stats
 */
export const getAllReviewRequestsAdmin = async (req: any, res: Response) => {
    try {
        const { status, search } = req.query;
        const filter: any = {};

        if (status && status !== 'all') {
            filter.status = status;
        }

        if (search) {
            const regex = new RegExp(search.toString().trim(), 'i');
            filter.$or = [
                { requestId: regex },
                { userName: regex },
                { userEmail: regex },
                { documentTitle: regex }
            ];
        }

        const requests = await DocumentReviewRequest.find(filter)
            .sort({ createdAt: -1 });

        // Calculate summary KPIs
        const stats = {
            total: await DocumentReviewRequest.countDocuments(),
            pendingQuote: await DocumentReviewRequest.countDocuments({ status: 'pending_quote' }),
            paymentPending: await DocumentReviewRequest.countDocuments({ status: 'payment_pending' }),
            inReview: await DocumentReviewRequest.countDocuments({ status: 'in_review' }),
            completed: await DocumentReviewRequest.countDocuments({ status: 'completed' })
        };

        return res.json({
            success: true,
            stats,
            data: requests
        });
    } catch (error: any) {
        console.error('[Review Controller] Admin error fetching reviews:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch review requests for admin'
        });
    }
};

/**
 * 8. Admin / Lawyer: Propose Review Fee Quote and send payment request to user
 */
export const sendReviewQuoteAdmin = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { quoteAmount, quoteNotes, lawyerName } = req.body;

        const amountNum = Number(quoteAmount);
        if (!amountNum || isNaN(amountNum) || amountNum <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid review fee quote amount in INR (greater than 0).'
            });
        }

        const request = await DocumentReviewRequest.findById(id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Review request not found' });
        }

        const advocateName = lawyerName || req.user?.fullName || req.user?.name || 'Vidhik AI Senior Legal Counsel';

        request.quoteAmount = amountNum;
        request.quoteNotes = (quoteNotes || '').trim();
        request.quotedAt = new Date();
        request.status = 'payment_pending';
        request.assignedLawyerName = advocateName;
        request.statusHistory.push({
            status: 'payment_pending',
            changedBy: req.user?.email || 'admin',
            changedAt: new Date(),
            note: `Review fee quoted: ₹${amountNum.toLocaleString('en-IN')}. ${quoteNotes ? `Notes: ${quoteNotes}` : ''}`
        });

        await request.save();

        // Create in-app notification for user
        try {
            await Notification.create({
                userId: request.userId.toString(),
                userRole: 'user',
                title: `Lawyer Review Quote Ready: ₹${amountNum}`,
                message: `Our advocate has reviewed your document "${request.documentTitle}" and proposed a review fee of ₹${amountNum}. Click to pay via Razorpay and commence the review.`,
                type: 'case',
                link: `/documents/workspace`
            });
        } catch (notifErr) {
            console.warn('[Review Controller] Failed to create quote notification:', notifErr);
        }

        // Send email to user
        try {
            const userSubject = `Review Fee Quote for "${request.documentTitle}" — Vidhik AI Expert Review`;
            const userHtml = `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 16px;">
                        <h2 style="color: #0f172a; margin: 0; font-size: 20px;">Lawyer Review Fee Quoted</h2>
                        <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Request ID: ${request.requestId}</p>
                    </div>

                    <p style="font-size: 14px; color: #334155; line-height: 1.6;">
                        Hello <strong>${request.userName}</strong>,
                    </p>
                    <p style="font-size: 14px; color: #334155; line-height: 1.6;">
                        Our legal team has reviewed your instructions for <strong>${request.documentTitle}</strong>. We have structured a customized review proposal:
                    </p>

                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 18px 0; text-align: center;">
                        <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Proposed Review Fee</span>
                        <div style="font-size: 28px; font-weight: 800; color: #0f172a; margin: 8px 0;">₹${amountNum.toLocaleString('en-IN')}</div>
                        ${request.quoteNotes ? `<p style="font-size: 13px; color: #475569; margin: 8px 0 0 0; text-align: left; background: #fff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;"><strong>Scope & Remarks:</strong> ${request.quoteNotes}</p>` : ''}
                    </div>

                    <p style="font-size: 14px; color: #334155; line-height: 1.6;">
                        To proceed with the review, please log in to your Vidhik AI dashboard and confirm payment via our secure Razorpay gateway.
                    </p>

                    <div style="margin-top: 24px; text-align: center;">
                        <a href="https://vidhikai.com/user/documents/workspace" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">Review & Pay via Razorpay</a>
                    </div>
                </div>
            `;
            sendEmail(request.userEmail, userSubject, userHtml).catch(() => {});
        } catch {}

        emitSocketUpdate(request.userId.toString(), 'DOCUMENT_REVIEW_QUOTED', request);

        return res.json({
            success: true,
            message: `Review quote of ₹${amountNum.toLocaleString('en-IN')} has been dispatched to the client!`,
            data: request
        });
    } catch (error: any) {
        console.error('[Review Controller] Error sending quote:', error);
        return res.status(500).json({
            success: false,
            message: error?.message || 'Failed to send quote'
        });
    }
};

/**
 * 9. Admin / Lawyer: Complete document review & deliver revised draft to user
 */
export const submitCompletedReviewAdmin = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { reviewedContent, reviewSummary, lawyerName } = req.body;

        const request = await DocumentReviewRequest.findById(id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Review request not found' });
        }

        let reviewedDocUrl = request.reviewedDocumentFile || '';
        let reviewedDocName = request.reviewedDocumentFileName || '';
        let fileExtractedHtml = '';

        // If an annotated/modified file was uploaded by the lawyer
        if (req.file) {
            reviewedDocUrl = `/uploads/${req.file.filename}`;
            reviewedDocName = req.file.originalname;
            await saveFileToGridFS(req.file.filename, req.file.path, req.file.mimetype).catch(() => {});

            const lowerName = (req.file.originalname || '').toLowerCase();
            if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
                try {
                    const mammoth = await import('mammoth');
                    const mammothModule: any = (mammoth as any).default || mammoth; const parsed = await mammothModule.convertToHtml({ path: req.file.path });
                    if (parsed && parsed.value && parsed.value.trim().length > 0) {
                        fileExtractedHtml = `<div class="lawyer-revised-content legal-document-preview" style="font-family: 'Times New Roman', serif; line-height: 1.8; padding: 24px;">${parsed.value}</div>`;
                        console.log(`[Review Delivery] Successfully extracted ${fileExtractedHtml.length} chars of HTML from uploaded docx ${req.file.originalname}`);
                    }
                } catch (docxErr) {
                    console.warn('[Review Delivery] Failed to extract docx via mammoth:', docxErr);
                }
            } else if (lowerName.endsWith('.pdf')) {
                try {
                    const pdfParse = await import('pdf-parse');
                    const buffer = fs.readFileSync(req.file.path);
                    const parseFn: any = (pdfParse as any).default || pdfParse; const parsed = await parseFn(buffer);
                    if (parsed && parsed.text && parsed.text.trim().length > 0) {
                        const paragraphs = parsed.text
                            .split(/\n\s*\n/)
                            .filter((p: string) => p.trim().length > 0)
                            .map((p: string) => `<p style="margin-bottom: 14px; text-align: justify; line-height: 1.7;">${p.trim().replace(/\n/g, ' ')}</p>`)
                            .join('');
                        fileExtractedHtml = `<div class="lawyer-revised-content legal-document-preview" style="font-family: 'Times New Roman', serif; line-height: 1.8; padding: 24px;">${paragraphs}</div>`;
                        console.log(`[Review Delivery] Successfully extracted ${fileExtractedHtml.length} chars of HTML from uploaded pdf ${req.file.originalname}`);
                    }
                } catch (pdfErr) {
                    console.warn('[Review Delivery] Failed to extract pdf via pdf-parse:', pdfErr);
                }
            }
        }

        const advocateName = lawyerName || req.user?.fullName || req.user?.name || 'Vidhik AI Senior Legal Counsel';

        // Prefer parsed file HTML if file was uploaded; otherwise use edited text from body
        let finalReviewedContent = '';
        if (fileExtractedHtml) {
            finalReviewedContent = fileExtractedHtml;
        } else if (reviewedContent && reviewedContent.trim().length > 0) {
            finalReviewedContent = reviewedContent.trim();
        } else {
            finalReviewedContent = request.originalContent;
        }

        request.status = 'completed';
        request.reviewedContent = finalReviewedContent;
        request.reviewSummary = (reviewSummary || '').trim();
        request.reviewedDocumentFile = reviewedDocUrl;
        request.reviewedDocumentFileName = reviewedDocName;
        request.assignedLawyerName = advocateName;
        request.reviewedAt = new Date();
        request.statusHistory.push({
            status: 'completed',
            changedBy: req.user?.email || 'admin',
            changedAt: new Date(),
            note: `Review completed and delivered by ${advocateName}.`
        });

        await request.save();

        // Create in-app notification for user
        try {
            await Notification.create({
                userId: request.userId.toString(),
                userRole: 'user',
                title: `Lawyer Review Completed for "${request.documentTitle}"`,
                message: `Your document review has been completed by advocate ${advocateName}. You can view the modified document, review summary, or schedule a video consultation anytime.`,
                type: 'case',
                link: `/documents/workspace`
            });
        } catch {}

        // Send email to user
        try {
            const userSubject = `Your Document Review is Ready: "${request.documentTitle}" — Vidhik AI`;
            const userHtml = `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <div style="border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 16px;">
                        <h2 style="color: #0f172a; margin: 0; font-size: 20px;">Document Review Completed</h2>
                        <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Request ID: ${request.requestId}</p>
                    </div>

                    <p style="font-size: 14px; color: #334155; line-height: 1.6;">
                        Hello <strong>${request.userName}</strong>,
                    </p>
                    <p style="font-size: 14px; color: #334155; line-height: 1.6;">
                        Your document <strong>${request.documentTitle}</strong> has been thoroughly reviewed and updated by advocate <strong>${advocateName}</strong>.
                    </p>

                    ${request.reviewSummary ? `
                        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                            <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Advocate's Review Summary & Notes:</p>
                            <p style="margin: 0; font-size: 13.5px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${request.reviewSummary}</p>
                        </div>
                    ` : ''}

                    <p style="font-size: 13.5px; color: #334155; line-height: 1.6;">
                        You can download the revised draft directly in your workspace. If you have questions or wish to discuss the contract clauses, you may also schedule a 1-on-1 video consultation with our legal panel anytime.
                    </p>

                    <div style="margin-top: 24px; text-align: center;">
                        <a href="https://vidhikai.com/user/documents/workspace" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">View Reviewed Document</a>
                    </div>
                </div>
            `;
            sendEmail(request.userEmail, userSubject, userHtml).catch(() => {});
        } catch {}

        emitSocketUpdate(request.userId.toString(), 'DOCUMENT_REVIEW_COMPLETED', request);

        return res.json({
            success: true,
            message: 'Reviewed document successfully delivered to the client!',
            data: request
        });
    } catch (error: any) {
        console.error('[Review Controller] Error submitting review:', error);
        return res.status(500).json({
            success: false,
            message: error?.message || 'Failed to submit completed review'
        });
    }
};

/**
 * 10. User / Admin: Cancel review request
 */
export const cancelReviewRequest = async (req: any, res: Response) => {
    try {
        const userId = req.user?._id;
        const isAdmin = req.user?.role === 'admin' || req.user?.role === 'superadmin';
        const { id } = req.params;
        const { reason } = req.body;

        const request = await DocumentReviewRequest.findById(id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Review request not found' });
        }

        if (!isAdmin && request.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        if (request.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Completed reviews cannot be cancelled.' });
        }

        request.status = 'cancelled';
        request.statusHistory.push({
            status: 'cancelled',
            changedBy: req.user?.email || 'user',
            changedAt: new Date(),
            note: reason || 'Review request cancelled'
        });

        await request.save();

        emitSocketUpdate(request.userId.toString(), 'DOCUMENT_REVIEW_CANCELLED', request);

        return res.json({
            success: true,
            message: 'Review request cancelled successfully',
            data: request
        });
    } catch (error: any) {
        console.error('[Review Controller] Error cancelling review:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to cancel review request'
        });
    }
};

/**
 * 11. Join Review Video Consultation Meeting
 */
export const joinReviewMeeting = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const isLawyer = req.user?.role === 'lawyer' || req.user?.role === 'admin' || req.user?.role === 'superadmin';

        const request = await DocumentReviewRequest.findById(id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Review request not found' });
        }

        if (isLawyer) {
            request.meetingJoinedByLawyer = true;
        } else {
            request.meetingJoinedByClient = true;
        }

        await request.save();

        emitSocketUpdate(request.userId.toString(), 'REVIEW_MEETING_JOINED', {
            reviewId: request._id,
            joinedBy: isLawyer ? 'lawyer' : 'client'
        });

        return res.json({
            success: true,
            data: request
        });
    } catch (err: any) {
        console.error('[Review Meeting] Error joining meeting:', err);
        return res.status(500).json({ success: false, message: err.message || 'Failed to join meeting' });
    }
};

/**
 * 12. Send WebRTC signal for review video meeting
 */
export const sendReviewSignal = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { sender, type, sdp, candidate } = req.body;

        if (!sender || !type) {
            return res.status(400).json({ success: false, message: 'Sender and type required' });
        }

        const signal = await Signal.create({
            reviewId: id,
            sender,
            type,
            sdp,
            candidate: typeof candidate === 'string' ? candidate : JSON.stringify(candidate)
        });

        return res.status(201).json({ success: true, data: signal });
    } catch (err: any) {
        console.error('[Review Signal] Error sending signal:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * 13. Get WebRTC signals for review video meeting
 */
export const getReviewSignals = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const signals = await Signal.find({ reviewId: id }).sort({ createdAt: 1 });
        return res.json({ success: true, data: signals });
    } catch (err: any) {
        console.error('[Review Signals] Error getting signals:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * 14. Clear signals after review video call concludes
 */
export const clearReviewSignals = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        await Signal.deleteMany({ reviewId: id });
        return res.json({ success: true, message: 'Signals cleared' });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
