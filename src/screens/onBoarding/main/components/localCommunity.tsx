import React, { useMemo, useState } from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import Dropdown from '../../../../components/Dropdown';
import BottomSheet from '../../../../components/BottomSheet';
import { aliasTokens } from '../../../../theme/alias';
import { LOCATION_STATES } from '../../../../strings';

// Domain model for a State with its Local Areas
interface LocalArea {
    label: string;
    value: string;
}
interface USStateAreas {
    label: string; // State display label
    value: string; // State unique value
    areas: LocalArea[]; // Local areas for that state
}

// Adapter converting string constants to typed structure used locally
const STATES: USStateAreas[] = LOCATION_STATES;

/**
 * Local Community selection screen
 *
 * Interaction
 * - Tap State dropdown -> bottom sheet with states
 * - After picking a state, automatically open Local Area bottom sheet
 * - Tap Local Area dropdown -> bottom sheet with areas for the selected state
 * - Continue button is enabled only when both are selected
 */
interface LocalCommunityProps {
    /** Currently selected state */
    selectedState: string | undefined;
    /** Currently selected area */
    selectedArea: string | undefined;
    /** Handler for state selection changes */
    onStateChange: (state: string) => void;
    /** Handler for area selection changes */
    onAreaChange: (area: string) => void;
    /** Notify parent whether this step is currently valid to proceed. */
    onValidityChange?: (isValid: boolean) => void;
}

const LocalCommunity: React.FC<LocalCommunityProps> = ({ 
    selectedState,
    selectedArea,
    onStateChange,
    onAreaChange,
    onValidityChange 
}) => {

    // Bottom sheet visibility states
    const [showStatesSheet, setShowStatesSheet] = useState(false);
    const [showAreasSheet, setShowAreasSheet] = useState(false);

    // Derived lists for the two dropdowns
    const stateOptions = useMemo(
        () => STATES.map((s) => ({ label: s.label, value: s.value })),
        []
    );
    const areaOptions = useMemo(() => {
        const state = STATES.find((s) => s.value === selectedState);
        return (state?.areas ?? []).map((a) => ({ label: a.label, value: a.value }));
    }, [selectedState]);

    // Handlers
    const handleSelectState = (value: string) => {
        onStateChange(value);
        // Close states sheet and open areas sheet to match the UX in screenshots
        setShowStatesSheet(false);
        setShowAreasSheet(true);
    };

    const handleSelectArea = (value: string) => {
        onAreaChange(value);
        setShowAreasSheet(false);
    };

    // Notify parent about validity changes whenever selection changes
    React.useEffect(() => {
        const canContinue = Boolean(selectedState && selectedArea);
        onValidityChange?.(canContinue);
    }, [selectedState, selectedArea, onValidityChange]);

    return (
        <View style={styles.container}>
            {/* State dropdown - opens the states bottom sheet */}
            <View style={{
                gap: aliasTokens.spacing.Medium
            }}>
                <Dropdown
                    label="State"
                    placeholder="Select"
                    value={selectedState}
                    options={stateOptions}
                    onSelect={() => { }}
                    onOpenBottomSheet={() => setShowStatesSheet(true)}
                />

                {/* Local Area dropdown - opens areas sheet (disabled until a state is chosen) */}
                <Dropdown
                    label="Local Area"
                    placeholder="Select"
                    value={selectedArea}
                    options={areaOptions}
                    onSelect={() => { }}
                    onOpenBottomSheet={() => selectedState && setShowAreasSheet(true)}
                />
            </View>

            {/* Helper copy with Request link */}
            <Text style={styles.helperText}>
                Select the local area closest to you. If your area isn’t
                listed, <Text style={styles.link} onPress={() => Linking.openURL('https://forms.gle/')}>Request location</Text>
            </Text>

            {/* Spacer to push content to the top */}
            <View style={{ flex: 1 }} />

            {/* BottomSheet for States */}
            <BottomSheet
                visible={showStatesSheet}
                title={undefined}
                options={stateOptions}
                onSelect={handleSelectState}
                onClose={() => setShowStatesSheet(false)}
                optionAlignment="left"
            />

            {/* BottomSheet for Local Areas (depends on selected state) */}
            <BottomSheet
                visible={showAreasSheet}
                title={undefined}
                options={areaOptions}
                onSelect={handleSelectArea}
                onClose={() => setShowAreasSheet(false)}
                optionAlignment="left"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: aliasTokens.spacing.Large,
    },
    helperText: {
        ...aliasTokens.typography.labelText.Small,
        color: aliasTokens.color.text.Primary,
        marginTop: aliasTokens.spacing.XSmall
    },
    link: {
        color: aliasTokens.color.brand.Primary,
        textDecorationLine: 'underline',
    },
    continueBtnDisabled: {
        backgroundColor: aliasTokens.button.primary.fillDisabled,
    },
});

export default LocalCommunity;
