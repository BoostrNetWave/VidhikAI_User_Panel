import mongoose from 'mongoose';

const sharedReviewSchema = new mongoose.Schema({
    fullText: {
        type: String,
        required: true
    },
    analysisData: {
        type: Object,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d' // Automatically delete after 30 days
    }
});

const SharedReview = mongoose.model('SharedReview', sharedReviewSchema);

export default SharedReview;
