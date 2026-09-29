import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common/Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  indoreHighlight: string;
}

const ONBOARDING_SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Meet People From Indore',
    tagline: 'Indore mein apna match dhoondo.',
    description: 'Discover verified singles living in Vijay Nagar, Palasia, Rajwada, and all across the cleanest city.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    indoreHighlight: '📍 Exclusively for Indore Residents',
  },
  {
    id: '2',
    title: 'Find Your Match',
    tagline: 'Search based on what matters to you.',
    description: 'Filter by lifestyle, relationship goals, and your favorite local food spots like Sarafa & Chappan Dukan.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    indoreHighlight: '🥨 Common Indori Food & Vibe Tags',
  },
  {
    id: '3',
    title: 'Match & Connect',
    tagline: 'When the feeling is mutual, it’s a match.',
    description: 'Swipe right on profiles you like. Only mutual likes or accepted requests start a connection.',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80',
    indoreHighlight: '🔒 Safe & Private Connections',
  },
  {
    id: '4',
    title: 'Start Talking',
    tagline: 'Build a real connection, one conversation at a time.',
    description: 'Plan your first coffee date or street food walk in Indore with confidence and real-time messaging.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    indoreHighlight: '💬 Real-time Chat & Verification',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.push('/(auth)/residency-check');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/residency-check');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Skip */}
      <View style={styles.topNav}>
        <View style={styles.logoRow}>
          <View style={styles.logoDot}>
            <Ionicons name="heart" size={14} color={COLORS.white} />
          </View>
          <Text style={styles.logoTitle}>Indori Date</Text>
        </View>
        <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(255, 248, 250, 0.9)', COLORS.background]}
                style={styles.imageGradient}
              />
              <View style={styles.indoreBadge}>
                <Text style={styles.indoreBadgeText}>{item.indoreHighlight}</Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.tagline}>“{item.tagline}”</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Controls */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <Button
          title={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started 🌸' : 'Continue'}
          onPress={handleNext}
          variant="primary"
          size="lg"
          style={styles.ctaButton}
        />

        {/* Login Link */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkBold}>Log In</Text>
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
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    letterSpacing: -0.3,
  },
  skipText: {
    fontSize: 14,
    color: COLORS.mutedText,
    fontWeight: '600',
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.42,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    position: 'relative',
    ...SHADOWS.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  indoreBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(23, 23, 23, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  indoreBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  textContainer: {
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.dark,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: SPACING.xs,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#E5D0D8',
  },
  ctaButton: {
    width: '100%',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 13,
    color: COLORS.mutedText,
  },
  loginLinkBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
