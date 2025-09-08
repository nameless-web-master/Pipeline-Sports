import { StackNavigationProp } from '@react-navigation/stack';

// Define Root stack param list
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  OnBoarding: undefined;
  Entry: undefined;
  Gateway: undefined;
};

// Generic navigation prop type
export type ScreenNavigationProp<Screen extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, Screen>;

// Screen props interface
export interface ScreenProps<Screen extends keyof RootStackParamList> {
  navigation: ScreenNavigationProp<Screen>;
}

// Use the generic interface for each screen component
export type OnBoardingScreenProps = ScreenProps<'OnBoarding'>;
export type HomeScreenProps = ScreenProps<'Home'>;
export type ProfileScreenProps = ScreenProps<'Profile'>;
export type entryMain = ScreenProps<'Entry'>;
export type Gateway = ScreenProps<'Gateway'>;