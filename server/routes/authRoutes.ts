import express from 'express';
import { registerUser, loginUser, updateProfile, verifyOTP, resendOTP } from '../controllers/authController';

const router = express.Router();

import { getEmailConfig, verifyEmailConfiguration, sendEmail } from '../utils/emailService';

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.post('/verify-otp', verifyOTP as any);
router.post('/resend-otp', resendOTP as any);
router.put('/profile', updateProfile as any);

// Diagnostic test endpoint to verify SMTP credentials in production
router.post('/test-smtp', async (req, res) => {
    try {
        const targetEmail = req.body?.email || process.env.SMTP_USER || 'support@boostrnetwave.com';
        const config = getEmailConfig();
        const verified = await verifyEmailConfiguration();

        if (!verified) {
            return res.status(500).json({
                success: false,
                message: 'SMTP connection verification failed. Please verify credentials, App Password, or host/port.',
                config: {
                    host: config.host || config.service,
                    port: config.port,
                    secure: config.secure,
                    user: config.user
                }
            });
        }

        const sent = await sendEmail(
            targetEmail,
            'Vidhik AI - SMTP Diagnostics Test',
            `<h3>SMTP Diagnostics Test</h3>
             <p>This is a test email sent from the Vidhik AI User Backend server.</p>
             <p><strong>SMTP Host:</strong> ${config.host || config.service}</p>
             <p><strong>SMTP Port:</strong> ${config.port}</p>
             <p><strong>Sender:</strong> ${config.user}</p>
             <p>Everything is working as expected!</p>`
        );

        return res.json({
            success: sent,
            message: sent ? `Test email dispatched to ${targetEmail}` : 'Verification passed but sendMail failed.',
            config: {
                host: config.host || config.service,
                port: config.port,
                secure: config.secure,
                user: config.user
            }
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
