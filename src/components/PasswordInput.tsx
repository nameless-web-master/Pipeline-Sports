import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps, Animated, TouchableOpacity } from 'react-native';
import { aliasTokens } from '../theme/alias';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = false,
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderAnim = React.useRef(new Animated.Value(0)).current;

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

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [aliasTokens.input.BorderEnabled, aliasTokens.input.BorderActive],
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

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
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="password"
          textContentType="password"
          autoCorrect={false}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleTogglePassword}
          disabled={disabled}
        >
          <Text style={[
            styles.toggleText,
            disabled && styles.toggleTextDisabled
          ]}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: aliasTokens.spacing.Small,
  },
  label: {
    ...aliasTokens.typography.labelText.Medium,
    color: aliasTokens.color.text.Primary,
    marginBottom: aliasTokens.spacing.XXSmall,
  },
  inputContainer: {
    borderWidth: aliasTokens.borderWidth.Default,
    borderRadius: aliasTokens.borderRadius.Default,
    backgroundColor: aliasTokens.input.FillEnabled,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12
  },
  input: {
    flex: 1,
    // paddingHorizontal: aliasTokens.spacing.Medium,
    height: aliasTokens.sizes.Medium,
    ...aliasTokens.typography.inputText.Medium,
    color: aliasTokens.color.text.Primary,
    includeFontPadding: false
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
  toggleButton: {
    paddingHorizontal: aliasTokens.spacing.Medium,
    paddingVertical: aliasTokens.spacing.XSmall,
  },
  toggleText: {
    ...aliasTokens.typography.buttonText.Small,
    color: aliasTokens.color.brand.Primary,
  },
  toggleTextDisabled: {
    color: aliasTokens.color.text.Disabled,
  },
});

export default PasswordInput; 