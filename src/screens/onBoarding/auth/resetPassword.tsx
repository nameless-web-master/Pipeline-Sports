import React, { useCallback, memo, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../../../components/BackButton';
import PasswordInput from '../../../components/PasswordInput';
import Button from '../../../components/Button';
import { aliasTokens } from '../../../theme/alias';
import type { ResetPassowrd as ResetPasswordProps } from '../../../types/navigation';

// Password validation regex patterns
const LETTER_NUMBER_REGEX = /[A-Za-z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

/**
 * Individual password rule indicator component
 * Shows a checkmark or empty circle with rule text
 */
const PasswordRule = memo(({ met, label }: { met: boolean; label: string }) => {
    return (
        <View style={styles.ruleRow}>
            <MaterialIcons
                name={met ? 'task-alt' : 'radio-button-unchecked'}
                size={18}
                color={met ? aliasTokens.color.semantic.success.Default : aliasTokens.color.text.Tertiary}
                style={{ marginRight: aliasTokens.spacing.XSmall }}
            />
            <Text style={[styles.ruleText, met ? styles.ruleTextMet : styles.ruleTextUnmet]}>{label}</Text>
        </View>
    );
});
PasswordRule.displayName = 'PasswordRule';

/**
 * Signup screen with email and password validation
 * Features real-time password strength validation with visual indicators
 */
const ResetPassowrd: React.FC<ResetPasswordProps> = ({ navigation, route }) => {
    // Form state management
    const [password, setPassword] = useState('qwe123qw');

    // Password validation rules - memoized for performance
    const passHasMin = useMemo(() => password.length >= 8, [password]);
    const passHasLetterAndNumber = useMemo(() => LETTER_NUMBER_REGEX.test(password) && DIGIT_REGEX.test(password), [password]);
    const passHasSpecial = useMemo(() => SPECIAL_CHAR_REGEX.test(password), [password]);

    // Overall form validation state
    const isFormValid = passHasMin && passHasLetterAndNumber && passHasSpecial;

    // Event handlers - memoized for performance
    const openLink = useCallback((url: string) => {
        Linking.openURL(url).catch(() => { });
    }, []);

    const handleBack = useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);


    const handlePassword = useCallback(() => {
        navigation.navigate('NotePage');
    }, [navigation]);


    return (
        <View style={{
            ...aliasTokens.container.bodyPadding,
            paddingTop: aliasTokens.spacing.Medium
        }}>
            <ScrollView keyboardShouldPersistTaps="handled">
                {/* Navigation header */}
                <BackButton onPress={handleBack} style={styles.backButton} />
                <Text style={styles.title}>Enter a new password below and you're set.</Text>

                <PasswordInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                />

                {/* Password validation rules */}
                <View>
                    <Text style={styles.rulesHeader}>Your password must have:</Text>
                    <PasswordRule met={passHasMin} label="8 characters minimum" />
                    <PasswordRule met={passHasLetterAndNumber} label="1 letter and 1 number" />
                    <PasswordRule met={passHasSpecial} label="1 special character (Example: # ? $ & @)" />
                </View>

                {/* Submit button */}
                <View style={styles.spacerLarge} />
                <Button
                    title="Reset Password"
                    onPress={handlePassword}
                    disabled={!isFormValid}
                    style={styles.cta}
                />
            </ScrollView>
        </View>
    );
};

// Component styles using design system tokens
const styles = StyleSheet.create({

    // Header and navigation styles
    backButton: {
        alignSelf: 'flex-start',
    },
    title: {
        ...aliasTokens.typography.display.Small,
        color: aliasTokens.color.text.Primary,
        textAlign: 'center',
        marginVertical: aliasTokens.spacing.Large,
        marginHorizontal: 29
    },

    // Spacing utilities
    spacerSmall: {
        height: aliasTokens.spacing.Large,
    },
    spacerMedium: {
        height: aliasTokens.spacing.Medium,
    },
    spacerLarge: {
        height: aliasTokens.spacing.Medium,
    },

    // Password validation rules styles
    rulesHeader: {
        ...aliasTokens.typography.labelText.Small,
        color: aliasTokens.color.text.Black,
        marginBottom: aliasTokens.spacing.XXSmall,
    },
    ruleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: aliasTokens.spacing.XXSmall,
    },

    // Unused rule icon styles (kept for potential future use)
    ruleIcon: {
        width: 16,
        height: 16,
        borderRadius: aliasTokens.borderRadius.Small,
        marginRight: aliasTokens.spacing.XSmall,
        borderWidth: 2,
    },
    ruleIconMet: {
        backgroundColor: aliasTokens.color.semantic.success.Light,
        borderColor: aliasTokens.color.semantic.success.Default,
    },
    ruleIconUnmet: {
        backgroundColor: aliasTokens.color.background.Primary,
        borderColor: aliasTokens.color.border.Light,
    },

    // Rule text styles
    ruleText: {
        ...aliasTokens.typography.body.XSmall,
        color: aliasTokens.color.text.Tertiary
    },
    ruleTextMet: {
        color: aliasTokens.color.text.Success,
    },
    ruleTextUnmet: {
        color: aliasTokens.color.text.Secondary,
    },

    // Call-to-action button styles
    cta: {
        marginTop: aliasTokens.spacing.Small,
    },
});

export default ResetPassowrd;
