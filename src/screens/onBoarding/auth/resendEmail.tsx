import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../../components/Button';
import CircleIcon from '../../../components/CircleIcon';
import { aliasTokens } from '../../../theme/alias';
import { ResendEmailScreen as ResendEmailType } from '../../../types/navigation';
import { ImagesAssets } from '../../../assets';
import * as Linking from 'expo-linking';
import { sendResetPasswordEmail, sendEmailVerification } from '../../../hooks/useAuth';
import type { ShowToast } from '../../../types/toast';

/**
 * Email verification prompt screen
 * 
 * Appears after signup/reset to guide users through verifying their email.
 * - Shows a clear envelope icon
 * - Displays the email (tappable to open the mail client)
 * - Offers a minimal "Resend Email" action (navigation-only stub)
 */
interface Props extends ResendEmailType {
    showToast: ShowToast;
}

const ResendEmailScreen = ({ navigation, route, showToast }: Props): ReactElement => {
    // Prefer the provided email, fall back to a generic placeholder
    const email = route?.params?.email ?? 'you@example.com';

    // Narrow expected content values for safer branching
    const content = (route?.params?.content as 'signup' | 'reset' | undefined) ?? undefined;

    // Opens the default mail client with the target email
    const handleOpenMail = () => {
        Linking.openURL(`mailto:${email}`).catch(() => { /* no-op */ });
    };

    // Decide next route based on entry context
    const nextRoute: Function | undefined = useMemo(() => {
        switch (content) {
            case 'signup':
                return sendEmailVerification;
            case 'reset':
                // Note: matches current route name in types (intentional spelling)
                return sendResetPasswordEmail;
            default:
                return undefined;
        }
    }, [content]);

    // Generate a context-specific message to guide the user on the next step.
    const contentMessage: string = useMemo(() => {
        switch (content) {
            case 'signup':
                return 'and verify your email.';
            case 'reset':
                return 'for the instructions to reset your password.';
            default:
                return '';
        }
    }, [content]);

    /**
     * Trigger resend action and toast based on result shape
     * - Success (result === true) → show concise custom success text
     * - Failure (result is Error-like) → show error.message
     */
    const handleEmailSent = async () => {
        if (!nextRoute) return;
        try {
            const result = await nextRoute(email);

            if (result === true) {
                // Only show custom success text
                showToast({
                    message: content === 'reset' ? 'Password reset email sent' : 'Verification email sent',
                    type: 'success',
                });
                return;
            }

            // Any non-true result is treated as an error-like object
            const errorMessage = (result as any)?.message ?? 'Failed to send email. Try again.';
            showToast({ message: errorMessage, type: 'danger' });
        } catch (err: any) {
            const errorMessage = err?.message ?? 'Failed to send email. Try again.';
            showToast({ message: errorMessage, type: 'danger' });
        }
    };

    useEffect(() => {
        const handleDeepLink = (url: string | null) => {
            if (!url) return;

            console.log('Initial URL:', url);

            if (url.includes('OnBoardingMain')) {
                showToast({ message: 'Email verified successfully.', type: 'success' });
                navigation.navigate('OnBoardingMain');
            } else if (url.includes('ResetPassowrd')) {
                showToast({ message: 'Password reset email sent.', type: 'success' });
                navigation.navigate('ResetPassowrd');
            }

        };

        // Get the initial URL
        Linking.getInitialURL().then(handleDeepLink);

        // Listen for new incoming URLs
        const subscription = Linking.addEventListener('url', (event) => {
            handleDeepLink(event.url);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                {/* Visual icon for email context */}
                <CircleIcon
                    source={{ uri: ImagesAssets('Email') }}
                    containerStyle={styles.iconWrapper}
                />

                {/* Main instruction text */}
                <Text style={styles.title}>Check your email</Text>

                {/* Detailed instruction with tappable email */}
                <Text style={styles.subtitle}>
                    {'Please check your email at\n'}
                    <Text style={styles.emailLink} onPress={handleOpenMail} accessibilityRole="link">
                        {email}
                    </Text>{' '}
                    {contentMessage}.
                </Text>

                {/* Resend email action button */}
                <Button
                    title="Resend Email"
                    variant="outline"
                    onPress={handleEmailSent}
                    style={styles.cta}
                />
            </View>
        </View>
    );
};

// Component styles using design system tokens
const styles = StyleSheet.create({
    // Main screen container
    screen: {
        flex: 1,
        backgroundColor: aliasTokens.color.background.Primary,
        paddingHorizontal: aliasTokens.spacing.Large,
    },

    // Centered content container
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Icon container styling (now handled by CircleIcon component)
    iconWrapper: {
        marginBottom: aliasTokens.spacing.Medium,
    },

    // Main title styling
    title: {
        ...aliasTokens.typography.title.Mini,
        color: aliasTokens.color.text.Primary,
        textAlign: 'center',
    },

    // Subtitle with instruction text
    subtitle: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
        textAlign: 'center',
        marginTop: aliasTokens.spacing.XSmall,
        // marginHorizontal: aliasTokens.spacing.XLarge,
    },

    // Tappable email link styling
    emailLink: {
        color: aliasTokens.color.brand.Primary,
    },

    // Call-to-action button styling
    cta: {
        width: '100%',
        marginTop: aliasTokens.spacing.XLarge,
    },
});

export default ResendEmailScreen;


