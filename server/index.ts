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

// Routes - Mounted with /api prefix as well as root & plural aliases for Nginx proxy compatibility
const registerRoute = (basePath: string, router: any) => {
    app.use(`/api${basePath}`, router);
    app.use(basePath, router);
};

registerRoute('/auth', authRoutes);
registerRoute('/documents', documentRoutes);
registerRoute('/research', researchRoutes);
registerRoute('/admin', adminRoutes);
registerRoute('/cases', caseRoutes);
registerRoute('/dashboard', dashboardRoutes);
registerRoute('/support', supportRoutes);
registerRoute('/consultations', consultationRoutes);
registerRoute('/subscription', subscriptionRoutes);
registerRoute('/subscriptions', subscriptionRoutes);
registerRoute('/payment', subscriptionRoutes);
registerRoute('/payments', subscriptionRoutes);

// Basic Route
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user-admin2';

// Serve uploads from shared lawyer-admin-main uploads folder across all server directory configurations
const possibleUploadPaths = [
    '/var/www/vidhik/lawyer-admin-main/backend/uploads',
    '/var/www/html/Vidhik_AI_Lawyer/backend/uploads',
    '/var/www/html/lawyer/backend/uploads',
    path.resolve(__dirname, '../../lawyer-admin-main/backend/uploads'),
    path.resolve(__dirname, '../uploads'),
    path.resolve(__dirname, './uploads')
];

possibleUploadPaths.forEach(dirPath => {
    if (fs.existsSync(dirPath)) {
        console.log(`[Static] Mounting upload path: ${dirPath}`);
        app.use('/uploads', express.static(dirPath));
        app.use('/user/uploads', express.static(dirPath));
        app.use('/lawyer/uploads', express.static(dirPath));
        app.use('/user/lawyer/uploads', express.static(dirPath));
    }
});

