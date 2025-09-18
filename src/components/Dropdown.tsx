import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  onOpenBottomSheet: () => void;
  style?: any;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onSelect,
  onOpenBottomSheet,
  style,
}) => {
  const selectedOption = options.find(option => option.value === value);

  const handlePress = () => {
    onOpenBottomSheet();
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.dropdownText,
          !selectedOption && styles.placeholderText
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown 
          size={24} 
          color={aliasTokens.color.text.Primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // marginBottom: aliasTokens.spacing.Small,
  },
  label: {
    ...aliasTokens.typography.labelText.Default,
    color: aliasTokens.color.text.Primary,
    marginBottom: aliasTokens.spacing.XSmall,
  },
  dropdown: {
    height: aliasTokens.sizes.Medium,
    backgroundColor: aliasTokens.input.FillEnabled,
    borderRadius: aliasTokens.borderRadius.Default,
    borderWidth: aliasTokens.borderWidth.Default,
    borderColor: aliasTokens.input.BorderEnabled,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: aliasTokens.spacing.Small,
  },
  dropdownText: {
    ...aliasTokens.typography.inputText.Medium,
    color: aliasTokens.color.text.Primary,
    flex: 1,
  },
  placeholderText: {
    color: aliasTokens.input.PlaceHolder,
  },
});

export default Dropdown; 