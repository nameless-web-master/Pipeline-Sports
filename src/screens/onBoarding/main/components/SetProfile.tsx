import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

// Custom Components
import Input from '../../../../components/Input';
import Dropdown from '../../../../components/Dropdown';
import BottomSheet from '../../../../components/BottomSheet';
import Button from '../../../../components/Button';
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

const SetProfile: React.FC = () => {
    // Basic input states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<string | undefined>(undefined);

    // Date of birth states
    const [dobYear, setDobYear] = useState<number | undefined>(undefined);
    const [dobMonth, setDobMonth] = useState<number | undefined>(undefined); // 1 to 12
    const [dobDay, setDobDay] = useState<number | undefined>(undefined);

    // Bottom sheet visibility
    const [isRoleSheetVisible, setRoleSheetVisible] = useState(false);
    const [isDobSheetVisible, setDobSheetVisible] = useState(false);

    // Memoized DOB text in MM/DD/YYYY format
    const selectedDobText = useMemo(() => {
        return formatDate(dobYear, dobMonth, dobDay);
    }, [dobYear, dobMonth, dobDay]);

    // Simple form validation
    const isFormValid = firstName.trim() && lastName.trim() && role && selectedDobText;

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
                        onChangeText={setFirstName}
                        autoCapitalize="words"
                        returnKeyType="next"
                        placeholder=""
                    />

                    <View style={styles.spacing} />

                    {/* Last Name */}
                    <Input
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
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
                        onSelect={setRole}
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

                {/* Submit Button */}
                <Button
                    title="Continue"
                    onPress={() => {
                        // TODO: Submit logic here
                    }}
                    disabled={!isFormValid}
                />
            </View>

            {/* Role Bottom Sheet */}
            <BottomSheet
                visible={isRoleSheetVisible}
                title=""
                options={ROLE_OPTIONS}
                onSelect={(value: string) => setRole(value)}
                onClose={() => setRoleSheetVisible(false)}
                optionAlignment="left"
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
                    setDobYear(v.year);
                    setDobMonth(v.month);
                    setDobDay(v.day);
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
        paddingHorizontal: aliasTokens.spacing.Medium,
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
