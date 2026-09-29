import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

const KEYS = {
  CURRENT_USER: '@indori_date_user_profile',
  AUTH_SESSION: '@indori_date_session',
  SWIPED_PROFILES: '@indori_date_swiped_profiles',
  LIKED_PROFILES: '@indori_date_liked_profiles',
  MATCHES: '@indori_date_matches',
  MESSAGES: '@indori_date_messages',
  CONNECTION_REQUESTS: '@indori_date_connection_requests',
  PREMIUM_SUBSCRIPTION: '@indori_date_subscription',
  DAILY_ACTIONS: '@indori_date_daily_actions',
  APP_SETTINGS: '@indori_date_app_settings',
  BLOCKED_USERS: '@indori_date_blocked_users',
  NOTIFICATIONS: '@indori_date_notifications',
};

export const StorageService = {
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving user profile to storage:', e);
    }
  },

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error getting user profile from storage:', e);
      return null;
    }
  },

  async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.CURRENT_USER);
      await AsyncStorage.removeItem(KEYS.AUTH_SESSION);
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  },

  async getDailyActionCount(actionKey: string): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await AsyncStorage.getItem(`${KEYS.DAILY_ACTIONS}_${today}`);
      const actions = data ? JSON.parse(data) : {};
      return actions[actionKey] || 0;
    } catch (e) {
      return 0;
    }
  },

  async incrementDailyAction(actionKey: string): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const storageKey = `${KEYS.DAILY_ACTIONS}_${today}`;
      const data = await AsyncStorage.getItem(storageKey);
      const actions = data ? JSON.parse(data) : {};
      actions[actionKey] = (actions[actionKey] || 0) + 1;
      await AsyncStorage.setItem(storageKey, JSON.stringify(actions));
      return actions[actionKey];
    } catch (e) {
      return 1;
    }
  },

  async getBlockedUserIds(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.BLOCKED_USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async addBlockedUserId(userId: string): Promise<void> {
    try {
      const existing = await this.getBlockedUserIds();
      if (!existing.includes(userId)) {
        existing.push(userId);
        await AsyncStorage.setItem(KEYS.BLOCKED_USERS, JSON.stringify(existing));
      }
    } catch (e) {
      console.error('Error blocking user:', e);
    }
  },
};
