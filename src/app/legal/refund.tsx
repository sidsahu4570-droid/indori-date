import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';

export default function RefundScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Refund Policy" showBack rightAction="none" showLocation={false} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Refund & Cancellation Policy</Text>
          <Text style={styles.date}>Indori Date Memberships</Text>

          <Text style={styles.sectionHeading}>1. Digital VIP Subscriptions</Text>
          <Text style={styles.body}>
            All VIP memberships purchased via Razorpay or app stores provide instant activation of premium digital perks (unlimited likes, boosts, profile tags).
          </Text>

          <Text style={styles.sectionHeading}>2. Cancellation</Text>
          <Text style={styles.body}>
            You can cancel auto-renewal anytime from your profile settings. You will continue to enjoy VIP benefits until the current billing period expires.
          </Text>

          <Text style={styles.sectionHeading}>3. Billing Queries</Text>
          <Text style={styles.body}>
            For duplicate charges or transaction issues, contact support@indoridate.com with your Razorpay Payment ID.
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
