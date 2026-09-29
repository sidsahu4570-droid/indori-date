import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../../types';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { formatRelativeTime } from '../../utils/dateUtils';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine }) => {
  const timeFormatted = new Date(message.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <View style={[styles.container, isMine ? styles.mineContainer : styles.theirsContainer]}>
      <View style={[styles.bubble, isMine ? styles.mineBubble : styles.theirsBubble]}>
        {message.mediaUrl && (
          <Image
            source={{ uri: message.mediaUrl }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        )}

        {message.text ? (
          <Text style={[styles.text, isMine ? styles.mineText : styles.theirsText]}>
            {message.text}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <Text style={[styles.timeText, isMine ? styles.mineTime : styles.theirsTime]}>
            {timeFormatted}
          </Text>
          {isMine && (
            <Ionicons
              name={message.isRead ? 'checkmark-done' : 'checkmark'}
              size={13}
              color={message.isRead ? COLORS.secondaryLight : 'rgba(255,255,255,0.7)'}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: SPACING.md,
    flexDirection: 'row',
  },
  mineContainer: {
    justifyContent: 'flex-end',
  },
  theirsContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.lg,
  },
  mineBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirsBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#F0E0E6',
  },
  mediaImage: {
    width: 220,
    height: 160,
    borderRadius: RADIUS.md,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  mineText: {
    color: COLORS.white,
  },
  theirsText: {
    color: COLORS.dark,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 3,
  },
  timeText: {
    fontSize: 10,
  },
  mineTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  theirsTime: {
    color: COLORS.subtleText,
  },
});
