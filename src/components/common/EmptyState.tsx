import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { Button } from './Button';

interface EmptyStateProps {
  type: 'no-profiles' | 'no-matches' | 'no-messages' | 'no-results';
  title?: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionTitle,
  onAction,
}) => {
  let defaultIcon: keyof typeof Ionicons.glyphMap = 'heart-dislike-outline';
  let defaultTitle = "Looks like you've seen everyone nearby.";
  let defaultDesc = 'Try expanding your search filters or check back later.';

  if (type === 'no-profiles') {
    defaultIcon = 'compass-outline';
    defaultTitle = "Looks like you've seen everyone nearby.";
    defaultDesc = 'Try expanding your search filters or checking other Indore localities.';
  } else if (type === 'no-matches') {
    defaultIcon = 'heart-half-outline';
    defaultTitle = 'Your next match could be around the corner ❤️';
    defaultDesc = 'Keep swiping on profiles in Vijay Nagar, Palasia, and across Indore.';
  } else if (type === 'no-messages') {
    defaultIcon = 'chatbubbles-outline';
    defaultTitle = 'Match with someone to start a conversation.';
    defaultDesc = 'When both of you like each other or accept a request, your chats appear here.';
  } else if (type === 'no-results') {
    defaultIcon = 'search-outline';
    defaultTitle = 'No profiles match these filters';
    defaultDesc = 'Adjust your age range or distance preferences in Indore.';
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={defaultIcon} size={42} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>{title || defaultTitle}</Text>
      <Text style={styles.description}>{description || defaultDesc}</Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="md"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    minHeight: 320,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: SPACING.lg,
  },
  button: {
    minWidth: 180,
  },
});
