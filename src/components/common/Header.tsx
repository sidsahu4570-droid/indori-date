import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { usePremium } from '../../context/PremiumContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title?: string;
  showLocation?: boolean;
  showBack?: boolean;
  rightAction?: 'premium' | 'settings' | 'admin' | 'none';
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showLocation = true,
  showBack = false,
  rightAction = 'premium',
  onBackPress,
}) => {
  const { isPremium } = usePremium();
  const { isAdmin } = useAuth();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.iconButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="heart" size={16} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.brandName}>Indori Date</Text>
              {showLocation && (
                <View style={styles.locationRow}>
                  <Ionicons name="location-sharp" size={10} color={COLORS.primary} />
                  <Text style={styles.locationText}>Indore, MP</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {title && (
        <View style={styles.titleSection}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      <View style={styles.rightSection}>
        {isAdmin && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.adminBtn]}
            onPress={() => router.push('/admin')}
          >
            <Ionicons name="shield-checkmark" size={16} color={COLORS.white} />
            <Text style={styles.adminBtnText}>Admin</Text>
          </TouchableOpacity>
        )}

        {rightAction === 'premium' && (
          <TouchableOpacity
            style={[styles.vipPill, isPremium && styles.vipPillActive]}
            onPress={() => router.push('/premium')}
          >
            <Ionicons
              name="sparkles"
              size={13}
              color={isPremium ? COLORS.white : COLORS.gold}
            />
            <Text style={[styles.vipText, isPremium && styles.vipTextActive]}>
              {isPremium ? 'VIP Gold' : 'Upgrade'}
            </Text>
          </TouchableOpacity>
        )}

        {rightAction === 'settings' && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={22} color={COLORS.dark} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6EC',
    zIndex: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.dark,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 100,
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFE082',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  vipPillActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  vipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gold,
  },
  vipTextActive: {
    color: COLORS.white,
  },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.dark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  adminBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtn: {
    padding: 6,
  },
});
