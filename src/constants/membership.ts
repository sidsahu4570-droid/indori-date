import { PremiumPlan } from '../types';

export const FREE_TIER_LIMITS = {
  dailyLikes: 15,
  dailySuperLikes: 1,
  dailyConnectionRequests: 5,
  dailySearches: 20,
  seeWhoLikedYou: false,
  profileBoost: false,
  advancedFilters: false,
  unlimitedRewind: false,
};

export const DEFAULT_PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'monthly',
    name: '1 Month VIP',
    durationMonths: 1,
    priceInr: 499,
    originalPriceInr: 999,
    discountPercent: 50,
    features: [
      'Unlimited Likes daily',
      'See who liked your profile',
      '5 Free Super Likes weekly',
      'Advanced Indore Locality filters',
      '1 Free Profile Boost per month',
      'Priority discovery in Indore queue',
      'Ad-free uninterrupted experience',
    ],
    isPopular: false,
    tag: 'STARTER',
  },
  {
    id: 'six_months',
    name: '6 Months Gold',
    durationMonths: 6,
    priceInr: 1799,
    originalPriceInr: 3999,
    discountPercent: 55,
    features: [
      'Everything in 1 Month VIP',
      'Unlimited Likes & Rewinds',
      'See who liked your profile instantly',
      '15 Super Likes monthly',
      '3 Profile Boosts per month',
      'Verified VIP Gold Badge on profile',
      'Priority chat read receipts',
      'Direct connect requests without limits',
    ],
    isPopular: true,
    tag: 'MOST POPULAR • BEST VALUE',
  },
  {
    id: 'yearly',
    name: '12 Months Platinum',
    durationMonths: 12,
    priceInr: 2799,
    originalPriceInr: 7999,
    discountPercent: 65,
    features: [
      'Everything in 6 Months Gold',
      'Highest Discovery Boost in Indore',
      'Unlimited Super Likes & Rewinds',
      'Exclusive Platinum VIP Badge',
      'Direct Priority Matchmaking Support',
      'Full safety insurance & profile concierge',
    ],
    isPopular: false,
    tag: 'MAX SAVINGS (65% OFF)',
  },
];

export const SAFETY_GUIDELINES = [
  {
    id: '1',
    title: 'Meet in Lively Public Places',
    description: 'For your first few dates, always meet at well-known, crowded Indore spots like Chappan Dukan, Phoenix Citadel, Vijay Nagar cafés, or C21 Mall.',
    icon: 'coffee',
  },
  {
    id: '2',
    title: 'Never Share Financial Details',
    description: 'Never send money, UPI transfers, OTPs, or bank details to anyone on Indori Date under any circumstances.',
    icon: 'shield-alert',
  },
  {
    id: '3',
    title: 'Keep Friends or Family Informed',
    description: 'Share your live location or let a close friend or family member know where you are going and who you are meeting.',
    icon: 'navigation',
  },
  {
    id: '4',
    title: 'Protect Your Exact Address',
    description: 'Never give your home address or private personal information early on. Indori Date never reveals your exact location.',
    icon: 'lock',
  },
  {
    id: '5',
    title: 'Report Suspicious Behavior Instantly',
    description: 'If anyone behaves inappropriately, threatens you, asks for money, or seems fake, immediately report and block them in the app.',
    icon: 'flag',
  },
];
