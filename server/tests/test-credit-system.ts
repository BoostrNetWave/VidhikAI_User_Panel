import mongoose from 'mongoose';
import '../config/env';
import User from '../models/User';
import UsageRecord from '../models/UsageRecord';
import CreditService, { PLAN_CREDIT_ALLOCATIONS, EXTRA_CREDIT_PACKAGES } from '../services/creditService';

async function runTests() {
    console.log('--- Starting Credit System v3.0 Unit & Integration Tests ---');

    // 1. Test Chat word counting and credit rules
    console.log('\n[Test 1] Legal Chat Word Limits & Credits:');
    const simpleText = 'word '.repeat(100);
    const simpleRes = CreditService.calculateChatCredits(simpleText);
    console.log(`Simple: ${simpleRes.words} words -> ${simpleRes.credits} credit (${simpleRes.featureName})`);
    if (simpleRes.credits !== 1) throw new Error('Simple chat should be 1 credit');

    const detailedText = 'word '.repeat(3000);
    const detailedRes = CreditService.calculateChatCredits(detailedText);
    console.log(`Detailed: ${detailedRes.words} words -> ${detailedRes.credits} credits (${detailedRes.featureName})`);
    if (detailedRes.credits !== 3) throw new Error('Detailed chat should be 3 credits');

    const advancedText = 'word '.repeat(8000);
    const advancedRes = CreditService.calculateChatCredits(advancedText);
    console.log(`Advanced: ${advancedRes.words} words -> ${advancedRes.credits} credits (${advancedRes.featureName})`);
    if (advancedRes.credits !== 5) throw new Error('Advanced chat should be 5 credits');

    try {
        const excessChat = 'word '.repeat(11000);
        CreditService.calculateChatCredits(excessChat);
        throw new Error('Should have failed on chat >10,000 words');
    } catch (err: any) {
        console.log(`✅ Correctly rejected chat exceeding 10,000 words: ${err.message}`);
    }

    // 2. Test Document Review Word Limits & Credits
    console.log('\n[Test 2] Document Review Word Limits & Credits:');
    const shortReview = CreditService.calculateReviewCredits('word '.repeat(3000));
    console.log(`Short Review: ${shortReview.words} words -> ${shortReview.credits} credits (${shortReview.featureName})`);
    if (shortReview.credits !== 5) throw new Error('Short review should be 5 credits');

    const standardReview = CreditService.calculateReviewCredits('word '.repeat(12000));
    console.log(`Standard Review: ${standardReview.words} words -> ${standardReview.credits} credits (${standardReview.featureName})`);
    if (standardReview.credits !== 10) throw new Error('Standard review should be 10 credits');

    const advancedReview = CreditService.calculateReviewCredits('word '.repeat(25000));
    console.log(`Advanced Review: ${advancedReview.words} words -> ${advancedReview.credits} credits (${advancedReview.featureName})`);
    if (advancedReview.credits !== 20) throw new Error('Advanced review should be 20 credits');

    const largeReview = CreditService.calculateReviewCredits('word '.repeat(45000));
    console.log(`Large Review: ${largeReview.words} words -> ${largeReview.credits} credits (${largeReview.featureName})`);
    if (largeReview.credits !== 30) throw new Error('Large review should be 30 credits');

    try {
        CreditService.calculateReviewCredits('word '.repeat(55000));
        throw new Error('Should have failed on review >50,000 words');
    } catch (err: any) {
        console.log(`✅ Correctly rejected document review exceeding 50,000 words: ${err.message}`);
    }

    // 3. Test Document Generation Credits
    console.log('\n[Test 3] Document Generation Tiers:');
    const basicGen = CreditService.calculateDocGenCredits('non-disclosure-agreement');
    console.log(`NDA -> ${basicGen.credits} credits (${basicGen.featureName})`);
    if (basicGen.credits !== 5) throw new Error('NDA should be basic 5 credits');

    const standardGen = CreditService.calculateDocGenCredits('employment-contract');
    console.log(`Employment Contract -> ${standardGen.credits} credits (${standardGen.featureName})`);
    if (standardGen.credits !== 10) throw new Error('Employment contract should be standard 10 credits');

    const advancedGen = CreditService.calculateDocGenCredits('share-subscription-agreement');
    console.log(`Share Subscription -> ${advancedGen.credits} credits (${advancedGen.featureName})`);
    if (advancedGen.credits !== 20) throw new Error('Share subscription should be advanced 20 credits');

    // 4. Test Database Connection & User Balance Mechanics
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user-admin2';
    await mongoose.connect(MONGO_URI);
    console.log('\n[Test 4] Database Connected. Testing User Credit Mechanics...');

    const testEmail = `test_credit_system_${Date.now()}@vidhikai.com`;
    const testUser = await User.create({
        fullName: 'Test Credit User',
        email: testEmail,
        password: 'password123',
        subscription: 'Free',
        monthlyCredits: 30,
        extraCredits: 0,
        aiCredits: 30
    });

    console.log(`Created test user: ${testUser.email} with ${testUser.aiCredits} initial credits`);

    // Test Deduction (order: monthly first)
    await CreditService.deductCredits(testUser._id, 'legal_research', 'Simple Legal Chat', 1);
    let u = await User.findById(testUser._id);
    console.log(`After 1 credit deduction -> Monthly: ${u?.monthlyCredits}, Extra: ${u?.extraCredits}, Total: ${u?.aiCredits}`);
    if (u?.monthlyCredits !== 29 || u?.aiCredits !== 29) throw new Error('Monthly credits deduction mismatch');

    // Add 50 Extra Credits
    testUser.extraCredits = 50;
    testUser.aiCredits = (testUser.monthlyCredits || 0) + testUser.extraCredits;
    await testUser.save();
    console.log(`Added 50 extra credits -> Total: ${testUser.aiCredits}`);

    // Deduct 35 credits (should consume all 29 monthly credits and 6 extra credits)
    await CreditService.deductCredits(testUser._id, 'document_generation', 'Standard Doc Gen', 35);
    u = await User.findById(testUser._id);
    console.log(`After 35 credit deduction -> Monthly: ${u?.monthlyCredits} (expect 0), Extra: ${u?.extraCredits} (expect 44), Total: ${u?.aiCredits} (expect 44)`);
    if (u?.monthlyCredits !== 0 || u?.extraCredits !== 44 || u?.aiCredits !== 44) {
        throw new Error('Consumption order mismatch (monthly first then extra)');
    }
    console.log('✅ Correct deduction priority: monthly credits consumed first, remainder from extra credits');

    // Test Insufficient Credits
    try {
        await CreditService.deductCredits(testUser._id, 'document_review', 'Large Review', 100);
        throw new Error('Should have failed on insufficient credits');
    } catch (err: any) {
        if (err.code !== 'INSUFFICIENT_CREDITS') throw err;
        console.log(`✅ Correctly blocked request with insufficient credits: required ${err.required}, available ${err.available}`);
    }

    // Clean up
    await UsageRecord.deleteMany({ userId: testUser._id });
    await User.findByIdAndDelete(testUser._id);
    console.log('✅ Cleaned up test user');

    console.log('\n=========================================');
    console.log('🎉 ALL CREDIT SYSTEM TESTS PASSED SUCCESSFULLY!');
    console.log('=========================================\n');
    await mongoose.disconnect();
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
