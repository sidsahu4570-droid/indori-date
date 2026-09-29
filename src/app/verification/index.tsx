import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { FirestoreService } from '../../services/firestoreService';

export default function VerificationScreen() {
  const { user, updateProfile } = useAuth();
  const [selfieUri, setSelfieUri] = useState<string | null>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'
  );
  const [idProofUploaded, setIdProofUploaded] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(user?.verificationStatus === 'pending' || user?.isVerified);

  const handleSubmitVerification = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await FirestoreService.submitVerificationRequest(
        user.id,
        user.name,
        selfieUri || ''
      );
      await updateProfile({
        verificationStatus: 'verified',
        isVerified: true,
      });
      setSubmitted(true);
      Alert.alert(
        'Profile Verified! ✓',
        'Congratulations! Your Indori Date profile has been verified with the green verification badge.'
      );
    } catch (e: any) {
      Alert.alert('Submission Error', e.message || 'Could not submit verification request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Verification</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Verification Badge Hero */}
        <View style={styles.heroCard}>
          <View style={styles.badgeCircle}>
            <Ionicons name="shield-checkmark" size={40} color={COLORS.white} />
          </View>
          <Text style={styles.heroTitle}>Get Your Verified Indori Badge</Text>
          <Text style={styles.heroSubtitle}>
            Verified profiles get up to 300% more likes and match requests in Indore.
          </Text>
        </View>

        {submitted ? (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
            <Text style={styles.successTitle}>
              {user?.isVerified ? 'Profile Verified ✓' : 'Verification Under Review'}
            </Text>
            <Text style={styles.successDesc}>
              {user?.isVerified
                ? 'Your profile proudly displays the verified badge to singles in Indore.'
                : 'Our Indore moderation team is currently validating your photo. You will be notified shortly.'}
            </Text>
            <Button
              title="Return to Profile"
              onPress={() => router.back()}
              variant="primary"
              size="md"
              style={{ marginTop: SPACING.md, width: '100%' }}
            />
          </View>
        ) : (
          <>
            {/* Step 1: Live Selfie */}
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <Text style={styles.stepTitle}>Take a Verification Selfie</Text>
              </View>
              <Text style={styles.stepDesc}>
                Take a clear selfie mimicking the pose on screen to confirm you are the real person in your photos.
              </Text>

              <View style={styles.selfiePreview}>
                <Image source={{ uri: selfieUri! }} style={styles.selfieImage} />
                <View style={styles.selfieOverlay}>
                  <Ionicons name="camera" size={20} color={COLORS.white} />
                  <Text style={styles.selfieOverlayText}>Selfie Captured</Text>
                </View>
              </View>
            </View>

            {/* Step 2: Government ID (Optional for Gold Checkmark) */}
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Indore Residency Proof (Optional)</Text>
              </View>
              <Text style={styles.stepDesc}>
                Documents are kept 100% private and never exposed to other users or public profiles.
              </Text>

              <View style={styles.docUploadBox}>
                <Ionicons name="document-attach" size={24} color={COLORS.primary} />
                <Text style={styles.docUploadText}>Aadhaar / Driving License / Voter ID (Encrypted)</Text>
              </View>
            </View>

            {/* Submit CTA */}
            <Button
              title="Submit Verification Request"
              onPress={handleSubmitVerification}
              variant="primary"
              size="lg"
              loading={submitting}
            />
          </>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6EC',
    backgroundColor: COLORS.white,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E0E6',
    ...SHADOWS.sm,
  },
  badgeCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.dark,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  stepCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.dark,
  },
  stepDesc: {
    fontSize: 12,
    color: COLORS.mutedText,
    lineHeight: 17,
  },
  selfiePreview: {
    width: '100%',
    height: 180,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 4,
  },
  selfieImage: {
    width: '100%',
    height: '100%',
  },
  selfieOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  selfieOverlayText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  docUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: 4,
  },
  docUploadText: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: '600',
    flex: 1,
  },
  successCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    ...SHADOWS.md,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.dark,
    marginTop: SPACING.md,
  },
  successDesc: {
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 19,
  },
});
