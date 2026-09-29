import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface SafetyPromptProps {
  userName: string;
}

export const SafetyPrompt: React.FC<SafetyPromptProps> = ({ userName }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
        <View style={styles.textWrap}>
          <Text style={styles.title}>Indori Date Safety Tip</Text>
          <Text style={styles.description}>
            Never share OTPs, UPI pins, or bank info with {userName}. When meeting, choose a vibrant public spot like Chappan Dukan or Phoenix Citadel.
          </Text>
        </View>
        <TouchableOpacity onPress={() => setDismissed(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={18} color={COLORS.mutedText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF1F5',
    borderWidth: 1,
    borderColor: '#FFD6E3',
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    padding: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  description: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    lineHeight: 15,
  },
});
