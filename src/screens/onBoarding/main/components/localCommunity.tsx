import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { aliasTokens } from '../../../../theme/alias';
import LocationSelector from '../../../../components/LocationSelector';

// This screen now delegates dropdowns and bottom sheets to LocationSelector

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
    /** Handler for step */
    setStep: (step: number) => void;
    /** Notify parent whether this step is currently valid to proceed. */
    onValidityChange?: (isValid: boolean) => void;
}

const LocalCommunity: React.FC<LocalCommunityProps> = ({
    selectedState,
    selectedArea,
    onStateChange,
    onAreaChange,
    onValidityChange,
    setStep
}) => {

    // The parent still controls selectedState/selectedArea values


    // Notify parent about validity changes whenever selection changes
    React.useEffect(() => {
        const canContinue = Boolean(selectedState && selectedArea);
        console.log(canContinue);
        onValidityChange?.(canContinue);
    }, [selectedState, selectedArea, onValidityChange]);

    return (
        <View style={styles.container}>
            <LocationSelector
                selectedState={selectedState}
                selectedArea={selectedArea}
                onStateChange={onStateChange}
                onAreaChange={onAreaChange}
                helper={(
                    <Text style={styles.helperText}>
                        Select the local area closest to you. If your area isn’t
                        listed, <Text style={styles.link} onPress={() => setStep(5)}>Request location</Text>
                    </Text>
                )}
            />

            {/* Spacer to push content to the top */}
            <View style={{ flex: 1 }} />
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
