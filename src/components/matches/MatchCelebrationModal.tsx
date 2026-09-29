import React from 'react';
import { View, Text, StyleSheet, Modal, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../common/Button';

interface MatchCelebrationModalProps {
  visible: boolean;
  currentUser: UserProfile;
  matchedUser: UserProfile;
  matchId: string;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  visible,
  currentUser,
  matchedUser,
  matchId,
  onClose,
}) => {
  const handleStartTalking = () => {
    onClose();
    router.push({
      pathname: '/chat/[id]',
      params: {
        id: matchId,
        userName: matchedUser.name,
        userPhoto: matchedUser.photos[0],
        locality: matchedUser.location.locality,
      },
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(23, 23, 23, 0.95)', 'rgba(233, 30, 99, 0.85)']}
          style={styles.container}
        >
          {/* Indore match badge */}
          <View style={styles.indoreVibePill}>
            <Ionicons name="sparkles" size={14} color={COLORS.gold} />
            <Text style={styles.indoreVibeText}>Indore Match Made!</Text>
          </View>

          {/* Heading */}
          <Text style={styles.title}>It's a Match! ❤️</Text>
          <Text style={styles.subtitle}>
            You and {matchedUser.name.split(' ')[0]} liked each other.
          </Text>

          {/* Overlapping Profile Avatars */}
          <View style={styles.avatarRow}>
            <View style={[styles.avatarWrapper, styles.leftAvatar]}>
              <Image
                source={{
                  uri:
                    currentUser.photos[0] ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800',
                }}
                style={styles.avatar}
              />
            </View>

            <View style={styles.heartCenter}>
              <Ionicons name="heart" size={26} color={COLORS.white} />
            </View>

            <View style={[styles.avatarWrapper, styles.rightAvatar]}>
              <Image
                source={{ uri: matchedUser.photos[0] }}
                style={styles.avatar}
              />
            </View>
          </View>

          {/* Common Indori Connection */}
          <View style={styles.connectionCard}>
            <Ionicons name="location-sharp" size={18} color={COLORS.primary} />
            <Text style={styles.connectionText}>
              Both around {matchedUser.location.locality} & {currentUser.location.locality}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Start Talking"
              onPress={handleStartTalking}
              variant="primary"
              size="lg"
              icon={<Ionicons name="chatbubble-ellipses" size={20} color={COLORS.white} />}
            />

            <Button
              title="Keep Exploring"
              onPress={onClose}
              variant="ghost"
              size="md"
              textStyle={{ color: COLORS.white, opacity: 0.8 }}
            />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  indoreVibePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.lg,
  },
  indoreVibeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: SPACING.xl,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
    position: 'relative',
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  leftAvatar: {
    marginRight: -18,
    zIndex: 1,
  },
  rightAvatar: {
    marginLeft: -18,
    zIndex: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  heartCenter: {
    position: 'absolute',
    zIndex: 3,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.md,
  },
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginVertical: SPACING.lg,
  },
  connectionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
});
