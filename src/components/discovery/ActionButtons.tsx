import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, RADIUS, SPACING } from '../../constants/theme';
import { usePremium } from '../../context/PremiumContext';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onRequest?: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPass,
  onLike,
  onSuperLike,
  onRequest,
  disabled = false,
}) => {
  const { dailyLikesRemaining, dailySuperLikesRemaining, isPremium } = usePremium();

  const handlePress = (action: () => void, type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (disabled) return;
    try {
      if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {
      // Haptics fallback
    }
    action();
  };

  return (
    <View style={styles.container}>
      {/* PASS BUTTON */}
      <TouchableOpacity
        style={[styles.btn, styles.passBtn]}
        onPress={() => handlePress(onPass, 'light')}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Ionicons name="close-outline" size={30} color={COLORS.danger} />
      </TouchableOpacity>

      {/* SUPER LIKE BUTTON */}
      <TouchableOpacity
        style={[styles.btn, styles.superBtn]}
        onPress={() => handlePress(onSuperLike, 'heavy')}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Ionicons name="star" size={24} color={COLORS.gold} />
        {!isPremium && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{dailySuperLikesRemaining}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* LIKE BUTTON */}
      <TouchableOpacity
        style={[styles.btn, styles.likeBtn]}
        onPress={() => handlePress(onLike, 'medium')}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Ionicons name="heart" size={34} color={COLORS.white} />
        {!isPremium && (
          <View style={styles.likeCountBadge}>
            <Text style={styles.likeCountText}>{dailyLikesRemaining}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* DIRECT CONNECT REQUEST */}
      {onRequest && (
        <TouchableOpacity
          style={[styles.btn, styles.requestBtn]}
          onPress={() => handlePress(onRequest, 'light')}
          activeOpacity={0.8}
          disabled={disabled}
        >
          <Ionicons name="paper-plane-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    ...SHADOWS.md,
  },
  passBtn: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
  },
  superBtn: {
    width: 52,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    position: 'relative',
  },
  likeBtn: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.primary,
    ...SHADOWS.lg,
    position: 'relative',
  },
  requestBtn: {
    width: 52,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#FCE4EC',
  },
  countBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.full,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  countText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  likeCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  likeCountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
