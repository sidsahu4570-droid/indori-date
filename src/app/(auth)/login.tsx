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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail, isValidIndianPhone } from '../../utils/validation';

export default function LoginScreen() {
  const { login, loginWithPhoneOtp, isLoading } = useAuth();

  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailLogin = async () => {
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter your email and password');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Login failed. Please check credentials.');
    }
  };

  const handleSendOtp = () => {
    setErrorMsg('');
    if (!isValidIndianPhone(phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setOtpSent(true);
    setOtp('123456'); // Pre-fill mock OTP for quick demo
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setErrorMsg('Please enter 6-digit OTP');
      return;
    }
    try {
      const success = await loginWithPhoneOtp(phone, otp);
      if (success) {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setErrorMsg('Invalid OTP. Please try again.');
    }
  };

  const handleAdminQuickFill = () => {
    setEmail('admin@indoridate.com');
    setPassword('admin123');
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
            <View style={styles.logoBadge}>
              <Ionicons name="heart" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.title}>Welcome to Indori Date</Text>
            <Text style={styles.tagline}>“Indore mein apna match dhoondo.”</Text>
          </View>

          {/* Tab Selector: Email vs Mobile OTP */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabBtn, authMode === 'email' && styles.tabBtnActive]}
              onPress={() => {
                setAuthMode('email');
                setErrorMsg('');
              }}
            >
              <Ionicons
                name="mail-outline"
                size={16}
                color={authMode === 'email' ? COLORS.primary : COLORS.mutedText}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  authMode === 'email' && styles.tabBtnTextActive,
                ]}
              >
                Email Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, authMode === 'phone' && styles.tabBtnActive]}
              onPress={() => {
                setAuthMode('phone');
                setErrorMsg('');
              }}
            >
              <Ionicons
                name="call-outline"
                size={16}
                color={authMode === 'phone' ? COLORS.primary : COLORS.mutedText}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  authMode === 'phone' && styles.tabBtnTextActive,
                ]}
              >
                Mobile OTP
              </Text>
            </TouchableOpacity>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {authMode === 'email' ? (
            /* EMAIL / PASSWORD FORM */
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.mutedText} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. rahul@indori.com"
                    placeholderTextColor={COLORS.subtleText}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.mutedText} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.subtleText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={COLORS.mutedText}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.forgotLink}
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                <Text style={styles.forgotLinkText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Log In to Indori Date"
                onPress={handleEmailLogin}
                variant="primary"
                size="lg"
                loading={isLoading}
              />

              {/* Admin demo helper */}
              <TouchableOpacity
                style={styles.adminDemoBtn}
                onPress={handleAdminQuickFill}
              >
                <Text style={styles.adminDemoText}>👑 Fill Admin Credentials</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* MOBILE OTP FORM */
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Indian Mobile Number</Text>
                <View style={styles.inputWrap}>
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="98765 43210"
                    placeholderTextColor={COLORS.subtleText}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!otpSent}
                  />
                </View>
              </View>

              {otpSent && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>6-Digit OTP</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="key-outline" size={20} color={COLORS.mutedText} />
                    <TextInput
                      style={styles.input}
                      placeholder="123456"
                      placeholderTextColor={COLORS.subtleText}
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                  <Text style={styles.otpHelper}>Demo OTP: 123456</Text>
                </View>
              )}

              {!otpSent ? (
                <Button
                  title="Send Verification OTP"
                  onPress={handleSendOtp}
                  variant="primary"
                  size="lg"
                />
              ) : (
                <Button
                  title="Verify OTP & Log In"
                  onPress={handleVerifyOtp}
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                />
              )}
            </View>
          )}

          {/* Footer Signup Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Indori Date?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/residency-check')}>
              <Text style={styles.signupLink}>Create an Account</Text>
            </TouchableOpacity>
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
    paddingTop: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3E8EC',
    borderRadius: RADIUS.full,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  tabBtnTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
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
    height: 52,
    gap: 10,
    ...SHADOWS.sm,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.dark,
  },
  forgotLink: {
    alignSelf: 'flex-end',
  },
  forgotLinkText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
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
  },
  otpHelper: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  adminDemoBtn: {
    alignSelf: 'center',
    paddingVertical: 6,
  },
  adminDemoText: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.mutedText,
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
