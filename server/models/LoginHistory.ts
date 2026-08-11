import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ILoginHistory extends Document {
    user?: mongoose.Types.ObjectId;
    email: string;
    role?: string;
    ipAddress?: string;
    userAgent?: string;
    status: 'success' | 'failed';
    createdAt: Date;
}

const loginHistorySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true },
    role: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    status: { 
        type: String, 
        enum: ['success', 'failed'], 
        required: true 
    }
}, {
    timestamps: true
});

// Index for fast querying by the admin panel
loginHistorySchema.index({ createdAt: -1 });
loginHistorySchema.index({ email: 1 });

const LoginHistory: Model<ILoginHistory> = mongoose.models.LoginHistory || mongoose.model<ILoginHistory>('LoginHistory', loginHistorySchema);

export default LoginHistory;
