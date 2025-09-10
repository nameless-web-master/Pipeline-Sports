// src/screens/onBoarding/entry/index.tsx
import React, { ReactElement, useEffect } from 'react';
import { View } from 'react-native';
import { HomeScreenProps } from '../../../types/navigation';

import { HomeLogo } from '../../../components/Logo';
import { aliasTokens } from '../../../theme/alias';

/**
 * Splash screen component for onboarding entry
 * 
 * Displays a brief splash screen with the app logo before automatically
 * navigating to the main onboarding flow. This provides a smooth transition
 * and branding opportunity when users first open the app.
 * 
 * Features:
 * - Automatic navigation after 1 second delay
 * - Centered logo display
 * - Clean, minimal design using design tokens
 * 
 * @param props - Navigation props for screen transitions
 * @returns JSX element representing the splash screen
 */
const OnBoardingScreen = ({ navigation }: HomeScreenProps): ReactElement => {
    // Auto-navigation effect - runs after component mounts
    useEffect(() => {
        const timer = setTimeout(() => navigation.navigate('Entry'), 1000);
        // Cleanup timer on component unmount to prevent memory leaks
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles}>
            <HomeLogo />
        </View>
    );
};

// Full-screen centered container styles using design system tokens
const styles = {
    ...aliasTokens.basic.dFlexCenter,
    ...aliasTokens.sizes.allFullSize,
    backgroundColor: aliasTokens.color.background.Home,
}

export default OnBoardingScreen;