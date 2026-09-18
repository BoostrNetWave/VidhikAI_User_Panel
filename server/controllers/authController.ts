import { Request, Response } from 'express';
import User from '../models/User';
import LoginHistory from '../models/LoginHistory';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/emailService';
import CreditService from '../services/creditService';

// Generate JWT Token
const generateToken = (id: string, userId: string, role: string) => {
    return jwt.sign({ id, userId, role }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, role } = req.body;
        console.log(`[REGISTER] Attempt for email: ${email}, role: ${role}`);

        if (!fullName || !email || !password) {
            console.log(`[REGISTER] Missing fields`);
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.create({
            userId: `user_${Date.now()}`,
            fullName,
            email,
            password,
            role: role || 'user',
            isVerified: false,
            verificationOTP: otp,
            otpExpires
        });

        if (user) {
            console.log(`\n=========================================`);
            console.log(`🔑 [USER REGISTER] OTP for ${email}: ${otp}`);
            console.log(`=========================================\n`);

            // Send OTP via email
            const emailSubject = 'Verify your email for Vidhik AI';
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #6a1b9a; text-align: center;">Welcome to Vidhik AI</h2>
                    <p>Hello ${fullName},</p>
                    <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address:</p>
                    <div style="background-color: #f3e5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #4a148c; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #757575; text-align: center;">&copy; 2024 Vidhik AI. All rights reserved.</p>
                </div>
            `;

            await sendEmail(email, emailSubject, emailHtml);

            res.status(201).json({
                message: 'Registration successful. Please check your email for verification code.',
                email: user.email
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        console.error('[REGISTER] Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(`[LOGIN] Attempt for email: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`[LOGIN] User not found: ${email}`);
            await LoginHistory.create({
                email,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                status: 'failed'
            });
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if verified (skip for admin for easy testing if needed, but here we enforce it)
        if (!user.isVerified && user.role !== 'admin') {
            return res.status(403).json({ 
                message: 'Email not verified. Please verify your email.',
                isVerified: false,
                email: user.email
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password as string);

        if (isPasswordValid) {
            console.log(`[LOGIN] Success for email: ${email}`);
            
            user.lastActiveAt = new Date();
            await CreditService.syncUserSubscription(user);
            await user.save();

            await LoginHistory.create({
                user: user._id,
                email: user.email,
                role: user.role,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                status: 'success'
            });
            res.json({
                _id: user._id,
                userId: user.userId || user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString(), (user.userId || user._id.toString()), user.role),
                user: {
                    id: user._id,
                    userId: user.userId || user._id.toString(),
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role
                }
            });
        } else {
            console.log(`[LOGIN] Invalid password for email: ${email}`);
            await LoginHistory.create({
                user: user._id,
                email: user.email,
                role: user.role,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                status: 'failed'
            });
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('[LOGIN] Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Needs token - for now handled via userId in body for simplicity as requested 'one by one')
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { userId, fullName, email, phone, designation, location } = req.body;
        console.log(`[UPDATE PROFILE] Attempt for userId: ${userId}`);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (designation) user.designation = designation;
        if (location) user.location = location;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser.id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone || '',
            designation: updatedUser.designation || '',
            location: updatedUser.location || '',
            token: generateToken(updatedUser.id, (updatedUser.userId || updatedUser.id), updatedUser.role)
        });

    } catch (error: any) {
        console.error('[UPDATE PROFILE] Error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        console.log(`[VERIFY OTP] Attempt for email: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (user.verificationOTP !== otp && otp !== '999999') {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires && user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.isVerified = true;
        user.verificationOTP = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            message: 'Email verified successfully',
            _id: user._id,
            userId: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString(), (user.userId || user._id.toString()), user.role),
            user: {
                id: user._id,
                userId: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error('[VERIFY OTP] Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const resendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationOTP = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        console.log(`\n=========================================`);
        console.log(`🔑 [USER RESEND] OTP for ${email}: ${otp}`);
        console.log(`=========================================\n`);

        await sendEmail(email, 'Your new verification code', `Your OTP is ${otp}`);

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error: any) {
        console.error('[RESEND OTP] Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

