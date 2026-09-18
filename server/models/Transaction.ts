import mongoose from 'mongoose';

export interface ITransaction extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    orderId: string;
    paymentId?: string;
    signature?: string;
    type: 'plan_subscription' | 'extra_credits';
    planName?: string;
    billingCycle?: 'monthly' | 'yearly';
    packageId?: string;
    amount: number;
    currency: string;
    status: 'created' | 'paid' | 'failed';
    creditsGranted: number;
    paymentMethod?: string;
    errorReason?: string;
    notes?: any;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    paymentId: {
        type: String,
        sparse: true,
        index: true
    },
    signature: {
        type: String
    },
    type: {
        type: String,
        enum: ['plan_subscription', 'extra_credits'],
        required: true
    },
    planName: {
        type: String
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    },
    packageId: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['created', 'paid', 'failed'],
        default: 'created',
        index: true
    },
    creditsGranted: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String
    },
    errorReason: {
        type: String
    },
    notes: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
