import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Check, Edit3, X } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';
import Button from './Button';
import BaseBottomSheet from './common/BaseBottomSheet';
import CircleIcon from './CircleIcon';
import { OnboardingData } from '../types/props';

/**
 * Props for the NoteBottomSheet component
 */
interface NoteBottomSheetProps {
    /** Controls visibility of the bottom sheet */
    visible: boolean;
    /** Callback when the note is saved */
    onSave?: (note: string) => void;
    /** Callback when the bottom sheet is closed */
    onClose: () => void;
    /** Callback when the note is deleted (optional) */
    onDelete?: () => void;
    /** Initial note content */
    initialNote?: string;
    /** Title displayed at the top of the sheet */
    title?: string;
    /** Placeholder text for the note input */
    placeholder?: string;
    /** Maximum character limit for the note */
    maxLength?: number;
    /** Whether to show character count */
    showCharacterCount?: boolean;
    /** Whether the note can be edited */
    editable?: boolean;
    /** Custom styles for the container */
    style?: any;
    /** Success message to display */
    successMessage?: string;
    /** Success title text (defaults to a generic message) */
    successTitle?: string;
    /** Current bottom sheet state (0: form, 1: state selection, 2: success) */
    currentState?: 0 | 1 | 2;
    /** Callback when state is changed */
    setCurrentState?: (state: 0 | 1 | 2) => void;
    /** Onboarding data to be logged */
    onboardingData?: OnboardingData;
    /** Whether the close button should show loading state */
    loading?: boolean;
}

/**
 * Note input bottom sheet component with rich text editing capabilities
 * Can also display success notifications and log onboarding data
 * 
 * Features:
 * - Success state display with customizable message
 * - Onboarding data logging when sheet becomes visible
 * - Clean, accessible UI with proper styling
 */
const NoteBottomSheet: React.FC<NoteBottomSheetProps> = ({
    visible,
    onSave,
    onClose,
    onDelete,
    initialNote = '',
    title = 'Add Note',
    placeholder = 'Write your note here...',
    maxLength = 500,
    showCharacterCount = true,
    editable = true,
    style,
    successMessage = "We're currently focused on operating in Louisiana, but into other states, we'll be sure to keep you updated.",
    successTitle = 'Success',
    setCurrentState,
    currentState,
    onboardingData,
    loading = false
}) => {
    const [note, setNote] = useState(initialNote);
    const [isEditing, setIsEditing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Reset state when opening and log onboarding data
    React.useEffect(() => {
        if (visible) {
            // Reset component state
            setNote(initialNote);
            setIsEditing(false);
            setHasChanges(false);

        }
    }, [visible, initialNote, onboardingData]);

    // Track changes to determine if save button should be enabled
    React.useEffect(() => {
        setHasChanges(note !== initialNote && note.trim().length > 0);
    }, [note, initialNote]);

    // Handle note text change
    const handleNoteChange = (text: string) => {
        if (text.length <= maxLength) {
            setNote(text);
        }
    };

    // Handle save action
    const handleSave = () => {
        if (note.trim().length > 0 && onSave) {
            onSave(note.trim());
            onClose();
        }
    };

    // Handle delete action
    const handleDelete = () => {
        if (onDelete) {
            onDelete();
            onClose();
        }
    };

    // Toggle edit mode
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // Clear note content
    const clearNote = () => {
        setNote('');
    };

    // Get character count color based on limit
    const getCharacterCountColor = () => {
        const remaining = maxLength - note.length;
        if (remaining < 50) return aliasTokens.color.text.Error;
        if (remaining < 100) return aliasTokens.color.text.Secondary;
        return aliasTokens.color.text.Tertiary;
    };

    return (
        <BaseBottomSheet
            visible={visible}
            onClose={onClose}
            style={style}
            showCloseButton={false}
        >
            {/* <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            > */}

            {/* Success State - Displays when onboarding location request is completed */}
            <View style={styles.successContainer}>
                {/* Success Icon */}
                <CircleIcon
                    type="icon"
                    iconLibrary="FontAwesome5"
                    iconName="check-circle"
                    iconColor={aliasTokens.color.semantic.success.Special}
                    backgroundColor={aliasTokens.color.semantic.success.Light}
                    containerStyle={{ marginBottom: aliasTokens.spacing.Medium }}
                />

                {/* Success Title */}
            <Text style={styles.successTitle}>{successTitle}</Text>

                {/* Success Message */}
                <Text style={styles.successMessage}>{successMessage}</Text>

                {/* Close Button */}
                <Button
                    title={loading ? "Closing..." : "Close"}
                    variant="outline"
                    onPress={onClose}
                    style={styles.closeSuccessButton}
                    disabled={loading}
                />
            </View>

            {/* </KeyboardAvoidingView> */}
        </BaseBottomSheet>
    );
};

const styles = StyleSheet.create({
    // Success state styles
    successContainer: {
        alignItems: 'center',
        paddingTop: aliasTokens.spacing.Large
    },
    successTitle: {
        ...aliasTokens.typography.labelText.Medium,
        color: aliasTokens.color.text.Primary,
        textAlign: 'center',
        marginBottom: aliasTokens.spacing.XSmall,
        fontSize: 16
    },
    successMessage: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
        textAlign: 'center',
        marginBottom: aliasTokens.spacing.XLarge,
    },
    closeSuccessButton: {
        width: '100%',
        height: 46
    },
});

export default NoteBottomSheet;
