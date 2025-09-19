import React, { memo, ReactElement, useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import BackButton from '../../../components/BackButton';
import PasswordInput from '../../../components/PasswordInput';
import Button from '../../../components/Button';
import { aliasTokens } from '../../../theme/alias';
import type { ShowToast } from '../../../types/toast';
import { updatePassword, signOut } from '../../../hooks/useAuth';
import type { ScreenProps } from '../../../types/navigation';
import PasswordRules from '../../../components/PasswordRules';
import { Template } from '../../../components/layout/Template';
import NoteBottomSheet from '../../../components/NoteBottomSheet';
import ConfirmBottomSheet from '../../../components/ConfirmBottomSheet';

// Reuse the same local validation rules used by resetPassword
const LETTER_REGEX = /[A-Za-z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

type Props = ScreenProps<'PasswordHandle'> & { showToast: ShowToast };

/**
 * PasswordHandle
 * Allows the authenticated user to change their password.
 * - Validates inputs locally (min length, letter+number, special char and confirmation match)
 * - Shows a confirmation modal before submitting
 * - On success: logs out the user and navigates back to Login
 */
const PasswordHandle = ({ navigation, showToast }: Props): ReactElement => {
    // Inputs
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI state
    const [submitting, setSubmitting] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [sheetState, setSheetState] = useState<0 | 1 | 2>(2);

    // Validation rules (mirrors ResetPassowrd visual spec)
    const passHasMin = useMemo(() => newPassword.length >= 8, [newPassword]);
    const passHasLetterAndNumber = useMemo(() => LETTER_REGEX.test(newPassword) && DIGIT_REGEX.test(newPassword), [newPassword]);
    const passHasSpecial = useMemo(() => SPECIAL_CHAR_REGEX.test(newPassword), [newPassword]);
    const passMatches = useMemo(() => newPassword.length > 0 && newPassword === confirmPassword, [newPassword, confirmPassword]);

    const isFormValid = passHasMin && passHasLetterAndNumber && passHasSpecial && passMatches;

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleOpenConfirm = useCallback(() => {
        if (!isFormValid) return;
        setConfirmVisible(true);
    }, [isFormValid]);

    const handleSubmit = useCallback(async () => {
        try {
            setSubmitting(true);
            setConfirmVisible(false);

            // Note: Supabase does not require the current password when there is a valid session.
            const ok = await updatePassword(newPassword);
            if (!ok) {
                showToast({ message: 'Failed to update password. Try again.', type: 'danger' });
                return;
            }

            // Show success sheet; on close we will sign out and navigate to Login
            setSuccessVisible(true);
        }
        catch (e: any) {
            const message = e?.message ?? 'Unexpected error while changing password.';
            showToast({ message, type: 'danger' });
        } finally {
            setSubmitting(false);
        }
    }, [navigation, newPassword, showToast]);


    const leftComponent = (
        <BackButton onPress={() => navigation.navigate('SettingsMain')} variant="ghost" />
    );

    return (
        <Template
            state={{
                appBar: true,
                appHeader: { leftComponent, title: 'Password', variant: 'secondary' }
            }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.select({ ios: 'padding', android: undefined })}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{
                        flex: 1
                    }}>
                        {/* Current, New and Confirm inputs */}
                        <View style={{
                            gap: 20,
                            flex: 1
                        }}>
                            <PasswordInput
                                label="Current Password"
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="••••••••"
                            />
                            <View>
                                <PasswordInput
                                    label="New Password"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder="••••••••"
                                />
                                {/* Rules */}
                                <PasswordRules
                                    hasMinLength={passHasMin}
                                    hasLetterAndNumber={passHasLetterAndNumber}
                                    hasSpecialChar={passHasSpecial}
                                />
                            </View>
                            <PasswordInput
                                label="Confirm New Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="••••••••"
                                error={confirmPassword.length > 0 && !passMatches}
                            />
                        </View>

                        <Button
                            title="Save Changes"
                            onPress={handleOpenConfirm}
                            disabled={!isFormValid || submitting || currentPassword === newPassword}
                            style={styles.cta}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Confirmation bottom sheet */}
            <ConfirmBottomSheet
                visible={confirmVisible}
                onCancel={() => setConfirmVisible(false)}
                onConfirm={handleSubmit}
                loading={submitting}
            />

            {/* Success bottom sheet */}
            <NoteBottomSheet
                visible={successVisible}
                onClose={async () => {
                    setSuccessVisible(false);
                    try {
                        await signOut();
                    } finally {
                        navigation.navigate('Login');
                    }
                }}
                successTitle={'Password Updated'}
                successMessage={'Your password has been updated successfully. Please log in again.'}
                currentState={sheetState}
                setCurrentState={setSheetState}
                loading={submitting}
            />
        </Template>
    );
};

// Removed local Rule in favor of shared PasswordRules component

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: aliasTokens.color.background.Primary
    },
    scrollContent: {
        paddingHorizontal: aliasTokens.spacing.Medium,
        paddingTop: aliasTokens.spacing.Large,
        flex: 1
    },
    backButton: { alignSelf: 'flex-start' },
    title: {
        ...aliasTokens.typography.display.Small,
        color: aliasTokens.color.text.Primary,
        textAlign: 'center',
        marginVertical: aliasTokens.spacing.Large,
    },
    cta: {
        marginBottom: aliasTokens.spacing.Large
    },
});

export default memo(PasswordHandle);


