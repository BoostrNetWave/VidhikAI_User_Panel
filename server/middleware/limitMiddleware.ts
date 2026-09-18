import { Response, NextFunction } from 'express';
import User from '../models/User';
import CreditService from '../services/creditService';

/**
 * Middleware to ensure the user has positive available AI credits before accessing AI tools
 */
export const checkUserLimit = (_featureType?: string) => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'User authentication required for credit check' });
            }

            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await CreditService.syncUserSubscription(user);

            const available = (user.monthlyCredits || 0) + (user.extraCredits || 0);
            if (available <= 0) {
                return res.status(403).json({
                    error: 'INSUFFICIENT_CREDITS',
                    message: `You have reached your AI credit limit (0 credits remaining) on your ${user.subscription || 'Free'} plan. Please upgrade your plan or purchase an Extra Credits package to continue.`,
                    available: 0,
                    required: 1,
                    plan: user.subscription || 'Free'
                });
            }

            next();
        } catch (error: any) {
            console.error('[Limit Middleware] Error checking credits:', error);
            next();
        }
    };
};
