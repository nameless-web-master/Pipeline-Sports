import React, { ReactElement, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../../components/Button';
import CircleIcon from '../../../components/CircleIcon';
import { aliasTokens } from '../../../theme/alias';
import { ResendEmailScreen as ResendEmailType } from '../../../types/navigation';
import { ImagesAssets } from '../../../assets';
import * as Linking from 'expo-linking';
import { sendResetPasswordEmail, sendEmailVerification, signInWithPassword } from '../../../hooks/useAuth';
import type { ShowToast } from '../../../types/toast';

type ContentType = 'signup' | 'reset';

interface Props extends ResendEmailType {
    showToast: ShowToast;
}

const ResendEmailScreen = ({ navigation, route, showToast }: Props): ReactElement => {
    const email = route?.params?.email ?? 'you@example.com';
    const password = (route?.params as any)?.password;
    const content = (route?.params?.content as ContentType) ?? undefined;

    // Opens the default mail client with the target email
    const handleOpenMail = () => {
        Linking.openURL(`mailto:${email}`).catch(() => { /* no-op */ });
    };

    // Get the appropriate email sending function based on content type
    const getEmailFunction = useMemo(() => {
        switch (content) {
            case 'signup':
                return sendEmailVerification;
            case 'reset':
                return sendResetPasswordEmail;
            default:
                return null;
        }
    }, [content]);

    // Generate context-specific message
    const contentMessage = useMemo(() => {
        switch (content) {
            case 'signup':
                return 'and verify your email.';
            case 'reset':
                return 'for the instructions to reset your password.';
            default:
                return '';
        }
    }, [content]);

    // Handle resend email action
    const handleResendEmail = async () => {
        if (!getEmailFunction) return;

        try {
            const result = await getEmailFunction(email);

            if (result === true) {
                const successMessage = content === 'reset'
                    ? 'Password reset email sent'
                    : 'Verification email sent';
                showToast({ message: successMessage, type: 'success' });
            } else {
                const errorMessage = (result as any)?.message ?? 'Failed to send email. Try again.';
                showToast({ message: errorMessage, type: 'danger' });
            }
        } catch (error: any) {
            const errorMessage = error?.message ?? 'Failed to send email. Try again.';
            showToast({ message: errorMessage, type: 'danger' });
        }
    };

    // Handle deep link navigation
    useEffect(() => {
        const handleDeepLink = async (url: string | null) => {
            if (!url) return;

            console.log('Deep link URL:', url);

            if (url.includes('OnBoardingMain')) {
                try {
                    console.log(email, password);

                    await signInWithPassword(email, password);
                    showToast({ message: 'Email verified successfully.', type: 'success' });
                    navigation.navigate('OnBoardingMain');
                } catch (error: any) {
                    showToast({
                        message: error?.message ?? 'Failed to sign in. Please try again.',
                        type: 'danger'
                    });
                }
            } else if (url.includes('ResetPassowrd')) {
                try {
                    showToast({ message: 'Password reset email sent.', type: 'success' });
                    navigation.navigate('ResetPassowrd');
                } catch (error: any) {
                    showToast({
                        message: error?.message ?? 'Failed to reset password. Please try again.',
                        type: 'danger'
                    });
                }
            }
        };

        // Get initial URL and listen for new URLs
        Linking.getInitialURL().then(handleDeepLink);
        const subscription = Linking.addEventListener('url', (event) => {
            handleDeepLink(event.url);
        });

        return () => subscription.remove();
    }, [email, password, navigation, showToast]);

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
                    onPress={handleResendEmail}
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


