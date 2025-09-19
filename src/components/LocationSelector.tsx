import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Dropdown from './Dropdown';
import BottomSheet from './BottomSheet';
import { aliasTokens } from '../theme/alias';
import { LOCATION_STATES } from '../strings';

// Typed models for states and areas
interface LocalArea { label: string; value: string; }
interface USStateAreas { label: string; value: string; areas: LocalArea[]; }

// Convert constants to typed structure
const STATES: USStateAreas[] = LOCATION_STATES;

/**
 * Props for LocationSelector
 * Reusable selector with two dropdowns (State, Local Area) and bottom sheets
 */
interface LocationSelectorProps {
    selectedState?: string;
    selectedArea?: string;
    onStateChange?: (state: string) => void;
    onAreaChange?: (area: string) => void;
    helper?: React.ReactNode;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    selectedState,
    selectedArea,
    onStateChange,
    onAreaChange,
    helper
}) => {
    // Bottom sheet visibility
    const [showStatesSheet, setShowStatesSheet] = useState(false);
    const [showAreasSheet, setShowAreasSheet] = useState(false);

    // Memoized options
    const stateOptions = useMemo(() => STATES.map(s => ({ label: s.label, value: s.value })), []);
    const areaOptions = useMemo(() => {
        const state = STATES.find(s => s.value === selectedState);
        return (state?.areas ?? []).map(a => ({ label: a.label, value: a.value }));
    }, [selectedState]);

    // Handlers for internal sheets
    const handleSelectState = (value: string) => {
        onStateChange?.(value);
        setShowStatesSheet(false);
        setShowAreasSheet(true);
    };
    const handleSelectArea = (value: string) => {
        onAreaChange?.(value);
        setShowAreasSheet(false);
    };

    return (
        <View>
            <View style={{ gap: aliasTokens.spacing.Medium }}>
                <Dropdown
                    label="State"
                    placeholder="Select"
                    value={selectedState}
                    options={stateOptions}
                    onSelect={() => { }}
                    onOpenBottomSheet={() => setShowStatesSheet(true)}
                />

                <Dropdown
                    label="Local Area"
                    placeholder="Select"
                    value={selectedArea}
                    options={areaOptions}
                    onSelect={() => { }}
                    onOpenBottomSheet={() => selectedState && setShowAreasSheet(true)}
                />
            </View>

            {helper}

            {/* States */}
            <BottomSheet
                visible={showStatesSheet}
                title={undefined}
                options={stateOptions}
                onSelect={handleSelectState}
                onClose={() => setShowStatesSheet(false)}
                optionAlignment="left"
            />
            {/* Areas */}
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

const styles = StyleSheet.create({});

export default LocationSelector;


