import React, { ReactElement } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../../../components/Button';
import { aliasTokens } from '../../../theme/alias';
import { ResendEmailScreen as ResendEmailType } from '../../../types/navigation';

/**
 * Email verification prompt screen
 * 
 * Displays after user signup to guide them through email verification:
 * - Visual envelope icon for clear context
 * - Displays the email address (tappable to open mail client)
 * - Provides resend verification email functionality
 * - Clean, centered layout with clear messaging
 * 
 * @param props - Navigation and route props containing email parameter
 * @returns JSX element representing the email verification screen
 */
const ResendEmailScreen = ({ navigation, route }: ResendEmailType): ReactElement => {
    // Extract email from route params or use placeholder
    const email = route?.params?.email ?? 'you@example.com';

    // Event handlers for user interactions
    const handleOpenMail = () => {
        // Attempt to open the default mail client with the selected email
        Linking.openURL(`mailto:${email}`).catch(() => { /* no-op */ });
    };

    const handleResend = () => {
        // TODO: Integrate with API to trigger resend verification email
        // Keep the UI behavior minimal for now
    };

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                {/* Visual icon for email context */}
                <View style={styles.iconWrapper}>
                    <MaterialIcons name="mail-outline" size={40} color={aliasTokens.color.text.Secondary} />
                </View>

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
    
    // Icon container with circular background
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: aliasTokens.color.background.Secondary,
        alignItems: 'center',
        justifyContent: 'center',
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


