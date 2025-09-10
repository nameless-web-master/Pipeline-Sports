import React, { ReactElement, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { aliasTokens } from '../../../theme/alias';
import validateEmail from '../../../utils/validateEmail';
import type { ForgotPassword as ForgotPasswordScreenProps } from '../../../types/navigation';

import Input from '../../../components/Input';
import Button from '../../../components/Button';
import SocialButton from '../../../components/SocialButton';
import PasswordInput from '../../../components/PasswordInput';
import BackButton from '../../../components/BackButton';

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
const ForgotPassword = ({ navigation }: ForgotPasswordScreenProps): ReactElement => {
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
                    title="Send Email"
                    variant="primary"
                    onPress={() => navigation.navigate('ResendEmailScreen', { email, content: 'reset' })}
                    disabled={!isEmailValid}
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
