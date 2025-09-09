// src/screens/onBoarding/entry/index.tsx
import React, { ReactElement, useEffect } from 'react';
import { View } from 'react-native';
import { HomeScreenProps } from '../../../types/navigation';

import { HomeLogo } from '../../../components/Logo';
import { aliasTokens } from '../../../theme/alias';

// Splash-like onboarding entry that redirects to Entry after a short delay.
const OnBoardingScreen = ({ navigation }: HomeScreenProps): ReactElement => {
    // Use an effect for navigation side-effects to avoid running during render.
    useEffect(() => {
        const timer = setTimeout(() => navigation.navigate('Entry'), 1000);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles}>
            <HomeLogo />
        </View>
    );
};

// Simple full-screen centered container using design tokens
const styles = {
    ...aliasTokens.basic.dFlexCenter,
    width: aliasTokens.sizes.full,
    height: aliasTokens.sizes.full,
    backgroundColor: aliasTokens.color.background.Home,
}

export default OnBoardingScreen;