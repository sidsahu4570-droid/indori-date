import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 'md' }) => {
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;
  const badgeSize = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;

  return (
    <View style={[styles.verifiedContainer, { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 }]}>
      <Ionicons name="checkmark-sharp" size={iconSize} color={COLORS.white} />
    </View>
  );
};

interface VIPBadgeProps {
  label?: string;
}

export const VIPBadge: React.FC<VIPBadgeProps> = ({ label = 'VIP' }) => {
  return (
    <View style={styles.vipContainer}>
      <Ionicons name="star" size={11} color={COLORS.dark} />
      <Text style={styles.vipText}>{label}</Text>
    </View>
  );
};

interface TagBadgeProps {
  text: string;
  isIndori?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ text, isIndori = false }) => {
  return (
    <View style={[styles.tagContainer, isIndori && styles.tagIndori]}>
      <Text style={[styles.tagText, isIndori && styles.tagTextIndori]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  verifiedContainer: {
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  vipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  vipText: {
    color: COLORS.dark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  tagIndori: {
    backgroundColor: COLORS.secondaryLight,
    borderWidth: 1,
    borderColor: '#FFD6E3',
  },
  tagText: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: '500',
  },
  tagTextIndori: {
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
});
