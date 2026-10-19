import nodemailer from 'nodemailer';

// Helper to mask sensitive strings in logs
const maskSecret = (str?: string) => {
    if (!str) return 'NOT SET';
    if (str.length <= 4) return '****';
    return `${str.substring(0, 2)}****${str.substring(str.length - 2)}`;
};

/**
 * Resolve SMTP transport configuration options dynamically from environment variables
 * with sensible fallbacks and auto-detection based on the email domain.
 */
export const getEmailConfig = () => {
    const rawUser = (process.env.SMTP_USER || '').trim();
    const rawPass = (process.env.SMTP_PASS || '').trim();
    const explicitHost = (process.env.SMTP_HOST || '').trim();
    const explicitPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const explicitSecure = process.env.SMTP_SECURE !== undefined
        ? (process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1')
        : undefined;
    const explicitService = (process.env.SMTP_SERVICE || '').trim().toLowerCase();

    // Default sender email & fallback
    const user = rawUser || 'support@boostrnetwave.com';
    const pass = rawPass || '7SdX5Kvd@42WiHC';

    let host = explicitHost;
    let port = explicitPort;
    let secure = explicitSecure;

    if (!host && !explicitService) {
        if (user.toLowerCase().includes('@gmail.com')) {
            host = 'smtp.gmail.com';
        } else if (user.toLowerCase().includes('@boostrnetwave.com') || user.toLowerCase().includes('@zoho')) {
            // Zoho India enterprise / mail hosting
            host = 'smtppro.zoho.in';
        } else {
            host = 'smtp.gmail.com';
        }
    }

    if (port === undefined) {
        // Default to port 465 (SSL) for secure SMTP, or 587 (STARTTLS)
        port = (secure === false) ? 587 : 465;
    }

    if (secure === undefined) {
        secure = port === 465;
    }

    const from = process.env.SMTP_FROM || `"Vidhik AI" <${user}>`;

    return {
        user,
        pass,
        host,
        port,
        secure,
        from,
        service: explicitService || undefined
    };
};

let cachedTransporter: nodemailer.Transporter | null = null;

export const createEmailTransporter = (): nodemailer.Transporter => {
    const config = getEmailConfig();

    console.log(`[EmailService] Initializing Transporter: Host=${config.host || config.service}, Port=${config.port}, Secure=${config.secure}, User=${config.user}, Pass=${maskSecret(config.pass)}`);

    const transportOpts: any = {
        auth: {
            user: config.user,
            pass: config.pass
        },
        connectionTimeout: 15000, // 15 seconds
        greetingTimeout: 10000,   // 10 seconds
        socketTimeout: 20000,     // 20 seconds
        tls: {
            rejectUnauthorized: false // Avoid SSL certificate handshake drops on cloud servers
        }
    };

    if (config.service) {
        transportOpts.service = config.service;
    } else {
        transportOpts.host = config.host;
        transportOpts.port = config.port;
        transportOpts.secure = config.secure;
    }

    return nodemailer.createTransport(transportOpts);
};

export const getTransporter = (): nodemailer.Transporter => {
    if (!cachedTransporter) {
        cachedTransporter = createEmailTransporter();
    }
    return cachedTransporter;
};

/**
 * Verify SMTP connectivity on server startup and output comprehensive diagnostic messages.
 */
export const verifyEmailConfiguration = async (): Promise<boolean> => {
    try {
        const config = getEmailConfig();
        const transporter = getTransporter();
        console.log(`[EmailService] 🔍 Verifying SMTP connection to ${config.host || config.service}:${config.port}...`);
        
        await transporter.verify();
        console.log(`[EmailService] ✅ SMTP connection verified successfully! Emails are ready to send via ${config.user}.`);
        return true;
    } catch (error: any) {
        const config = getEmailConfig();
        console.error(`\n======================================================`);
        console.error(`❌ [EmailService] SMTP Connection Verification FAILED!`);
        console.error(`Host: ${config.host || config.service}, Port: ${config.port}, User: ${config.user}`);
        console.error(`Error Code: ${error.code || 'UNKNOWN'}, Message: ${error.message}`);
        console.error(`------------------------------------------------------`);
        if (error.message && (error.message.includes('535') || error.message.includes('Authentication Failed') || error.message.includes('BadCredentials'))) {
            if (config.user.includes('@boostrnetwave.com') || config.user.includes('zoho')) {
                console.error(`👉 ZOHO MAIL DETECTED:`);
                console.error(`   1. If Two-Factor Authentication (2FA) is enabled on Zoho, your normal password WILL NOT WORK.`);
                console.error(`      Generate an Application-Specific Password from https://accounts.zoho.in -> Security -> App Passwords.`);
                console.error(`   2. Ensure 'SMTP Access' is toggled ON in Zoho Mail Admin Console (mailadmin.zoho.in -> Mail Accounts -> Email Access).`);
                console.error(`   3. Verify whether your Zoho account is on .in (smtppro.zoho.in) or .com (smtppro.zoho.com).`);
            } else if (config.user.includes('@gmail.com')) {
                console.error(`👉 GMAIL DETECTED:`);
                console.error(`   1. Normal Gmail passwords are not allowed for SMTP.`);
                console.error(`   2. Generate a 16-character Google App Password from https://myaccount.google.com/apppasswords`);
                console.error(`   3. Update SMTP_PASS with the generated app password.`);
            }
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
            console.error(`👉 NETWORK / PORT BLOCKING DETECTED:`);
            console.error(`   1. AWS EC2 blocks outbound port 25 completely. Ensure port 465 (SSL) or 587 (STARTTLS) is used.`);
            console.error(`   2. Verify AWS Security Group outbound rules allow traffic to destination port ${config.port}.`);
        }
        console.error(`======================================================\n`);
        return false;
    }
};

/**
 * Standard Vidhik AI Email wrapper with branded responsive layout
 */
export const wrapEmailTemplate = (contentHtml: string, title = 'Vidhik AI Notification'): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 30px 15px;">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 28px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                                    ⚖️ Vidhik AI
                                </h1>
                                <p style="margin: 5px 0 0 0; color: #e0e7ff; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">
                                    Next-Gen Legal Intelligence & Services
                                </p>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td style="padding: 32px 30px; line-height: 1.6; font-size: 15px; color: #334155;">
                                ${contentHtml}
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
                                <p style="margin: 0 0 6px 0;">This is an automated notification from <strong>Vidhik AI</strong>.</p>
                                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Vidhik AI / BoostrNetWave. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

/**
 * Send an email asynchronously with full error logging
 */
export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
    try {
        if (!to || !to.trim()) {
            console.warn('[EmailService] ⚠️ Cannot send email: recipient address is empty');
            return false;
        }

        const config = getEmailConfig();
        const transporter = getTransporter();

        const formattedHtml = html.includes('<!DOCTYPE html>') ? html : wrapEmailTemplate(html, subject);

        const mailOptions = {
            from: config.from,
            to: to.trim(),
            subject,
            html: formattedHtml
        };

        console.log(`[EmailService] 📤 Sending email to: "${to}" | Subject: "${subject}"...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] ✅ Email delivered successfully to "${to}" (Message ID: ${info.messageId || 'OK'})`);
        return true;
    } catch (error: any) {
        console.error(`[EmailService] ❌ Failed to send email to "${to}":`, error.message);
        return false;
    }
};

