import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface IndoreTagChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
}

export const IndoreTagChip: React.FC<IndoreTagChipProps> = ({
  label,
  selected = false,
  onPress,
  size = 'md',
}) => {
  const isPressable = !!onPress;

  const content = (
    <View
      style={[
        styles.chip,
        size === 'sm' ? styles.chipSm : styles.chipMd,
        selected ? styles.chipSelected : styles.chipUnselected,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          selected ? styles.textSelected : styles.textUnselected,
        ]}
      >
        {label}
      </Text>
    </View>
  );

  if (isPressable) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  chipSm: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipMd: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: '#F0E0E6',
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  text: {
    fontWeight: '600',
  },
  textSm: {
    fontSize: 12,
  },
  textMd: {
    fontSize: 13,
  },
  textUnselected: {
    color: COLORS.dark,
  },
  textSelected: {
    color: COLORS.white,
  },
});