// Explicit handler for missing image uploads so Express NEVER returns HTML index.html for image requests!
app.use(['/uploads/*', '/user/uploads/*', '/lawyer/uploads/*', '/user/lawyer/uploads/*'], (_req, res) => {
    res.status(404).send('Image Not Found');
});

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

            // Auto-sync official v3.0 Landing Page section default configs if missing
            const defaultLandingConfigs = [
                // Hero & Badges
                { key: 'LANDING_HERO_TITLE', value: 'Legal work, drafted with intelligence.', category: 'landing', description: 'Main headline on the landing page' },
                { key: 'LANDING_HERO_SUBTITLE', value: 'Generate professional legal documents, review contracts, and move from legal questions to usable work — faster.', category: 'landing', description: 'Subtitle text under the main headline' },
                { key: 'LANDING_HERO_BADGE', value: 'Get started with Vidhik AI', category: 'landing', description: 'Top badge tag text on hero section' },
                { key: 'LANDING_HERO_PRIMARY_CTA_TEXT', value: 'Start Free Trial', category: 'landing', description: 'Primary CTA button label' },
                { key: 'LANDING_HERO_PRIMARY_CTA_LINK', value: '/user/auth?mode=register', category: 'landing', description: 'Primary CTA target link' },
                { key: 'LANDING_HERO_SECONDARY_CTA_TEXT', value: 'Watch Demo', category: 'landing', description: 'Secondary CTA button label' },
                { key: 'LANDING_HERO_SECONDARY_CTA_LINK', value: '#demo', category: 'landing', description: 'Secondary CTA target link' },
                { key: 'LANDING_HERO_TRUST_TEXT', value: 'Trusted by legal professionals', category: 'landing', description: 'Trust badge copy' },
                { key: 'LANDING_HERO_STAT_NUMBER', value: '24', category: 'landing', description: 'Floating date stat badge' },
                { key: 'LANDING_HERO_IMAGE', value: '', category: 'landing', description: 'Custom hero dashboard screenshot URL' },

                // Workflow (How It Works)
                { key: 'LANDING_WORKFLOW_TAG', value: 'Workflow', category: 'landing', description: 'Section pill tag for workflow' },
                { key: 'LANDING_WORKFLOW_TITLE', value: 'From blank page to executed agreement in minutes.', category: 'landing', description: 'Workflow section title' },
                { key: 'LANDING_WORKFLOW_SUBTITLE', value: 'Our intelligent workflow removes the friction from legal documentation, letting you focus on your actual business.', category: 'landing', description: 'Workflow section subtitle' },
                { 
                    key: 'LANDING_WORKFLOW_STEPS', 
                    value: [
                        { num: "01", title: "Choose a document", desc: "Select the legal document you need from our verified template library." },
                        { num: "02", title: "Provide your details", desc: "Answer a few simple questions in plain English to customize your document." },
                        { num: "03", title: "Generate and review", desc: "Our AI engine instantly drafts the contract. Review and edit as needed." },
                        { num: "04", title: "Download or use", desc: "Export securely to PDF or Word, ready for signatures or filing." }
                    ], 
                    category: 'landing', 
                    description: 'Workflow step cards array' 
                },

                // Audience (Who It Is For)
                { key: 'LANDING_AUDIENCE_TAG', value: 'Who it is for', category: 'landing', description: 'Audience section tag' },
                { key: 'LANDING_AUDIENCE_TITLE', value: 'Built for modern teams and professionals.', category: 'landing', description: 'Audience section title' },
                { 
                    key: 'LANDING_AUDIENCE_CARDS', 
                    value: [
                        { label: "Startups", desc: "Draft incorporation documents, founder agreements, NDAs, and equity structures instantly." },
                        { label: "Freelancers", desc: "Protect your work with bulletproof service contracts, invoices, and IP assignments." },
                        { label: "Small Businesses", desc: "Manage employment agreements, compliance checklists, and corporate policies." },
                        { label: "Individuals", desc: "Handle personal legal matters like rental agreements, wills, and basic legal guidance." }
                    ], 
                    category: 'landing', 
                    description: 'Audience cards array' 
                },

                // Testimonials
                { key: 'LANDING_TESTIMONIALS_TITLE', value: 'Trusted by professionals navigating complex work.', category: 'landing', description: 'Testimonials title' },
                { key: 'LANDING_TESTIMONIALS_SUBTITLE', value: 'Built for founders, businesses, legal teams, and professionals who need to move through complex legal work with clarity and confidence.', category: 'landing', description: 'Testimonials subtitle' },
                { 
                    key: 'LANDING_TESTIMONIALS_ITEMS', 
                    value: [
                        { id: "t1", name: "Priya Sharma", role: "Startup Founder", text: "Vidhik AI helped us draft all our incorporation documents in under an hour. The speed and precision is unmatched, letting us focus entirely on building our product.", avatar: "PS" },
                        { id: "t2", name: "Anita Desai", role: "Director", company: "Desai Ventures", text: "The contract review feature is a game changer. It consistently catches clauses I would have missed and allows us to negotiate with absolute clarity and zero anxiety.", avatar: "AD", featured: true },
                        { id: "t3", name: "Rahul Mehra", role: "Freelance Designer", text: "I finally have proper contracts for my clients. The AI assistant answered all my legal questions instantly. It's the best tool for protecting my independent business.", avatar: "RM" }
                    ], 
                    category: 'landing', 
                    description: 'Customer reviews array' 
                },

                // Pricing & FAQ Title
                { key: 'LANDING_PRICING_TITLE', value: 'Smart pricing for serious growth.', category: 'landing', description: 'Pricing section title' },
                { key: 'LANDING_PRICING_SUBTITLE', value: 'Our plans are designed to give you everything you need to scale your legal operations securely.', category: 'landing', description: 'Pricing section subtitle' },
                { key: 'LANDING_FAQ_TITLE', value: 'Frequently asked questions.', category: 'landing', description: 'FAQ section title' },

                // Navbar & Footer
                { key: 'LANDING_NAVBAR_BRAND', value: 'Vidhik AI', category: 'landing', description: 'Brand name displayed in navbar' },
                { key: 'LANDING_LOGO_URL', value: '', category: 'landing', description: 'Logo image URL' },
                { key: 'LANDING_FOOTER_TAGLINE', value: 'Intelligent legal drafting, contract review, and powerful tools for modern teams.', category: 'landing', description: 'Footer tagline subtext' },
                { key: 'LANDING_FOOTER_COPYRIGHT', value: '© 2026 Vidhik AI. All rights reserved.', category: 'landing', description: 'Footer copyright statement' },
                { key: 'LANDING_FOOTER_STATUS_TEXT', value: 'All systems operational', category: 'landing', description: 'System status indicator copy' }
            ];

            for (const cfg of defaultLandingConfigs) {
                const existing = await SystemConfig.findOne({ key: cfg.key });
                if (!existing || existing.value === 'Affordable Legal Services') {
                    await SystemConfig.findOneAndUpdate({ key: cfg.key }, cfg, { upsert: true });
                }
            }

            console.log('✅ Official v3.0 Pricing Plans, Credit Packages, and Landing Section Configs synced to database');
        } catch (syncErr) {
            console.warn('⚠️ Config sync warning:', syncErr);
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
