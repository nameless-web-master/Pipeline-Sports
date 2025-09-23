import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Dropdown from './Dropdown';
import BottomSheet from './BottomSheet';
import { aliasTokens } from '../theme/alias';
import { US_STATES } from '../strings';
import { LoadingStates } from './Loading';
import { fetchLocalAreasByStateId, fetchStatesWithLocalAreas } from '../hooks/useProfile';

// Local DB models
type DBStateRow = { id: number; content: string };
type DBLocalAreaRow = { id: number; content: string; match: number };

// BottomSheet option model used by the Dropdown/BottomSheet components
type OptionItem = { label: string; value: string };

// Helper to get full state name by its 2-letter code
const getStateNameFromCode = (code: string): string => {
    const state = US_STATES.find(s => s.code === code);
    return state ? state.name : code;
};

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
    currentState?: string;
    currentArea?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    selectedState,
    selectedArea,
    onStateChange,
    onAreaChange,
    helper,
    currentState,
    currentArea
}) => {

    // Bottom sheet visibility
    const [showStatesSheet, setShowStatesSheet] = useState(false);
    const [showAreasSheet, setShowAreasSheet] = useState(false);

    // Loading flags
    const [loading, setLoading] = useState(true);
    const [loadingAreas, setLoadingAreas] = useState(false);

    // Raw DB rows
    const [dbStates, setDbStates] = useState<DBStateRow[]>([]);
    const [dbAreas, setDbAreas] = useState<DBLocalAreaRow[]>([]);

    // Internal selection by numeric IDs for filtering and joins
    const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

    // Fetch states (only those having at least one local_area) once
    const onGetLocations = useCallback(() => {
        let isMounted = true;
        const loadStates = async () => {
            setLoading(true);
            try {
                const result = await fetchStatesWithLocalAreas();
                if (!result.success) throw new Error(result.error || 'load states failed');

                if (isMounted) {
                    // Map to DBStateRow shape used locally
                    const rows: DBStateRow[] = (result.states || []).map(s => ({ id: s.id, content: s.code }));
                    console.log(rows);

                    setDbStates(rows);

                    if (selectedState) {
                        const existing = rows.find(s => s.content === selectedState);
                        setSelectedStateId(existing ? existing.id : null);
                    }
                }
            } catch (err) {
                console.log('Failed to load states with local areas', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadStates();
        return () => { isMounted = false; };
    }, [currentState]);

    // Re-sync selectedStateId when external selectedState changes
    useEffect(() => {
        if (!dbStates.length) return;
        const match = dbStates.find(s => s.content === selectedState);
        setSelectedStateId(match ? match.id : null);
    }, [selectedState, dbStates]);

    // Load areas whenever selectedStateId changes
    useEffect(() => {
        let isMounted = true;
        const loadAreas = async () => {
            if (!selectedStateId) { setDbAreas([]); return; }
            setLoadingAreas(true);
            try {
                const result = await fetchLocalAreasByStateId(selectedStateId);
                if (!result.success) throw new Error(result.error || 'load areas failed');
                if (isMounted) setDbAreas((result.areas || []) as DBLocalAreaRow[]);
            } catch (err) {
                console.log('Failed to load local areas', err);
                if (isMounted) setDbAreas([]);
            } finally {
                if (isMounted) setLoadingAreas(false);
            }
        };
        loadAreas();
        return () => { isMounted = false; };
    }, [selectedStateId]);

    // Compute bottom sheet options
    const stateOptions: OptionItem[] = useMemo(() =>
        dbStates.map(s => ({
            // label shows full state name, fallback to code
            label: getStateNameFromCode(s.content),
            // value is the state code to align with `selectedState`
            value: s.content,
        })), [dbStates]);

    const areaOptions: OptionItem[] = useMemo(() => {
        if (!selectedStateId) return [];
        const filtered = dbAreas.filter(a => a.match === selectedStateId);
        return filtered.map(a => ({ label: a.content, value: a.content }));
    }, [dbAreas, selectedStateId]);

    // Handlers for internal sheets
    const handleSelectState = (value: string) => {
        // Value is the state code; find the row and set internal id
        const row = dbStates.find(s => s.content === value);
        setSelectedStateId(row ? row.id : null);
        onStateChange?.(row ? row.content : '');

        // Reset area selection when state changes
        onAreaChange?.('');
        setShowStatesSheet(false);
        setShowAreasSheet(true);
    };

    const handleSelectArea = (value: string) => {
        const row = dbAreas.find(a => a.content === value);
        onAreaChange?.(row ? row.content : '');
        setShowAreasSheet(false);
    };

    return (
        <View>
            <View style={{ gap: aliasTokens.spacing.Medium }}>
                <Dropdown
                    label="State"
                    placeholder={currentState ? `${getStateNameFromCode(currentState)}` : "Select"}
                    value={selectedState}
                    options={stateOptions}
                    onSelect={() => { }}
                    onOpenBottomSheet={() => {
                        setShowStatesSheet(true);
                        onGetLocations();
                    }}
                />

                <Dropdown
                    label="Local Area"
                    placeholder={currentArea ? `${currentArea}` : "Select"}
                    value={selectedArea}
                    options={areaOptions}
                    onSelect={() => { }}
                    onOpenBottomSheet={() => selectedStateId && setShowAreasSheet(true)}
                />
            </View>

            {helper}

            {/* State chooser */}
            {(showStatesSheet && loading) ?
                <LoadingStates /> :
                <BottomSheet
                    visible={showStatesSheet}
                    title={undefined}
                    options={stateOptions}
                    onSelect={handleSelectState}
                    onClose={() => setShowStatesSheet(false)}
                    optionAlignment="left"
                />
            }
            {/* Area chooser; show loader inside sheet if needed */}
            {(showAreasSheet && loadingAreas) ?
                <LoadingStates /> :
                <BottomSheet
                    visible={showAreasSheet}
                    title={undefined}
                    options={areaOptions}
                    onSelect={handleSelectArea}
                    onClose={() => setShowAreasSheet(false)}
                    optionAlignment="left"
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({});

export default LocationSelector;


