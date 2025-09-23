import React, { useState } from "react";
import Header from "./header";
import { StyleSheet, View } from "react-native";
import { aliasTokens } from "../../../theme/alias";
import PhotoUpload from "./components/photoUpload";
import SetProfile from "./components/SetProfile";
import SetInterest from "./components/SetInterest";
import LocalCommunity from "./components/localCommunity";
import Button from "../../../components/Button";
import { OnBoardingMain as OnBoardingMainProps } from "../../../types/navigation";
import { ShowToast } from "../../../types/toast";
import { LocationRequest } from "./components/locationRequest";
import { OnBoarding } from "../../../hooks/useProfile";
import { OnboardingData } from "../../../types/props";

interface OnBoardingMainWithToast extends OnBoardingMainProps {
    showToast: ShowToast;
}

export const OnBoardingMain = ({ navigation, showToast }: OnBoardingMainWithToast) => {
    // Current step of onboarding flow (1..5)
    const [step, setStep] = useState(1);
    // Whether the current visible step is valid to proceed
    const [isStepValid, setIsStepValid] = useState(false);
    // Loading state for onboarding completion
    const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);

    // ===== CENTRALIZED ONBOARDING DATA STATE =====
    // All onboarding data is managed centrally in this component
    // and passed down to child components as needed

    // Step 1: Photo Upload Data
    const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);
    const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);

    // Step 2: Profile Data
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<string | undefined>(undefined);
    const [dobYear, setDobYear] = useState<number | undefined>(undefined);
    const [dobMonth, setDobMonth] = useState<number | undefined>(undefined);
    const [dobDay, setDobDay] = useState<number | undefined>(undefined);

    // Step 3: Interests Data
    const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());

    // Step 4: Location Data
    const [selectedState, setSelectedState] = useState<string | undefined>();
    const [selectedArea, setSelectedArea] = useState<string | undefined>();

    // ===== HELPER FUNCTIONS =====

    /**
     * Builds the complete onboarding data object from current state
     * @returns Complete onboarding data structure
     */
    const buildOnboardingData = (): OnboardingData => ({
        photo: {
            isUploaded: isImageUploaded,
            uri: uploadedImageUri
        },
        profile: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            role,
            dateOfBirth: {
                year: dobYear,
                month: dobMonth,
                day: dobDay
            }
        },
        interests: Array.from(selectedInterests),
        location: {
            state: selectedState,
            area: selectedArea
        }
    });

    /**
     * Validates the current step before proceeding
     * @returns true if current step is valid
     */
    const validateCurrentStep = (): boolean => isStepValid;

    // Navigate to next step with validation.
    const handleNext = () => {
        const isValid = validateCurrentStep();
        if (!isValid) {
            showToast({
                message: 'Please complete required fields before continuing.'
            });
            return;
        }

        // If we're on the last step (4), complete onboarding and navigate away
        if (step === 4 || step === 5) {
            handleCompleteOnboarding();
            return;
        }
        setStep(prev => Math.min(prev + 1, 4));
    };


    /**
     * Handle completion of onboarding flow
     * Collects all data, calls OnBoarding API, and handles navigation
     */
    const handleCompleteOnboarding = async (insertDatas: OnboardingData = buildOnboardingData()) => {
        // Prevent multiple submissions
        if (isCompletingOnboarding) return;

        setIsCompletingOnboarding(true);

        try {
            // Call OnBoarding API to save data and upload image
            const result = await OnBoarding(insertDatas);

            if (result.success) {
                // Show success toast and navigate
                showToast({
                    message: result.message || 'Profile created successfully!',
                    type: 'success',
                    duration: 2000,
                });
                navigation.navigate('CommunityCommitmentScreen');
            } else {
                // Show error toast
                showToast({
                    message: result.message || 'Failed to create profile. Please try again.',
                    type: 'danger',
                    duration: 4000
                });
            }

        } catch (error) {
            console.log('Onboarding completion error:', error);
            showToast({
                message: 'An unexpected error occurred. Please try again.',
                type: 'danger',
                duration: 4000
            });
        } finally {
            setIsCompletingOnboarding(false);
        }
    };

    // Navigate back safely; never below step 1.
    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };
    // Renders the content for the current step with centralized data and handlers.
    const renderCurrentStep = () => {
        switch (step) {
            case 1:
                return (
                    <PhotoUpload
                        isImageUploaded={isImageUploaded}
                        uploadedImageUri={uploadedImageUri}
                        onImageSelected={(uri: string) => {
                            setUploadedImageUri(uri);
                            setIsImageUploaded(true);
                            setIsStepValid(true);
                        }}
                        onValidityChange={setIsStepValid}
                    />
                );
            case 2:
                return (
                    <SetProfile
                        firstName={firstName}
                        lastName={lastName}
                        role={role}
                        dobYear={dobYear}
                        dobMonth={dobMonth}
                        dobDay={dobDay}
                        onFirstNameChange={setFirstName}
                        onLastNameChange={setLastName}
                        onRoleChange={setRole}
                        onDobChange={(year, month, day) => {
                            setDobYear(year);
                            setDobMonth(month);
                            setDobDay(day);
                        }}
                        onValidityChange={setIsStepValid}
                    />
                );
            case 3:
                return (
                    <SetInterest
                        selectedInterests={selectedInterests}
                        onInterestsChange={(interests) => {
                            setSelectedInterests(interests);
                            setIsStepValid(interests.size > 0);
                        }}
                        onValidityChange={setIsStepValid}
                    />
                );
            case 4:
            case 5:
                return (
                    <LocalCommunity
                        selectedState={selectedState}
                        selectedArea={selectedArea}
                        onStateChange={(state) => {
                            setSelectedState(state);
                            // Clear area when state changes
                            if (state !== selectedState) {
                                setSelectedArea(undefined);
                            }
                        }}
                        onAreaChange={(area) => {
                            setSelectedArea(area);
                            setIsStepValid(Boolean(selectedState && area));
                        }}
                        onValidityChange={setIsStepValid}
                        setStep={setStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={aliasTokens.container.bodyPadding}>
            <Header onBackPress={handleBack} progress={step} />
            {renderCurrentStep()}

            {/* Centralized bottom CTA: title and disabled state vary by step */}
            <View style={styles.ctaContainer}>
                <Button
                    title={
                        isCompletingOnboarding
                            ? "Creating Profile..."
                            : step > 1
                                ? "Continue"
                                : "Next"
                    }
                    onPress={handleNext}
                    disabled={(!isStepValid && step <= 5) || isCompletingOnboarding}
                />
            </View>
            {/* Location Request Component - Only shown on step 5 */}
            {/* Passes complete onboarding data for console logging in NoteBottomSheet */}
            {
                step === 5 && (
                    <LocationRequest
                        step={step}
                        setStep={setStep}
                        showToast={showToast}
                        onboardingData={buildOnboardingData()}
                        handleCompleteOnboarding={() => setStep(4)}
                    />
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    ctaContainer: {
        marginTop: aliasTokens.spacing.Medium,
    }
})