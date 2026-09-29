import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { SwipeCard } from '../../components/discovery/SwipeCard';
import { ActionButtons } from '../../components/discovery/ActionButtons';
import { ProfileCardModal } from '../../components/discovery/ProfileCardModal';
import { EmptyState } from '../../components/common/EmptyState';
import { useMatch } from '../../context/MatchContext';
import { usePremium } from '../../context/PremiumContext';
import { UserProfile, ReportReason } from '../../types';
import { INDORE_VIBE_PHRASES } from '../../constants/indoreData';
import { FirestoreService } from '../../services/firestoreService';

export default function DiscoverScreen() {
  const {
    currentProfile,
    profilesQueue,
    isLoading,
    likeProfile,
    passProfile,
    superLikeProfile,
    sendConnectionRequest,
    refreshProfiles,
  } = useMatch();

  const { isBoosted, activateBoost } = usePremium();

  const [selectedProfileForModal, setSelectedProfileForModal] = useState<UserProfile | null>(null);
  const [vibeIndex, setVibeIndex] = useState(0);

  const nextVibe = () => {
    setVibeIndex((prev) => (prev + 1) % INDORE_VIBE_PHRASES.length);
  };

  const handleSwipeLeft = (profile: UserProfile) => {
    passProfile(profile);
  };

  const handleSwipeRight = (profile: UserProfile) => {
    likeProfile(profile);
  };

  const handleSuperLike = (profile: UserProfile) => {
    superLikeProfile(profile);
  };

  const handleConnectRequest = () => {
    if (currentProfile) {
      sendConnectionRequest(currentProfile);
    }
  };

  const handleReport = async (profile: UserProfile, reason: ReportReason, evidence: string) => {
    await FirestoreService.submitReport({
      reporterId: 'current_user_id',
      reportedUserId: profile.id,
      reportedUserName: profile.name,
      reason,
      evidence,
    });
    passProfile(profile);
  };

  const handleBlock = async (profile: UserProfile) => {
    await FirestoreService.blockUser('current_user_id', profile.id);
    passProfile(profile);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showLocation rightAction="premium" />

      {/* Cultural Indore Vibe Banner */}
      <TouchableOpacity
        style={styles.vibeBanner}
        onPress={nextVibe}
        activeOpacity={0.8}
      >
        <Ionicons name="sparkles" size={14} color={COLORS.primary} />
        <Text style={styles.vibeText}>{INDORE_VIBE_PHRASES[vibeIndex]}</Text>
      </TouchableOpacity>

      {/* Main Discover Area */}
      <View style={styles.cardArea}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Finding Indori singles nearby...</Text>
          </View>
        ) : currentProfile ? (
          <View style={styles.cardsStack}>
            {/* Background peek card */}
            {profilesQueue.length > 1 && (
              <View style={styles.peekCard}>
                <SwipeCard
                  profile={profilesQueue[1]}
                  onSwipeLeft={() => {}}
                  onSwipeRight={() => {}}
                  onOpenDetails={() => {}}
                  isFirst={false}
                />
              </View>
            )}

            {/* Active Front Card */}
            <SwipeCard
              profile={currentProfile}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onOpenDetails={(p) => setSelectedProfileForModal(p)}
              isFirst={true}
            />
          </View>
        ) : (
          <EmptyState
            type="no-profiles"
            actionTitle="Refresh Profiles"
            onAction={refreshProfiles}
          />
        )}
      </View>

      {/* Action Buttons Bottom */}
      {currentProfile && (
        <View style={styles.actionsContainer}>
          <ActionButtons
            onPass={() => handleSwipeLeft(currentProfile)}
            onLike={() => handleSwipeRight(currentProfile)}
            onSuperLike={() => handleSuperLike(currentProfile)}
            onRequest={handleConnectRequest}
          />
        </View>
      )}

      {/* Profile Detail Drawer Modal */}
      <ProfileCardModal
        visible={!!selectedProfileForModal}
        profile={selectedProfileForModal}
        onClose={() => setSelectedProfileForModal(null)}
        onLike={handleSwipeRight}
        onPass={handleSwipeLeft}
        onSuperLike={handleSuperLike}
        onReport={handleReport}
        onBlock={handleBlock}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  vibeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF0F5',
    paddingVertical: 7,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0EB',
  },
  vibeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    letterSpacing: 0.2,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  cardsStack: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  peekCard: {
    position: 'absolute',
    top: 8,
    transform: [{ scale: 0.95 }],
    opacity: 0.6,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.mutedText,
    fontWeight: '600',
  },
  actionsContainer: {
    paddingBottom: SPACING.xs,
  },
});
