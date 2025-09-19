import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Template } from '../../../components/layout/Template';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';
import LocationSelector from '../../../components/LocationSelector';
import LocationRequestFlow from '../../../components/LocationRequestFlow';
import { aliasTokens } from '../../../theme/alias';
import type { RootStackParamList } from '../../../types/navigation';
import type { ShowToast } from '../../../types/toast';

/**
 * Settings Location screen
 * Matches the onboarding Location UI using shared components and bottom sheets.
 */
interface LocationSettingProps {
    showToast: ShowToast;
}

const LocationSetting: React.FC<LocationSettingProps> = ({ showToast }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Pre-populated example values to mirror the mock
    const initial = useMemo(() => ({ state: 'LA', area: 'new_orleans' }), []);
    const [stateVal, setStateVal] = useState<string | undefined>(initial.state);
    const [areaVal, setAreaVal] = useState<string | undefined>(initial.area);

    // Control for the request flow
    const [showRequest, setShowRequest] = useState(false);

    const isValid = Boolean(stateVal && areaVal) && (areaVal !== initial.area);

    const leftComponent = (
        <BackButton onPress={() => navigation.navigate('SettingsMain')} variant="ghost" />
    );

    return (
        <Template
            state={{
                appBar: true,
                appHeader: { leftComponent, title: 'Location', variant: 'secondary' }
            }}>
            <KeyboardAvoidingView
                style={styles.body}
                behavior={Platform.select({ ios: 'padding', android: undefined })}
            >
                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                    <LocationSelector
                        selectedState={stateVal}
                        selectedArea={areaVal}
                        onStateChange={setStateVal}
                        onAreaChange={setAreaVal}
                        helper={(
                            <Text style={styles.helperText}>
                                Select the local area closest to you. If your area isn’t listed,{' '}
                                <Text style={styles.link} onPress={() => setShowRequest(true)}>Request location</Text>
                            </Text>
                        )}
                    />

                </ScrollView>

                {/* Footer save button mirrors the mock */}
                <View style={styles.footer}>
                    <Button
                        title="Save Changes"
                        onPress={() => showToast({ message: 'Location updated', type: 'success' })}
                        disabled={!isValid}
                        variant="primary"
                    />
                </View>
            </KeyboardAvoidingView>

            {/* Request Location flow using shared bottom sheets */}
            {showRequest && (
                <LocationRequestFlow
                    stepAfterClose={() => setShowRequest(false)}
                    showToast={showToast}
                    handleCompleteOnboarding={async () => setShowRequest(false)}
                />
            )}
        </Template>
    );
};

export default LocationSetting;

const styles = StyleSheet.create({
    body: {
        flex: 1
    },
    scroll: {
        flex: 1, backgroundColor: aliasTokens.color.background.Primary
    },
    scrollContent: {
        paddingHorizontal: aliasTokens.spacing.Medium,
        paddingTop: aliasTokens.spacing.Large
    },
    helperText: {
        ...aliasTokens.typography.labelText.Small,
        color: aliasTokens.color.text.Primary, marginTop: aliasTokens.spacing.XSmall
    },
    link: {
        color: aliasTokens.color.brand.Primary,
        textDecorationLine: 'underline'
    },
    footer: {
        paddingHorizontal: aliasTokens.spacing.Medium,
        paddingVertical: aliasTokens.spacing.Medium,
        backgroundColor: aliasTokens.color.background.Primary
    }
});


