import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BaseBottomSheet from './common/BaseBottomSheet';
import Input from './Input';
import Button from './Button';
import { aliasTokens } from '../theme/alias';
import validateEmail from '../utils/validateEmail';
import type { ShowToast } from '../types/toast';

/**
 * Props for the EmailBottomSheet component
 */
interface EmailBottomSheetProps {
    /** Controls visibility of the bottom sheet */
    visible: boolean;
    /** Current email to prefill the input */
    currentEmail: string;
    /** Called when the user confirms a valid new email */
    onConfirm: (newEmail: string) => Promise<void> | void;
    /** Close handler (also used for backdrop and cancel) */
    onClose: () => void;
    /** Toast function to show feedback */
    showToast: ShowToast;
}

/**
 * A reusable bottom sheet for changing a user's email address.
 * - Validates input using `validateEmail`.
 * - Disables the primary action until a valid and different email is entered.
 * - Mirrors visual structure used by other bottom sheets in the app.
 */
const EmailBottomSheet: React.FC<EmailBottomSheetProps> = ({
    visible,
    currentEmail,
    onConfirm,
    onClose,
    showToast
}) => {
    const [email, setEmail] = useState(currentEmail ?? '');
    const [submitting, setSubmitting] = useState(false);

    // Keep local state in sync when sheet opens with a possibly new currentEmail
    useEffect(() => {
        if (visible) {
            setEmail(currentEmail ?? '');
        }
    }, [visible, currentEmail]);

    // Button enablement: must be a valid email and different from the current email
    const canSubmit = useMemo(() => {
        if (submitting) return false;
        const trimmed = email.trim();
        return validateEmail(trimmed) && trimmed.toLowerCase() !== (currentEmail ?? '').trim().toLowerCase();
    }, [email, currentEmail, submitting]);

    /**
     * Attempt to submit the new email. Leaves actual persistence up to parent.
     */
    const handleSubmit = async () => {
        const nextEmail = email.trim();
        if (!validateEmail(nextEmail)) {
            showToast({ message: 'Please enter a valid email address.', type: 'danger' });
            return;
        }
        if (nextEmail.toLowerCase() === (currentEmail ?? '').trim().toLowerCase()) {
            showToast({ message: 'Please change the email before submitting.', type: 'danger' });
            return;
        }
        try {
            setSubmitting(true);
            await onConfirm(nextEmail);
        } catch (err: any) {
            showToast({ message: err?.message || 'Failed to update email.', type: 'danger' });
            return;
        } finally {
            setSubmitting(false);
        }
        onClose();
    };

    return (
        <BaseBottomSheet
            visible={visible}
            onClose={onClose}
            title="Change Email"
            showCloseButton={false}
        >
            <View>
                <Input
                    label="New Email"
                    placeholder="name@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                />

                <Text style={styles.helperText}>
                    We’ll send a verification link to your new email. If it’s not verified within 24 hours, your email will revert to the previous one.
                </Text>

                <View style={styles.actions}>
                    <Button
                        title="Cancel"
                        variant="outline"
                        onPress={onClose}
                        style={styles.actionBtn}
                    />
                    <Button
                        title={submitting ? 'Sending…' : 'Change Email'}
                        variant="primary"
                        onPress={handleSubmit}
                        disabled={!canSubmit}
                        style={[styles.actionBtn, !canSubmit && styles.disabledBtn]}
                    />
                </View>
            </View>
        </BaseBottomSheet>
    );
};

const styles = StyleSheet.create({
    helperText: {
        ...aliasTokens.typography.body.XSmall,
        color: aliasTokens.color.text.Primary,
        marginTop: aliasTokens.spacing.XSmall,
    },
    actions: {
        flexDirection: 'row',
        gap: aliasTokens.spacing.Small,
        marginTop: aliasTokens.spacing.XLarge,
    },
    actionBtn: {
        flex: 1,
        height: 46,
    },
    disabledBtn: {
        opacity: 0.5,
    },
});

export default EmailBottomSheet;


