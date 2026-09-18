import User from '../models/User';

export const checkAndDeductCredits = async (userId: string, requiredCredits: number) => {
    const user = await User.findById(userId);
    
    if (!user) {
        const error = new Error('User not found');
        (error as any).code = 'USER_NOT_FOUND';
        throw error;
    }

    if (user.aiCredits < requiredCredits) {
        const error = new Error('Insufficient AI credits');
        (error as any).code = 'INSUFFICIENT_CREDITS';
        throw error;
    }

    user.aiCredits -= requiredCredits;
    await user.save();
    
    return user;
};
