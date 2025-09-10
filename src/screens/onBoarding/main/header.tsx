import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import BackButton from '../../../components/BackButton';
import Progress from './components/progress';
import { aliasTokens } from '../../../theme/alias';
import { StaticContent } from '../../../strings';

/**
 * Props interface for the Onboarding Header component
 */
interface HeaderProps {
  /** Current progress value (0-100) */
  progress: number;
  /** Callback function when back button is pressed */
  onBackPress: () => void;
  /** Show percentage text in progress bar */
  showPercentage?: boolean;
  /** Animation duration for progress bar in milliseconds */
  animationDuration?: number;
  /** Custom progress bar color */
  progressColor?: string;
  /** Custom background color for progress bar */
  backgroundColor?: string;
  /** Custom text color for percentage display */
  textColor?: string;
  /** Custom title text color */
  titleColor?: string;
  /** Height of the progress bar in pixels */
  progressHeight?: number;
  /** Width of the progress bar (number in pixels or string percentage) */
  progressWidth?: number | string;
  /** Custom style for the header container */
  style?: ViewStyle;
  /** Back button visual variant */
  backButtonVariant?: 'outline' | 'ghost';
}

/**
 * Onboarding Header Component
 * 
 * A comprehensive header component for onboarding flows that includes:
 * - Conditional back button (only shows when progress > 1)
 * - Animated progress bar with customizable styling
 * - Dynamic title that updates based on current progress step
 * - Responsive layout with proper spacing
 * 
 * Layout Structure:
 * - Top row: Back button (left) + Progress bar (center) + Spacer (right)
 * - Title row: Centered title text below progress bar
 * 
 * @param progress - Current step progress (0-100)
 * @param onBackPress - Handler for back button press
 * @param showPercentage - Whether to display percentage in progress bar
 * @param animationDuration - Duration for progress bar animation
 * @param progressColor - Color of the progress bar fill
 * @param backgroundColor - Background color of the progress bar
 * @param textColor - Color of percentage text
 * @param titleColor - Color of the title text
 * @param progressHeight - Height of the progress bar
 * @param progressWidth - Width of the progress bar
 * @param style - Additional styles for the container
 * @param backButtonVariant - Visual style of the back button
 */
const Header: React.FC<HeaderProps> = ({
  progress,
  onBackPress,
  showPercentage = false,
  animationDuration = 1000,
  progressColor = aliasTokens.color.brand.Primary,
  backgroundColor = aliasTokens.color.border.Light,
  textColor = aliasTokens.color.text.Primary,
  titleColor = aliasTokens.color.text.Primary,
  progressHeight = 4,
  progressWidth = '100%',
  style,
  backButtonVariant = 'outline',
}) => {
  return (
    <View style={style}>
      {/* Top Row: Back Button + Progress Bar + Spacer */}
      <View style={styles.topRow}>
        {/* Conditional Back Button - Only show if not on first step */}
        {progress > 1 ? (
          <View>
            <BackButton
              onPress={onBackPress}
              variant={backButtonVariant}
            />
          </View>
        ) :
          <View style={styles.spacer} />

        }

        {/* Progress Bar - Takes remaining space in the row */}
        <View style={styles.progressContainer}>
          <Progress
            progress={progress}
            height={progressHeight}
            width={progressWidth}
            showPercentage={showPercentage}
            animationDuration={animationDuration}
            progressColor={progressColor}
            backgroundColor={backgroundColor}
            textColor={textColor}
          />
        </View>

        {/* Spacer to balance layout when back button is hidden */}
        <View style={styles.spacer} />
      </View>

      {/* Dynamic Title - Shows current step title based on progress */}
      {progress > 0 && (
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: titleColor }]}>
            {StaticContent.onBoarding[progress - 1]}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container for the header component

  // Top row containing back button, progress bar, and spacer
  topRow: {
    ...aliasTokens.basic.dFlexBetween,
    gap: aliasTokens.spacing.Small,
  },

  // Container for the progress bar - takes remaining space
  progressContainer: {
    flex: 1,
  },

  // Spacer element to balance layout when back button is hidden
  spacer: {
    width: 42,
    height: 42,
  },

  // Container for the dynamic title text
  titleContainer: {
    marginTop: aliasTokens.spacing.Large,
    marginHorizontal: 29,
  },

  // Title text styling
  title: {
    ...aliasTokens.typography.title.Large,
    color: aliasTokens.color.text.Primary,
    textAlign: 'center',
    letterSpacing: -0.25,
  },
});

export default Header;
