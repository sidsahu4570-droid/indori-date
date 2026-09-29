import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile, ReportReason } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { VerifiedBadge, VIPBadge } from '../common/Badge';
import { IndoreTagChip } from './IndoreTagChip';
import { Button } from '../common/Button';
import { formatDistance } from '../../utils/distanceUtils';
import { ActionButtons } from './ActionButtons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileCardModalProps {
  visible: boolean;
  profile: UserProfile | null;
  onClose: () => void;
  onLike: (profile: UserProfile) => void;
  onPass: (profile: UserProfile) => void;
  onSuperLike: (profile: UserProfile) => void;
  onReport: (profile: UserProfile, reason: ReportReason, evidence: string) => void;
  onBlock: (profile: UserProfile) => void;
}

export const ProfileCardModal: React.FC<ProfileCardModalProps> = ({
  visible,
  profile,
  onClose,
  onLike,
  onPass,
  onSuperLike,
  onReport,
  onBlock,
}) => {
  const [showSafetyMenu, setShowSafetyMenu] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  if (!profile) return null;

  const handleLike = () => {
    onClose();
    onLike(profile);
  };

  const handlePass = () => {
    onClose();
    onPass(profile);
  };

  const handleSuperLike = () => {
    onClose();
    onSuperLike(profile);
  };

  const handleConfirmReport = (reason: ReportReason) => {
    setReportModalVisible(false);
    setShowSafetyMenu(false);
    onReport(profile, reason, 'Reported via profile view');
    onClose();
  };

  const handleConfirmBlock = () => {
    setShowSafetyMenu(false);
    onBlock(profile);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.barTitle}>{profile.name.split(' ')[0]}'s Profile</Text>
          <TouchableOpacity
            onPress={() => setShowSafetyMenu(!showSafetyMenu)}
            style={styles.moreBtn}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color={COLORS.dark} />
          </TouchableOpacity>
        </View>

        {/* Safety dropdown menu */}
        {showSafetyMenu && (
          <View style={styles.safetyMenu}>
            <TouchableOpacity
              style={styles.safetyMenuItem}
              onPress={() => {
                setShowSafetyMenu(false);
                setReportModalVisible(true);
              }}
            >
              <Ionicons name="flag-outline" size={18} color={COLORS.danger} />
              <Text style={styles.safetyMenuTextDanger}>Report {profile.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.safetyMenuItem}
              onPress={handleConfirmBlock}
            >
              <Ionicons name="ban-outline" size={18} color={COLORS.danger} />
              <Text style={styles.safetyMenuTextDanger}>Block {profile.name}</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Photos Carousel */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.photoCarousel}
          >
            {profile.photos.map((photoUrl, idx) => (
              <Image
                key={idx}
                source={{ uri: photoUrl }}
                style={styles.profilePhoto}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Core Info */}
          <View style={styles.contentBody}>
            <View style={styles.nameHeader}>
              <View>
                <View style={styles.nameBadgeRow}>
                  <Text style={styles.fullName}>
                    {profile.name}, {profile.age}
                  </Text>
                  {profile.isVerified && <VerifiedBadge size="lg" />}
                  {profile.isPremium && <VIPBadge label="VIP Gold" />}
                </View>
                <Text style={styles.localitySubtext}>
                  📍 {profile.location.locality}, Indore ({formatDistance(profile.location.distanceKm)})
                </Text>
              </View>
            </View>

            {/* Relationship Intention Card */}
            <View style={styles.intentCard}>
              <Ionicons name="heart-circle" size={24} color={COLORS.primary} />
              <View style={styles.intentInfo}>
                <Text style={styles.intentLabel}>Looking for</Text>
                <Text style={styles.intentValue}>{profile.relationshipIntent}</Text>
              </View>
            </View>

            {/* About / Bio */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.bioBody}>{profile.bio}</Text>
            </View>

            {/* Quick Essentials */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Essentials</Text>
              <View style={styles.essentialsGrid}>
                <View style={styles.essentialItem}>
                  <Ionicons name="briefcase-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.essentialText}>{profile.occupation}</Text>
                </View>
                <View style={styles.essentialItem}>
                  <Ionicons name="school-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.essentialText}>{profile.education}</Text>
                </View>
                {profile.height && (
                  <View style={styles.essentialItem}>
                    <Ionicons name="resize-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.essentialText}>{profile.height}</Text>
                  </View>
                )}
                <View style={styles.essentialItem}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.success} />
                  <Text style={styles.essentialText}>
                    {profile.isVerified ? 'Verified Indori Citizen ✓' : 'Indore Resident'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Indore Cultural Tags */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Indore Vibe & Food Hotspots 🥨</Text>
              <View style={styles.tagsWrap}>
                {profile.indoreInterests.map((tag, i) => (
                  <IndoreTagChip key={i} label={tag} />
                ))}
              </View>
            </View>

            {/* Interests & Passions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests & Passions</Text>
              <View style={styles.tagsWrap}>
                {profile.interests.map((tag, i) => (
                  <IndoreTagChip key={i} label={tag} />
                ))}
              </View>
            </View>

            {/* Safety Reminder */}
            <View style={styles.safetyBox}>
              <Ionicons name="shield-outline" size={18} color={COLORS.mutedText} />
              <Text style={styles.safetyBoxText}>
                Indori Date protects personal info. Never transfer money or reveal private home addresses.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Floating Action Buttons at Bottom */}
        <View style={styles.bottomBar}>
          <ActionButtons
            onPass={handlePass}
            onLike={handleLike}
            onSuperLike={handleSuperLike}
          />
        </View>

        {/* Report Reason Selection Modal */}
        <Modal visible={reportModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.reportModalCard}>
              <Text style={styles.reportTitle}>Report {profile.name}</Text>
              <Text style={styles.reportSubtitle}>
                Help us keep Indori Date safe and authentic for everyone.
              </Text>

              {(
                [
                  'Fake profile / Impersonation',
                  'Harassment or hate speech',
                  'Spam or commercial promotion',
                  'Inappropriate content / Nudity',
                  'Scam or asking for money',
                  'Underage user',
                ] as ReportReason[]
              ).map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={styles.reasonBtn}
                  onPress={() => handleConfirmReport(reason)}
                >
                  <Text style={styles.reasonBtnText}>{reason}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.mutedText} />
                </TouchableOpacity>
              ))}

              <Button
                title="Cancel"
                onPress={() => setReportModalVisible(false)}
                variant="ghost"
                size="sm"
                style={{ marginTop: 10 }}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6EC',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyMenu: {
    position: 'absolute',
    top: 55,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.xs,
    zIndex: 20,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
  },
  safetyMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  safetyMenuTextDanger: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.danger,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  photoCarousel: {
    width: SCREEN_WIDTH,
    height: 380,
  },
  profilePhoto: {
    width: SCREEN_WIDTH,
    height: 380,
  },
  contentBody: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  nameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fullName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.dark,
    letterSpacing: -0.3,
  },
  localitySubtext: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  intentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    ...SHADOWS.sm,
  },
  intentInfo: {
    flex: 1,
  },
  intentLabel: {
    fontSize: 11,
    color: COLORS.mutedText,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  intentValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark,
    marginTop: 2,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
    letterSpacing: -0.2,
  },
  bioBody: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  essentialsGrid: {
    gap: 8,
  },
  essentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#F0E0E6',
  },
  essentialText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    flex: 1,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F9FAFB',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: SPACING.sm,
  },
  safetyBoxText: {
    fontSize: 12,
    color: COLORS.mutedText,
    flex: 1,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#F0E0E6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  reportModalCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.dark,
  },
  reportSubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  reasonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reasonBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
});
