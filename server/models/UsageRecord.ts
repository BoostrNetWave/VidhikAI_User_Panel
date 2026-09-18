import mongoose, { Schema, Document } from 'mongoose';

export interface IUsageRecord extends Document {
    userId: mongoose.Types.ObjectId;
    featureType: 'document_generation' | 'document_review' | 'legal_research' | 'lawyer_booking' | 'extra_credits_purchase' | 'subscription_grant' | 'refund';
    featureName?: string;
    creditsUsed: number;
    wordCount?: number;
    subscriptionPlan?: string;
    requestId?: string;
    notes?: string;
    createdAt: Date;
}

const UsageRecordSchema: Schema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true 
    },
    featureType: { 
        type: String, 
        enum: [
            'document_generation', 
            'document_review', 
            'legal_research', 
            'lawyer_booking', 
            'extra_credits_purchase', 
            'subscription_grant', 
            'refund'
        ], 
        required: true, 
        index: true 
    },
    featureName: {
        type: String,
        default: ''
    },
    creditsUsed: {
        type: Number,
        default: 0
    },
    wordCount: {
        type: Number,
        default: 0
    },
    subscriptionPlan: {
        type: String,
        default: 'Free'
    },
    requestId: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, { 
    timestamps: { createdAt: true, updatedAt: false }
});

const UsageRecord = mongoose.model<IUsageRecord>('UsageRecord', UsageRecordSchema);

export default UsageRecord;
