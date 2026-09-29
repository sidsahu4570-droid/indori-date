import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { FirestoreService } from '../../services/firestoreService';
import { Report } from '../../types';

export default function AdminScreen() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'users' | 'pricing'>('analytics');

  const [stats, setStats] = useState({
    totalUsers: 1420,
    newRegistrationsToday: 38,
    activeUsersNow: 215,
    totalMatches: 890,
    messagesSent: 14500,
    paidSubscribers: 184,
    totalRevenueInr: 342000,
    conversionRate: '12.9%',
    pendingReports: 2,
    bannedUsers: 6,
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [announcement, setAnnouncement] = useState('✨ Indore Dating Fest: 50% off VIP Gold this weekend!');
  const [priceMonthly, setPriceMonthly] = useState('499');
  const [price6Months, setPrice6Months] = useState('1799');
  const [priceYearly, setPriceYearly] = useState('2799');

  useEffect(() => {
    const load = async () => {
      const r = await FirestoreService.getAdminReports();
      setReports(r);
    };
    load();
  }, []);

  const handleResolveReport = (reportId: string, action: 'ban' | 'dismiss') => {
    Alert.alert(
      action === 'ban' ? 'Ban User' : 'Dismiss Report',
      action === 'ban'
        ? 'User will be permanently banned from Indori Date.'
        : 'This report will be marked as resolved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: action === 'ban' ? 'destructive' : 'default',
          onPress: () => {
            setReports((prev) => prev.filter((r) => r.id !== reportId));
            Alert.alert('Success', 'Action taken successfully.');
          },
        },
      ]
    );
  };

  const handleSavePricing = () => {
    Alert.alert('Pricing Updated', 'New pricing has been saved to Firestore settings.');
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Admin Restricted" showBack />
        <View style={styles.unauthorized}>
          <Ionicons name="lock-closed" size={48} color={COLORS.danger} />
          <Text style={styles.unauthTitle}>Admin Access Required</Text>
          <Text style={styles.unauthDesc}>
            Only verified Indori Date administrators can access this moderation portal.
          </Text>
          <Button
            title="Return to Home"
            onPress={() => router.replace('/(tabs)')}
            variant="primary"
            size="md"
            style={{ marginTop: SPACING.md }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Indori Admin Portal 👑" showBack rightAction="none" showLocation={false} />

      {/* Admin Tabs */}
      <View style={styles.tabBar}>
        {(
          [
            { id: 'analytics', label: 'Analytics' },
            { id: 'reports', label: `Reports (${reports.length})` },
            { id: 'users', label: 'Users' },
            { id: 'pricing', label: 'Pricing' },
          ] as const
        ).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'analytics' && (
          <View style={styles.analyticsSection}>
            <Text style={styles.sectionHeading}>Real-Time Indore Platform Metrics</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="people" size={20} color={COLORS.primary} />
                <Text style={styles.statNumber}>{stats.totalUsers}</Text>
                <Text style={styles.statLabel}>Total Indori Users</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="person-add" size={20} color={COLORS.success} />
                <Text style={styles.statNumber}>+{stats.newRegistrationsToday}</Text>
                <Text style={styles.statLabel}>New Today</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="heart" size={20} color={COLORS.secondary} />
                <Text style={styles.statNumber}>{stats.totalMatches}</Text>
                <Text style={styles.statLabel}>Total Matches</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="cash" size={20} color={COLORS.gold} />
                <Text style={styles.statNumber}>₹{(stats.totalRevenueInr / 1000).toFixed(0)}k</Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiRow}>
                <Text style={styles.kpiLabel}>Paid VIP Subscribers</Text>
                <Text style={styles.kpiValue}>{stats.paidSubscribers} users</Text>
              </View>
              <View style={styles.kpiRow}>
                <Text style={styles.kpiLabel}>Free to VIP Conversion</Text>
                <Text style={styles.kpiValue}>{stats.conversionRate}</Text>
              </View>
              <View style={styles.kpiRow}>
                <Text style={styles.kpiLabel}>Total Messages Exchanged</Text>
                <Text style={styles.kpiValue}>{stats.messagesSent}</Text>
              </View>
              <View style={styles.kpiRow}>
                <Text style={styles.kpiLabel}>Banned Spammers</Text>
                <Text style={[styles.kpiValue, { color: COLORS.danger }]}>{stats.bannedUsers}</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'reports' && (
          <View style={styles.reportsSection}>
            <Text style={styles.sectionHeading}>Pending Community Reports</Text>
            {reports.length > 0 ? (
              reports.map((rep) => (
                <View key={rep.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportSubject}>{rep.reportedUserName}</Text>
                    <View style={styles.reportBadge}>
                      <Text style={styles.reportBadgeText}>{rep.reason}</Text>
                    </View>
                  </View>

                  <Text style={styles.reportEvidence}>“{rep.evidence}”</Text>
                  <Text style={styles.reportedBy}>Reported by: {rep.reporterName || 'Indori User'}</Text>

                  <View style={styles.reportActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.banBtn]}
                      onPress={() => handleResolveReport(rep.id, 'ban')}
                    >
                      <Ionicons name="ban" size={14} color={COLORS.white} />
                      <Text style={styles.btnTextWhite}>Ban User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.dismissBtn]}
                      onPress={() => handleResolveReport(rep.id, 'dismiss')}
                    >
                      <Ionicons name="checkmark" size={14} color={COLORS.dark} />
                      <Text style={styles.btnTextDark}>Dismiss</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Ionicons name="shield-checkmark" size={36} color={COLORS.success} />
                <Text style={styles.emptyBoxTitle}>All Reports Cleared!</Text>
                <Text style={styles.emptyBoxSubtitle}>Indori Date community is safe and clean.</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'users' && (
          <View style={styles.usersSection}>
            <Text style={styles.sectionHeading}>Indore User Management</Text>
            <View style={styles.userSearchWrap}>
              <Ionicons name="search" size={18} color={COLORS.mutedText} />
              <TextInput style={styles.userSearchInput} placeholder="Search users by name/phone..." />
            </View>

            <View style={styles.userRowCard}>
              <View style={styles.userInfoLeft}>
                <Text style={styles.userNameText}>Priya Sharma (24)</Text>
                <Text style={styles.userSubText}>Vijay Nagar • VIP Member ✓</Text>
              </View>
              <TouchableOpacity
                style={styles.inspectBtn}
                onPress={() => Alert.alert('User Details', 'Status: Active, Verified: Yes, Reports: 0')}
              >
                <Text style={styles.inspectBtnText}>Manage</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userRowCard}>
              <View style={styles.userInfoLeft}>
                <Text style={styles.userNameText}>Aarav Patel (25)</Text>
                <Text style={styles.userSubText}>Scheme 54 • Free Plan</Text>
              </View>
              <TouchableOpacity
                style={styles.inspectBtn}
                onPress={() => Alert.alert('User Details', 'Status: Active, Verified: Yes, Reports: 0')}
              >
                <Text style={styles.inspectBtnText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'pricing' && (
          <View style={styles.pricingSection}>
            <Text style={styles.sectionHeading}>VIP Pricing & Announcement Controls</Text>

            <View style={styles.settingCard}>
              <Text style={styles.settingTitle}>Broadcast Announcement</Text>
              <TextInput
                style={styles.settingInput}
                value={announcement}
                onChangeText={setAnnouncement}
                multiline
              />
            </View>

            <View style={styles.settingCard}>
              <Text style={styles.settingTitle}>Monthly VIP Price (₹)</Text>
              <TextInput
                style={styles.priceInput}
                value={priceMonthly}
                onChangeText={setPriceMonthly}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.settingCard}>
              <Text style={styles.settingTitle}>6 Months Gold Price (₹)</Text>
              <TextInput
                style={styles.priceInput}
                value={price6Months}
                onChangeText={setPrice6Months}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.settingCard}>
              <Text style={styles.settingTitle}>12 Months Platinum Price (₹)</Text>
              <TextInput
                style={styles.priceInput}
                value={priceYearly}
                onChangeText={setPriceYearly}
                keyboardType="numeric"
              />
            </View>

            <Button
              title="Save App Settings"
              onPress={handleSavePricing}
              variant="primary"
              size="lg"
            />
          </View>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E0E6',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  tabTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: 6,
  },
  analyticsSection: {
    gap: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 4,
    ...SHADOWS.sm,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.dark,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.mutedText,
    fontWeight: '600',
  },
  kpiCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 10,
    ...SHADOWS.sm,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EEF2',
  },
  kpiLabel: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: '500',
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  reportsSection: {
    gap: SPACING.md,
  },
  reportCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 6,
    ...SHADOWS.sm,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportSubject: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.dark,
  },
  reportBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  reportBadgeText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  reportEvidence: {
    fontSize: 13,
    color: '#444',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  reportedBy: {
    fontSize: 11,
    color: COLORS.subtleText,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  banBtn: {
    backgroundColor: COLORS.danger,
  },
  dismissBtn: {
    backgroundColor: '#F3F4F6',
  },
  btnTextWhite: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  btnTextDark: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyBox: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#F0E0E6',
  },
  emptyBoxTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
  },
  emptyBoxSubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
  },
  usersSection: {
    gap: SPACING.md,
  },
  userSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    height: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 8,
  },
  userSearchInput: {
    flex: 1,
    fontSize: 14,
  },
  userRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    ...SHADOWS.sm,
  },
  userInfoLeft: {
    gap: 2,
  },
  userNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.dark,
  },
  userSubText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  inspectBtn: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  inspectBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  pricingSection: {
    gap: SPACING.md,
  },
  settingCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 6,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.dark,
  },
  settingInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    fontSize: 13,
    minHeight: 60,
  },
  priceInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark,
  },
  unauthorized: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: 8,
  },
  unauthTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.dark,
  },
  unauthDesc: {
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
  },
});
