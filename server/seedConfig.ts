import mongoose from 'mongoose';
import SystemConfig from './models/SystemConfig';
import User from './models/User';
import './config/env'; // Load env variables

const seedData = [
    {
        key: 'LANDING_HERO_TITLE',
        value: 'Affordable Legal Services',
        category: 'landing',
        description: 'Main headline on the landing page'
    },
    {
        key: 'LANDING_HERO_SUBTITLE',
        value: 'Create legal documents, review contracts, and get legal help instantly using AI. Designed for startups, freelancers, and businesses.',
        category: 'landing',
        description: 'Subtitle text under the main headline'
    },
    {
        key: 'LANDING_LOGO_URL',
        value: '',
        category: 'landing',
        description: 'Custom URL for the landing page logo (leave empty to use default local logo)'
    },
    {
        key: 'LANDING_HERO_IMAGE',
        value: '',
        category: 'landing',
        description: 'Custom URL for the hero section dashboard image (leave empty to use default local image)'
    },
    {
        key: 'LANDING_HOW_IT_WORKS_STEPS',
        value: [
            { num: "01", title: "Choose Legal Service", desc: "Select from document generation, contract review, or legal Q&A.", iconName: "Zap" },
            { num: "02", title: "Fill Simple Details", desc: "Provide basic information through our guided forms.", iconName: "FileText" },
            { num: "03", title: "AI Generates Results", desc: "Get your document or legal answer instantly.", iconName: "Sparkles" }
        ],
        category: 'landing',
        description: 'JSON array of steps under the How It Works section'
    },
    {
        key: 'LANDING_FEATURES',
        value: [
            { iconName: "FileText", title: "AI Legal Document Generator", desc: "Create legal agreements in minutes with AI-powered templates.", color: "from-purple-500/20 to-violet-500/20" },
            { iconName: "ShieldCheck", title: "AI Contract Review", desc: "Upload contracts and detect risky clauses automatically.", color: "from-blue-500/20 to-indigo-500/20" },
            { iconName: "MessageSquare", title: "AI Legal Assistant", desc: "Ask legal questions and get instant, accurate answers.", color: "from-pink-500/20 to-rose-500/20" },
            { iconName: "Users", title: "Legal Consultation", desc: "Book verified lawyers online for expert guidance.", color: "from-emerald-500/20 to-teal-500/20" },
            { iconName: "Lock", title: "Secure Document Storage", desc: "Store and manage legal documents safely in the cloud.", color: "from-amber-500/20 to-orange-500/20" }
        ],
        category: 'landing',
        description: 'JSON array of core features displayed on the website'
    },
    {
        key: 'LANDING_PRICING_PLANS',
        value: [
            { name: "Free", priceMonthly: 0, priceYearly: 0, desc: "Perfect for trying out Vidhik AI", features: ["5 documents per month", "Basic AI chat", "Email support", "1 GB storage"], gradient: "from-slate-500 to-slate-600", popular: false, iconName: "Zap" },
            { name: "Pro", priceMonthly: 29, priceYearly: 290, desc: "Best for freelancers & startups", features: ["Unlimited documents", "AI contract review", "10 GB storage", "Priority support", "Document templates", "Export to PDF/Word"], gradient: "from-accent to-purple-500", popular: true, iconName: "Crown" },
            { name: "Business", priceMonthly: 79, priceYearly: 790, desc: "For teams & growing businesses", features: ["Everything in Pro", "Team access (up to 10)", "Task management", "Priority legal consultation", "Custom templates", "API access", "Dedicated account manager"], gradient: "from-indigo-500 to-blue-600", popular: false, iconName: "Building2" }
        ],
        category: 'landing',
        description: 'JSON array of pricing plans (used in both main page and pricing page)'
    },
    {
        key: 'LANDING_CONTACT_INFO',
        value: [
            { iconName: "Mail", title: "Email Support", detail: "support@vidhikai.com", desc: "We respond within 24 hours", color: "from-blue-500 to-indigo-600" },
            { iconName: "Building2", title: "Business Inquiries", detail: "business@vidhikai.com", desc: "Partnerships & enterprise", color: "from-purple-500 to-violet-600" },
            { iconName: "Phone", title: "Phone", detail: "+91 98765 43210", desc: "Mon-Fri, 9 AM - 6 PM IST", color: "from-emerald-500 to-teal-600" },
            { iconName: "MapPin", title: "Office", detail: "Bangalore, India", desc: "Koramangala, 5th Block", color: "from-amber-500 to-orange-600" }
        ],
        category: 'landing',
        description: 'JSON array of contact card items'
    },
    {
        key: 'LANDING_FAQS',
        value: [
            { q: "Is Vidhik AI a replacement for a lawyer?", a: "Vidhik AI is designed to assist with routine legal tasks like document generation and contract review. For complex legal matters, we recommend consulting with a qualified lawyer — and we can help you connect with one too." },
            { q: "How accurate are the AI-generated documents?", a: "Our documents are generated using advanced AI trained on thousands of legal templates and reviewed by legal professionals. We maintain a 98% accuracy rate across all document types." },
            { q: "Is my data secure on Vidhik AI?", a: "Absolutely. We use bank-grade encryption (AES-256) for all data storage and transfers. Your documents are private and never shared with third parties." },
            { q: "Can I customize the generated documents?", a: "Yes! All generated documents are fully editable. You can customize clauses, add sections, and tailor them to your specific needs before downloading." },
            { q: "What types of legal documents can I create?", a: "You can create NDAs, employment agreements, service contracts, rental agreements, partnership deeds, MOUs, privacy policies, terms of service, and many more." },
            { q: "Do you offer refunds?", a: "Yes, we offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team for a full refund." }
        ],
        category: 'landing',
        description: 'JSON array of FAQs shown on the main page, pricing, and contact pages'
    },
    {
        key: 'CONSULTATION_BASE_FEE',
        value: 500,
        category: 'payments',
        description: 'Default consultation fee for lawyers (in INR)'
    },
    {
        key: 'USER_PRICING_PLANS',
        value: [
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
        ],
        category: 'user_panel',
        description: 'JSON array of subscription plans displayed in the User Panel Billing section (prices in INR)'
    },
    {
        key: 'EXTRA_CREDIT_PACKAGES',
        value: [
            { id: "extra-50", credits: 50, price: 199, desc: "50 Extra AI Credits", popular: false },
            { id: "extra-100", credits: 100, price: 349, desc: "100 Extra AI Credits", popular: true },
            { id: "extra-250", credits: 250, price: 749, desc: "250 Extra AI Credits", popular: false },
            { id: "extra-500", credits: 500, price: 1299, desc: "500 Extra AI Credits", popular: false },
            { id: "extra-1000", credits: 1000, price: 2299, desc: "1,000 Extra AI Credits", popular: false }
        ],
        category: 'user_panel',
        description: 'JSON array of top-up extra credit packages (prices in INR)'
    },
    {
        key: 'LAWYER_PRICING_PLANS',
        value: [
            { name: "Free", priceMonthly: 0, priceYearly: 0, desc: "Basic lawyer profile", features: ["Up to 5 active cases", "2 blog posts per week", "15% platform commission"], gradient: "from-slate-500 to-slate-600", popular: false, iconName: "Zap", cta: "Current Active Plan", disabled: true, current: true, limits: { activeCases: 5, blogsPerWeek: 2, commissionPercent: 15 } },
            { name: "Standard", priceMonthly: 1999, priceYearly: 19990, desc: "Standard level for practitioners", features: ["Up to 15 active cases", "5 blog posts per week", "10% platform commission"], gradient: "from-accent to-purple-500", popular: true, iconName: "Crown", cta: "Upgrade to Standard", disabled: false, limits: { activeCases: 15, blogsPerWeek: 5, commissionPercent: 10 } },
            { name: "Premium", priceMonthly: 4999, priceYearly: 49990, desc: "Professional firm features", features: ["Up to 50 active cases", "10 blog posts per week", "7% platform commission"], gradient: "from-indigo-500 to-blue-600", popular: false, iconName: "Building2", cta: "Upgrade to Premium", disabled: false, limits: { activeCases: 50, blogsPerWeek: 10, commissionPercent: 7 } },
            { name: "Enterprise", priceMonthly: "Custom", priceYearly: "Custom", desc: "For large legal associations", features: ["Unlimited active cases", "Unlimited blog posts", "5% platform commission"], gradient: "from-slate-900 to-slate-800", popular: false, iconName: "Shield", cta: "Contact Sales", disabled: false, limits: { activeCases: 999999, blogsPerWeek: 999999, commissionPercent: 5 } }
        ],
        category: 'lawyer_panel',
        description: 'JSON array of subscription plans displayed in the Lawyer Panel (prices in INR)'
    },
    {
        key: 'USER_DOC_GENERATOR_TITLE',
        value: 'AI Legal Document Generator',
        category: 'user_panel',
        description: 'Heading displayed at the top of the AI Document Generator and Hub sections'
    },
    {
        key: 'USER_DOC_GENERATOR_DESC',
        value: 'Create professional, legally-compliant contracts, notices, and agreements in minutes. Simply answer a few questions and our AI will draft the document for you.',
        category: 'user_panel',
        description: 'Detailed description for the AI Document Generator sub-module'
    },
    {
        key: 'USER_DOC_GENERATOR_LIMIT_FREE',
        value: 5,
        category: 'user_panel',
        description: 'Default monthly document generation limit for free tier users'
    },
    {
        key: 'USER_DOC_GENERATOR_ACTIVE',
        value: true,
        category: 'user_panel',
        description: 'Enable or disable the AI Document Generator feature entirely'
    },
    {
        key: 'USER_DOC_REVIEW_TITLE',
        value: 'AI Contract Review & Audit',
        category: 'user_panel',
        description: 'Heading displayed on the AI Document / Contract Review page'
    },
    {
        key: 'USER_DOC_REVIEW_DESC',
        value: 'Upload any contract or legal document to automatically analyze it for hidden risks, missing terms, liability exposure, and suggested revisions.',
        category: 'user_panel',
        description: 'Sub-description text for the Contract Review tool'
    },
    {
        key: 'USER_DOC_REVIEW_MAX_FILE_SIZE_MB',
        value: 10,
        category: 'user_panel',
        description: 'Maximum permitted file size in Megabytes for contract review uploads'
    },
    {
        key: 'USER_DOC_REVIEW_ACTIVE',
        value: true,
        category: 'user_panel',
        description: 'Enable or disable the AI Contract Review features'
    },
    {
        key: 'USER_LEGAL_ASSISTANT_TITLE',
        value: 'Vidhik AI Legal Assistant',
        category: 'user_panel',
        description: 'Main heading for the Legal Assistant chat and research page'
    },
    {
        key: 'USER_LEGAL_ASSISTANT_DESC',
        value: 'Query laws, retrieve judicial citations, and draft legal templates interactively with our LLM trained on Indian jurisprudence.',
        category: 'user_panel',
        description: 'Description of the AI Legal Assistant capabilities'
    },
    {
        key: 'USER_LEGAL_ASSISTANT_DAILY_LIMIT',
        value: 20,
        category: 'user_panel',
        description: 'Daily query limit per basic user'
    },
    {
        key: 'USER_LEGAL_ASSISTANT_ACTIVE',
        value: true,
        category: 'user_panel',
        description: 'Toggle to activate/deactivate the AI Legal Assistant chat interface'
    },
    {
        key: 'USER_LAWYER_BOOKING_TITLE',
        value: 'Verified Lawyer Consultations',
        category: 'user_panel',
        description: 'Heading displayed on the Find & Book Lawyers page'
    },
    {
        key: 'USER_LAWYER_BOOKING_DESC',
        value: 'Schedule video calls or physical appointments with vetted specialists. Get legal advice on business, corporate, family, and criminal cases.',
        category: 'user_panel',
        description: 'Sub-description text for lawyer directories'
    },
    {
        key: 'USER_LAWYER_BOOKING_BASE_COMMISSION_PERCENT',
        value: 15,
        category: 'user_panel',
        description: 'Platform commission percentage charged on lawyer booking fees'
    },
    {
        key: 'USER_LAWYER_BOOKING_ACTIVE',
        value: true,
        category: 'user_panel',
        description: 'Toggle availability of lawyer bookings and meeting portals'
    },
    {
        key: 'LAWYER_DASHBOARD_TITLE',
        value: 'Lawyer Chamber Control',
        category: 'lawyer_panel',
        description: 'Main header title visible on the lawyer portal dashboard'
    },
    {
        key: 'LAWYER_DASHBOARD_WELCOME_MSG',
        value: 'Manage client relationships, audit assigned case profiles, and track payout releases from your centralized legal console.',
        category: 'lawyer_panel',
        description: 'Greeting description subtext on the lawyer dashboard'
    },
    {
        key: 'LAWYER_DASHBOARD_ANNOUNCEMENT',
        value: 'Notice: Platform commission is currently fixed at 15% per booking. Weekly payout cycles occur every Friday for all completed milestones.',
        category: 'lawyer_panel',
        description: 'Scrolling or static banner message shown to logged-in lawyers'
    },
    {
        key: 'LAWYER_CASES_MAX_ACTIVE_PER_LAWYER',
        value: 50,
        category: 'lawyer_panel',
        description: 'Maximum number of concurrent active case consults a lawyer can handle'
    },
    {
        key: 'LAWYER_APPOINTMENT_MIN_NOTICE_HOURS',
        value: 4,
        category: 'lawyer_panel',
        description: 'Minimum notice period in hours required before a user can book a lawyer consultation'
    },
    {
        key: 'LAWYER_APPOINTMENT_ACTIVE',
        value: true,
        category: 'lawyer_panel',
        description: 'Allow or block clients from making new bookings with lawyers'
    },
    {
        key: 'LAWYER_BLOG_MAX_POSTS_PER_WEEK',
        value: 5,
        category: 'lawyer_panel',
        description: 'Number of legal articles or updates a lawyer can post weekly'
    },
    {
        key: 'LAWYER_BLOG_AUTO_APPROVE',
        value: false,
        category: 'lawyer_panel',
        description: 'If false, lawyer articles must be manually approved by administrators before going live'
    },
    {
        key: 'LAWYER_BLOG_ACTIVE',
        value: true,
        category: 'lawyer_panel',
        description: 'Enable or disable article generation/sharing inside the lawyer panel'
    },
    {
        key: 'LAWYER_PAYMENT_MIN_PAYOUT_AMOUNT',
        value: 1000,
        category: 'lawyer_panel',
        description: 'Minimum milestone payout threshold in INR required to release funds to the bank'
    },
    {
        key: 'LAWYER_PAYMENT_TDS_PERCENT',
        value: 10,
        category: 'lawyer_panel',
        description: 'Tax Deducted at Source (TDS) rate applied on lawyer payments'
    },
    {
        key: 'LAWYER_PAYMENT_ACTIVE',
        value: true,
        category: 'lawyer_panel',
        description: 'Enable or suspend lawyer payment collections and withdrawal options'
    },
    {
        key: 'LAWYER_SUPPORT_CONTACT_PHONE',
        value: '+91 80 4567 8910',
        category: 'lawyer_panel',
        description: 'Direct support phone line displayed in the lawyer helpline page'
    },
    {
        key: 'LAWYER_SUPPORT_ACTIVE',
        value: true,
        category: 'lawyer_panel',
        description: 'Enable or disable support request creation in the lawyer help center'
    },
    {
        key: 'SYSTEM_MAINTENANCE_MODE',
        value: false,
        category: 'system',
        description: 'If true, the entire site shows a maintenance page'
    },
    {
        key: 'SUPPORT_CONTACT_EMAIL',
        value: 'support@vidhik.ai',
        category: 'system',
        description: 'Central support email displayed across all panels'
    },
    {
        key: 'LLM_CONFIG_DEFAULT',
        value: { provider: 'openai', model: 'gpt-4o', apiKey: '' },
        category: 'system',
        description: 'Default LLM Configuration'
    },
    {
        key: 'LLM_CONFIG_CHATBOT',
        value: { provider: 'openai', model: 'gpt-4o', apiKey: '' },
        category: 'system',
        description: 'LLM Configuration for Legal Assistant Chatbot'
    },
    {
        key: 'LLM_CONFIG_DOC_GEN',
        value: { provider: 'openai', model: 'gpt-4o', apiKey: '' },
        category: 'system',
        description: 'LLM Configuration for Document Generation'
    },
    {
        key: 'LLM_CONFIG_DOC_REVIEW',
        value: { provider: 'openai', model: 'gpt-4o', apiKey: '' },
        category: 'system',
        description: 'LLM Configuration for Contract Review'
    }
];

