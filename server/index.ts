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

// Basic Route
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user-admin2';

// Serve static assets unconditionally (bulletproof routing)
let clientBuildPath = path.join(__dirname, '../dist/client');
if (!fs.existsSync(clientBuildPath)) {
    clientBuildPath = path.join(__dirname, '../../dist/client');
}
app.use('/user', express.static(clientBuildPath));
app.get(['/user', '/user/*'], (_req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB Atlas');
        console.log('URI used:', MONGO_URI);

        app.listen(PORT, () => {
            console.log(`\n=================================================`);
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`👉 API URL: http://localhost:${PORT}/api`);
            console.log(`=================================================\n`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
