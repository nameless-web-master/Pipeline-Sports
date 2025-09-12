import React, { ReactElement, useCallback, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { aliasTokens } from '../../../theme/alias';
import validateEmail from '../../../utils/validateEmail';
import type { ForgotPassword as ForgotPasswordScreenProps } from '../../../types/navigation';
import type { ShowToast } from '../../../types/toast';

import Input from '../../../components/Input';
import Button from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import { sendResetPasswordEmail } from '../../../hooks/useAuth';

/**
 * ForgotPassword screen for authentication entry
 * 
 * Primary entry point for user authentication featuring:
 * - Email input with real-time validation
 * - Social authentication options (Google, Apple)
 * - Brand logo and welcome messaging
 * - Legal text and terms
 * 
 * @param props - Navigation props for screen transitions
 * @returns JSX element representing the authentication ForgotPassword
 */
interface Props extends ForgotPasswordScreenProps { showToast: ShowToast }

/**
 * ForgotPassword screen
 * - Validates email
 * - Sends Supabase reset email with deep link back to app
 * - Shows user feedback via app-level toast
 */
const ForgotPassword = ({ navigation, route, showToast }: Props): ReactElement => {
    // Local form state
    const [email, setEmail] = useState<string>(route?.params?.email ?? '');
    const [isLoading, setIsLoading] = useState(false);

    // Derived validation state
    const isEmailValid = validateEmail(email);

    // Send reset email and guide user to check inbox
    const handleForgotPassword = useCallback(async () => {
        if (isLoading || !isEmailValid) return;
        setIsLoading(true);
        try {
            const sent = await sendResetPasswordEmail(email);
            if (sent === null) {
                showToast({ message: 'You have not registered yet. Please register first.', type: 'info' });
                navigation.navigate('SignupWithEmailScreen', { email });
            }
            else if (sent as boolean) {
                // Success: inform user and navigate to helper screen
                showToast({
                    message: 'Password reset email sent. Check your inbox.',
                    type: 'success'
                });
                navigation.navigate('ResendEmailScreen', { email, content: 'reset' });
            } else {
                showToast({ message: sent as string, type: 'danger' });
            }
        } catch (error) {
            console.log(error);
            showToast({ message: 'Unexpected error. Please try again.', type: 'danger' });
        } finally {
            setIsLoading(false);
        }
    }, [email, isLoading, isEmailValid, navigation, showToast]);

    return (
        <View style={[
            aliasTokens.container.bodyPadding,
            {
                paddingTop: aliasTokens.spacing.Medium
            }
        ]}>
            {/* Header section with logo and welcome text */}
            <View>
                <BackButton onPress={() => navigation.navigate('Login')} />
                <Text style={styles.title}>Enter your email and you’ll be back in no time.</Text>
            </View>

            {/* Authentication form section */}
            <View style={styles.form}>
                {/* Email input with validation */}
                <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {/* Primary email authentication button */}
                <Button
                    title={isLoading ? 'Sending…' : 'Send Email'}
                    variant="primary"
                    onPress={handleForgotPassword}
                    disabled={!isEmailValid || isLoading}
                />
            </View>
        </View>
    );
};
// Component styles using design system tokens
const styles = StyleSheet.create({

    // Main title styling
    title: {
        ...aliasTokens.typography.display.Small,
        color: aliasTokens.color.text.Primary,
        marginVertical: aliasTokens.spacing.Large,
        marginHorizontal: 29,
        textAlign: 'center'
    },

    // Form container with consistent spacing
    form: {
        gap: aliasTokens.spacing.Medium,
    } as unknown as any,

    // Divider text between authentication methods
    or: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
        textAlign: 'center',
    },
    forgotPassword: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Brand,
        marginTop: -20,
        marginBottom: aliasTokens.spacing.Small
    }
});

export default ForgotPassword;
