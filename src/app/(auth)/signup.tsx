import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { calculateAge, isAdult } from '../../utils/dateUtils';
import { isValidEmail, isValidIndianPhone } from '../../utils/validation';
import { Gender, InterestedIn } from '../../types';

export default function SignupScreen() {
  const { signup, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('2001-05-15'); // YYYY-MM-DD
  const [gender, setGender] = useState<Gender>('female');
  const [interestedIn, setInterestedIn] = useState<InterestedIn>('men');

  const [agree18Plus, setAgree18Plus] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeIndore, setAgreeIndore] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = async () => {
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!isValidIndianPhone(mobile)) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    const calculatedAge = calculateAge(dob);
    if (calculatedAge < 18) {
      setErrorMsg('You must be 18 years or older to register on Indori Date');
      return;
    }

    if (!agree18Plus || !agreeTerms || !agreeIndore) {
      setErrorMsg('Please accept all verification checkboxes to proceed');
      return;
    }

    // Proceed to multi-step profile creation
    router.push({
      pathname: '/(auth)/create-profile',
      params: {
        name: fullName,
        email,
        phone: mobile,
        dob,
        age: calculatedAge.toString(),
        gender,
        interestedIn,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </TouchableOpacity>
            <Text style={styles.stepTitle}>Step 1 of 2: Basic Info</Text>
            <Text style={styles.headerTitle}>Create Your Indori Profile</Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color={COLORS.mutedText} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Priya Sharma"
                  placeholderTextColor={COLORS.subtleText}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={COLORS.mutedText} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. priya@gmail.com"
                  placeholderTextColor={COLORS.subtleText}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number (India)</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.prefix}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="98765 43210"
                  placeholderTextColor={COLORS.subtleText}
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.mutedText} />
                <TextInput
                  style={styles.input}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={COLORS.subtleText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* DOB & Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth (YYYY-MM-DD)</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.mutedText} />
                <TextInput
                  style={styles.input}
                  placeholder="2001-05-15"
                  placeholderTextColor={COLORS.subtleText}
                  value={dob}
                  onChangeText={setDob}
                />
                <Text style={styles.ageBadge}>{calculateAge(dob)} yrs old</Text>
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>I am a</Text>
              <View style={styles.pillRow}>
                {(['female', 'male', 'non-binary'] as Gender[]).map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.pill, gender === g && styles.pillActive]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.pillText, gender === g && styles.pillTextActive]}>
                      {g === 'female' ? 'Woman' : g === 'male' ? 'Man' : 'Non-binary'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Interested In */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Looking to meet</Text>
              <View style={styles.pillRow}>
                {(['men', 'women', 'everyone'] as InterestedIn[]).map((i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.pill, interestedIn === i && styles.pillActive]}
                    onPress={() => setInterestedIn(i)}
                  >
                    <Text style={[styles.pillText, interestedIn === i && styles.pillTextActive]}>
                      {i === 'men' ? 'Men' : i === 'women' ? 'Women' : 'Everyone'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* City (Strictly Indore) */}
            <View style={styles.cityPill}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.cityPillText}>City: Indore, Madhya Pradesh (Locked)</Text>
            </View>

            {/* Mandatory Checkboxes */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgree18Plus(!agree18Plus)}
              >
                <Ionicons
                  name={agree18Plus ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={agree18Plus ? COLORS.primary : COLORS.mutedText}
                />
                <Text style={styles.checkboxLabel}>I confirm that I am 18 years or older</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreeIndore(!agreeIndore)}
              >
                <Ionicons
                  name={agreeIndore ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={agreeIndore ? COLORS.primary : COLORS.mutedText}
                />
                <Text style={styles.checkboxLabel}>I currently live, study, or work in Indore</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreeTerms(!agreeTerms)}
              >
                <Ionicons
                  name={agreeTerms ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={agreeTerms ? COLORS.primary : COLORS.mutedText}
                />
                <Text style={styles.checkboxLabel}>
                  I agree to the <Text style={styles.linkText} onPress={() => router.push('/legal/terms')}>Terms</Text> & <Text style={styles.linkText} onPress={() => router.push('/legal/privacy')}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Continue to Profile Details →"
              onPress={handleNext}
              variant="primary"
              size="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
    ...SHADOWS.sm,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
    marginTop: 2,
    letterSpacing: -0.3,
  },
  form: {
    gap: SPACING.md,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.dark,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 50,
    gap: 8,
    ...SHADOWS.sm,
  },
  prefix: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.dark,
  },
  ageBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#F0E0E6',
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  pillTextActive: {
    color: COLORS.white,
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0F5',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FFD6E3',
  },
  cityPillText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  checkboxContainer: {
    gap: 10,
    marginVertical: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 12,
    color: COLORS.dark,
    flex: 1,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: 6,
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
});
