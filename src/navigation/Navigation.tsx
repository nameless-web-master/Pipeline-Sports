// src/navigation/Navigation.tsx
import React, { memo, ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

// OnBoarding Navigation Links
import OnBoardingScreen from '../screens/onBoarding/entry';
import { EntryMain } from '../screens/onBoarding/entry/main';
import Gateway from '../screens/onBoarding/entry/gateway';

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = (): ReactElement => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={OnBoardingScreen} />
        <Stack.Screen name="Entry" component={EntryMain} />
        <Stack.Screen name="Gateway" component={Gateway} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(Navigation);