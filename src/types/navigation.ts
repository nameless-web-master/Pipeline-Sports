import { StackScreenProps } from '@react-navigation/stack';

// Define Root stack param list
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  OnBoarding: undefined;
  Entry: undefined;
  Gateway: undefined;
  SignupWithEmailScreen: { email?: string } | undefined;
  ResendEmailScreen: { email?: string } | undefined;
  OnBoardingMain: undefined;
  CommunityCommitmentScreen: undefined;
  NotificationScreen: undefined;
};

// Generic screen props type (includes navigation and route)
export type ScreenProps<Screen extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, Screen>;

// Use the generic interface for each screen component
export type OnBoardingScreenProps = ScreenProps<'OnBoarding'>;
export type HomeScreenProps = ScreenProps<'Home'>;
export type ProfileScreenProps = ScreenProps<'Profile'>;
export type entryMain = ScreenProps<'Entry'>;
export type Gateway = ScreenProps<'Gateway'>;
export type SignupWithEmailScreen = ScreenProps<'SignupWithEmailScreen'>;
export type ResendEmailScreen = ScreenProps<'ResendEmailScreen'>;
export type OnBoardingMain = ScreenProps<'OnBoardingMain'>;
export type CommunityCommitmentScreen = ScreenProps<'CommunityCommitmentScreen'>;
export type NotificationScreen = ScreenProps<'NotificationScreen'>;