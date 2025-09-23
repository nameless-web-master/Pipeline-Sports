// src/navigation/Navigation.tsx
import React, { memo, ReactElement } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import type { ShowToast } from '../types/toast';

// OnBoarding Navigation screens Import
import OnBoardingScreen from '../screens/onBoarding/entry';
import { EntryMain } from '../screens/onBoarding/entry/main';
import * as GatewayModule from '../screens/onBoarding/entry/gateway';
import { OnBoardingMain } from '../screens/onBoarding/main';

// Agreement Navigation screens Import

import CommunityCommitmentScreen from '../screens/onBoarding/agreements';
import NotificationScreen from '../screens/onBoarding/agreements/notification';

// Auth Navigation screens Import
import SignupWithEmailScreen from '../screens/onBoarding/auth/signUp';
import Login from '../screens/onBoarding/auth/login';
import ResendEmailScreen from '../screens/onBoarding/auth/resendEmail';
import ForgotPassword from '../screens/onBoarding/auth/forgotPassword';
import ResetPassowrd from '../screens/onBoarding/auth/resetPassword';

import { linking } from '../hooks/useLinking';

// Success Note Import 
import NotePage from '../components/layout/notePage';

// Setting Navigation Screens Import 
import { SettingsScreen } from '../screens/settings';
import UserInformation from '../screens/settings/components/userInformation';
import LocationSetting from '../screens/settings/components/locationSetting';
import PasswordHandle from '../screens/settings/components/passwordHandle';

const Stack = createStackNavigator<RootStackParamList>();

interface NavigationProps {
  showToast: ShowToast;
}

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Navigation = ({ showToast }: NavigationProps): ReactElement => {
  // Handle modules that may export default or named component
  const Gateway = (GatewayModule as any).default || (GatewayModule as any);
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>

        {/* OnBoarding Navigation Link */}

        <Stack.Screen name="Home">
          {(props) => <OnBoardingScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Entry">
          {(props) => <EntryMain {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Gateway">
          {(props) => <Gateway {...props} showToast={showToast} />}
        </Stack.Screen>
        <Stack.Screen name="OnBoardingMain">
          {(props) => <OnBoardingMain {...props} showToast={showToast} />}
        </Stack.Screen>

        {/* Agreement Navigation Link */}

        <Stack.Screen name="CommunityCommitmentScreen" component={CommunityCommitmentScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />

        {/* Auth Navigation Link */}

        <Stack.Screen name="SignupWithEmailScreen">
          {(props) => <SignupWithEmailScreen {...props} showToast={showToast} />}
        </Stack.Screen>
        <Stack.Screen name="ResendEmailScreen">
          {(props) => <ResendEmailScreen {...props} showToast={showToast} />}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {(props) => <Login {...props} showToast={showToast} />}
        </Stack.Screen>
        <Stack.Screen name="ForgotPassword">
          {(props) => <ForgotPassword {...props} showToast={showToast} />}
        </Stack.Screen>
        <Stack.Screen name="ResetPassowrd">
          {(props) => <ResetPassowrd {...props} showToast={showToast} />}
        </Stack.Screen>

        {/* Success Note Link */}

        <Stack.Screen name="NotePage">
          {(props) => <NotePage {...props} />}
        </Stack.Screen>

        {/* Setting Navigation Links */}

        <Stack.Group>
          <Stack.Screen name='SettingsMain'>
            {(props) => <SettingsScreen {...props} showToast={showToast} />}
          </Stack.Screen>
          <Stack.Screen name='UserInformation'>
            {(props) => <UserInformation {...props} showToast={showToast} />}
          </Stack.Screen>
          <Stack.Screen name='LocationSetting'>
            {(props) => <LocationSetting {...props} showToast={showToast} />}
          </Stack.Screen>
          <Stack.Screen name='PasswordHandle'>
            {(props) => <PasswordHandle {...props} showToast={showToast} />}
          </Stack.Screen>
        </Stack.Group>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(Navigation);