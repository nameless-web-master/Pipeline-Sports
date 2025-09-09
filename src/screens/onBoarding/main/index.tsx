import React, { useState } from "react";
import Header from "./header";
import { Alert, StyleSheet, Text, View } from "react-native";
import { aliasTokens } from "../../../theme/alias";
import PhotoUpload from "./components/photoUpload";
import SetProfile from "./components/SetProfile";
import SetInterest from "./components/SetInterest";
import LocalCommunity from "./components/localCommunity";
import Button from "../../../components/Button";
import { OnBoardingMain as OnBoardingMainProps } from "../../../types/navigation";

export const OnBoardingMain = ({ navigation }: OnBoardingMainProps) => {
    // Current step of onboarding flow (1..4)
    const [step, setStep] = useState(1);
    // Whether the current visible step is valid to proceed
    const [isStepValid, setIsStepValid] = useState(false);

    // ===== CENTRALIZED ONBOARDING DATA STATE =====

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

    // Centralized validation before moving forward.
    // Replace the placeholder logic with real checks as needed.
    // Step-specific validation is reported by child components via onValidityChange
    // and stored in isStepValid.
    const validateCurrentStep = (): boolean => isStepValid;

    // Navigate to next step with validation.
    const handleNext = () => {
        setIsStepValid(false);

        const isValid = validateCurrentStep();
        if (!isValid) {
            Alert.alert("Hold on", "Please complete required fields before continuing.");
            return;
        }

        // If we're on the last step (4), complete onboarding and navigate away
        if (step >= 4) {
            handleCompleteOnboarding();
            return;
        }
        setStep(prev => Math.min(prev + 1, 4));
    };

    // Handle completion of onboarding flow
    const handleCompleteOnboarding = () => {
        // Collect all onboarding data
        const onboardingData = {
            // Step 1: Photo
            photo: {
                isUploaded: isImageUploaded,
                uri: uploadedImageUri
            },
            // Step 2: Profile
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
            // Step 3: Interests
            interests: Array.from(selectedInterests),
            // Step 4: Location
            location: {
                state: selectedState,
                area: selectedArea
            }
        };

        // TODO: Save onboarding data to store/API here
        console.log("Onboarding completed successfully!", onboardingData);

        // Navigate to main app or home screen
        // You can replace 'Home' with the appropriate screen name for your main app
        navigation.navigate('Home');
    };

    // Navigate back safely; never below step 1.
    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    // ===== STEP VALIDATION HELPERS =====

    // Validate step 1: Photo upload
    const isPhotoStepValid = () => isImageUploaded;

    // Validate step 2: Profile completion
    const isProfileStepValid = () => {
        return firstName.trim() && lastName.trim() && role && dobYear && dobMonth && dobDay;
    };

    // Validate step 3: At least one interest selected
    const isInterestStepValid = () => selectedInterests.size > 0;

    // Validate step 4: Location selection
    const isLocationStepValid = () => selectedState && selectedArea;

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
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <Header onBackPress={handleBack} progress={step} />
            {renderCurrentStep()}

            {/* Centralized bottom CTA: title and disabled state vary by step */}
            <View style={styles.ctaContainer}>
                <Button
                    title={step > 1 ? "Continue" : "Next"}
                    onPress={handleNext}
                    disabled={!isStepValid && step <= 4}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: aliasTokens.color.background.Primary,
        paddingTop: aliasTokens.spacing.XLarge,
        paddingHorizontal: aliasTokens.spacing.Large,
        paddingBottom: aliasTokens.spacing.Medium,
    },
    ctaContainer: {
        marginTop: aliasTokens.spacing.Medium,
    }
})