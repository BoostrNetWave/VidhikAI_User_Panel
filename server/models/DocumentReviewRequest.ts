import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocumentReviewRequest extends MongooseDocument {
    requestId: string;
    userId: mongoose.Types.ObjectId;
    userName: string;
    userEmail: string;
    userPhone?: string;
    documentId?: mongoose.Types.ObjectId;
    documentTitle: string;
    documentType: string;
    originalContent: string;
    userNotes: string;
    urgency: 'standard' | 'urgent';
    status: 'pending_quote' | 'payment_pending' | 'in_review' | 'completed' | 'cancelled';
    quoteAmount?: number;
    quoteNotes?: string;
    quotedAt?: Date;
    paymentDetails?: {
        orderId?: string;
        paymentId?: string;
        signature?: string;
        amount?: number;
        paidAt?: Date;
    };
    reviewedContent?: string;
    reviewSummary?: string;
    reviewedDocumentFile?: string;
    reviewedDocumentFileName?: string;
    assignedLawyerId?: mongoose.Types.ObjectId;
    assignedLawyerName?: string;
    reviewedAt?: Date;
    userFeedback?: {
        accepted?: boolean;
        feedbackText?: string;
        updatedAt?: Date;
    };
    statusHistory: Array<{
        status: string;
        changedBy: string;
        changedAt: Date;
        note?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const documentReviewRequestSchema = new Schema<IDocumentReviewRequest>({
    requestId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    userPhone: {
        type: String,
        trim: true,
        default: ''
    },
    documentId: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
        default: null
    },
    documentTitle: {
        type: String,
        required: true,
        trim: true
    },
    documentType: {
        type: String,
        required: true,
        trim: true
    },
    originalContent: {
        type: String,
        required: true
    },
    userNotes: {
        type: String,
        required: true,
        trim: true
    },
    urgency: {
        type: String,
        enum: ['standard', 'urgent'],
        default: 'standard'
    },
    status: {
        type: String,
        enum: ['pending_quote', 'payment_pending', 'in_review', 'completed', 'cancelled'],
        default: 'pending_quote',
        index: true
    },
    quoteAmount: {
        type: Number,
        default: 0
    },
    quoteNotes: {
        type: String,
        default: '',
        trim: true
    },
    quotedAt: {
        type: Date,
        default: null
    },
    paymentDetails: {
        orderId: { type: String, default: '' },
        paymentId: { type: String, default: '' },
        signature: { type: String, default: '' },
        amount: { type: Number, default: 0 },
        paidAt: { type: Date, default: null }
    },
    reviewedContent: {
        type: String,
        default: ''
    },
    reviewSummary: {
        type: String,
        default: '',
        trim: true
    },
    reviewedDocumentFile: {
        type: String,
        default: ''
    },
    reviewedDocumentFileName: {
        type: String,
        default: ''
    },
    assignedLawyerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    assignedLawyerName: {
        type: String,
        default: '',
        trim: true
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    userFeedback: {
        accepted: { type: Boolean, default: null },
        feedbackText: { type: String, default: '' },
        updatedAt: { type: Date, default: null }
    },
    statusHistory: [{
        status: { type: String, required: true },
        changedBy: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, default: '' }
    }]
}, {
    timestamps: true
});

const DocumentReviewRequest = mongoose.model<IDocumentReviewRequest>(
    'DocumentReviewRequest',
    documentReviewRequestSchema
);

export default DocumentReviewRequest;