const mockLawyers = [
    {
        fullName: "Adv. Rahul Sharma",
        email: "rahul.sharma@vidhikai.com",
        password: "lawyer123",
        role: "lawyer",
        isApproved: true,
        isVerified: true,
        expertise: "Corporate & Startup Law",
        experience: "10+ years",
        hourlyRate: 999,
        location: "Mumbai",
        rating: 4.8,
        reviews: 156,
        bio: "Specializing in corporate compliance, startup advisory, and funding agreements."
    },
    {
        fullName: "Adv. Priya Kapoor",
        email: "priya.kapoor@vidhikai.com",
        password: "lawyer123",
        role: "lawyer",
        isApproved: true,
        isVerified: true,
        expertise: "Family Law",
        experience: "8+ years",
        hourlyRate: 799,
        location: "Delhi",
        rating: 4.9,
        reviews: 203,
        bio: "Dedicated family law expert helping clients navigate sensitive matters with care."
    },
    {
        fullName: "Adv. Vikram Desai",
        email: "vikram.desai@vidhikai.com",
        password: "lawyer123",
        role: "lawyer",
        isApproved: true,
        isVerified: true,
        expertise: "Criminal Law",
        experience: "15+ years",
        hourlyRate: 1499,
        location: "Bangalore",
        rating: 4.7,
        reviews: 312,
        bio: "Veteran criminal trial lawyer with over 15 years in courts around India."
    },
    {
        fullName: "Adv. Anita Reddy",
        email: "anita.reddy@vidhikai.com",
        password: "lawyer123",
        role: "lawyer",
        isApproved: true,
        isVerified: true,
        expertise: "Intellectual Property",
        experience: "12+ years",
        hourlyRate: 1299,
        location: "Hyderabad",
        rating: 4.9,
        reviews: 178,
        bio: "Helping brands protect patents, trademarks, and copyright assets internationally."
    }
];

const seedDatabase = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user-admin2';
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Seed configurations
        for (const data of seedData) {
            await SystemConfig.findOneAndUpdate(
                { key: data.key },
                data,
                { upsert: true, new: true }
            );
            console.log(`✅ Seeded/Updated Config: ${data.key}`);
        }

        // 2. Seed mock lawyers if none exist
        const lawyerCount = await User.countDocuments({ role: 'lawyer' });
        if (lawyerCount === 0) {
            console.log('No lawyers found in DB. Seeding mock verified lawyers...');
            for (const mock of mockLawyers) {
                await User.create(mock);
                console.log(`✅ Seeded Mock Lawyer: ${mock.fullName}`);
            }
        } else {
            console.log(`ℹ️ Skipping lawyer seeding: ${lawyerCount} lawyers already exist in database.`);
        }

        console.log('\nDatabase seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
