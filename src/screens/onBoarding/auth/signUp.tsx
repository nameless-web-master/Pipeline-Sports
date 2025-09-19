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
import type { ShowToast } from '../../../types/toast';
import LegalText from '../../../components/LegalText';
import PasswordRules from '../../../components/PasswordRules';
import { signUp } from '../../../hooks/useAuth';

// Password validation regex patterns
const LETTER_NUMBER_REGEX = /[A-Za-z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

// Removed local PasswordRule in favor of shared PasswordRules component

/**
 * Signup screen with email and password validation
 * Features real-time password strength validation with visual indicators
 * Integrates with Supabase auth for user registration
 */
interface SignupProps extends SignupType {
  showToast: ShowToast;
}

const SignupWithEmailScreen: React.FC<SignupProps> = ({ navigation, route, showToast }) => {
  // Form state management
  const [email, setEmail] = useState(route?.params?.email ?? '');
  const [password, setPassword] = useState(''); // Removed default password for security
  const [isLoading, setIsLoading] = useState(false);

  // Password validation rules - memoized for performance
  const emailValid = useMemo(() => validateEmail(email), [email]);
  const passHasMin = useMemo(() => password.length >= 8, [password]);
  const passHasLetterAndNumber = useMemo(() =>
    LETTER_NUMBER_REGEX.test(password) && DIGIT_REGEX.test(password), [password]);
  const passHasSpecial = useMemo(() => SPECIAL_CHAR_REGEX.test(password), [password]);

  // Overall form validation state - all rules must be met
  const isFormValid = emailValid && passHasMin && passHasLetterAndNumber && passHasSpecial;

  // Event handlers - memoized for performance
  const openLink = useCallback((url: string) => {
    Linking.openURL(url).catch(() => { });
  }, []);

  /**
   * Navigate back to the gateway screen
   */
  const handleBack = useCallback(() => {
    navigation.navigate('Gateway');
  }, [navigation]);

  /**
   * Handles user signup with proper error handling and user feedback
   * Uses the improved signUp function that returns structured success/error responses
   */
  const handleSignup = useCallback(async () => {
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    try {
      const signUpResult = await signUp(email, password);

      if (signUpResult.success) {
        // Signup successful - user created and email confirmation sent
        showToast({
          message: "Account created! Please check your email to verify your account.",
          type: 'success'
        });
        navigation.navigate('ResendEmailScreen', { email, content: "signup", password });
      } else {
        // Signup failed - show specific error message
        const errorMessage = signUpResult.error || 'Failed to create account. Please try again.';
        showToast({ message: errorMessage, type: 'danger' });
      }
    } catch (err) {
      // Handle unexpected errors
      console.log('Signup error:', err);
      showToast({
        message: 'An unexpected error occurred. Please try again.',
        type: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigation, email, password, isFormValid, isLoading, showToast]);

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
        <PasswordRules
          hasMinLength={passHasMin}
          hasLetterAndNumber={passHasLetterAndNumber}
          hasSpecialChar={passHasSpecial}
        />

        {/* Submit button */}
        <View style={styles.spacerLarge} />
        <Button
          title={isLoading ? "Creating Account..." : "Signup with email"}
          onPress={handleSignup}
          disabled={!isFormValid || isLoading}
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

  // Password validation rules styles moved into shared component

  // Call-to-action button styles
  cta: {
    marginTop: aliasTokens.spacing.Small,
  },
});

export default SignupWithEmailScreen;