/**
 * Helper: Send Verification / Signup OTP Email
 */
export const sendVerificationOTPEmail = async (email: string, fullName: string, otp: string): Promise<boolean> => {
    const subject = 'Verify your email for Vidhik AI';
    const content = `
        <h2 style="color: #1e1b4b; margin-top: 0; font-size: 20px;">Welcome to Vidhik AI, ${fullName}!</h2>
        <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address and activate your account:</p>
        
        <div style="background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%); border: 2px dashed #6366f1; border-radius: 8px; padding: 18px; text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #4338ca; display: inline-block;">
                ${otp}
            </span>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #6366f1;">Valid for 10 minutes</p>
        </div>

        <p style="color: #64748b; font-size: 13px;">If you did not request this verification, please safely ignore this email.</p>
    `;

    return sendEmail(email, subject, content);
};

/**
 * Helper: Consultation Booking Notification to BOTH User and Lawyer
 */
export const notifyConsultationCreated = async (params: {
    clientEmail: string;
    clientName: string;
    lawyerEmail: string;
    lawyerName: string;
    title: string;
    description: string;
    scheduledDate: Date | string;
    scheduledTime: string;
    totalFee: number;
}) => {
    const { clientEmail, clientName, lawyerEmail, lawyerName, title, description, scheduledDate, scheduledTime, totalFee } = params;
    const formattedDate = new Date(scheduledDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // 1. Email to Lawyer
    const lawyerSubject = `New Live Consultation Request: ${title}`;
    const lawyerHtml = `
        <h2 style="color: #1e1b4b; margin-top: 0;">New Consultation Request Received</h2>
        <p>Hello <strong>Adv. ${lawyerName}</strong>,</p>
        <p>You have received a new live video consultation booking request from <strong>${clientName}</strong>.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Topic:</strong> ${title}</p>
            <p style="margin: 0 0 8px 0;"><strong>Proposed Date:</strong> ${formattedDate}</p>
            <p style="margin: 0 0 8px 0;"><strong>Proposed Time:</strong> ${scheduledTime}</p>
            <p style="margin: 0 0 8px 0;"><strong>Consultation Fee:</strong> ₹${Number(totalFee).toLocaleString('en-IN')}</p>
            <p style="margin: 0;"><strong>Description:</strong> ${description}</p>
        </div>

        <p>Please log in to your Lawyer Dashboard under <strong>Live Consultations</strong> to accept this appointment or propose an alternative time slot.</p>
    `;

    // 2. Email to Client
    const clientSubject = `Consultation Request Submitted: ${title}`;
    const clientHtml = `
        <h2 style="color: #1e1b4b; margin-top: 0;">Consultation Request Submitted</h2>
        <p>Hello <strong>${clientName}</strong>,</p>
        <p>Your live consultation request has been successfully submitted to <strong>Adv. ${lawyerName}</strong>.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Topic:</strong> ${title}</p>
            <p style="margin: 0 0 8px 0;"><strong>Proposed Date:</strong> ${formattedDate}</p>
            <p style="margin: 0 0 8px 0;"><strong>Proposed Time:</strong> ${scheduledTime}</p>
            <p style="margin: 0 0 8px 0;"><strong>Consultation Fee:</strong> ₹${Number(totalFee).toLocaleString('en-IN')}</p>
            <p style="margin: 0;"><strong>Advocate:</strong> Adv. ${lawyerName}</p>
        </div>

        <p>You will receive an email as soon as the advocate accepts or proposes a slot. You can track this in your Client Dashboard under <strong>Live Consultations</strong>.</p>
    `;

    await Promise.allSettled([
        sendEmail(lawyerEmail, lawyerSubject, lawyerHtml),
        sendEmail(clientEmail, clientSubject, clientHtml)
    ]);
};

/**
 * Helper: Consultation Payment & Meeting Link Confirmed to BOTH User and Lawyer
 */
export const notifyConsultationConfirmed = async (params: {
    clientEmail: string;
    clientName: string;
    lawyerEmail: string;
    lawyerName: string;
    title: string;
    scheduledDate: Date | string;
    scheduledTime: string;
    meetingLink: string;
}) => {
    const { clientEmail, clientName, lawyerEmail, lawyerName, title, scheduledDate, scheduledTime, meetingLink } = params;
    const formattedDate = new Date(scheduledDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // 1. Email to Lawyer
    const lawyerSubject = `Confirmed: Live Consultation with ${clientName}`;
    const lawyerHtml = `
        <h2 style="color: #1e1b4b; margin-top: 0;">Consultation Payment & Schedule Confirmed</h2>
        <p>Hello <strong>Adv. ${lawyerName}</strong>,</p>
        <p>Payment has been completed by <strong>${clientName}</strong> for the consultation: <strong>${title}</strong>.</p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Scheduled Date:</strong> ${formattedDate}</p>
            <p style="margin: 0 0 8px 0;"><strong>Scheduled Time:</strong> ${scheduledTime}</p>
            <p style="margin: 0 0 8px 0;"><strong>Client Name:</strong> ${clientName}</p>
            <p style="margin: 0;"><strong>Video Meeting Room:</strong> <a href="${meetingLink}" style="color: #4f46e5; font-weight: bold;">${meetingLink}</a></p>
        </div>

        <p>Please log in to your dashboard at the scheduled time and enter the video conference room.</p>
    `;

    // 2. Email to Client
    const clientSubject = `Confirmed: Live Consultation with Adv. ${lawyerName}`;
    const clientHtml = `
        <h2 style="color: #1e1b4b; margin-top: 0;">Live Consultation Confirmed & Scheduled!</h2>
        <p>Hello <strong>${clientName}</strong>,</p>
        <p>Your payment for the live consultation <strong>${title}</strong> with <strong>Adv. ${lawyerName}</strong> has been confirmed.</p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Scheduled Date:</strong> ${formattedDate}</p>
            <p style="margin: 0 0 8px 0;"><strong>Scheduled Time:</strong> ${scheduledTime}</p>
            <p style="margin: 0 0 8px 0;"><strong>Advocate:</strong> Adv. ${lawyerName}</p>
            <p style="margin: 0;"><strong>Join Video Session:</strong> <a href="${meetingLink}" style="color: #4f46e5; font-weight: bold;">${meetingLink}</a></p>
        </div>

        <p>You can join the session directly through your dashboard under <strong>Live Consultations</strong> or using the room link above.</p>
    `;

    await Promise.allSettled([
        sendEmail(lawyerEmail, lawyerSubject, lawyerHtml),
        sendEmail(clientEmail, clientSubject, clientHtml)
    ]);
};

/**
 * Helper: Consultation Status Updates (Accept, Reschedule, Cancel) to BOTH User and Lawyer
 */
export const notifyConsultationStatusChange = async (params: {
    clientEmail: string;
    clientName: string;
    lawyerEmail: string;
    lawyerName: string;
    title: string;
    status: 'accepted_by_lawyer' | 'rescheduled_by_lawyer' | 'rescheduled_by_client' | 'accepted_by_client' | 'cancelled';
    scheduledDate?: Date | string;
    scheduledTime?: string;
    cancelledBy?: 'client' | 'lawyer';
}) => {
    const { clientEmail, clientName, lawyerEmail, lawyerName, title, status, scheduledDate, scheduledTime, cancelledBy } = params;
    const formattedDate = scheduledDate ? new Date(scheduledDate).toLocaleDateString('en-IN') : '';

    if (status === 'accepted_by_lawyer') {
        // Lawyer accepted client request -> Notify client to pay, notify lawyer of acceptance
        await Promise.allSettled([
            sendEmail(
                clientEmail,
                `Consultation Approved: ${title}`,
                `<p>Hello <strong>${clientName}</strong>,</p>
                 <p>Advocate <strong>Adv. ${lawyerName}</strong> has approved your consultation request for <strong>${title}</strong> on <strong>${formattedDate} at ${scheduledTime}</strong>.</p>
                 <p>Please log in to your dashboard to complete the payment and receive the video meeting room link.</p>`
            ),
            sendEmail(
                lawyerEmail,
                `You Approved Consultation: ${title}`,
                `<p>Hello <strong>Adv. ${lawyerName}</strong>,</p>
                 <p>You have approved the consultation request with <strong>${clientName}</strong> for <strong>${formattedDate} at ${scheduledTime}</strong>.</p>
                 <p>The client has been notified to complete payment.</p>`
            )
        ]);
    } else if (status === 'rescheduled_by_lawyer') {
        await Promise.allSettled([
            sendEmail(
                clientEmail,
                `New Time Proposed by Advocate: ${title}`,
                `<p>Hello <strong>${clientName}</strong>,</p>
                 <p>Advocate <strong>Adv. ${lawyerName}</strong> proposed a new slot for <strong>${title}</strong>: <strong>${formattedDate} at ${scheduledTime}</strong>.</p>
                 <p>Please log in to your dashboard under Live Consultations to accept or counter-propose.</p>`
            ),
            sendEmail(
                lawyerEmail,
                `Proposed New Slot: ${title}`,
                `<p>Hello <strong>Adv. ${lawyerName}</strong>,</p>
                 <p>You proposed a new slot to <strong>${clientName}</strong> for <strong>${title}</strong>: <strong>${formattedDate} at ${scheduledTime}</strong>.</p>`
            )
        ]);
    } else if (status === 'rescheduled_by_client') {
        await Promise.allSettled([
            sendEmail(
                lawyerEmail,
                `New Time Proposed by Client: ${title}`,
                `<p>Hello <strong>Adv. ${lawyerName}</strong>,</p>
                 <p>Client <strong>${clientName}</strong> proposed a new slot for <strong>${title}</strong>: <strong>${formattedDate} at ${scheduledTime}</strong>.</p>
                 <p>Please log in to your dashboard to review and approve.</p>`
            ),
            sendEmail(
                clientEmail,
                `You Proposed a New Slot: ${title}`,
                `<p>Hello <strong>${clientName}</strong>,</p>
                 <p>Your proposed slot for <strong>${title}</strong> (<strong>${formattedDate} at ${scheduledTime}</strong>) was sent to Adv. ${lawyerName}.</p>`
            )
        ]);
    } else if (status === 'accepted_by_client') {
        await Promise.allSettled([
            sendEmail(
                lawyerEmail,
                `Client Accepted Proposed Time: ${title}`,
                `<p>Hello <strong>Adv. ${lawyerName}</strong>,</p>
                 <p>Client <strong>${clientName}</strong> accepted your proposed slot (<strong>${formattedDate} at ${scheduledTime}</strong>). The consultation is now pending payment.</p>`
            ),
            sendEmail(
                clientEmail,
                `Counter-Proposal Accepted: ${title}`,
                `<p>Hello <strong>${clientName}</strong>,</p>
                 <p>You accepted the slot proposed by Adv. ${lawyerName} (<strong>${formattedDate} at ${scheduledTime}</strong>). Please complete payment in your dashboard.</p>`
            )
        ]);
    } else if (status === 'cancelled') {
        const initiator = cancelledBy === 'client' ? clientName : `Adv. ${lawyerName}`;
        await Promise.allSettled([
            sendEmail(
                clientEmail,
                `Consultation Cancelled: ${title}`,
                `<p>Hello <strong>${clientName}</strong>,</p>
                 <p>The live consultation <strong>${title}</strong> has been cancelled by ${initiator}.</p>`
            ),
            sendEmail(
                lawyerEmail,
                `Consultation Cancelled: ${title}`,
                `<p>Hello <strong>Adv. ${lawyerName}</strong>,</p>
                 <p>The live consultation <strong>${title}</strong> with ${clientName} has been cancelled by ${initiator}.</p>`
            )
        ]);
    }
};

/**
 * Helper: Case Consultation Booking Notifications to BOTH User and Lawyer
 */
export const notifyCaseBookingCreated = async (params: {
    clientEmail: string;
    clientName: string;
    lawyerEmail: string;
    lawyerName: string;
    title: string;
    description: string;
    bookingDate?: Date | string;
    bookingTime?: string;
    totalFee: number;
}) => {
    const { clientEmail, clientName, lawyerEmail, lawyerName, title, description, bookingDate, bookingTime, totalFee } = params;
    const formattedDate = bookingDate ? new Date(bookingDate).toLocaleDateString('en-IN') : 'To be scheduled';

    // 1. To Lawyer
    const lawyerSubject = `New Case Consultation Request: ${title}`;
    const lawyerHtml = `
        <h2 style="color: #1e1b4b; margin-top: 0;">New Case Booking Request</h2>
        <p>Hello <strong>Adv. ${lawyerName}</strong>,</p>
        <p>You have received a new Case Engagement & Consultation request from <strong>${clientName}</strong>.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Case Title:</strong> ${title}</p>
            <p style="margin: 0 0 8px 0;"><strong>Proposed Date:</strong> ${formattedDate}</p>
            <p style="margin: 0 0 8px 0;"><strong>Proposed Time:</strong> ${bookingTime || 'N/A'}</p>
            <p style="margin: 0 0 8px 0;"><strong>Case Engagement Fee:</strong> ₹${Number(totalFee).toLocaleString('en-IN')}</p>
            <p style="margin: 0;"><strong>Brief:</strong> ${description}</p>
        </div>

        <p>Please log in to your dashboard under <strong>Case Management</strong> to accept this engagement and conduct the preliminary briefing.</p>
    `;

    // 2. To Client
    const clientSubject = `Case Booking Request Submitted: ${title}`;
    const clientHtml = `
        <h2 style="color: #1e1b4b; margin-top: 0;">Case Request Submitted</h2>
        <p>Hello <strong>${clientName}</strong>,</p>
        <p>Your case consultation request <strong>${title}</strong> has been submitted to <strong>Adv. ${lawyerName}</strong>.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Case Title:</strong> ${title}</p>
            <p style="margin: 0 0 8px 0;"><strong>Proposed Date:</strong> ${formattedDate}</p>
            <p style="margin: 0 0 8px 0;"><strong>Proposed Time:</strong> ${bookingTime || 'N/A'}</p>
            <p style="margin: 0 0 8px 0;"><strong>Total Fee:</strong> ₹${Number(totalFee).toLocaleString('en-IN')}</p>
            <p style="margin: 0;"><strong>Assigned Advocate:</strong> Adv. ${lawyerName}</p>
        </div>

        <p>You will receive an update once Adv. ${lawyerName} reviews and confirms the request.</p>
    `;

    await Promise.allSettled([
        sendEmail(lawyerEmail, lawyerSubject, lawyerHtml),
        sendEmail(clientEmail, clientSubject, clientHtml)
    ]);
};
