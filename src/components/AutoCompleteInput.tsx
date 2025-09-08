import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps, Animated, TouchableOpacity } from 'react-native';
import { aliasTokens } from '../theme/alias';

interface AutoCompleteInputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  error = false, 
  disabled = false,
  suggestions = [],
  onSuggestionPress,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: aliasTokens.motion.duration.Base,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for touch events
    setTimeout(() => setShowSuggestions(false), 200);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: aliasTokens.motion.duration.Base,
      useNativeDriver: false,
    }).start();
  };

  const handleSuggestionPress = (suggestion: string) => {
    onChangeText(suggestion);
    setShowSuggestions(false);
    onSuggestionPress?.(suggestion);
  };

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
      
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
    height: aliasTokens.sizes.Medium,
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: aliasTokens.spacing.Medium,
    height: '100%',
    ...aliasTokens.typography.inputText.Medium,
    color: aliasTokens.color.text.Primary,
    textAlignVertical: 'center',
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
  suggestionsContainer: {
    backgroundColor: aliasTokens.color.background.Primary,
    borderRadius: aliasTokens.borderRadius.Default,
    borderWidth: 1,
    borderColor: aliasTokens.color.border.Light,
    marginTop: 2,
    maxHeight: 200,
  },
  suggestionItem: {
    paddingHorizontal: aliasTokens.spacing.Medium,
    paddingVertical: aliasTokens.spacing.Small,
    borderBottomWidth: 1,
    borderBottomColor: aliasTokens.color.border.Light,
  },
  suggestionText: {
    ...aliasTokens.typography.body.Medium,
    color: aliasTokens.color.text.Primary,
  },
});

export default AutoCompleteInput; 