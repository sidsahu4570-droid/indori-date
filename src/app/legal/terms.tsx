import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Terms & Conditions" showBack rightAction="none" showLocation={false} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Indori Date Terms of Service</Text>
          <Text style={styles.date}>Last updated: March 2026 • Indore, MP</Text>

          <Text style={styles.sectionHeading}>1. Eligibility (Strictly 18+ and Indore Only)</Text>
          <Text style={styles.body}>
            You must be at least 18 years of age and currently residing, studying, or working in the Indore metropolitan area to create an account or use Indori Date. Any accounts discovered belonging to individuals under 18 years of age or outside the specified area are subject to immediate termination.
          </Text>

          <Text style={styles.sectionHeading}>2. Community Standards & Zero Tolerance</Text>
          <Text style={styles.body}>
            Indori Date strictly prohibits harassment, unsolicited explicit media, solicitation for commercial or sexual services, impersonation, hate speech, or financial scams. Users must interact with courtesy and respect at all times.
          </Text>

          <Text style={styles.sectionHeading}>3. Subscriptions & Billing</Text>
          <Text style={styles.body}>
            Premium features and VIP Gold subscriptions are billed via authorized payment partners (Razorpay). Subscriptions provide access to unlimited likes, priority discovery in Indore, and VIP status according to chosen tier.
          </Text>

          <Text style={styles.sectionHeading}>4. Account Termination</Text>
          <Text style={styles.body}>
            We reserve the right to suspend or terminate accounts that violate our terms, guidelines, or applicable laws in Madhya Pradesh, India.
          </Text>
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
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 12,
    ...SHADOWS.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.dark,
  },
  date: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark,
    marginTop: 6,
  },
  body: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },
});
