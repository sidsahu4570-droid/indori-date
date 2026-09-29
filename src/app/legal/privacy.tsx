import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Privacy Policy" showBack rightAction="none" showLocation={false} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.date}>Indori Date • Protecting Your Personal Privacy</Text>

          <Text style={styles.sectionHeading}>1. Approximate Location Only</Text>
          <Text style={styles.body}>
            We value your personal safety. Indori Date never displays your exact GPS coordinates or street address publicly. Only approximate locality (such as Vijay Nagar, Palasia, or Saket) and approximate distance (e.g. "3 km away") are displayed.
          </Text>

          <Text style={styles.sectionHeading}>2. Verification Documents</Text>
          <Text style={styles.body}>
            Selfies and identification documents uploaded for profile verification are strictly encrypted, processed by internal security teams, and never shown to other users.
          </Text>

          <Text style={styles.sectionHeading}>3. Private Messaging</Text>
          <Text style={styles.body}>
            Chat conversations are strictly private between matched users and are protected by Firestore security rules.
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
