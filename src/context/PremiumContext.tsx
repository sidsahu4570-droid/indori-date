import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PremiumPlan, Subscription } from '../types';
import { DEFAULT_PREMIUM_PLANS, FREE_TIER_LIMITS } from '../constants/membership';
import { RazorpayService } from '../services/razorpayService';
import { StorageService } from '../services/storageService';
import { useAuth } from './AuthContext';

interface PremiumContextType {
  isPremium: boolean;
  activeSubscription: Subscription | null;
  plans: PremiumPlan[];
  dailyLikesRemaining: number;
  dailySuperLikesRemaining: number;
  dailyRequestsRemaining: number;
  isBoosted: boolean;
  useLike: () => boolean;
  useSuperLike: () => boolean;
  useRequest: () => boolean;
  activateBoost: () => void;
  purchasePlan: (plan: PremiumPlan) => Promise<{ success: boolean; error?: string }>;
  cancelSubscription: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const { user, updateProfile } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(user?.isPremium || false);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<PremiumPlan[]>(DEFAULT_PREMIUM_PLANS);
  const [likesUsedToday, setLikesUsedToday] = useState<number>(0);
  const [superLikesUsedToday, setSuperLikesUsedToday] = useState<number>(0);
  const [requestsUsedToday, setRequestsUsedToday] = useState<number>(0);
  const [isBoosted, setIsBoosted] = useState<boolean>(false);

  useEffect(() => {
    if (user?.isPremium) {
      setIsPremium(true);
    }
  }, [user]);

  useEffect(() => {
    const loadDailyCounters = async () => {
      const likes = await StorageService.getDailyActionCount('likes');
      const superLikes = await StorageService.getDailyActionCount('super_likes');
      const reqs = await StorageService.getDailyActionCount('requests');
      setLikesUsedToday(likes);
      setSuperLikesUsedToday(superLikes);
      setRequestsUsedToday(reqs);
    };
    loadDailyCounters();
  }, []);

  const dailyLikesRemaining = isPremium
    ? 999
    : Math.max(0, FREE_TIER_LIMITS.dailyLikes - likesUsedToday);

  const dailySuperLikesRemaining = isPremium
    ? 50
    : Math.max(0, FREE_TIER_LIMITS.dailySuperLikes - superLikesUsedToday);

  const dailyRequestsRemaining = isPremium
    ? 999
    : Math.max(0, FREE_TIER_LIMITS.dailyConnectionRequests - requestsUsedToday);

  const useLike = (): boolean => {
    if (isPremium) return true;
    if (dailyLikesRemaining > 0) {
      StorageService.incrementDailyAction('likes');
      setLikesUsedToday((prev) => prev + 1);
      return true;
    }
    return false;
  };

  const useSuperLike = (): boolean => {
    if (isPremium) return true;
    if (dailySuperLikesRemaining > 0) {
      StorageService.incrementDailyAction('super_likes');
      setSuperLikesUsedToday((prev) => prev + 1);
      return true;
    }
    return false;
  };

  const useRequest = (): boolean => {
    if (isPremium) return true;
    if (dailyRequestsRemaining > 0) {
      StorageService.incrementDailyAction('requests');
      setRequestsUsedToday((prev) => prev + 1);
      return true;
    }
    return false;
  };

  const activateBoost = () => {
    setIsBoosted(true);
    setTimeout(() => {
      setIsBoosted(false);
    }, 30 * 60 * 1000); // 30 min boost
  };

  const purchasePlan = async (plan: PremiumPlan): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) return { success: false, error: 'User not authenticated' };

      // Step 1: Create Razorpay Order
      const order = await RazorpayService.createOrder(plan, user.id);

      // Step 2: In mobile app, open Razorpay checkout modal / intent
      // Step 3: Server-side payment verification
      const verification = await RazorpayService.verifyPaymentServerSide({
        razorpay_order_id: order.orderId,
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_signature: 'sig_mock_signature_valid',
        userId: user.id,
        planId: plan.id,
      });

      if (verification.success && verification.subscription) {
        setIsPremium(true);
        setActiveSubscription(verification.subscription);
        await updateProfile({
          isPremium: true,
          premiumExpiry: verification.subscription.expiryDate,
        });
        return { success: true };
      } else {
        return { success: false, error: verification.error };
      }
    } catch (e: any) {
      return { success: false, error: e.message || 'Payment processing error' };
    }
  };

  const cancelSubscription = async () => {
    setIsPremium(false);
    setActiveSubscription(null);
    if (user) {
      await updateProfile({ isPremium: false, premiumExpiry: undefined });
    }
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        activeSubscription,
        plans,
        dailyLikesRemaining,
        dailySuperLikesRemaining,
        dailyRequestsRemaining,
        isBoosted,
        useLike,
        useSuperLike,
        useRequest,
        activateBoost,
        purchasePlan,
        cancelSubscription,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};
