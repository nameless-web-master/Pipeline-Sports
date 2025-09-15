import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { aliasTokens } from '../theme/alias';
import Button from './Button';
import Input from './Input';
import Dropdown from './Dropdown';
import BottomSheet from './BottomSheet';
import BaseBottomSheet from './common/BaseBottomSheet';
import { US_STATES } from '../strings';
import { StateOption, DatabaseState } from '../types/props';
import { fetchStatesFromDB, saveLocationToDB } from '../hooks/useProfile';
import { LocationType } from '../types/props';
import { getCurrentSession } from '../hooks/useSession';
import type { ShowToast } from '../types/toast';

/**
 * Props for the StateBottomSheet component
 */
interface StateBottomSheetProps {
    /** Controls visibility of the bottom sheet */
    visible: boolean;
    /** Callback when location is saved */
    onSave: (location: LocationType) => void;
    /** Callback when the bottom sheet is closed */
    onClose: () => void;
    /** Initial location data */
    initialLocation?: LocationType;
    /** Title displayed at the top of the sheet */
    title?: string;
    /** Custom styles for the container */
    style?: any;
    /** Current bottom sheet state (0: form, 1: state selection, 2: success) */
    currentState: 0 | 1 | 2;
    /** Callback when state is changed */
    setCurrentState: (state: 0 | 1 | 2) => void;
    /** Toast function for showing notifications */
    showToast: ShowToast;
}


/**
 * Location request bottom sheet component
 * Allows users to select state and enter city information
 * 
 * Interaction Flow:
 * - Shows form with state dropdown and city input
 * - When state dropdown is tapped, opens state selection bottom sheet
 * - User can save location request when both fields are filled
 */
