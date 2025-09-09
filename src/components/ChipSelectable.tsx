import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';

interface ChipSelectableProps {
  label: string;
  variant?: 'primary' | 'outline';
  size?: 'small' | 'medium';
  selected?: boolean;
  onPress?: () => void;
}

const ChipSelectable: React.FC<ChipSelectableProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  selected = false,
  onPress
}) => {
  const getChipStyle = () => {
    return [
      styles.chip,
      size === 'medium' ? styles.chipMedium : styles.chipSmall,
      getVariantStyle(),
    ];
  };

  const getVariantStyle = () => {
    if (variant === 'primary') {
      return selected ? styles.chipPrimarySelected : styles.chipPrimaryUnselected;
    } else {
      return selected ? styles.chipOutlineSelected : styles.chipOutlineUnselected;
    }
  };

  const getTextStyle = () => {
    return [
      styles.chipText,
      size === 'medium' ? styles.chipTextMedium : styles.chipTextSmall,
      selected ? styles.chipTextSelected : styles.chipTextUnselected,
    ];
  };

  const ChipWrapper = onPress ? TouchableOpacity : View;

  return (
    <ChipWrapper style={getChipStyle()} onPress={onPress}>
      <View style={styles.contentRow}>
        {selected && (
          <Check
            size={20}
            color={aliasTokens.color.text.InversePrimary}
            strokeWidth={2}
            style={styles.leadingIcon}
          />
        )}
        <Text style={getTextStyle()}>{label}</Text>
      </View>
    </ChipWrapper>
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

  // Primary variant styles
  chipPrimaryUnselected: {
    backgroundColor: aliasTokens.color.background.Tertiary,
    borderWidth: 1,
    borderColor: aliasTokens.color.background.Tertiary,
  },
  chipPrimarySelected: {
    backgroundColor: aliasTokens.color.brand.Primary, // blue.500
    borderWidth: 1,
    borderColor: aliasTokens.color.brand.Primary, // blue.500
  },

  // Outline variant styles
  chipOutlineUnselected: {
    backgroundColor: aliasTokens.color.background.Primary,
    borderWidth: 1,
    borderColor: aliasTokens.color.border.Default,
  },
  chipOutlineSelected: {
    backgroundColor: aliasTokens.color.brand.Primary, // blue.500 background
    borderWidth: 1,
    borderColor: aliasTokens.color.brand.Primary, // blue.500 border
  },

  // Text styles
  chipText: {
    textAlign: 'center',
    includeFontPadding: false,
  },
  chipTextMedium: {
    ...aliasTokens.typography.labelText.Default,
  },
  chipTextSmall: {
    ...aliasTokens.typography.body.XSmall,
  },
  chipTextUnselected: {
    color: aliasTokens.color.text.Primary, // text.primary
  },
  chipTextSelected: {
    color: aliasTokens.color.text.InversePrimary, // text.inverse primary
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadingIcon: {
    marginRight: aliasTokens.spacing.XXSmall,
    marginLeft: -8
  },
});

export default ChipSelectable; 