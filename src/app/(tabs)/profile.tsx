import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { VerifiedBadge, VIPBadge } from '../../components/common/Badge';
import { IndoreTagChip } from '../../components/discovery/IndoreTagChip';
import { useAuth } from '../../context/AuthContext';
import { usePremium } from '../../context/PremiumContext';

export default function ProfileScreen() {
  const { user, logout, deleteAccount } = useAuth();
  const { isPremium, activeSubscription } = usePremium();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Indori Date?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your Indori Date profile, matches, and messages. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
            router.replace('/(auth)/onboarding');
          },
        },
      ]
    );
  };

  const profilePhoto =
    user?.photos && user.photos.length > 0
      ? user.photos[0]
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800';

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Profile" rightAction="settings" showLocation={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Card Hero */}
        <View style={styles.profileHeroCard}>
          <Image source={{ uri: profilePhoto }} style={styles.heroAvatar} />

          <View style={styles.heroInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>
                {user?.name || 'Indori User'}, {user?.age || 24}
              </Text>
              {user?.isVerified ? (
                <VerifiedBadge size="md" />
              ) : (
                <TouchableOpacity
                  onPress={() => router.push('/verification')}
                  style={styles.getVerifiedBadge}
                >
                  <Text style={styles.getVerifiedText}>Get Verified</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.localityText}>
              📍 {user?.location?.locality || 'Vijay Nagar'}, Indore
            </Text>
            <Text style={styles.occupationText}>{user?.occupation || 'Working in Indore'}</Text>
          </View>
        </View>

        {/* Membership Banner */}
        <TouchableOpacity
          style={[styles.vipBanner, isPremium && styles.vipBannerActive]}
          onPress={() => router.push('/premium')}
          activeOpacity={0.9}
        >
          <View style={styles.vipIconCircle}>
            <Ionicons name="sparkles" size={20} color={isPremium ? COLORS.white : COLORS.gold} />
          </View>
          <View style={styles.vipTextWrap}>
            <Text style={styles.vipBannerTitle}>
              {isPremium ? 'VIP Gold Active 👑' : 'Upgrade to Indori Date VIP'}
            </Text>
            <Text style={styles.vipBannerSubtitle}>
              {isPremium
                ? 'Unlimited Likes, Boosts, & See Who Liked You'
                : 'Get 5x more matches in Indore with VIP status'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={isPremium ? COLORS.white : COLORS.gold} />
        </TouchableOpacity>

        {/* Bio & Indore Tags */}
        <View style={styles.detailsCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <TouchableOpacity onPress={() => router.push('/settings/edit-profile')}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.bioText}>“{user?.bio}”</Text>

          <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>
            My Indore Hangout Spots 🥨
          </Text>
          <View style={styles.tagsRow}>
            {user?.indoreInterests?.map((tag, idx) => (
              <IndoreTagChip key={idx} label={tag} size="sm" />
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>
            Relationship Intention
          </Text>
          <View style={styles.intentPill}>
            <Ionicons name="heart-outline" size={16} color={COLORS.primary} />
            <Text style={styles.intentPillText}>{user?.relationshipIntent}</Text>
          </View>
        </View>

        {/* Navigation Menu Options */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/settings/edit-profile')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
              <Text style={styles.menuText}>Edit Profile Details</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtleText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/verification')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.success} />
              <Text style={styles.menuText}>Profile Verification (Get Blue Tick)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtleText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/premium')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="card-outline" size={20} color={COLORS.gold} />
              <Text style={styles.menuText}>VIP Membership & Billing</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtleText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/safety')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="shield-outline" size={20} color={COLORS.dark} />
              <Text style={styles.menuText}>Safety Center & Guidelines</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtleText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={20} color={COLORS.dark} />
              <Text style={styles.menuText}>Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtleText} />
          </TouchableOpacity>
        </View>

        {/* Legal & Policies */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/legal/terms')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.mutedText} />
              <Text style={styles.menuText}>Terms & Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtleText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/legal/privacy')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.mutedText} />
              <Text style={styles.menuText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtleText} />
          </TouchableOpacity>
        </View>

        {/* Logout & Delete Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Indori Date v1.0.0 • Made with ❤️ in Indore</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: 50,
  },
  profileHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    ...SHADOWS.sm,
    gap: 14,
  },
  heroAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  heroInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
  },
  getVerifiedBadge: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  getVerifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  localityText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  occupationText: {
    fontSize: 13,
    color: COLORS.mutedText,
  },
  vipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderWidth: 1.5,
    borderColor: '#FFE082',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: 12,
  },
  vipBannerActive: {
    backgroundColor: COLORS.gold,
    borderColor: '#B8860B',
  },
  vipIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 167, 44, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipTextWrap: {
    flex: 1,
  },
  vipBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.dark,
  },
  vipBannerSubtitle: {
    fontSize: 12,
    color: '#775500',
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    ...SHADOWS.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.dark,
  },
  editLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bioText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  intentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  intentPillText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EEF2',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  actionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    padding: SPACING.sm,
    gap: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: SPACING.sm,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: SPACING.sm,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.danger,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.subtleText,
    marginVertical: SPACING.md,
  },
});
