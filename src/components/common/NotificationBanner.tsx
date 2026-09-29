import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '../../types';
import { NotificationService } from '../../services/notificationService';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

export const NotificationBanner: React.FC = () => {
  const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);
  const translateY = useState(new Animated.Value(-100))[0];

  useEffect(() => {
    const unsubscribe = NotificationService.subscribe((item) => {
      setActiveNotification(item);

      // Slide down
      Animated.spring(translateY, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }).start();

      // Auto dismiss after 4.5 seconds
      const timer = setTimeout(() => {
        dismiss();
      }, 4500);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  const dismiss = () => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setActiveNotification(null);
    });
  };

  const handlePress = () => {
    if (!activeNotification) return;
    const notif = activeNotification;
    dismiss();

    if (notif.type === 'match' || notif.type === 'message') {
      if (notif.data?.matchId) {
        router.push({
          pathname: '/chat/[id]',
          params: { id: notif.data.matchId },
        });
      } else {
        router.push('/(tabs)/messages');
      }
    } else if (notif.type === 'request_accepted' || notif.type === 'like') {
      router.push('/(tabs)/matches');
    }
  };

  if (!activeNotification) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={
              activeNotification.type === 'match'
                ? 'heart'
                : activeNotification.type === 'message'
                ? 'chatbubble-ellipses'
                : 'sparkles'
            }
            size={18}
            color={COLORS.white}
          />
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.title}>{activeNotification.title}</Text>
          <Text style={styles.body} numberOfLines={1}>
            {activeNotification.body}
          </Text>
        </View>

        <TouchableOpacity onPress={dismiss} style={styles.closeBtn}>
          <Ionicons name="close" size={16} color={COLORS.mutedText} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    ...SHADOWS.lg,
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.dark,
  },
  body: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
});
