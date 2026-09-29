import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Match, ConnectionRequest, FilterOptions } from '../types';
import { FirestoreService } from '../services/firestoreService';
import { NotificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';
import { usePremium } from './PremiumContext';

interface MatchCelebrationData {
  currentUser: UserProfile;
  matchedUser: UserProfile;
  matchId: string;
}

interface MatchContextType {
  profilesQueue: UserProfile[];
  currentProfile: UserProfile | null;
  matches: Match[];
  connectionRequests: ConnectionRequest[];
  isLoading: boolean;
  matchCelebration: MatchCelebrationData | null;
  clearMatchCelebration: () => void;
  likeProfile: (profile: UserProfile) => Promise<boolean>;
  superLikeProfile: (profile: UserProfile) => Promise<boolean>;
  passProfile: (profile: UserProfile) => void;
  sendConnectionRequest: (profile: UserProfile) => Promise<boolean>;
  acceptConnectionRequest: (requestId: string) => Promise<Match | null>;
  declineConnectionRequest: (requestId: string) => Promise<void>;
  unmatchUser: (matchId: string) => Promise<void>;
  applyFilters: (filters: Partial<FilterOptions>) => Promise<void>;
  refreshProfiles: () => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { useLike, useSuperLike, useRequest } = usePremium();

  const [profilesQueue, setProfilesQueue] = useState<UserProfile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [matchCelebration, setMatchCelebration] = useState<MatchCelebrationData | null>(null);

  const loadData = async (filters?: Partial<FilterOptions>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [fetchedProfiles, fetchedMatches, fetchedRequests] = await Promise.all([
        FirestoreService.getProfiles(user.id, filters),
        FirestoreService.getMatches(user.id),
        FirestoreService.getConnectionRequests(user.id),
      ]);
      setProfilesQueue(fetchedProfiles);
      setMatches(fetchedMatches);
      setConnectionRequests(fetchedRequests);
    } catch (e) {
      console.error('Error loading discovery data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const currentProfile = profilesQueue.length > 0 ? profilesQueue[0] : null;

  const likeProfile = async (targetProfile: UserProfile): Promise<boolean> => {
    if (!useLike()) {
      return false; // Reached free daily limit
    }

    // Remove from queue
    setProfilesQueue((prev) => prev.filter((p) => p.id !== targetProfile.id));

    // Simulate mutual match check (e.g. Priya Sharma or Ananya triggers match)
    const isMutual = targetProfile.id.includes('priya') || targetProfile.id.includes('ananya') || Math.random() > 0.4;

    if (isMutual && user) {
      const newMatch: Match = {
        id: `match_${Date.now()}`,
        users: [user.id, targetProfile.id],
        profiles: {
          [user.id]: {
            name: user.name,
            photo: user.photos[0] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800',
            occupation: user.occupation,
            locality: user.location.locality,
          },
          [targetProfile.id]: {
            name: targetProfile.name,
            photo: targetProfile.photos[0],
            occupation: targetProfile.occupation,
            locality: targetProfile.location.locality,
          },
        },
        matchedAt: new Date().toISOString(),
        lastMessage: `You and ${targetProfile.name.split(' ')[0]} matched! ❤️`,
        lastMessageTime: new Date().toISOString(),
        unreadCount: {
          [user.id]: 0,
          [targetProfile.id]: 0,
        },
      };

      setMatches((prev) => [newMatch, ...prev]);

      // Trigger Celebration Modal
      setMatchCelebration({
        currentUser: user,
        matchedUser: targetProfile,
        matchId: newMatch.id,
      });

      NotificationService.notify({
        userId: user.id,
        type: 'match',
        title: "It's a Match! ❤️",
        body: `You and ${targetProfile.name} liked each other. Say hello!`,
        data: { matchId: newMatch.id },
      });
    }

    return true;
  };

  const superLikeProfile = async (targetProfile: UserProfile): Promise<boolean> => {
    if (!useSuperLike()) {
      return false;
    }

    setProfilesQueue((prev) => prev.filter((p) => p.id !== targetProfile.id));

    // Super like creates instant match with high probability
    if (user) {
      const newMatch: Match = {
        id: `match_super_${Date.now()}`,
        users: [user.id, targetProfile.id],
        profiles: {
          [user.id]: {
            name: user.name,
            photo: user.photos[0],
            occupation: user.occupation,
            locality: user.location.locality,
          },
          [targetProfile.id]: {
            name: targetProfile.name,
            photo: targetProfile.photos[0],
            occupation: targetProfile.occupation,
            locality: targetProfile.location.locality,
          },
        },
        matchedAt: new Date().toISOString(),
        lastMessage: `⭐ Super Liked! Start the conversation.`,
        lastMessageTime: new Date().toISOString(),
      };

      setMatches((prev) => [newMatch, ...prev]);
      setMatchCelebration({
        currentUser: user,
        matchedUser: targetProfile,
        matchId: newMatch.id,
      });
    }

    return true;
  };

  const passProfile = (targetProfile: UserProfile) => {
    setProfilesQueue((prev) => prev.filter((p) => p.id !== targetProfile.id));
  };

  const sendConnectionRequest = async (targetProfile: UserProfile): Promise<boolean> => {
    if (!useRequest()) return false;

    setProfilesQueue((prev) => prev.filter((p) => p.id !== targetProfile.id));
    NotificationService.notify({
      userId: user?.id || '',
      type: 'like',
      title: 'Connection Request Sent 💌',
      body: `Your request was sent to ${targetProfile.name}.`,
    });
    return true;
  };

  const acceptConnectionRequest = async (requestId: string): Promise<Match | null> => {
    const req = connectionRequests.find((r) => r.id === requestId);
    if (!req || !user) return null;

    // Remove from pending
    setConnectionRequests((prev) => prev.filter((r) => r.id !== requestId));

    // Add to active matches
    const newMatch: Match = {
      id: `match_accepted_${Date.now()}`,
      users: [user.id, req.senderId],
      profiles: {
        [user.id]: {
          name: user.name,
          photo: user.photos[0],
          occupation: user.occupation,
          locality: user.location.locality,
        },
        [req.senderId]: {
          name: req.senderProfile.name,
          photo: req.senderProfile.photo,
          occupation: req.senderProfile.occupation,
          locality: req.senderProfile.locality,
        },
      },
      matchedAt: new Date().toISOString(),
      lastMessage: 'You accepted the connection request! 💬',
      lastMessageTime: new Date().toISOString(),
    };

    setMatches((prev) => [newMatch, ...prev]);

    NotificationService.notify({
      userId: user.id,
      type: 'request_accepted',
      title: 'Connection Accepted 🎉',
      body: `You can now talk to ${req.senderProfile.name}.`,
      data: { matchId: newMatch.id },
    });

    return newMatch;
  };

  const declineConnectionRequest = async (requestId: string) => {
    setConnectionRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const unmatchUser = async (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  const applyFilters = async (filters: Partial<FilterOptions>) => {
    await loadData(filters);
  };

  const refreshProfiles = async () => {
    await loadData();
  };

  const clearMatchCelebration = () => {
    setMatchCelebration(null);
  };

  return (
    <MatchContext.Provider
      value={{
        profilesQueue,
        currentProfile,
        matches,
        connectionRequests,
        isLoading,
        matchCelebration,
        clearMatchCelebration,
        likeProfile,
        superLikeProfile,
        passProfile,
        sendConnectionRequest,
        acceptConnectionRequest,
        declineConnectionRequest,
        unmatchUser,
        applyFilters,
        refreshProfiles,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
