import React, { ReactElement, useMemo } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import Button from '../../../components/Button';
import CircleIcon from '../../../components/CircleIcon';
import { aliasTokens } from '../../../theme/alias';
import { ResendEmailScreen as ResendEmailType, RootStackParamList } from '../../../types/navigation';
import { ImagesAssets } from '../../../assets';

/**
 * Email verification prompt screen
 * 
 * Appears after signup/reset to guide users through verifying their email.
 * - Shows a clear envelope icon
 * - Displays the email (tappable to open the mail client)
 * - Offers a minimal "Resend Email" action (navigation-only stub)
 */
const ResendEmailScreen = ({ navigation, route }: ResendEmailType): ReactElement => {
    // Prefer the provided email, fall back to a generic placeholder
    const email = route?.params?.email ?? 'you@example.com';

    // Narrow expected content values for safer branching
    const content = (route?.params?.content as 'signup' | 'reset' | undefined) ?? undefined;

    // Opens the default mail client with the target email
    const handleOpenMail = () => {
        Linking.openURL(`mailto:${email}`).catch(() => { /* no-op */ });
    };

    // Decide next route based on entry context
    const nextRoute: keyof RootStackParamList | undefined = useMemo(() => {
        switch (content) {
            case 'signup':
                return 'OnBoardingMain';
            case 'reset':
                // Note: matches current route name in types (intentional spelling)
                return 'ResetPassowrd';
            default:
                return undefined;
        }
    }, [content]);

    const handleResend = () => {
        // TODO: Wire to API to trigger resend; currently navigates forward only
        if (nextRoute) {
            navigation.navigate(nextRoute);
        }
    };

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
                    and verify your email.
                </Text>

                {/* Resend email action button */}
                <Button title="Resend Email" variant="outline" onPress={handleResend} style={styles.cta} />
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


