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
 * Gateway screen for authentication entry: email and social sign-in.
 */
const Gateway = ({ navigation }: GatewayScreenProps): ReactElement => {
    const [email, setEmail] = useState<string>('nameless@gmail.com');
    const isEmailValid = validateEmail(email);

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <LogoImage />
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
                <Button
                    title="Continue with Email"
                    variant="primary"
                    onPress={() => navigation.navigate('SignupWithEmailScreen', { email })}
                    disabled={!isEmailValid}
                />

                <Text style={styles.or}>or</Text>

                <View style={{
                    gap: aliasTokens.spacing.Small
                }}>
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

            <LegalText />
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

});

export default Gateway;
