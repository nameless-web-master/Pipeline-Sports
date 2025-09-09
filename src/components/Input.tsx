import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps, Animated } from 'react-native';
import { aliasTokens } from '../theme/alias';

/**
 * Props for the Input component
 */
interface InputProps extends TextInputProps {
  /** Optional label displayed above the input */
  label?: string;
  /** Controlled value */
  value: string;
  /** Change handler for the controlled value */
  onChangeText: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Error state to indicate validation failure */
  error?: boolean;
  /** Disabled state to prevent editing */
  disabled?: boolean;
}

/**
 * Theme-aware text input with focus border animation and states.
 */
const Input: React.FC<InputProps> = ({ label, value, onChangeText, placeholder, error = false, disabled = false, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: aliasTokens.motion.duration.Base,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: aliasTokens.motion.duration.Base,
      useNativeDriver: false,
    }).start();
  };

  // Interpolated border color animated on focus/blur
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [aliasTokens.input.BorderEnabled, aliasTokens.input.BorderActive],
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          style={[
            styles.input,
            disabled ? styles.inputDisabled : error ? styles.inputError : styles.inputEnabled,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={aliasTokens.input.PlaceHolder}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
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
  inputContainer: {
    borderWidth: aliasTokens.borderWidth.Default,
    borderRadius: aliasTokens.borderRadius.Default,
    backgroundColor: aliasTokens.input.FillEnabled,
    height: aliasTokens.sizes.Medium,
    justifyContent: 'center', // Center the text vertically
  },
  input: {
    paddingHorizontal: aliasTokens.spacing.Medium,
    height: '100%', // Take full height of container
    ...aliasTokens.typography.inputText.Medium,
    color: aliasTokens.color.text.Primary,
    textAlignVertical: 'center', // Center text vertically
  },
  inputEnabled: {
    backgroundColor: 'transparent',
  },
  inputError: {
    backgroundColor: aliasTokens.input.FillError,
    borderColor: aliasTokens.input.BorderError,
  },
  inputDisabled: {
    backgroundColor: aliasTokens.input.FillDisabled,
    borderColor: aliasTokens.input.BorderDisabled,
    color: aliasTokens.color.text.Disabled,
  },
});

export default Input;
