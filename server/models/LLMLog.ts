import mongoose, { Schema, Document } from 'mongoose';

export interface ILLMLog {
    feature: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
    latencyMs: number;
    status: 'success' | 'error';
    errorMessage?: string;
    userId?: mongoose.Types.ObjectId;
    createdAt?: Date;
}

export type ILLMLogDocument = ILLMLog & Document;

const LLMLogSchema: Schema = new Schema({
    feature: { 
        type: String, 
        required: true,
        index: true 
    },
    provider: { 
        type: String, 
        required: true,
        index: true 
    },
    model: { 
        type: String, 
        required: true 
    },
    promptTokens: { 
        type: Number, 
        default: 0 
    },
    completionTokens: { 
        type: Number, 
        default: 0 
    },
    totalTokens: { 
        type: Number, 
        default: 0 
    },
    estimatedCost: { 
        type: Number, 
        default: 0 
    },
    latencyMs: { 
        type: Number, 
        default: 0 
    },
    status: { 
        type: String, 
        enum: ['success', 'error'], 
        required: true,
        index: true 
    },
    errorMessage: { 
        type: String, 
        default: '' 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: false 
    }
}, { 
    timestamps: { createdAt: true, updatedAt: false }
});

const LLMLog = mongoose.model<ILLMLogDocument>('LLMLog', LLMLogSchema);

export default LLMLog;
