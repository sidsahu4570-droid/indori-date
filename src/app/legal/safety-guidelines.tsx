import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { SAFETY_GUIDELINES } from '../../constants/membership';

export default function SafetyGuidelinesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Safety Guidelines" showBack rightAction="none" showLocation={false} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Official Indori Safe Dating Protocol</Text>
          <Text style={styles.date}>Safe Dating Tips for Indore</Text>

          {SAFETY_GUIDELINES.map((item, index) => (
            <View key={item.id} style={styles.itemBox}>
              <Text style={styles.itemTitle}>
                {index + 1}. {item.title}
              </Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
            </View>
          ))}
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
  itemBox: {
    gap: 4,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EEF2',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark,
  },
  itemDesc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
});
