import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { firestore } from './firebase';
import { 
  UserProfile, 
  Match, 
  ConnectionRequest, 
  Message, 
  Report, 
  Subscription, 
  VerificationRequest, 
  AppSettings,
  FilterOptions
} from '../types';
import { 
  INITIAL_INDORI_PROFILES, 
  INITIAL_MATCHES, 
  INITIAL_CONNECTION_REQUESTS, 
  INITIAL_MESSAGES_PRIYA,
  INITIAL_APP_SETTINGS,
  INITIAL_REPORTS
} from './mockData';
import { StorageService } from './storageService';

export const FirestoreService = {
  // Profiles
  async getProfiles(currentUserId: string, filters?: Partial<FilterOptions>): Promise<UserProfile[]> {
    try {
      const blockedIds = await StorageService.getBlockedUserIds();
      // Start with base data
      let profiles = [...INITIAL_INDORI_PROFILES];

      // Exclude current user and blocked users
      profiles = profiles.filter(
        (p) => p.id !== currentUserId && !blockedIds.includes(p.id) && !p.isBanned
      );

      // Apply filtering if provided
      if (filters) {
        if (filters.minAge && filters.maxAge) {
          profiles = profiles.filter((p) => p.age >= filters.minAge! && p.age <= filters.maxAge!);
        }
        if (filters.interestedIn && filters.interestedIn !== 'everyone') {
          const targetGender = filters.interestedIn === 'men' ? 'male' : 'female';
          profiles = profiles.filter((p) => p.gender === targetGender);
        }
        if (filters.maxDistanceKm) {
          profiles = profiles.filter((p) => p.location.distanceKm <= filters.maxDistanceKm!);
        }
        if (filters.verifiedOnly) {
          profiles = profiles.filter((p) => p.isVerified);
        }
        if (filters.selectedIndoreTags && filters.selectedIndoreTags.length > 0) {
          profiles = profiles.filter((p) =>
            p.indoreInterests.some((tag) => filters.selectedIndoreTags!.includes(tag))
          );
        }
        if (filters.selectedInterests && filters.selectedInterests.length > 0) {
          profiles = profiles.filter((p) =>
            p.interests.some((i) => filters.selectedInterests!.includes(i))
          );
        }
      }

      return profiles;
    } catch (e) {
      console.error('Error fetching profiles:', e);
      return INITIAL_INDORI_PROFILES;
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(firestore, 'profiles', userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserProfile;
      }
    } catch (e) {
      // Fallback
    }
    const found = INITIAL_INDORI_PROFILES.find((p) => p.id === userId);
    return found || null;
  },

  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(firestore, 'profiles', userId);
      await setDoc(docRef, data, { merge: true });
    } catch (e) {
      // Offline fallback
    }
  },

  // Matches
  async getMatches(userId: string): Promise<Match[]> {
    try {
      // In firestore: query(collection(firestore, 'matches'), where('users', 'array-contains', userId))
      return INITIAL_MATCHES;
    } catch (e) {
      return INITIAL_MATCHES;
    }
  },

  // Connection Requests
  async getConnectionRequests(userId: string): Promise<ConnectionRequest[]> {
    return INITIAL_CONNECTION_REQUESTS;
  },

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    if (conversationId === 'match_priya_user') {
      return INITIAL_MESSAGES_PRIYA;
    }
    return [
      {
        id: 'msg_welcome',
        conversationId,
        senderId: 'system',
        receiverId: 'user',
        text: 'Say hello to your new Indori match! ✨',
        timestamp: new Date().toISOString(),
        isRead: true,
        isDelivered: true,
      },
    ];
  },

  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'isDelivered'>): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      isDelivered: true,
    };
    return newMessage;
  },

  // Reports & Safety
  async submitReport(report: Omit<Report, 'id' | 'createdAt' | 'status'>): Promise<Report> {
    const fullReport: Report = {
      ...report,
      id: `rep_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    return fullReport;
  },

  async blockUser(currentUserId: string, targetUserId: string): Promise<void> {
    await StorageService.addBlockedUserId(targetUserId);
  },

  // Verification
  async submitVerificationRequest(userId: string, userName: string, selfieUrl: string): Promise<VerificationRequest> {
    const req: VerificationRequest = {
      id: `ver_${Date.now()}`,
      userId,
      userName,
      selfieUrl,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    return req;
  },

  // Admin
  async getAdminStats() {
    return {
      totalUsers: 1420,
      newRegistrationsToday: 38,
      activeUsersNow: 215,
      totalMatches: 890,
      messagesSent: 14500,
      paidSubscribers: 184,
      totalRevenueInr: 342000,
      conversionRate: '12.9%',
      pendingReports: INITIAL_REPORTS.filter((r) => r.status === 'pending').length,
      bannedUsers: 6,
    };
  },

  async getAdminReports(): Promise<Report[]> {
    return INITIAL_REPORTS;
  },

  async getAppSettings(): Promise<AppSettings> {
    return INITIAL_APP_SETTINGS;
  },
};
