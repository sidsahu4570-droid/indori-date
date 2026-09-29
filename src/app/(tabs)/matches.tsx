import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { ConnectionRequestCard } from '../../components/matches/ConnectionRequestCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useMatch } from '../../context/MatchContext';
import { useAuth } from '../../context/AuthContext';
import { Match, ConnectionRequest } from '../../types';
import { formatRelativeTime } from '../../utils/dateUtils';

export default function MatchesScreen() {
  const { user } = useAuth();
  const {
    matches,
    connectionRequests,
    acceptConnectionRequest,
    declineConnectionRequest,
  } = useMatch();

  const [activeTab, setActiveTab] = useState<'matches' | 'requests'>('matches');

  const handleOpenChat = (match: Match) => {
    const otherUserId = match.users.find((id) => id !== user?.id) || match.users[1];
    const otherProfile = match.profiles[otherUserId];

    router.push({
      pathname: '/chat/[id]',
      params: {
        id: match.id,
        userName: otherProfile?.name || 'Match',
        userPhoto: otherProfile?.photo || '',
        locality: otherProfile?.locality || 'Indore',
      },
    });
  };

  const handleAcceptRequest = async (request: ConnectionRequest) => {
    const newMatch = await acceptConnectionRequest(request.id);
    if (newMatch) {
      handleOpenChat(newMatch);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Matches & Connect" rightAction="premium" showLocation={false} />

      {/* Segment Selector */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'matches' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('matches')}
        >
          <Ionicons
            name="heart"
            size={16}
            color={activeTab === 'matches' ? COLORS.primary : COLORS.mutedText}
          />
          <Text
            style={[
              styles.segmentBtnText,
              activeTab === 'matches' && styles.segmentBtnTextActive,
            ]}
          >
            Mutual Matches ({matches.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'requests' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Ionicons
            name="paper-plane"
            size={16}
            color={activeTab === 'requests' ? COLORS.primary : COLORS.mutedText}
          />
          <Text
            style={[
              styles.segmentBtnText,
              activeTab === 'requests' && styles.segmentBtnTextActive,
            ]}
          >
            Requests ({connectionRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'matches' ? (
          /* MUTUAL MATCHES */
          matches.length > 0 ? (
            <View style={styles.matchesGrid}>
              <Text style={styles.sectionHeader}>Tap any match to start chatting 💬</Text>
              <View style={styles.gridRow}>
                {matches.map((match) => {
                  const otherUserId = match.users.find((id) => id !== user?.id) || match.users[1];
                  const profile = match.profiles[otherUserId];

                  return (
                    <TouchableOpacity
                      key={match.id}
                      style={styles.matchCard}
                      onPress={() => handleOpenChat(match)}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={{ uri: profile?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800' }}
                        style={styles.matchPhoto}
                      />
                      <View style={styles.matchInfo}>
                        <Text style={styles.matchName} numberOfLines={1}>
                          {profile?.name}
                        </Text>
                        <Text style={styles.matchLocality} numberOfLines={1}>
                          📍 {profile?.locality}
                        </Text>
                        <Text style={styles.matchTime}>
                          Matched {formatRelativeTime(match.matchedAt)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <EmptyState
              type="no-matches"
              actionTitle="Discover People"
              onAction={() => router.push('/(tabs)')}
            />
          )
        ) : (
          /* CONNECTION REQUESTS */
          connectionRequests.length > 0 ? (
            <View style={styles.requestsContainer}>
              <Text style={styles.sectionHeader}>
                Accept to start talking. Declined requests are quietly removed.
              </Text>
              {connectionRequests.map((req) => (
                <ConnectionRequestCard
                  key={req.id}
                  request={req}
                  onAccept={handleAcceptRequest}
                  onDecline={(r) => declineConnectionRequest(r.id)}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              type="no-matches"
              title="No pending requests"
              description="When someone in Indore sends you a direct connection request, it will appear here."
              actionTitle="Explore Profiles"
              onAction={() => router.push('/(tabs)')}
            />
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3E8EC',
    borderRadius: RADIUS.full,
    padding: 4,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  segmentBtnTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginBottom: SPACING.md,
    fontWeight: '500',
  },
  matchesGrid: {
    gap: SPACING.md,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  matchCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0E0E6',
    ...SHADOWS.sm,
  },
  matchPhoto: {
    width: '100%',
    height: 170,
  },
  matchInfo: {
    padding: SPACING.sm,
  },
  matchName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.dark,
  },
  matchLocality: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  matchTime: {
    fontSize: 10,
    color: COLORS.subtleText,
    marginTop: 4,
  },
  requestsContainer: {
    gap: SPACING.sm,
  },
});
