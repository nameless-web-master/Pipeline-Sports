import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { aliasTokens } from '../theme/alias';

interface ChipProps {
  label: string;
  variant?: 'primary' | 'outline';
  size?: 'small' | 'medium';
}

const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'primary',
  size = 'medium'
}) => {
  const getChipStyle = () => {
    return [
      styles.chip,
      size === 'medium' ? styles.chipMedium : styles.chipSmall,
      variant === 'primary' ? styles.chipPrimary : styles.chipOutline,
    ];
  };

  const getTextStyle = () => {
    return [
      styles.chipText,
      size === 'medium' ? styles.chipTextMedium : styles.chipTextSmall,
    ];
  };

  return (
    <View style={getChipStyle()}>
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Base chip styles
  chip: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  
  // Size variations
  chipMedium: {
    height: 32,
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  chipSmall: {
    height: 24,
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  
  // Variant styles
  chipPrimary: {
    backgroundColor: aliasTokens.color.background.Tertiary,
    borderWidth: 0,
  },
  chipOutline: {
    backgroundColor: aliasTokens.color.background.Primary,
    borderWidth: 1,
    borderColor: aliasTokens.color.border.Default,
  },
  
  // Text styles
  chipText: {
    color: aliasTokens.color.text.Primary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  chipTextMedium: {
    ...(aliasTokens.typography.body.Small || {}),
  },
  chipTextSmall: {
    ...(aliasTokens.typography.body.XSmall || {}),
  },
});

export default Chip; 