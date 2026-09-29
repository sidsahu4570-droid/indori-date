import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ConnectionRequest } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { formatRelativeTime } from '../../utils/dateUtils';

interface ConnectionRequestCardProps {
  request: ConnectionRequest;
  onAccept: (request: ConnectionRequest) => void;
  onDecline: (request: ConnectionRequest) => void;
}

export const ConnectionRequestCard: React.FC<ConnectionRequestCardProps> = ({
  request,
  onAccept,
  onDecline,
}) => {
  const { senderProfile } = request;

  return (
    <View style={styles.card}>
      <Image source={{ uri: senderProfile.photo }} style={styles.avatar} />

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {senderProfile.name}, {senderProfile.age}
          </Text>
          <Text style={styles.timeText}>{formatRelativeTime(request.createdAt)}</Text>
        </View>

        <Text style={styles.occupation} numberOfLines={1}>
          {senderProfile.occupation}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          📍 {senderProfile.locality}
        </Text>

        {senderProfile.indoreInterests?.length > 0 && (
          <Text style={styles.tagText} numberOfLines={1}>
            {senderProfile.indoreInterests[0]}
          </Text>
        )}

        {/* Action Buttons: Accept & Decline */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.btn, styles.acceptBtn]}
            onPress={() => onAccept(request)}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={16} color={COLORS.white} />
            <Text style={styles.acceptBtnText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.declineBtn]}
            onPress={() => onDecline(request)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={16} color={COLORS.mutedText} />
            <Text style={styles.declineBtnText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    ...SHADOWS.sm,
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 80,
    height: 100,
    borderRadius: RADIUS.md,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.subtleText,
  },
  occupation: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.dark,
    backgroundColor: COLORS.secondaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginTop: 4,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
  },
  acceptBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  declineBtn: {
    backgroundColor: '#F3F4F6',
  },
  declineBtnText: {
    color: COLORS.mutedText,
    fontSize: 13,
    fontWeight: '600',
  },
});
