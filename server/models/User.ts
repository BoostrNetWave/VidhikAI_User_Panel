import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        sparse: true // Allow existing users without userId
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'lawyer', 'admin'],
        default: 'user'
    },
    // Approval Status (for Lawyers)
    isApproved: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // Common Profile Fields
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    designation: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    // Lawyer Specific Profile Fields (CMS manageable)
    title: { type: String, default: "" },
    expertise: { type: String, default: "" },
    hourlyRate: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    experience: { type: String, default: "" },
    practiceAreas: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    education: [{
        degree: String,
        school: String,
        year: String
    }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    
    verificationOTP: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    subscription: {
        type: String,
        default: "Free"
    },
    aiCredits: {
        type: Number,
        default: 5000
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
