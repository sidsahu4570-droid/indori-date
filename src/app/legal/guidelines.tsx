import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';

export default function GuidelinesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Community Guidelines" showBack rightAction="none" showLocation={false} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Indori Date Community Code 🤝</Text>
          <Text style={styles.date}>Keep Indore Friendly, Respectful & Safe</Text>

          <Text style={styles.sectionHeading}>1. Be Authentic</Text>
          <Text style={styles.body}>
            Use your genuine photos and real profile information. Impersonation of celebrities, other people, or fake profiles will result in an immediate permanent ban.
          </Text>

          <Text style={styles.sectionHeading}>2. Respect Boundaries</Text>
          <Text style={styles.body}>
            Consent and mutual respect are non-negotiable. If someone does not wish to chat, unmatches, or declines a request, respect their decision gracefully.
          </Text>

          <Text style={styles.sectionHeading}>3. Keep Financial Transactions Off the App</Text>
          <Text style={styles.body}>
            Never ask for money, UPI transfers, loan assistance, or cryptocurrency on Indori Date. Anyone requesting funds will be permanently blocked and reported.
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
