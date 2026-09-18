import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITicketMessage {
    _id?: any;
    sender: 'user' | 'admin';
    senderName?: string;
    message: string;
    attachment?: string;
    attachmentName?: string;
    createdAt: Date;
}

export interface IStatusHistory {
    _id?: any;
    status: 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed';
    changedBy: 'user' | 'admin';
    changedAt: Date;
    note?: string;
}

export interface ISupportTicket extends Document {
    ticketId: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    subject: string;
    category: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    description: string;
    attachment?: string;
    attachmentName?: string;
    status: 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed';
    messages: ITicketMessage[];
    statusHistory: IStatusHistory[];
    adminReply?: string; // backwards compatibility
    createdAt: Date;
    updatedAt: Date;
}

const ticketMessageSchema = new Schema({
    sender: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    senderName: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    attachment: {
        type: String
    },
    attachmentName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const statusHistorySchema = new Schema({
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed'],
        required: true
    },
    changedBy: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    changedAt: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        default: ''
    }
});

const supportTicketSchema: Schema = new Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    userName: {
        type: String,
        default: ''
    },
    userEmail: {
        type: String,
        default: ''
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        default: 'General'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    description: {
        type: String,
        required: true
    },
    attachment: {
        type: String
    },
    attachmentName: {
        type: String
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed'],
        default: 'Open'
    },
    messages: [ticketMessageSchema],
    statusHistory: [statusHistorySchema],
    adminReply: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const SupportTicket: Model<ISupportTicket> = mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);

export default SupportTicket;
