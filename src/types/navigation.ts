import { StackScreenProps } from '@react-navigation/stack';


// Define Root stack param list
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  OnBoarding: undefined;
  Entry: undefined;
  Gateway: undefined;
  SignupWithEmailScreen: { email?: string } | undefined;
  ResendEmailScreen: { email?: string, content?: string } | undefined;
  OnBoardingMain: undefined;
  CommunityCommitmentScreen: undefined;
  NotificationScreen: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassowrd: undefined;
  NotePage: {
    title?: string;
    content?: string;
    buttonTitle?: string;
    navigateTo?: keyof RootStackParamList;
  } | undefined
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
export type Login = ScreenProps<'Login'>;
export type ForgotPassword = ScreenProps<'ForgotPassword'>;
export type ResetPassowrd = ScreenProps<'ResetPassowrd'>;
export type NotePage = ScreenProps<'NotePage'>;