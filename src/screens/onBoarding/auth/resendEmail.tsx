import React, { ReactElement, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Platform, Linking as RNLinking } from 'react-native';
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

    // Attempt to open the user's email inbox natively. No browser/compose fallbacks.
    const handleOpenMail = async () => {
        try {
            if (Platform.OS === 'android') {
                // Try explicit intents for popular apps and a generic email category
                const androidIntents: string[] = [
                    // Gmail: open email app category in Gmail
                    'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_EMAIL;package=com.google.android.gm;end',
                    // Gmail: open inbox via scheme packaged to Gmail
                    'intent://inbox#Intent;scheme=googlegmail;package=com.google.android.gm;end',
                    // Gmail: conversation list with specific account (best effort)
                    `intent://#Intent;action=android.intent.action.VIEW;component=com.google.android.gm/com.google.android.gm.ConversationListActivityGmail;S.extra_account=${encodeURIComponent(email)};end`,
                    // Outlook
                    'intent://inbox#Intent;scheme=ms-outlook;package=com.microsoft.office.outlook;end',
                    'intent:#Intent;action=android.intent.action.VIEW;package=com.microsoft.office.outlook;end',
                    // Yahoo Mail
                    'intent://#Intent;scheme=ymail;package=com.yahoo.mobile.client.android.mail;end',
                    'intent:#Intent;action=android.intent.action.VIEW;package=com.yahoo.mobile.client.android.mail;end',
                    // Spark
                    'intent://inbox#Intent;scheme=readdle-spark;package=com.readdle.spark;end',
                    'intent:#Intent;action=android.intent.action.VIEW;package=com.readdle.spark;end',
                    // Generic: open default email app
                    'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_EMAIL;end',
                ];

                for (const intent of androidIntents) {
                    try {
                        await RNLinking.openURL(intent);
                        return;
                    } catch { /* try next intent */ }
                }

                // As a final Android attempt, try known schemes directly
                const schemeCandidates: string[] = [
                    'googlegmail://',
                    'gmail://',
                    'ms-outlook://inbox',
                    'ymail://',
                    'readdle-spark://inbox',
                ];
                for (const url of schemeCandidates) {
                    try {
                        await RNLinking.openURL(url);
                        return;
                    } catch { /* continue */ }
                }
            } else {
                // iOS: try inbox schemes (account targeting is not supported publicly by Gmail on iOS)
                const iosSchemes: string[] = [
                    'googlegmail://',
                    'gmail://',
                    'ms-outlook://inbox',
                    'ymail://',
                    'readdle-spark://inbox',
                ];
                for (const url of iosSchemes) {
                    try {
                        const can = await RNLinking.canOpenURL(url);
                        if (can) {
                            await RNLinking.openURL(url);
                            return;
                        }
                    } catch { /* continue */ }
                }
            }

            // No supported mail apps available: do nothing
            return;
        } catch {
            // Swallow errors; no-op to avoid crashing the flow
        }
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
                    <Text style={styles.emailLink} >
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
                <Button
                    title="Open Email"
                    variant="tertiary"
                    onPress={handleOpenMail}
                    style={{
                        marginTop: aliasTokens.spacing.Medium,
                        width: aliasTokens.sizes.full
                    }}
                    textStyle={{ color: aliasTokens.color.text.Primary }}
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
        width: aliasTokens.sizes.full,
        marginTop: aliasTokens.spacing.XLarge,
    },
});

export default ResendEmailScreen;


