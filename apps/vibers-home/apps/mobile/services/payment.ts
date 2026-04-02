/**
 * vibers-mobile/services/payment.ts
 * 
 * [Electronic Payment System]
 * 토스페이먼츠 / 아임포트 등 외부 결제 게이트웨이 연동을 위한 서비스 레이어입니다.
 */

import { StorageService } from './storage';
import * as Haptics from 'expo-haptics';

export interface VibePackage {
    id: string;
    vibeAmount: number;
    price: number;
    name: string;
}

export const VIBE_PACKAGES: VibePackage[] = [
    { id: 'v_lite', vibeAmount: 100, price: 9900, name: 'Vibe Lite' },
    { id: 'v_pro', vibeAmount: 300, price: 29000, name: 'Vibe Pro' },
    { id: 'v_mega', vibeAmount: 1000, price: 89000, name: 'Vibe Mega' },
];

export const SUBSCRIPTION_PLANS = [
    { id: 'free', name: 'Free', price: 0, perks: ['10 Vibes/day', 'Basic Models'] },
    { id: 'pro', name: 'Pro', price: 19000, perks: ['Unlimited Vibes', 'Vertex AI Pro 1.5', 'Git Sync Priority'] },
];

// Backend API endpoint (Next.js or dedicated server)
const PAYMENT_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/payment';

export const PaymentService = {
    /**
     * Request payment initiation from backend
     */
    async requestPayment(packageId: string, userId: string): Promise<{ orderId: string; clientKey: string; amount: number; orderName: string }> {
        const pkg = VIBE_PACKAGES.find(p => p.id === packageId);
        if (!pkg) throw new Error('Invalid package');

        const response = await fetch(PAYMENT_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'request',
                packageId,
                amount: pkg.price,
                orderName: pkg.name,
                userId,
            }),
        });

        if (!response.ok) {
            const error = (await response.json()) as { error?: string };
            throw new Error(error.error || 'Payment request failed');
        }

        return (await response.json()) as { orderId: string; clientKey: string; amount: number; orderName: string };
    },

    /**
     * 실제 결제 윈도우를 띄우고 처리하는 로직
     * React Native에서는 WebView나 Linking으로 토스페이먼츠 SDK 연동
     */
    async processPayment(packageId: string, userId: string = 'user_default'): Promise<boolean> {
        console.log(`💳 Initializing Payment for ${packageId}...`);

        try {
            // Step 1: Request payment from backend
            const paymentData = await this.requestPayment(packageId, userId);

            // Step 2: Open Toss Payments (in production, use PortOne SDK or WebView)
            // For now, simulate successful payment after delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Step 3: Verify payment (would normally get paymentKey from Toss callback)
            const mockPaymentKey = `payment_${Date.now()}`;
            const verifyResponse = await fetch(PAYMENT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'verify',
                    paymentKey: mockPaymentKey,
                    orderId: paymentData.orderId,
                    amount: paymentData.amount,
                    packageId,
                    userId,
                }),
            });

            if (!verifyResponse.ok) {
                throw new Error('Payment verification failed');
            }

            // Step 4: Update local credits
            const pkg = VIBE_PACKAGES.find(p => p.id === packageId);
            if (pkg) {
                const currentVibes = await StorageService.getCredits();
                await StorageService.saveCredits(currentVibes + pkg.vibeAmount);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            return true;
        } catch (error) {
            console.error('Payment error:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            throw error;
        }
    },

    async updateSubscription(planId: string): Promise<boolean> {
        await StorageService.saveSubscriptionTier(planId === 'pro' ? 'Pro' : 'Free');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
    }
};
