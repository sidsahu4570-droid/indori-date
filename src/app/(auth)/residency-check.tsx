import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export default function ResidencyCheckScreen() {
  const { setIsIndoreResident } = useAuth();
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);
  const [showIneligibleAlert, setShowIneligibleAlert] = useState(false);

  const handleProceed = () => {
    if (selectedOption === 'yes') {
      setIsIndoreResident(true);
      router.push('/(auth)/signup');
    } else if (selectedOption === 'no') {
      setIsIndoreResident(false);
      setShowIneligibleAlert(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Indore Icon Header */}
        <View style={styles.iconCircle}>
          <Ionicons name="location" size={40} color={COLORS.primary} />
        </View>

        <Text style={styles.badge}>INDORE EXCLUSIVE</Text>
        <Text style={styles.title}>Are you currently living in Indore?</Text>
        <Text style={styles.description}>
          Indori Date is dedicated exclusively to people living in Indore. We connect singles across Vijay Nagar, Palasia, Rajwada, and nearby local areas.
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOption === 'yes' && styles.optionCardSelected,
            ]}
            onPress={() => {
              setSelectedOption('yes');
              setShowIneligibleAlert(false);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.radioRow}>
              <View
                style={[
                  styles.radioOuter,
                  selectedOption === 'yes' && styles.radioOuterSelected,
                ]}
              >
                {selectedOption === 'yes' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>Yes, I live in Indore 🥨</Text>
                <Text style={styles.optionDesc}>
                  I currently reside, study, or work in Indore
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOption === 'no' && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedOption('no')}
            activeOpacity={0.8}
          >
            <View style={styles.radioRow}>
              <View
                style={[
                  styles.radioOuter,
                  selectedOption === 'no' && styles.radioOuterSelected,
                ]}
              >
                {selectedOption === 'no' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>No, I live elsewhere</Text>
                <Text style={styles.optionDesc}>
                  I am located in another city or state
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Ineligible Notice if user selected No */}
        {showIneligibleAlert && (
          <View style={styles.ineligibleBox}>
            <Ionicons name="information-circle" size={22} color={COLORS.warning} />
            <View style={styles.ineligibleTextWrap}>
              <Text style={styles.ineligibleTitle}>Indori Date is Indore-Only</Text>
              <Text style={styles.ineligibleDesc}>
                Indori Date is currently available only for people living in Indore. We are planning to expand to other cities across MP soon!
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Action */}
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleProceed}
          variant="primary"
          size="lg"
          disabled={!selectedOption}
        />
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>
            Existing user? <Text style={styles.backLinkBold}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  badge: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: 14,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  optionsContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#F0E0E6',
    ...SHADOWS.sm,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F8',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
  },
  optionDesc: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  ineligibleBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    gap: 10,
  },
  ineligibleTextWrap: {
    flex: 1,
  },
  ineligibleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  ineligibleDesc: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 16,
  },
  footer: {
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  backLink: {
    alignItems: 'center',
  },
  backLinkText: {
    fontSize: 13,
    color: COLORS.mutedText,
  },
  backLinkBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
