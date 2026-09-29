import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Gender, InterestedIn, RelationshipIntent } from '../types';
import { StorageService } from '../services/storageService';
import { calculateAge, isAdult } from '../utils/dateUtils';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithPhoneOtp: (phone: string, otp: string) => Promise<boolean>;
  signup: (userData: Partial<UserProfile>) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  isIndoreResident: boolean;
  setIsIndoreResident: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CURRENT_USER: UserProfile = {
  id: 'current_user_id',
  email: 'indori.user@gmail.com',
  phone: '+91 98765 43210',
  name: 'Devansh Vyas',
  dob: '2001-05-12',
  age: 25,
  gender: 'male',
  interestedIn: 'women',
  city: 'Indore',
  isIndoreResident: true,
  isAdult: true,
  photos: [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
  ],
  bio: 'Indore born & bred. Love filter coffee near Saket, evening walks at Meghdoot, and late night drives on the Super Corridor. Looking for someone genuine 🌸',
  occupation: 'Tech Consultant & Explorer',
  education: 'SGSITS Indore',
  height: "5'11\"",
  relationshipIntent: 'Long-term relationship',
  interests: ['Foodie 🍲', 'Café Hopping ☕', 'Music 🎵', 'Road Trips 🚗', 'Cricket 🏏'],
  indoreInterests: ['Vijay Nagar Nightlife 🍸', 'Chappan Dukan Poha 🍽️', 'Super Corridor Drives 🛣️', 'Sarafa Food Walk 🌙'],
  isVerified: true,
  verificationStatus: 'verified',
  isOnline: true,
  lastActive: new Date().toISOString(),
  location: {
    locality: 'Vijay Nagar',
    distanceKm: 0,
  },
  isPremium: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(DEMO_CURRENT_USER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isIndoreResident, setIsIndoreResident] = useState<boolean>(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const saved = await StorageService.getUserProfile();
        if (saved) {
          setUser(saved);
          setIsIndoreResident(saved.isIndoreResident);
        } else {
          // Initialize with demo user for seamless preview
          setUser(DEMO_CURRENT_USER);
          await StorageService.saveUserProfile(DEMO_CURRENT_USER);
        }
      } catch (e) {
        console.error('Session load error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const isAdmin = user?.email === 'admin@indoridate.com' || user?.email === 'admin@indori.com';

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate auth
    let loggedUser: UserProfile;

    if (email.toLowerCase().includes('admin')) {
      loggedUser = {
        ...DEMO_CURRENT_USER,
        id: 'admin_user_01',
        email: 'admin@indoridate.com',
        name: 'Indori Admin',
        isVerified: true,
        isPremium: true,
      };
    } else {
      loggedUser = {
        ...DEMO_CURRENT_USER,
        email,
      };
    }

    setUser(loggedUser);
    await StorageService.saveUserProfile(loggedUser);
    setIsLoading(false);
    return true;
  };

  const loginWithPhoneOtp = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const loggedUser: UserProfile = {
      ...DEMO_CURRENT_USER,
      phone,
    };
    setUser(loggedUser);
    await StorageService.saveUserProfile(loggedUser);
    setIsLoading(false);
    return true;
  };

  const signup = async (userData: Partial<UserProfile>): Promise<boolean> => {
    setIsLoading(true);
    const dob = userData.dob || '2000-01-01';
    const age = calculateAge(dob);

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email: userData.email || 'user@indori.com',
      phone: userData.phone || '',
      name: userData.name || 'New Indori',
      dob,
      age,
      gender: userData.gender || 'male',
      interestedIn: userData.interestedIn || 'women',
      city: 'Indore',
      isIndoreResident: userData.isIndoreResident ?? true,
      isAdult: age >= 18,
      photos: userData.photos && userData.photos.length > 0 ? userData.photos : [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=80'
      ],
      bio: userData.bio || 'Exploring Indore & looking for great connections 🌸',
      occupation: userData.occupation || 'Working in Indore',
      education: userData.education || 'Indore University',
      height: userData.height || "5'9\"",
      relationshipIntent: userData.relationshipIntent || 'Coffee & Conversation',
      interests: userData.interests || ['Foodie 🍲', 'Café Hopping ☕'],
      indoreInterests: userData.indoreInterests || ['Sarafa Food Walk 🌙', 'Chappan Dukan Poha 🍽️'],
      isVerified: false,
      verificationStatus: 'unverified',
      isOnline: true,
      lastActive: new Date().toISOString(),
      location: {
        locality: userData.location?.locality || 'Vijay Nagar',
        distanceKm: 0,
      },
      isPremium: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(newUser);
    await StorageService.saveUserProfile(newUser);
    setIsLoading(false);
    return true;
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData, updatedAt: new Date().toISOString() };
    setUser(updated);
    await StorageService.saveUserProfile(updated);
  };

  const logout = async () => {
    await StorageService.clearSession();
    setUser(null);
  };

  const deleteAccount = async () => {
    await StorageService.clearSession();
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 600));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        login,
        loginWithPhoneOtp,
        signup,
        logout,
        deleteAccount,
        updateProfile,
        resetPassword,
        isIndoreResident,
        setIsIndoreResident,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
