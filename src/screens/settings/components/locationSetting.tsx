import React, { useContext, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';

import { Template } from '../../../components/layout/Template';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';
import LocationSelector from '../../../components/LocationSelector';
import LocationRequestFlow from '../../../components/LocationRequestFlow';
import { aliasTokens } from '../../../theme/alias';
import type { RootStackParamList } from '../../../types/navigation';
import type { ShowToast } from '../../../types/toast';
import { AuthContext } from '../../../context/AuthContext';
import { updateUserProfile, getStateById, getLocalAreaById, getLocation, saveLocationToDB } from '../../../hooks/useProfile';

/**
 * Settings Location screen
 * Matches the onboarding Location UI using shared components and bottom sheets.
 */
interface LocationSettingProps extends StackScreenProps<RootStackParamList, 'LocationSetting'> {
    showToast: ShowToast;
}

const LocationSetting: React.FC<LocationSettingProps> = ({ showToast, navigation }) => {
    const { profile, setState } = useContext(AuthContext);

    // Current location data from database (used as preview/placeholder)
    const [currentStateName, setCurrentStateName] = useState<string>('');
    const [currentAreaName, setCurrentAreaName] = useState<string>('');
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Form state for new selections
    const [selectedState, setSelectedState] = useState<string | undefined>('');
    const [selectedArea, setSelectedArea] = useState<string | undefined>('');
    const [isLoading, setIsLoading] = useState(false);

    // Control for the location request flow
    const [showRequest, setShowRequest] = useState(false);

    /**
     * Fetch current location data from database to display as preview/placeholder
     * This shows the user's current saved location before they make changes
     */
    const fetchCurrentLocationData = async () => {
        if (!profile?.state || !profile?.local_area) {
            setIsLoadingData(false);
            return;
        }

        try {
            setIsLoadingData(true);

            // Fetch current state name from database
            const stateResult = await getStateById(Number(profile.state));
            if (stateResult.success && stateResult.state) {
                setCurrentStateName(stateResult.state.code);
                // Initialize form with current values as default
                setSelectedState(stateResult.state.code);
            }

            // Fetch current area name from database
            const areaResult = await getLocalAreaById(Number(profile.local_area));
            if (areaResult.success && areaResult.area) {
                setCurrentAreaName(areaResult.area.content);
                // Initialize form with current values as default
                setSelectedArea(areaResult.area.content);
            }
        } catch (error) {
            console.log('Error fetching current location data:', error);
            showToast({ message: 'Failed to load current location data', type: 'danger' });
        } finally {
            setIsLoadingData(false);
        }
    };

    // Fetch location data when component mounts or profile changes
    useEffect(() => {
        fetchCurrentLocationData();
    }, [profile?.state, profile?.local_area, showToast]);

    /**
     * Check if form has been modified from the current database values
     * Form is considered dirty if user has made changes from their saved location
     */
    const isDirty = selectedState !== currentStateName || selectedArea !== currentAreaName;
    const isValid = Boolean(selectedState && selectedArea) && isDirty;

    /**
     * Save the new location selection to the database
     * Converts area name to location IDs and updates user profile
     */
    const onSave = async () => {
        if (!profile?.id) {
            showToast({ message: 'User profile not found', type: 'danger' });
            return;
        }

        if (!selectedArea) {
            showToast({ message: 'Please select an area', type: 'danger' });
            return;
        }

        setIsLoading(true);
        try {
            // Get location IDs from selected area name using existing getLocation function
            const locationResult = await getLocation(selectedArea);

            if (!locationResult || locationResult instanceof Error || typeof locationResult !== 'object' || !('state' in locationResult) || !('area' in locationResult)) {
                showToast({ message: 'Invalid location selected. Please try again.', type: 'danger' });
                setIsLoading(false);
                return;
            }

            // Update user profile with new location IDs
            const updateResult = await updateUserProfile(profile.id, {
                state: locationResult.state,
                local_area: locationResult.area
            });

            if (!updateResult.success) {
                showToast({ message: updateResult.error || 'Failed to update location', type: 'danger' });
            } else {
                showToast({ message: 'Location updated successfully', type: 'success' });

                // Update current location data to reflect the new saved values
                setCurrentStateName(selectedState || '');
                setCurrentAreaName(selectedArea || '');

                // Refresh the current location data from database to ensure consistency
                // This will update the profile context and re-fetch the latest data
                setTimeout(() => {
                    fetchCurrentLocationData();
                }, 500);

                setState?.(prev => !prev);

                navigation.navigate('SettingsMain');
            }
        } catch (error) {
            showToast({ message: 'Failed to update location', type: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };


    const handleCompleteLocation = async (locationData?: any) => {
        if (!profile?.id) {
            showToast({ message: 'User profile not found', type: 'danger' });
            return;
        }

        try {
            setShowRequest(false);
        } catch (error) {
            showToast({ message: 'Failed to update location', type: 'danger' });
        }
    };

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
                    {isLoadingData ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading location data...</Text>
                        </View>
                    ) : (
                        <LocationSelector
                            selectedState={selectedState}
                            selectedArea={selectedArea}
                            onStateChange={setSelectedState}
                            onAreaChange={setSelectedArea}
                            currentState={currentStateName}
                            currentArea={currentAreaName}
                            helper={(
                                <Text style={styles.helperText}>
                                    Select the local area closest to you. If your area isn't listed,{' '}
                                    <Text style={styles.link} onPress={() => setShowRequest(true)}>Request location</Text>
                                </Text>
                            )}
                        />
                    )}
                </ScrollView>

                {/* Footer save button mirrors the mock */}
                <View style={styles.footer}>
                    <Button
                        title="Save Changes"
                        onPress={onSave}
                        disabled={!isValid || isLoading || isLoadingData}
                        variant="primary"
                    />
                </View>
            </KeyboardAvoidingView>

            {/* Request Location flow using shared bottom sheets */}
            {showRequest && (
                <LocationRequestFlow
                    stepAfterClose={() => {
                        setShowRequest(false);
                    }}
                    showToast={showToast}
                    handleCompleteOnboarding={handleCompleteLocation}
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
        paddingVertical: aliasTokens.spacing.Large,
        backgroundColor: aliasTokens.color.background.Primary
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: aliasTokens.spacing.Large
    },
    loadingText: {
        ...aliasTokens.typography.body.Medium,
        color: aliasTokens.color.text.Secondary
    }
});


