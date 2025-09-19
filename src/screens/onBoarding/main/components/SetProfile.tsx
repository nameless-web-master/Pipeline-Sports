import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

// Custom Components
import Input from '../../../../components/Input';
import Dropdown from '../../../../components/Dropdown';
import RoleBottomSheet from '../../../../components/RoleBottomSheet';
import DobBottomSheet from '../../../../components/DobBottomSheet';

// Theme Tokens
import { aliasTokens } from '../../../../theme/alias';
import { ROLE_OPTIONS } from '../../../../strings';

// Constants

// Format date as MM/DD/YYYY
const formatDate = (y?: number, m?: number, d?: number) => {
    if (!y || !m || !d) return '';
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${mm}/${dd}/${y}`;
};

interface SetProfileProps {
    /** Current first name value */
    firstName: string;
    /** Current last name value */
    lastName: string;
    /** Current role selection */
    role: string | undefined;
    /** Current date of birth year */
    dobYear: number | undefined;
    /** Current date of birth month */
    dobMonth: number | undefined;
    /** Current date of birth day */
    dobDay: number | undefined;
    /** Handler for first name changes */
    onFirstNameChange: (value: string) => void;
    /** Handler for last name changes */
    onLastNameChange: (value: string) => void;
    /** Handler for role changes */
    onRoleChange: (value: string) => void;
    /** Handler for date of birth changes */
    onDobChange: (year: number, month: number, day: number) => void;
    /** Notify parent whether this step is currently valid to proceed. */
    onValidityChange?: (isValid: boolean) => void;
}

const SetProfile: React.FC<SetProfileProps> = ({ 
    firstName,
    lastName,
    role,
    dobYear,
    dobMonth,
    dobDay,
    onFirstNameChange,
    onLastNameChange,
    onRoleChange,
    onDobChange,
    onValidityChange 
}) => {

    // Bottom sheet visibility
    const [isRoleSheetVisible, setRoleSheetVisible] = useState(false);
    const [isDobSheetVisible, setDobSheetVisible] = useState(false);

    // Memoized DOB text in MM/DD/YYYY format
    const selectedDobText = useMemo(() => {
        return formatDate(dobYear, dobMonth, dobDay);
    }, [dobYear, dobMonth, dobDay]);

    // Simple form validation
    const isFormValid = firstName.trim() && lastName.trim() && role && selectedDobText;

    // Inform parent about validity changes whenever form data changes
    React.useEffect(() => {
        onValidityChange?.(Boolean(isFormValid));
    }, [firstName, lastName, role, dobYear, dobMonth, dobDay, onValidityChange]);

    const dateNow = new Date();

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                {/* Form fields */}
                <View style={styles.form}>
                    {/* First Name */}
                    <Input
                        label="First Name"
                        value={firstName}
                        onChangeText={onFirstNameChange}
                        autoCapitalize="words"
                        returnKeyType="next"
                        placeholder=""
                    />

                    <View style={styles.spacing} />

                    {/* Last Name */}
                    <Input
                        label="Last Name"
                        value={lastName}
                        onChangeText={onLastNameChange}
                        autoCapitalize="words"
                        returnKeyType="done"
                        placeholder=""
                    />

                    <View style={styles.spacing} />

                    {/* Role Dropdown */}
                    <Dropdown
                        label="Select your role"
                        placeholder="Select"
                        value={role}
                        options={ROLE_OPTIONS}
                        onSelect={onRoleChange}
                        onOpenBottomSheet={() => setRoleSheetVisible(true)}
                    />

                    <View style={styles.spacing} />
 
                    {/* Date of Birth Field */}
                    <Text style={styles.label}>Date of birth</Text>
                    <TouchableOpacity
                        style={styles.dobField}
                        activeOpacity={0.8}
                        onPress={() => setDobSheetVisible(true)}
                    >
                        <Text style={[styles.dobText, !selectedDobText && styles.placeholderText]}>
                            {selectedDobText || '--/--/----'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Submit Button moved to parent; centralized CTA */}
            </View>

            {/* Role selection bottom sheet (reusable component) */}
            <RoleBottomSheet
                visible={isRoleSheetVisible}
                onSelect={(value: string) => {
                    onRoleChange(value);
                    setRoleSheetVisible(false);
                }}
                onClose={() => setRoleSheetVisible(false)}
            />

            {/* Date of Birth Bottom Sheet */}
            <DobBottomSheet
                visible={isDobSheetVisible}
                value={{
                    year: dobYear ?? dateNow.getFullYear(),
                    month: dobMonth ?? dateNow.getMonth() + 1,
                    day: dobDay ?? dateNow.getDate(),
                }}
                onClose={() => setDobSheetVisible(false)}
                onSave={(v) => {
                    onDobChange(v.year, v.month, v.day);
                    setDobSheetVisible(false);
                }}
            />
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: aliasTokens.color.background.Primary,
        paddingTop: aliasTokens.spacing.Large,
    },
    form: {
        gap: 0,
    },
    spacing: {
        height: aliasTokens.spacing.Medium,
    },
    label: {
        ...aliasTokens.typography.labelText.Default,
        color: aliasTokens.color.text.Primary,
        marginBottom: aliasTokens.spacing.XSmall,
    },
    dobField: {
        height: aliasTokens.sizes.Medium,
        backgroundColor: aliasTokens.input.FillEnabled,
        borderRadius: aliasTokens.borderRadius.Default,
        borderWidth: aliasTokens.borderWidth.Default,
        borderColor: aliasTokens.input.BorderEnabled,
        justifyContent: 'center',
        paddingHorizontal: aliasTokens.spacing.Small,
    },
    dobText: {
        ...aliasTokens.typography.inputText.Medium,
        color: aliasTokens.color.text.Primary,
    },
    placeholderText: {
        color: aliasTokens.input.PlaceHolder,
    },
});

export default SetProfile;
