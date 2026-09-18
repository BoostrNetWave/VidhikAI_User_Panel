// CRITICAL: Load environment variables FIRST before any other imports
import './config/env';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './routes/authRoutes';
import documentRoutes from './routes/documentRoutes';
import researchRoutes from './routes/researchRoutes';
import adminRoutes from './routes/adminRoutes';
import caseRoutes from './routes/caseRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import supportRoutes from './routes/supportRoutes';
import consultationRoutes from './routes/consultationRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import SystemConfig from './models/SystemConfig';

const app = express();
const PORT = process.env.PORT || 5003;
console.log("Final PORT used:", PORT);

app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Basic Route
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user-admin2';

// Serve uploads from shared lawyer-admin-main uploads folder (and local fallback)
const lawyerUploadsPath = path.resolve(__dirname, '../../lawyer-admin-main/backend/uploads');
const localUploadsPath = path.resolve(__dirname, '../uploads');

if (fs.existsSync(lawyerUploadsPath)) {
    console.log(`[Static] Serving uploads from shared lawyer-admin uploads: ${lawyerUploadsPath}`);
    app.use('/uploads', express.static(lawyerUploadsPath));
    app.use('/lawyer/uploads', express.static(lawyerUploadsPath));
    app.use('/user/uploads', express.static(lawyerUploadsPath));
    app.use('/user/lawyer/uploads', express.static(lawyerUploadsPath));
}

if (fs.existsSync(localUploadsPath)) {
    console.log(`[Static] Serving uploads from local uploads: ${localUploadsPath}`);
    app.use('/uploads', express.static(localUploadsPath));
    app.use('/lawyer/uploads', express.static(localUploadsPath));
    app.use('/user/uploads', express.static(localUploadsPath));
    app.use('/user/lawyer/uploads', express.static(localUploadsPath));
}

// Serve static assets unconditionally (bulletproof routing)
let clientBuildPath = path.join(__dirname, '../dist/client');
if (!fs.existsSync(clientBuildPath)) {
    clientBuildPath = path.join(__dirname, '../../dist/client');
}
app.use('/user', express.static(clientBuildPath));
app.get(['/user', '/user/*'], (_req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

import http from 'http';
import { initSocket } from './socket';

const server = http.createServer(app);
initSocket(server);

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB Atlas');
        console.log('URI used:', MONGO_URI);

        // Auto-sync official v3.0 Pricing Plans and Extra Credit Packages
        try {
            const defaultPlans = [
                { 
                    id: "free",
                    name: "Free", 
                    priceMonthly: 0, 
                    priceYearly: 0, 
                    monthlyCredits: 30,
                    desc: "Perfect for getting started with AI legal assistance", 
                    features: [
                        "30 Monthly AI Credits", 
                        "Simple & Detailed Legal Chat (1–3 credits)", 
                        "Basic Document Generation (5 credits)", 
                        "Short Document Review (up to 5,000 words)",
                        "Verified Lawyer Marketplace access",
                        "Credits reset each billing cycle"
                    ], 
                    gradient: "from-slate-500 to-slate-600", 
                    popular: false, 
                    iconName: "Zap", 
                    cta: "Current Active Plan", 
                    disabled: true, 
                    current: true, 
                    limits: { monthlyCredits: 30, maxChatWords: 5000, maxDocGenWords: 2000, maxDocReviewWords: 5000 } 
                },
                { 
                    id: "starter",
                    name: "Starter", 
                    priceMonthly: 499, 
                    priceYearly: 4990, 
                    monthlyCredits: 150,
                    desc: "Designed for individuals, freelancers & emerging startups", 
                    features: [
                        "150 Monthly AI Credits", 
                        "Advanced Legal Chat (up to 10,000 words)", 
                        "Standard Document Generation (10 credits)", 
                        "Standard Document Review (up to 15,000 words)",
                        "Verified Lawyer Marketplace access",
                        "Priority AI processing speed"
                    ], 
                    gradient: "from-accent to-purple-500", 
                    popular: true, 
                    bestValue: true,
                    iconName: "Crown", 
                    cta: "Upgrade to Starter", 
                    disabled: false, 
                    limits: { monthlyCredits: 150, maxChatWords: 10000, maxDocGenWords: 5000, maxDocReviewWords: 15000 } 
                },
                { 
                    id: "growth",
                    name: "Growth", 
                    priceMonthly: 1499, 
                    priceYearly: 14990, 
                    monthlyCredits: 500,
                    desc: "For growing businesses, law chambers & comprehensive legal operations", 
                    features: [
                        "500 Monthly AI Credits", 
                        "All Legal Chat tiers with extended context", 
                        "Large Document Generation (up to 15,000 words)", 
                        "Large Document Review (up to 50,000 words)",
                        "Verified Lawyer Marketplace access",
                        "Maximum AI speed & priority support"
                    ], 
                    gradient: "from-indigo-500 to-blue-600", 
                    popular: false, 
                    iconName: "Building2", 
                    cta: "Upgrade to Growth", 
                    disabled: false, 
                    limits: { monthlyCredits: 500, maxChatWords: 10000, maxDocGenWords: 15000, maxDocReviewWords: 50000 } 
                }
            ];

            const defaultPackages = [
                { id: "extra-50", credits: 50, price: 199, desc: "50 Extra AI Credits", popular: false },
                { id: "extra-100", credits: 100, price: 349, desc: "100 Extra AI Credits", popular: true },
                { id: "extra-250", credits: 250, price: 749, desc: "250 Extra AI Credits", popular: false },
                { id: "extra-500", credits: 500, price: 1299, desc: "500 Extra AI Credits", popular: false },
                { id: "extra-1000", credits: 1000, price: 2299, desc: "1,000 Extra AI Credits", popular: false }
            ];

            await SystemConfig.findOneAndUpdate(
                { key: 'USER_PRICING_PLANS' },
                { 
                    key: 'USER_PRICING_PLANS',
                    value: defaultPlans,
                    category: 'user_panel',
                    description: 'Official v3.0 subscription plans'
                },
                { upsert: true }
            );

            await SystemConfig.findOneAndUpdate(
                { key: 'EXTRA_CREDIT_PACKAGES' },
                { 
                    key: 'EXTRA_CREDIT_PACKAGES',
                    value: defaultPackages,
                    category: 'user_panel',
                    description: 'Official v3.0 extra AI credit packages'
                },
                { upsert: true }
            );

            console.log('✅ Official v3.0 Pricing Plans and Extra Credit Packages synced to database');
        } catch (syncErr) {
            console.warn('⚠️ Pricing config sync warning:', syncErr);
        }

        server.listen(PORT, () => {
            console.log(`\n=================================================`);
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`👉 API URL: http://localhost:${PORT}/api`);
            console.log(`=================================================\n`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
