import React, { useState } from 'react';
import StateBottomSheet from './StateBottomSheet';
import NoteBottomSheet from './NoteBottomSheet';
import { LocationType, OnboardingData } from '../types/props';
import type { ShowToast } from '../types/toast';

/**
 * Thin wrapper around existing bottom sheets to provide the
 * "Request Location" flow as a reusable component.
 */
interface LocationRequestFlowProps {
    stepAfterClose?: () => void;
    showToast: ShowToast;
    onboardingData?: OnboardingData;
    handleCompleteOnboarding: (data?: any) => Promise<void> | void;
}

const LocationRequestFlow: React.FC<LocationRequestFlowProps> = ({
    stepAfterClose,
    showToast,
    onboardingData,
    handleCompleteOnboarding
}) => {
    // 0 = request form, 1 = select state, 2 = success
    const [currentState, setCurrentState] = useState<0 | 1 | 2>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<LocationType>({ state: '', city: '', id: 0 });

    const handleClose = () => {
        setCurrentState(0);
        setLocation({ state: '', city: '', id: 0 });
        stepAfterClose?.();
    };

    const handleInsert = async () => {
        try {
            setIsLoading(true);
            const newOnBoardingData = {
                ...onboardingData,
                location: { state: location.state, area: location.city }
            };
            await handleCompleteOnboarding(newOnBoardingData);
        } catch (error) {
            showToast({ message: `Insert error: ${error}`, type: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <StateBottomSheet
                currentState={currentState}
                setCurrentState={setCurrentState}
                visible={currentState === 0}
                onSave={setLocation}
                onClose={handleClose}
                initialLocation={location}
                title="Request Location"
                showToast={showToast}
            />
            <NoteBottomSheet
                currentState={currentState}
                setCurrentState={setCurrentState}
                visible={currentState === 2}
                onClose={handleInsert}
                title="Request Received!"
                successMessage="We're currently focused on operating in Louisiana, but as we expand into other states, we'll be sure to keep you updated."
                onboardingData={onboardingData}
                loading={isLoading}
            />
        </>
    );
};

export default LocationRequestFlow;


