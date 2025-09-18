import React, { ReactElement, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, AppState } from 'react-native';

import { aliasTokens } from '../../../theme/alias';
import validateEmail from '../../../utils/validateEmail';

// Import Types of several Varialbles
import type { Gateway as GatewayScreenProps } from '../../../types/navigation';
import type { ShowToast } from '../../../types/toast';
import type { checkEmailPropsType } from '../../../types/props';

// Import Components
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import SocialButton from '../../../components/SocialButton';
import LegalText from '../../../components/LegalText';
import { LogoImage } from '../../../components/Logo';
import { checkEmailExist, sendEmailVerification } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';

/**
 * Gateway screen for authentication entry
 * 
 * Primary entry point for user authentication featuring:
 * - Email input with real-time validation
 * - Social authentication options (Google, Apple)
 * - Brand logo and welcome messaging
 * - Legal text and terms
 * 
 * @param props - Navigation props for screen transitions
 * @returns JSX element representing the authentication gateway
 */
interface GatewayProps extends GatewayScreenProps {
    showToast: ShowToast;
}

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active')
        supabase.auth.startAutoRefresh();
    else
        supabase.auth.stopAutoRefresh();
});


const Gateway = ({ navigation, showToast }: GatewayProps): ReactElement => {
    // Form state
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Derived state
    const isEmailValid = validateEmail(email);

    /**
     * Check whether the email exists and route accordingly.
     * - 'login': user exists → navigate to Login with prefilled email
     * - 'signup': user not found → navigate to Signup with prefilled email
     * - 'error': unexpected error → show error toast
     */
    const handleEmailAuth = useCallback(async () => {
        if (!isEmailValid || isLoading) return;

        setIsLoading(true);
        try {
            const result: checkEmailPropsType = await checkEmailExist(email);
            console.log(result);

            switch (result) {
                case 'login':
                    showToast({ message: 'Account found. Please log in.', type: 'success' });
                    navigation.navigate('Login', { email });
                    break;
                case 'verify':
                    showToast({ message: 'Account found. But you should verify.' });
                    sendEmailVerification(email);
                    navigation.navigate('ResendEmailScreen', { email, content: 'signup' });
                    break;
                case 'signup':
                    showToast({ message: 'No account found. Create one.' });
                    navigation.navigate('SignupWithEmailScreen', { email });
                    break;
                default:
                    showToast({ message: 'An error occurred. Please try again.', type: 'danger' });
            }

        } catch (error) {
            console.log('Email auth error:', error);
            showToast({ message: 'An error occurred. Please try again.', type: 'danger' });
        } finally {
            setIsLoading(false);
        }
    }, [email, isEmailValid, isLoading, navigation, showToast]);

    return (
        <View style={[
            aliasTokens.container.bodyPadding,
            {
                paddingTop: aliasTokens.spacing.MaxLarge
            }
        ]}>
            {/* Header section with logo and welcome text */}
            <View style={styles.header}>
                <LogoImage style={{
                    width: 50,
                    height: 50
                }} />
                <Text style={styles.title}>Welcome to Pipeline!</Text>
                <Text style={styles.subtitle}>Get started by logging in.</Text>
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
                    title={isLoading ? "Checking..." : "Continue with Email"}
                    variant="primary"
                    onPress={handleEmailAuth}
                    disabled={!isEmailValid || isLoading}
                />

                {/* Divider text */}
                <Text style={styles.or}>or</Text>

                {/* Social authentication options */}
                <View style={{
                    gap: aliasTokens.spacing.Small
                }}>
                    <SocialButton
                        title="Continue with Google"
                        iconUri="https://img.icons8.com/color/48/google-logo.png"
                        onPress={() => { /* TODO: Implement Google OAuth */ }}
                    />
                    <SocialButton
                        title="Continue with Apple"
                        iconUri="https://img.icons8.com/ios-filled/50/000000/mac-os.png"
                        onPress={() => { /* TODO: Implement Apple Sign-In */ }}
                    />
                </View>
            </View>

            {/* Legal text footer */}
            <LegalText />

            {/* Toast is rendered once at the App root */}
        </View>
    );
};
// Component styles using design system tokens
const styles = StyleSheet.create({
    // Header section with centered content
    header: {
        alignItems: 'center',
        marginBottom: aliasTokens.spacing.XLarge,
    },

    // Main title styling
    title: {
        ...aliasTokens.typography.display.Small,
        color: aliasTokens.color.text.Primary,
        textAlign: 'center',
        marginTop: aliasTokens.spacing.Medium,
    },

    // Subtitle styling
    subtitle: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
        textAlign: 'center',
        marginTop: aliasTokens.spacing.XXSmall,
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
});

export default Gateway;



