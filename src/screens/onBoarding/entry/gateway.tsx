import React, { ReactElement, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { aliasTokens } from '../../../theme/alias';
import { Logo } from '../../../assets';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import SocialButton from '../../../components/SocialButton';

/**
 * Gateway screen for authentication entry: email and social sign-in.
 */
const Gateway = (): ReactElement => {
    const [email, setEmail] = useState<string>('');

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Image source={Logo} />
                <Text style={styles.title}>Welcome to Pipeline!</Text>
                <Text style={styles.subtitle}>Get started by logging in.</Text>
            </View>

            <View style={styles.form}>
                <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Button title="Continue with Email" variant="primary" onPress={() => { }} />

                <Text style={styles.or}>or</Text>

                <View>
                    <SocialButton
                        title="Continue with Google"
                        iconUri="https://img.icons8.com/color/48/google-logo.png"
                        onPress={() => { }}
                    />
                    <SocialButton
                        title="Continue with Apple"
                        iconUri="https://img.icons8.com/ios-filled/50/000000/mac-os.png"
                        onPress={() => { }}
                    />
                </View>
            </View>

            <Text style={styles.legal}>
                By proceeding, you acknowledge and agree to our
                <Text style={styles.link}> Terms</Text>
                <Text> and</Text>
                <Text style={styles.link}> Privacy Policy</Text>
                <Text>.</Text>
            </Text>
        </View>
    );
};
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: aliasTokens.color.background.Primary,
        paddingHorizontal: aliasTokens.spacing.Large,
        paddingTop: aliasTokens.spacing.MaxLarge,
    },
    header: {
        alignItems: 'center',
        marginBottom: aliasTokens.spacing.XLarge,
    },
    title: {
        ...aliasTokens.typography.display.Small,
        color: aliasTokens.color.text.Primary,
        textAlign: 'center',
        marginTop: aliasTokens.spacing.Medium,
    },
    subtitle: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
        textAlign: 'center',
        marginTop: aliasTokens.spacing.XXSmall,
    },
    form: {
        gap: aliasTokens.spacing.Medium,
    } as unknown as any,
    or: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
        textAlign: 'center',
    },
    legal: {
        ...aliasTokens.typography.body.XSmall,
        color: aliasTokens.color.text.Tertiary,
        textAlign: 'center',
        marginTop: aliasTokens.spacing.Medium,
        marginHorizontal: 29
    },
    link: {
        color: aliasTokens.color.brand.Primary,
    },
});

export default Gateway;


