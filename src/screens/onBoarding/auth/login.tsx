import React, { ReactElement, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

import { aliasTokens } from '../../../theme/alias';
import validateEmail from '../../../utils/validateEmail';
import type { Login as LoginScreenProps } from '../../../types/navigation';

import Input from '../../../components/Input';
import Button from '../../../components/Button';
import SocialButton from '../../../components/SocialButton';
import PasswordInput from '../../../components/PasswordInput';
import BackButton from '../../../components/BackButton';

/**
 * Login screen for authentication entry
 * 
 * Primary entry point for user authentication featuring:
 * - Email input with real-time validation
 * - Social authentication options (Google, Apple)
 * - Brand logo and welcome messaging
 * - Legal text and terms
 * 
 * @param props - Navigation props for screen transitions
 * @returns JSX element representing the authentication Login
 */
const Login = ({ navigation }: LoginScreenProps): ReactElement => {
    // Form state management
    const [email, setEmail] = useState<string>('daniel.martinez1995@gmail.com');
    const [password, setPassword] = useState<string>('daniel');

    // Email validation state
    const isEmailValid = validateEmail(email);

    return (
        <View style={[
            aliasTokens.container.bodyPadding,
            {
                paddingTop: aliasTokens.spacing.Medium
            }
        ]}>

            {/* Header section with logo and welcome text */}
            <View>
                <BackButton onPress={() => navigation.navigate('Gateway')} />
                <Text style={styles.title}>Login with email</Text>
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

                <PasswordInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                />

                <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </Pressable>

                {/* Primary email authentication button */}
                <Button
                    title="Login with Email"
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
        </View>
    );
};
// Component styles using design system tokens
const styles = StyleSheet.create({
    // Main title styling
    title: {
        ...aliasTokens.typography.title.Large,
        lineHeight: 28,
        letterSpacing: -.25,
        color: aliasTokens.color.text.Primary,
        marginVertical: aliasTokens.spacing.Large,
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

export default Login;
