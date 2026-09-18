import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER || 'sibsankar2727@gmail.com',
                pass: process.env.SMTP_PASS || 'ulqi aihu ajut qdnl'
            },
            connectionTimeout: 5000 // 5 seconds connection timeout
        });

        const mailOptions = {
            from: process.env.SMTP_USER || 'sibsankar2727@gmail.com',
            to,
            subject,
            html
        };

        // Await the email sending to catch errors properly instead of fire-and-forget.
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('[EmailService] Email sent successfully: ' + info.response);
        } catch (error) {
            console.error('[EmailService] Email sending failed:', error);
            // We return false or throw an error depending on how we want to handle it.
            // For now, logging it is the most important part so we can debug SMTP issues.
        }

        return true;
    } catch (error) {
        console.error('[EmailService] Error initializing email send:', error);
        return false;
    }
};
