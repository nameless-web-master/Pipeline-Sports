import React, { ReactElement, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { aliasTokens } from '../../../theme/alias';
import validateEmail from '../../../utils/validateEmail';
import type { Gateway as GatewayScreenProps } from '../../../types/navigation';

import Input from '../../../components/Input';
import Button from '../../../components/Button';
import SocialButton from '../../../components/SocialButton';
import LegalText from '../../../components/LegalText';
import { LogoImage } from '../../../components/Logo';

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
const Gateway = ({ navigation }: GatewayScreenProps): ReactElement => {
    // Form state management
    const [email, setEmail] = useState<string>('daniel.martinez1995@gmail.com');

    // Email validation state
    const isEmailValid = validateEmail(email);

    return (
        <View style={[
            aliasTokens.container.bodyPadding,
            {
                paddingTop: aliasTokens.spacing.MaxLarge
            }
        ]}>
            {/* Header section with logo and welcome text */}
            <View style={styles.header}>
                <LogoImage />
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
                    title="Continue with Email"
                    variant="primary"
                    onPress={() => navigation.navigate('SignupWithEmailScreen', { email })}
                    disabled={!isEmailValid}
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
