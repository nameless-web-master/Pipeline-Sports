import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseBottomSheet from './common/BaseBottomSheet';
import CircleIcon from './CircleIcon';
import Button from './Button';
import { aliasTokens } from '../theme/alias';

interface ConfirmBottomSheetProps {
    /** Controls visibility of the bottom sheet */
    visible: boolean;
    /** Called when user cancels */
    onCancel: () => void;
    /** Called when user confirms the action */
    onConfirm: () => void;
    /** Optional loading state for confirm action */
    loading?: boolean;
    /** Optional title above the message */
    title?: string;
    /** Message shown in the sheet */
    message?: string;
}

/**
 * A simple confirmation bottom sheet with a warning icon and two actions.
 * Designed to match the confirmation pattern in settings flows (e.g., change password).
 */
const ConfirmBottomSheet: React.FC<ConfirmBottomSheetProps> = ({
    visible,
    onCancel,
    onConfirm,
    loading = false,
    title = "",
    message = "After you update your password, you'll be automatically logged out. Log back in to verify that your password was changed.",
}) => {
    return (
        <BaseBottomSheet visible={visible} onClose={onCancel} showCloseButton={false}>
            <View style={styles.container}>
                <CircleIcon
                    type="icon"
                    iconLibrary="Feather"
                    iconName="alert-triangle"
                    iconColor={aliasTokens.color.semantic.danger.Default}
                    backgroundColor={aliasTokens.color.semantic.danger.Light}
                    containerStyle={{ marginBottom: aliasTokens.spacing.Medium }}
                />
                {
                    title !== "" && <Text style={styles.title}>{title}</Text>
                }
                <Text style={styles.message}>{message}</Text>

                <View style={styles.actions}>
                    <Button
                        title="Cancel"
                        variant="outline"
                        onPress={onCancel}
                        style={{ flex: 1 }}
                        disabled={loading}
                    />
                    <Button
                        title={loading ? 'Changing…' : 'Change Password'}
                        onPress={onConfirm}
                        style={{ flex: 1 }}
                        disabled={loading}
                    />
                </View>
            </View>
        </BaseBottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: aliasTokens.spacing.Large,
    },
    title: {
        ...aliasTokens.typography.labelText.Medium,
        color: aliasTokens.color.text.Primary,
        marginBottom: aliasTokens.spacing.XSmall,
        fontSize: 16,
    },
    message: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
        textAlign: 'center',
        marginBottom: aliasTokens.spacing.XLarge,
    },
    actions: { 
        flexDirection: 'row',
        gap: aliasTokens.spacing.XSmall,
        width: '100%',
    },
});

export default ConfirmBottomSheet;


