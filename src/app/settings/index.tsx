import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
  const { user, logout, deleteAccount } = useAuth();

  const [matchNotifs, setMatchNotifs] = useState(true);
  const [messageNotifs, setMessageNotifs] = useState(true);
  const [superLikeNotifs, setSuperLikeNotifs] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" rightAction="none" showLocation={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Account Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile</Text>
            <Text style={styles.infoValue}>{user?.phone || 'Not linked'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Residency Status</Text>
            <Text style={[styles.infoValue, { color: COLORS.success, fontWeight: '700' }]}>
              Verified Indore Resident ✓
            </Text>
          </View>
        </View>

        {/* Push & In-App Notification Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Notification Preferences</Text>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.toggleTitle}>New Match Alerts ❤️</Text>
              <Text style={styles.toggleDesc}>When you and another Indori like each other</Text>
            </View>
            <Switch
              value={matchNotifs}
              onValueChange={setMatchNotifs}
              trackColor={{ false: '#DDD', true: COLORS.primaryLight }}
              thumbColor={matchNotifs ? COLORS.primary : '#FFF'}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.toggleTitle}>New Messages 💬</Text>
              <Text style={styles.toggleDesc}>Instant alerts for incoming chat messages</Text>
            </View>
            <Switch
              value={messageNotifs}
              onValueChange={setMessageNotifs}
              trackColor={{ false: '#DDD', true: COLORS.primaryLight }}
              thumbColor={messageNotifs ? COLORS.primary : '#FFF'}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.toggleTitle}>Super Likes & Requests ⭐</Text>
              <Text style={styles.toggleDesc}>When someone sends you a special connection</Text>
            </View>
            <Switch
              value={superLikeNotifs}
              onValueChange={setSuperLikeNotifs}
              trackColor={{ false: '#DDD', true: COLORS.primaryLight }}
              thumbColor={superLikeNotifs ? COLORS.primary : '#FFF'}
            />
          </View>
        </View>

        {/* Discovery & Privacy Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Discovery & Privacy</Text>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.toggleTitle}>Incognito Browsing 🕶️</Text>
              <Text style={styles.toggleDesc}>Only be visible to profiles you like (VIP feature)</Text>
            </View>
            <Switch
              value={incognitoMode}
              onValueChange={setIncognitoMode}
              trackColor={{ false: '#DDD', true: COLORS.primaryLight }}
              thumbColor={incognitoMode ? COLORS.primary : '#FFF'}
            />
          </View>
        </View>

        {/* Legal & App Links */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Legal & About</Text>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push('/legal/terms')}
          >
            <Text style={styles.linkRowText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.subtleText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push('/legal/privacy')}
          >
            <Text style={styles.linkRowText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.subtleText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push('/legal/refund')}
          >
            <Text style={styles.linkRowText}>Refund Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.subtleText} />
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 8,
    ...SHADOWS.sm,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EEF2',
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.mutedText,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EEF2',
  },
  toggleTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark,
  },
  toggleDesc: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EEF2',
  },
  linkRowText: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
  },
});
