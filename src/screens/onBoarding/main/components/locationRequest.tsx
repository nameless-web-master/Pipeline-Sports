import React, { useState } from "react";
import StateBottomSheet from "../../../../components/StateBottomSheet";
import NoteBottomSheet from "../../../../components/NoteBottomSheet";
import { LocationType } from "../../../../types/props";
import { ShowToast } from "../../../../types/toast";
import { OnboardingData } from "../../../../types/props";

/**
 * Props for the LocationRequest component
 */
interface LocationRequestProps {
    /** Current step number */
    step: number;
    /** Handler for step changes */
    setStep: (step: number) => void;
    /** Toast function for showing notifications */
    showToast: ShowToast;
    /** Onboarding data to be passed to NoteBottomSheet */
    onboardingData?: OnboardingData;
    /** Function for Insert the user profile */
    handleCompleteOnboarding: Function
}

/**
 * Location Request component for onboarding flow
 * 
 * Interaction Flow:
 * - State 0: Show location request form (state + city input)
 * - State 1: Show state selection bottom sheet (handled by StateBottomSheet)
 * - State 2: Show success notification
 */
export const LocationRequest: React.FC<LocationRequestProps> = ({
    step,
    setStep,
    showToast,
    onboardingData,
    handleCompleteOnboarding
}) => {
    /**
     * Bottom sheet state management
     * - 0: Location request form (state and city input)
     * - 1: State selection bottom sheet (handled internally by StateBottomSheet)
     * - 2: Success notification
     */
    const [currentState, setCurrentState] = useState<0 | 1 | 2>(0);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Location data state
     */
    const [location, setLocation] = useState<LocationType>({
        state: '',
        city: '',
        id: 0
    });

    /**
     * Handler for closing bottom sheets
     * Resets state and returns to step 4
     */
    const handleClose = () => {
        setCurrentState(0);
        setStep(4);
        setLocation({
            state: '',
            city: '',
            id: 0
        });
    };


    /** Handler for Inserting User Profile */
    const handleInsert = async () => {
        try {
            setIsLoading(true);
            const newOnBoardingData = {
                ...onboardingData,
                location: {
                    state: location.state,
                    area: location.city
                }
            }

            await handleCompleteOnboarding(newOnBoardingData);
        } catch (error) {
            showToast({
                message: `Insert error: ${error}`,
                type: 'danger'
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {/* Location Request Bottom Sheet */}
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

            {/* Success Notification Bottom Sheet */}
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