const StateBottomSheet: React.FC<StateBottomSheetProps> = ({
    visible,
    onSave,
    onClose,
    initialLocation = { state: '', city: '', id: 0 },
    title = 'Request Location',
    style,
    currentState,
    setCurrentState,
    showToast
}) => {
    // State management for database states
    const [states, setStates] = useState<DatabaseState[]>([]);
    const [loading, setLoading] = useState(true); // Start with loading true
    const [error, setError] = useState<string | null>(null);
    const [initialLoad, setInitialLoad] = useState(true);

    // Loading state for save operation
    const [saving, setSaving] = useState(false);

    // Helper function to map database states to static state names
    const mapDatabaseStatesToStatic = (dbStates: DatabaseState[]): DatabaseState[] => {
        return dbStates.map(dbState => {
            const staticState = US_STATES.find(staticState => staticState.code === dbState.code);
            if (staticState) {
                console.log(`Mapped ${dbState.code} -> ${staticState.name}`);
                return {
                    id: dbState.id,
                    code: dbState.code,
                    name: staticState.name // Always use static name when available
                };
            } else {
                let toastContent = `No static state found for code: ${dbState.code}, using database name: ${dbState.name || 'Unknown'}`;
                console.log(toastContent);
                showToast({
                    message: toastContent,
                    type: 'danger'
                })
                return {
                    id: dbState.id,
                    code: dbState.code,
                    name: dbState.name || `State ${dbState.code}` // Fallback to database name or formatted code
                };
            }
        });
    };

    // Fetch states from database when component mounts
    useEffect(() => {
        const loadStates = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await fetchStatesFromDB();

                if (result.success && result.states) {
                    // Map database codes to static state names
                    const mappedStates = mapDatabaseStatesToStatic(result.states);
                    setStates(mappedStates);
                    console.log('Final mapped states:', mappedStates);
                    showToast({
                        message: 'New Location request is Success!',
                        type: 'success'
                    });
                } else {
                    // Fallback to static states if database fetch fails
                    console.warn('Failed to fetch states from database, using static fallback:', result.error);
                    showToast({
                        message: `Failed to fetch states from database, using static fallback: ${result.error}`,
                        type: 'danger'
                    });
                    setStates(US_STATES.map(state => ({
                        id: 0, // Static states don't have database IDs
                        code: state.code,
                        name: state.name
                    })));
                    setError('Using offline state list');
                }
            } catch (err) {
                showToast({
                    message: `Error loading states: ${err}`,
                    type: 'danger'
                });
                // Fallback to static states
                setStates(US_STATES.map(state => ({
                    id: 0,
                    code: state.code,
                    name: state.name
                })));
                setError('Using offline state list');
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        loadStates();
    }, []);

    // Reset location when opening
    React.useEffect(() => {
        if (visible) {
            onSave(initialLocation);
        }
    }, [visible, initialLocation]);

    // Handle state selection from the state selection bottom sheet
    const handleStateSelect = (stateName: string) => {
        const selectedState = states.find(state => state.name === stateName);

        if (selectedState) {
            onSave({ ...initialLocation, state: selectedState.name, id: selectedState.id });
        }
        // Return to form view
        setCurrentState(0);
    };

    // Handle city input change
    const handleCityChange = (city: string) => {
        onSave({ ...initialLocation, city });
    };

    /**
     * Handle save location request to database
     * Validates data, gets user session, and saves location request
     */
    const handleSave = async () => {
        // Validate required fields
        if (!initialLocation.state.trim() || !initialLocation.city.trim() || initialLocation.id === 0) {
            showToast({
                message: 'Please select a state and enter a city name',
                type: 'danger',
                duration: 2000
            });
            return;
        }

        setSaving(true);

        try {
            // Get current user session
            const session = await getCurrentSession();
            if (!session.session?.user?.id) {
                showToast({
                    message: 'User session not found. Please log in again.',
                    type: 'danger',
                    duration: 3000
                });
                return;
            }

            const userId = session.session.user.id;

            // Save location request to database
            const result = await saveLocationToDB({
                city: initialLocation.city,
                stateId: initialLocation.id,
                userId: userId
            });

            console.log(result);


            if (result.success) {
                // Show success toast
                // showToast({
                //     message: result.message,
                //     type: 'success',
                //     duration: 2000,
                //     afterToast: () => {
                //         // Close the bottom sheet after successful save
                //         onClose();
                //         setCurrentState(0); // Reset to initial state
                //     }
                // });
                setCurrentState(2);
            } else {
                // Show error toast
                showToast({
                    message: result.message,
                    type: 'danger',
                    duration: 3000
                });
            }

        } catch (error) {
            console.log('Save location request error:', error);
            showToast({
                message: 'An unexpected error occurred. Please try again.',
                type: 'danger',
                duration: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    // Check if save button should be enabled (disabled when saving)
    const canSave = initialLocation.state.trim() && initialLocation.city.trim().length > 0 && !saving;

    // Prepare state options for the bottom sheet
    const stateOptions = states.map(state => ({
        label: state.name,
        value: state.name
    }));

    // Loading component for states
    const LoadingStatesComponent = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={aliasTokens.color.brand.Primary} />
            <Text style={styles.loadingText}>Loading states...</Text>
        </View>
    );

    return (
        <>
            {/* Main Form Bottom Sheet */}
            <BaseBottomSheet
                visible={visible && currentState === 0}
                onClose={onClose}
                title={title}
                style={style}
                showCloseButton={false}
            >
                {/* Form Content */}
                <View style={styles.formContainer}>
                    {/* Loading States Component */}
                    {initialLoad && loading ? (
                        <LoadingStatesComponent />
                    ) : (
                        <>
                            {/* State Dropdown */}
                            <Dropdown
                                label="State"
                                placeholder="Select state"
                                value={initialLocation.state}
                                options={stateOptions}
                                onSelect={() => { }}
                                onOpenBottomSheet={() => setCurrentState(1)}
                                style={styles.inputField}
                            />

                            {/* Error message for fallback */}
                            {error && (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            )}

                            {/* City Input */}
                            <Input
                                label="City"
                                placeholder="Enter city name"
                                value={initialLocation.city}
                                onChangeText={handleCityChange}
                            />
                        </>
                    )}
                </View>

                {/* Action Buttons */}
                {!initialLoad && (
                    <View style={styles.actionButtons}>
                        <Button
                            title="Cancel"
                            variant="outline"
                            onPress={onClose}
                            style={styles.cancelButton}
                        />
                        <Button
                            title={saving ? "Saving..." : "Save Request"}
                            variant="primary"
                            onPress={handleSave}
                            disabled={!canSave}
                            style={[
                                styles.saveButton,
                                !canSave && styles.saveButtonDisabled,
                            ]}
                        />
                    </View>
                )}
            </BaseBottomSheet>

            {/* State Selection Bottom Sheet */}
            <BottomSheet
                visible={currentState === 1 && !initialLoad}
                options={stateOptions}
                onSelect={handleStateSelect}
                onClose={() => setCurrentState(0)}
                optionAlignment="left"
            />
        </>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        marginBottom: aliasTokens.spacing.XLarge,
    },
    inputField: {
        marginBottom: aliasTokens.spacing.Medium,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: aliasTokens.spacing.Large,
        paddingHorizontal: aliasTokens.spacing.Medium,
    },
    loadingText: {
        marginLeft: aliasTokens.spacing.Small,
        fontSize: 14,
        color: aliasTokens.color.text.Secondary,
    },
    errorContainer: {
        marginTop: aliasTokens.spacing.Small,
        marginBottom: aliasTokens.spacing.Medium,
    },
    errorText: {
        fontSize: 12,
        color: '#FF6B6B',
        fontStyle: 'italic',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: aliasTokens.spacing.Small,
    },
    cancelButton: {
        flex: 1,
        height: 46
    },
    saveButton: {
        flex: 1,
        height: 46
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
});

export default StateBottomSheet;
