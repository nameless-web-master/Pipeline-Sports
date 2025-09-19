import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import AppHeader from '../../../components/AppHeader';
import BackButton from '../../../components/BackButton';
import Input from '../../../components/Input';
import Dropdown from '../../../components/Dropdown';
import RoleBottomSheet from '../../../components/RoleBottomSheet';
import Button from '../../../components/Button';
import { aliasTokens } from '../../../theme/alias';
import type { RootStackParamList } from '../../../types/navigation';
import { Template } from '../../../components/layout/Template';
import { ROLE_OPTIONS } from '../../../strings';

/**
 * UserInformation
 * A presentational screen matching the provided mock:
 * - Dark header with back button and centered title
 * - First Name, Last Name inputs
 * - "Which are you?" dropdown using a bottom sheet
 * - Disabled Save button that enables when form becomes dirty
 */
const UserInformation: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Initial values (could be replaced by user profile values from context/api)
    const initial = useMemo(() => ({
        firstName: 'Daniel',
        lastName: 'Martinez',
        role: 'coach',
    }), []);

    // Local form state
    const [firstName, setFirstName] = useState(initial.firstName);
    const [lastName, setLastName] = useState(initial.lastName);
    const [role, setRole] = useState<string>(initial.role);
    const [isLoading, setIsLoading] = useState(false);

    // Bottom sheet control
    const [roleSheetOpen, setRoleSheetOpen] = useState(false);

    // Form dirty check to control Save button enablement
    const isDirty = firstName !== initial.firstName || lastName !== initial.lastName || role !== initial.role;
    const isEmpty = firstName === "" || lastName === "" || role === "";
    // Dropdown options (centralized list)
    const roleOptions = ROLE_OPTIONS;

    const onSave = () => {
        // Hook up to API later; for now just close or show toast upstream
        // navigation.goBack();
    };

    const leftComponent =
        <BackButton
            onPress={() => navigation.navigate('SettingsMain')}
            variant='ghost'
        />

    return (
        <Template state={{
            appBar: true,
            appHeader: {
                leftComponent: leftComponent,
                title: 'User Information',
                variant: 'secondary'
            }
        }}>
            {/* Body */}
            <KeyboardAvoidingView
                style={styles.body}
                behavior={Platform.select({ ios: 'padding', android: undefined })}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Input
                        label="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="Enter first name"
                        autoCapitalize="words"
                        returnKeyType="next"
                    />

                    <View style={styles.fieldSpacing} />

                    <Input
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Enter last name"
                        autoCapitalize="words"
                        returnKeyType="done"
                    />

                    <View style={styles.fieldSpacing} />

                    <Dropdown
                        label="Which are you?"
                        value={role}
                        options={roleOptions}
                        onSelect={(val) => setRole(val)}
                        onOpenBottomSheet={() => setRoleSheetOpen(true)}
                    />
                </ScrollView>

                {/* Footer button pinned to bottom, disabled until form changes */}
                <View style={styles.footer}>
                    <Button
                        title="Save Changes"
                        onPress={onSave}
                        disabled={!isDirty || isEmpty}
                        variant="primary"
                        style={styles.saveButton}
                    />
                </View>
            </KeyboardAvoidingView>

            {/* Role selection bottom sheet (reusable component) */}
            <RoleBottomSheet
                visible={roleSheetOpen}
                onSelect={(val) => setRole(val)}
                onClose={() => setRoleSheetOpen(false)}
            />
        </Template>
    );
};

export default UserInformation;

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({

    body: {
        flex: 1,
    },
    scroll: {
        flex: 1,
        backgroundColor: aliasTokens.color.background.Primary
    },
    scrollContent: {
        paddingHorizontal: aliasTokens.spacing.Medium,
        paddingTop: aliasTokens.spacing.Large,
    },
    fieldSpacing: {
        height: aliasTokens.spacing.Medium,
    },
    footer: {
        paddingHorizontal: aliasTokens.spacing.Medium,
        paddingVertical: aliasTokens.spacing.Medium,
        backgroundColor: aliasTokens.color.background.Primary
    },
    saveButton: {
        // Make sure the button matches the mock width and spacing
    },
});


