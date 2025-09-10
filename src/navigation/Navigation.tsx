// src/navigation/Navigation.tsx
import React, { memo, ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

// OnBoarding Navigation Import
import OnBoardingScreen from '../screens/onBoarding/entry';
import { EntryMain } from '../screens/onBoarding/entry/main';
import Gateway from '../screens/onBoarding/entry/gateway';
import { OnBoardingMain } from '../screens/onBoarding/main';

// Agreement Navigation Import

import CommunityCommitmentScreen from '../screens/onBoarding/agreements';
import NotificationScreen from '../screens/onBoarding/agreements/notification';

// Auth Navigation Import
import SignupWithEmailScreen from '../screens/onBoarding/auth/signUp';
import Login from '../screens/onBoarding/auth/login';
import ResendEmailScreen from '../screens/onBoarding/auth/resendEmail';
import ForgotPassword from '../screens/onBoarding/auth/forgotPassword';
import ResetPassowrd from '../screens/onBoarding/auth/resetPassword';


// Success Note Import 
import NotePage from '../components/layout/notePage';

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = (): ReactElement => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

        {/* OnBoarding Navigation Link */}

        <Stack.Screen name="Home" component={OnBoardingScreen} />
        <Stack.Screen name="Entry" component={EntryMain} />
        <Stack.Screen name="Gateway" component={Gateway} />
        <Stack.Screen name="OnBoardingMain" component={OnBoardingMain} />

        {/* Agreement Navigation Link */}

        <Stack.Screen name="CommunityCommitmentScreen" component={CommunityCommitmentScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />

        {/* Auth Navigation Link */}

        <Stack.Screen name="SignupWithEmailScreen" component={SignupWithEmailScreen} />
        <Stack.Screen name="ResendEmailScreen" component={ResendEmailScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassowrd" component={ResetPassowrd} />

        {/* Success Note Link */}
        
        <Stack.Screen name="NotePage" component={NotePage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(Navigation);