import React, { useCallback, memo, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../../../components/BackButton';
import Input from '../../../components/Input';
import PasswordInput from '../../../components/PasswordInput';
import Button from '../../../components/Button';
import { aliasTokens } from '../../../theme/alias';
import validateEmail from '../../../utils/validateEmail';
import type { SignupWithEmailScreen as SignupType } from '../../../types/navigation';
import LegalText from '../../../components/LegalText';

// Password validation regex patterns
const LETTER_NUMBER_REGEX = /[A-Za-z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

/**
 * Individual password rule indicator component
 * Shows a checkmark or empty circle with rule text
 */
const PasswordRule = memo(({ met, label }: { met: boolean; label: string }) => {
  return (
    <View style={styles.ruleRow}>
      <MaterialIcons
        name={met ? 'task-alt' : 'radio-button-unchecked'}
        size={18}
        color={met ? aliasTokens.color.semantic.success.Default : aliasTokens.color.text.Tertiary}
        style={{ marginRight: aliasTokens.spacing.XSmall }}
      />
      <Text style={[styles.ruleText, met ? styles.ruleTextMet : styles.ruleTextUnmet]}>{label}</Text>
    </View>
  );
});
PasswordRule.displayName = 'PasswordRule';

/**
 * Signup screen with email and password validation
 * Features real-time password strength validation with visual indicators
 */
const SignupWithEmailScreen: React.FC<SignupType> = ({ navigation, route }) => {
  // Form state management
  const [email, setEmail] = useState(route?.params?.email ?? '');
  const [password, setPassword] = useState('qwe123qw');

  // Password validation rules - memoized for performance
  const emailValid = useMemo(() => validateEmail(email), [email]);
  const passHasMin = useMemo(() => password.length >= 8, [password]);
  const passHasLetterAndNumber = useMemo(() => LETTER_NUMBER_REGEX.test(password) && DIGIT_REGEX.test(password), [password]);
  const passHasSpecial = useMemo(() => SPECIAL_CHAR_REGEX.test(password), [password]);

  // Overall form validation state
  const isFormValid = emailValid && passHasMin && passHasLetterAndNumber && passHasSpecial;

  // Event handlers - memoized for performance
  const openLink = useCallback((url: string) => {
    Linking.openURL(url).catch(() => { });
  }, []);

  const handleBack = useCallback(() => {
    navigation.navigate('Gateway');
  }, [navigation]);

  const handleSignup = useCallback(() => {
    // TODO: Hook up to actual signup API when available
    // For now, navigate to email verification screen
    navigation.navigate('ResendEmailScreen', { email });
  }, [navigation, email]);

  return (
    <View style={aliasTokens.container.bodyPadding}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Navigation header */}
        <BackButton onPress={handleBack} style={styles.backButton} />
        <Text style={styles.title}>Signup with email</Text>

        {/* Email input section */}
        <View style={styles.spacerSmall} />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholder="you@example.com"
          error={email.length > 0 && !emailValid}
        />

        {/* Password input section */}
        <View style={styles.spacerMedium} />
        <PasswordInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />

        {/* Password validation rules */}
        <View>
          <Text style={styles.rulesHeader}>Your password must have:</Text>
          <PasswordRule met={passHasMin} label="8 characters minimum" />
          <PasswordRule met={passHasLetterAndNumber} label="1 letter and 1 number" />
          <PasswordRule met={passHasSpecial} label="1 special character (Example: # ? $ & @)" />
        </View>

        {/* Submit button */}
        <View style={styles.spacerLarge} />
        <Button
          title="Signup with email"
          onPress={handleSignup}
          disabled={!isFormValid}
          style={styles.cta}
        />

        {/* Legal text footer */}
        <LegalText />
      </ScrollView>
    </View>
  );
};

// Component styles using design system tokens
const styles = StyleSheet.create({
 
  // Header and navigation styles
  backButton: {
    alignSelf: 'flex-start',
  },
  title: {
    ...aliasTokens.typography.display.Small,
    color: aliasTokens.color.text.Primary,
    marginTop: aliasTokens.spacing.Large,
  },
  
  // Spacing utilities
  spacerSmall: {
    height: aliasTokens.spacing.Large,
  },
  spacerMedium: {
    height: aliasTokens.spacing.Medium,
  },
  spacerLarge: {
    height: aliasTokens.spacing.Medium,
  },
  
  // Password validation rules styles
  rulesHeader: {
    ...aliasTokens.typography.labelText.Small,
    color: aliasTokens.color.text.Black,
    marginBottom: aliasTokens.spacing.XXSmall,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: aliasTokens.spacing.XXSmall,
  },
  
  // Unused rule icon styles (kept for potential future use)
  ruleIcon: {
    width: 16,
    height: 16,
    borderRadius: aliasTokens.borderRadius.Small,
    marginRight: aliasTokens.spacing.XSmall,
    borderWidth: 2,
  },
  ruleIconMet: {
    backgroundColor: aliasTokens.color.semantic.success.Light,
    borderColor: aliasTokens.color.semantic.success.Default,
  },
  ruleIconUnmet: {
    backgroundColor: aliasTokens.color.background.Primary,
    borderColor: aliasTokens.color.border.Light,
  },
  
  // Rule text styles
  ruleText: {
    ...aliasTokens.typography.body.XSmall,
    color: aliasTokens.color.text.Tertiary
  },
  ruleTextMet: {
    color: aliasTokens.color.text.Success,
  },
  ruleTextUnmet: {
    color: aliasTokens.color.text.Secondary,
  },
  
  // Call-to-action button styles
  cta: {
    marginTop: aliasTokens.spacing.Small,
  },
});

export default SignupWithEmailScreen;
