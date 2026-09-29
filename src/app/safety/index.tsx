import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { SAFETY_GUIDELINES } from '../../constants/membership';
import { StorageService } from '../../services/storageService';

export default function SafetyCenterScreen() {
  const [blockedCount, setBlockedCount] = useState(0);

  useEffect(() => {
    const loadBlocked = async () => {
      const ids = await StorageService.getBlockedUserIds();
      setBlockedCount(ids.length);
    };
    loadBlocked();
  }, []);

  const handleReportIncident = () => {
    Alert.alert(
      'Emergency / Immediate Support',
      'For immediate safety emergencies in Indore, please contact Indore Police helpline at 112 or Women Helpline at 1090. For in-app harassment, report the user directly from their chat or profile.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Safety Center" rightAction="none" showLocation={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Safety Header Banner */}
        <View style={styles.safetyHero}>
          <View style={styles.heroShield}>
            <Ionicons name="shield-checkmark" size={36} color={COLORS.white} />
          </View>
          <Text style={styles.heroTitle}>Your Safety in Indore Comes First</Text>
          <Text style={styles.heroSubtitle}>
            Indori Date is committed to creating a respectful, authentic, and secure dating environment.
          </Text>
        </View>

        {/* Essential Safety Guidelines */}
        <Text style={styles.sectionTitle}>Essential Safe Dating Rules</Text>
        <View style={styles.guidelinesList}>
          {SAFETY_GUIDELINES.map((item) => (
            <View key={item.id} style={styles.guidelineCard}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={
                    item.id === '1'
                      ? 'cafe-outline'
                      : item.id === '2'
                      ? 'warning-outline'
                      : item.id === '3'
                      ? 'people-outline'
                      : item.id === '4'
                      ? 'lock-closed-outline'
                      : 'flag-outline'
                  }
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.guidelineContent}>
                <Text style={styles.guidelineTitle}>{item.title}</Text>
                <Text style={styles.guidelineDesc}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Emergency & Local Helplines */}
        <View style={styles.helplineCard}>
          <Text style={styles.helplineTitle}>Indore City Emergency Helplines</Text>
          <View style={styles.helplineRow}>
            <Text style={styles.helplineName}>Indore Police Emergency</Text>
            <Text style={styles.helplineNumber}>112</Text>
          </View>
          <View style={styles.helplineRow}>
            <Text style={styles.helplineName}>Madhya Pradesh Women Helpline</Text>
            <Text style={styles.helplineNumber}>1090</Text>
          </View>
          <View style={styles.helplineRow}>
            <Text style={styles.helplineName}>National Cyber Crime Helpline</Text>
            <Text style={styles.helplineNumber}>1930</Text>
          </View>
        </View>

        {/* Moderation Controls */}
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/legal/guidelines')}
          >
            <Ionicons name="book-outline" size={20} color={COLORS.dark} />
            <Text style={styles.actionText}>Indori Community Guidelines</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtleText} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleReportIncident}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.actionText, { color: COLORS.danger }]}>
              Report an Urgent Safety Concern
            </Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtleText} />
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
  safetyHero: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: 6,
    ...SHADOWS.md,
  },
  heroShield: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
    marginTop: 4,
  },
  guidelinesList: {
    gap: 10,
  },
  guidelineCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 12,
    ...SHADOWS.sm,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelineContent: {
    flex: 1,
  },
  guidelineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.dark,
  },
  guidelineDesc: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 2,
    lineHeight: 17,
  },
  helplineCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 10,
    ...SHADOWS.sm,
  },
  helplineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: 2,
  },
  helplineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EEF2',
  },
  helplineName: {
    fontSize: 13,
    color: COLORS.dark,
  },
  helplineNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EEF2',
    gap: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    flex: 1,
  },
});
