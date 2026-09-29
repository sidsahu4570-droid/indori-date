import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { VerifiedBadge, VIPBadge } from '../common/Badge';
import { IndoreTagChip } from './IndoreTagChip';
import { formatDistance } from '../../utils/distanceUtils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

interface SwipeCardProps {
  profile: UserProfile;
  onSwipeLeft: (profile: UserProfile) => void;
  onSwipeRight: (profile: UserProfile) => void;
  onOpenDetails: (profile: UserProfile) => void;
  isFirst?: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onOpenDetails,
  isFirst = true,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-20deg', '0deg', '20deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [10, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.timing(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            onSwipeRight(profile);
            position.setValue({ x: 0, y: 0 });
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.timing(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            onSwipeLeft(profile);
            position.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleNextPhoto = () => {
    if (photoIndex < (profile.photos.length || 1) - 1) {
      setPhotoIndex(photoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    }
  };

  const currentPhoto =
    profile.photos && profile.photos.length > 0
      ? profile.photos[photoIndex]
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';

  const cardStyle = isFirst
    ? {
        transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
      }
    : {};

  return (
    <Animated.View
      {...(isFirst ? panResponder.panHandlers : {})}
      style={[styles.cardContainer, cardStyle]}
    >
      <View style={styles.cardInner}>
        {/* Profile Image */}
        <Image
          source={{ uri: currentPhoto }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Photo Indicators */}
        {profile.photos && profile.photos.length > 1 && (
          <View style={styles.photoIndicators}>
            {profile.photos.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicatorBar,
                  i === photoIndex && styles.indicatorBarActive,
                ]}
              />
            ))}
          </View>
        )}

        {/* Photo Navigation Touch Areas */}
        <View style={styles.touchAreaContainer}>
          <TouchableOpacity
            style={styles.leftTouch}
            onPress={handlePrevPhoto}
            activeOpacity={1}
          />
          <TouchableOpacity
            style={styles.rightTouch}
            onPress={handleNextPhoto}
            activeOpacity={1}
          />
        </View>

        {/* Swipe Overlays */}
        {isFirst && (
          <>
            <Animated.View style={[styles.likeStamp, { opacity: likeOpacity }]}>
              <Text style={styles.likeStampText}>LIKE ❤️</Text>
            </Animated.View>

            <Animated.View style={[styles.passStamp, { opacity: passOpacity }]}>
              <Text style={styles.passStampText}>PASS ✕</Text>
            </Animated.View>
          </>
        )}

        {/* Bottom Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.92)']}
          style={styles.gradient}
        >
          {/* Main info container */}
          <TouchableOpacity
            onPress={() => onOpenDetails(profile)}
            activeOpacity={0.9}
            style={styles.infoContainer}
          >
            {/* Name, Age, Badges */}
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>
                {profile.name.split(' ')[0]}, {profile.age}
              </Text>
              {profile.isVerified && <VerifiedBadge size="md" />}
              {profile.isPremium && <VIPBadge label="VIP" />}
            </View>

            {/* Occupation */}
            <View style={styles.rowItem}>
              <Ionicons name="briefcase-outline" size={14} color="#E0E0E0" />
              <Text style={styles.occupationText}>{profile.occupation}</Text>
            </View>

            {/* Indore Location & Distance */}
            <View style={styles.rowItem}>
              <Ionicons name="location-outline" size={14} color={COLORS.secondary} />
              <Text style={styles.locationText}>
                {profile.location.locality} • {formatDistance(profile.location.distanceKm)}
              </Text>
            </View>

            {/* Short Bio */}
            {profile.bio && (
              <Text style={styles.bioText} numberOfLines={2}>
                “{profile.bio}”
              </Text>
            )}

            {/* Indore Tags */}
            <View style={styles.tagsRow}>
              {profile.indoreInterests?.slice(0, 2).map((tag, idx) => (
                <IndoreTagChip key={idx} label={tag} size="sm" />
              ))}
              {profile.interests?.slice(0, 2).map((tag, idx) => (
                <IndoreTagChip key={`int_${idx}`} label={tag} size="sm" />
              ))}
            </View>

            {/* Tap for more details prompt */}
            <View style={styles.tapPrompt}>
              <Text style={styles.tapPromptText}>Tap to view full Indore profile</Text>
              <Ionicons name="chevron-up" size={16} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: SCREEN_WIDTH - 24,
    height: SCREEN_HEIGHT * 0.65,
    maxHeight: 560,
    alignSelf: 'center',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.darkCard,
    ...SHADOWS.card,
  },
  cardInner: {
    flex: 1,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  photoIndicators: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 4,
    zIndex: 5,
  },
  indicatorBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  indicatorBarActive: {
    backgroundColor: COLORS.white,
  },
  touchAreaContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    bottom: 220,
    flexDirection: 'row',
    zIndex: 4,
  },
  leftTouch: {
    flex: 1,
  },
  rightTouch: {
    flex: 1,
  },
  likeStamp: {
    position: 'absolute',
    top: 50,
    left: 30,
    borderWidth: 4,
    borderColor: COLORS.success,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '-15deg' }],
    zIndex: 10,
    backgroundColor: 'rgba(34, 160, 107, 0.2)',
  },
  likeStampText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.success,
    letterSpacing: 2,
  },
  passStamp: {
    position: 'absolute',
    top: 50,
    right: 30,
    borderWidth: 4,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '15deg' }],
    zIndex: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  passStampText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.danger,
    letterSpacing: 2,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 280,
    justifyContent: 'flex-end',
    padding: SPACING.lg,
    zIndex: 6,
  },
  infoContainer: {
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameText: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  occupationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  locationText: {
    fontSize: 13,
    color: '#FFD6E3',
    fontWeight: '500',
  },
  bioText: {
    fontSize: 14,
    color: '#F5F5F5',
    lineHeight: 19,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tapPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
    paddingTop: 4,
  },
  tapPromptText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
});
