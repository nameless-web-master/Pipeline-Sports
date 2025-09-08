import React, { ReactElement } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../../../components/Button';
import { aliasTokens } from '../../../theme/alias';
import { ResendEmailScreen as ResendEmailType } from '../../../types/navigation';

/**
 * Simple screen prompting the user to verify their email address.
 * - Shows an envelope icon
 * - Displays the email address (tappable to open the mail client)
 * - Provides a CTA to resend the verification email
 *
 * If a route param `email` exists, it will be displayed; otherwise a placeholder is shown.
 */
const ResendEmailScreen = ({ navigation, route }: ResendEmailType): ReactElement => {
    const email = route?.params?.email ?? 'you@example.com';

    const handleOpenMail = () => {
        // Attempt to open the default mail client with the selected email
        Linking.openURL(`mailto:${email}`).catch(() => { /* no-op */ });
    };

    const handleResend = () => {
        // TODO: Integrate with API to trigger resend
        // Keep the UI behavior minimal for now
    };

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <MaterialIcons name="mail-outline" size={40} color={aliasTokens.color.text.Secondary} />
                </View>

                <Text style={styles.title}>Check your email</Text>

                <Text style={styles.subtitle}>
                    {'Please check your email at\n'}
                    <Text style={styles.emailLink} onPress={handleOpenMail} accessibilityRole="link">
                        {email}
                    </Text>{' '}
                    and verify your email.
                </Text>

                <Button title="Resend Email" variant="outline" onPress={handleResend} style={styles.cta} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: aliasTokens.color.background.Primary,
        paddingHorizontal: aliasTokens.spacing.Large,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: aliasTokens.color.background.Secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: aliasTokens.spacing.Medium,
    },
    title: {
        ...aliasTokens.typography.title.Mini,
        color: aliasTokens.color.text.Primary,
        textAlign: 'center',
    },
    subtitle: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
        textAlign: 'center',
        marginTop: aliasTokens.spacing.XSmall,
        // marginHorizontal: aliasTokens.spacing.XLarge,
    },
    emailLink: {
        color: aliasTokens.color.brand.Primary,
    },
    cta: {
        width: '100%',
        marginTop: aliasTokens.spacing.XLarge,
    },
});

export default ResendEmailScreen;


