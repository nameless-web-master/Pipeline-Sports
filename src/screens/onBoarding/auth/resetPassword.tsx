import React, { useCallback, memo, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../../../components/BackButton';
import PasswordInput from '../../../components/PasswordInput';
import Button from '../../../components/Button';
import { aliasTokens } from '../../../theme/alias';
import type { ResetPassowrd as ResetPasswordProps } from '../../../types/navigation';
import type { ShowToast } from '../../../types/toast';
import { updatePassword, usePasswordResetLink } from '../../../hooks/useAuth';
import PasswordRules from '../../../components/PasswordRules';

// Password validation regex patterns
const LETTER_NUMBER_REGEX = /[A-Za-z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

// Removed local PasswordRule in favor of shared PasswordRules component

/**
 * Signup screen with email and password validation
 * Features real-time password strength validation with visual indicators
 */
interface Props extends ResetPasswordProps { showToast?: ShowToast }

/**
 * ResetPassowrd screen
 * - Validates new password locally
 * - Submits to Supabase (requires session from the reset link)
 */
const ResetPassowrd: React.FC<Props> = ({ navigation, route, showToast }) => {
    // Form state management
    const [password, setPassword] = useState('');
    const { sessionLoaded } = usePasswordResetLink();
    const [isLoading, setIsLoading] = useState(false);

    // Password validation rules - memoized for performance
    const passHasMin = useMemo(() => password.length >= 8, [password]);
    const passHasLetterAndNumber = useMemo(() => LETTER_NUMBER_REGEX.test(password) && DIGIT_REGEX.test(password), [password]);
    const passHasSpecial = useMemo(() => SPECIAL_CHAR_REGEX.test(password), [password]);

    // Overall form validation state
    const isFormValid = passHasMin && passHasLetterAndNumber && passHasSpecial;

    // Event handlers - memoized for performance
    const openLink = useCallback((url: string) => {
        Linking.openURL(url).catch(() => { });
    }, []);

    const handleBack = useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);


    const handlePassword = useCallback(async () => {
        try {
            setIsLoading(true);
            if (!isFormValid) return;
            const ok = await updatePassword(password);
            if (ok) {
                showToast?.({ message: 'Password updated successfully.', type: 'success' });
                navigation.navigate('Login', { email: undefined });
            } else {
                showToast?.({ message: 'Failed to update password. Try again.', type: 'danger' });
            }
        }
        catch (err: any) {
            const errorMessage = err?.message ?? 'Failed to send email. Try again.';
            showToast?.({ message: errorMessage, type: 'danger' });
        } finally {
            setIsLoading(false)
        }
    }, [isFormValid, password, navigation, showToast, sessionLoaded, isLoading]);


    return (
        <View style={{
            ...aliasTokens.container.bodyPadding,
            paddingTop: aliasTokens.spacing.Medium
        }}>
            <ScrollView keyboardShouldPersistTaps="handled">
                {/* Navigation header */}
                <BackButton onPress={handleBack} style={styles.backButton} />
                <Text style={styles.title}>Enter a new password below and you're set.</Text>

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
                    title="Reset Password"
                    onPress={handlePassword}
                    disabled={!isFormValid || isLoading}
                    style={styles.cta}
                />
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
        textAlign: 'center',
        marginVertical: aliasTokens.spacing.Large,
        marginHorizontal: 29
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

export default ResetPassowrd;
