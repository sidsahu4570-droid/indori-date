export type Gender = 'male' | 'female' | 'non-binary' | 'other';
export type InterestedIn = 'men' | 'women' | 'everyone';
export type RelationshipIntent = 
  | 'Long-term relationship'
  | 'Something casual'
  | 'Marriage / Matrimony'
  | 'Coffee & Conversation'
  | 'New friends in Indore'
  | 'Still figuring it out';

export interface IndoreLocation {
  locality: string;
  distanceKm: number;
}

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  name: string;
  dob: string; // YYYY-MM-DD
  age: number;
  gender: Gender;
  interestedIn: InterestedIn;
  city: string; // strictly "Indore"
  isIndoreResident: boolean;
  isAdult: boolean;
  photos: string[];
  bio: string;
  occupation: string;
  education: string;
  height?: string; // e.g., "5'8\""
  relationshipIntent: RelationshipIntent;
  interests: string[];
  indoreInterests: string[];
  isVerified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  isOnline: boolean;
  lastActive: string;
  location: IndoreLocation;
  isBanned?: boolean;
  isSuspended?: boolean;
  isPremium?: boolean;
  premiumExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  users: [string, string];
  profiles: {
    [userId: string]: {
      name: string;
      photo: string;
      occupation: string;
      locality: string;
    };
  };
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSenderId?: string;
  unreadCount?: {
    [userId: string]: number;
  };
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderProfile: {
    id: string;
    name: string;
    age: number;
    photo: string;
    occupation: string;
    bio: string;
    locality: string;
    indoreInterests: string[];
  };
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'location';
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
}

export type ReportReason = 
  | 'Fake profile / Impersonation'
  | 'Harassment or hate speech'
  | 'Spam or commercial promotion'
  | 'Inappropriate content / Nudity'
  | 'Scam or asking for money'
  | 'Underage user'
  | 'Other';

export interface Report {
  id: string;
  reporterId: string;
  reporterName?: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: ReportReason;
  evidence: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
}

export interface Block {
  id: string;
  userId: string;
  blockedUserId: string;
  createdAt: string;
}

export interface PremiumPlan {
  id: 'monthly' | 'six_months' | 'yearly';
  name: string;
  durationMonths: number;
  priceInr: number;
  originalPriceInr: number;
  discountPercent: number;
  features: string[];
  isPopular?: boolean;
  tag?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  expiryDate: string;
  paymentId: string;
  orderId: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  selfieUrl: string;
  idDocUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface AppSettings {
  premiumPrices: {
    monthly: number;
    six_months: number;
    yearly: number;
  };
  freeDailyLikes: number;
  freeDailySearches: number;
  freeDailyRequests: number;
  minAge: number;
  announcement?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'like' | 'match' | 'message' | 'request_accepted' | 'superlike' | 'premium_expiry';
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface FilterOptions {
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  interestedIn: InterestedIn;
  relationshipIntents: RelationshipIntent[];
  selectedInterests: string[];
  selectedIndoreTags: string[];
  verifiedOnly: boolean;
  recentlyActiveOnly: boolean;
}
