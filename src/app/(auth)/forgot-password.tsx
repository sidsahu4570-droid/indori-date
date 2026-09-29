import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/validation';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setErrorMsg('');
    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-open-outline" size={36} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.description}>
          Enter your registered email address and we will send you instructions to reset your password.
        </Text>

        {submitted ? (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            <Text style={styles.successTitle}>Password Reset Link Sent!</Text>
            <Text style={styles.successDesc}>
              Check your inbox at {email} for instructions.
            </Text>
            <Button
              title="Return to Login"
              onPress={() => router.replace('/(auth)/login')}
              variant="primary"
              size="md"
              style={{ marginTop: SPACING.md, width: '100%' }}
            />
          </View>
        ) : (
          <View style={styles.form}>
            {errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : null}

            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={20} color={COLORS.mutedText} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.subtleText}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Button
              title="Send Reset Link"
              onPress={handleReset}
              variant="primary"
              size="lg"
              loading={loading}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  content: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: 14,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  form: {
    width: '100%',
    gap: SPACING.md,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 52,
    gap: 10,
    ...SHADOWS.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.dark,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  successBox: {
    width: '100%',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F5E9',
    ...SHADOWS.md,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    marginTop: 8,
  },
  successDesc: {
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 4,
  },
});
