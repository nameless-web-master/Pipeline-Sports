import React from "react";
import { ShowToast } from "../../../../types/toast";
import { OnboardingData } from "../../../../types/props";
import LocationRequestFlow from "../../../../components/LocationRequestFlow";

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
    // Delegate the full flow to the reusable component
    return (
        <LocationRequestFlow
            stepAfterClose={() => setStep(4)}
            showToast={showToast}
            onboardingData={onboardingData}
            handleCompleteOnboarding={handleCompleteOnboarding as any}
        />
    );
};