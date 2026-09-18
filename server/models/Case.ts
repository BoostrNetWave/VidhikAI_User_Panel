import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMilestone {
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    progressIncrement: number;
    payoutAmount: number;
    payoutStatus: 'pending' | 'requested' | 'approved' | 'rejected';
    proofDocs: {
        name: string;
        url: string;
        uploadedAt: Date;
        details?: string;
    }[];
    completedAt?: Date;
}

export interface ICase extends Document {
    title: string;
    description: string;
    client: mongoose.Types.ObjectId;
    lawyer: mongoose.Types.ObjectId;
    status: 'pending_lawyer' | 'pending_payment' | 'active' | 'completed' | 'cancelled';
    totalFee: number;
    currentProgress: number;
    planSubmitted: boolean;
    planApproved: boolean;
    milestones: IMilestone[];
    category?: string;
    court?: string;
    filingNumber?: string;
    nextHearingDate?: Date;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    notes?: {
        text: string;
        createdAt: Date;
        createdBy?: string;
    }[];
    documents?: {
        name: string;
        url: string;
        uploadedAt: Date;
        docType?: string;
    }[];
    bookingDate?: Date;
    bookingTime?: string;
    meetingLink?: string;
    meetingSummaryUrl?: string;
    meetingSummaryName?: string;
    meetingSummaryUploadedAt?: Date;
    meetingJoinedByClient?: boolean;
    meetingJoinedByLawyer?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const milestoneSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'in_progress', 'completed'], 
        default: 'pending' 
    },
    progressIncrement: { type: Number, required: true, default: 0 },
    payoutAmount: { type: Number, required: true, default: 0 },
    payoutStatus: { 
        type: String, 
        enum: ['pending', 'requested', 'approved', 'rejected'], 
        default: 'pending' 
    },
    proofDocs: [{
        name: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
        details: { type: String }
    }],
    completedAt: { type: Date }
});

const caseSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lawyer: { type: Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, default: 'General Legal' },
    court: { type: String },
    filingNumber: { type: String },
    nextHearingDate: { type: Date },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high', 'urgent'], 
        default: 'medium' 
    },
    status: { 
        type: String, 
        enum: ['pending_lawyer', 'pending_payment', 'active', 'completed', 'cancelled'], 
        default: 'active' 
    },
    totalFee: { type: Number, required: true, default: 0 },
    currentProgress: { type: Number, default: 0 },
    planSubmitted: { type: Boolean, default: false },
    planApproved: { type: Boolean, default: false },
    milestones: [milestoneSchema],
    notes: [{
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: String }
    }],
    documents: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        docType: { type: String, default: 'General' }
    }],
    bookingDate: { type: Date },
    bookingTime: { type: String },
    meetingLink: { type: String },
    meetingSummaryUrl: { type: String },
    meetingSummaryName: { type: String },
    meetingSummaryUploadedAt: { type: Date },
    meetingJoinedByClient: { type: Boolean, default: false },
    meetingJoinedByLawyer: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Case: Model<ICase> = mongoose.models.Case || mongoose.model<ICase>('Case', caseSchema);

export default Case;
