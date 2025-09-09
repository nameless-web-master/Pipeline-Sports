import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, ViewStyle } from 'react-native';
import { aliasTokens } from '../../../../theme/alias';

/**
 * Props interface for the Progress component
 */
interface ProgressProps {
    /** Current progress value (0-100) */
    progress: number;
    /** Height of the progress bar in pixels */
    height?: number;
    /** Width of the progress bar (number in pixels or string percentage) */
    width?: number | string;
    /** Whether to display percentage text below the progress bar */
    showPercentage?: boolean;
    /** Animation duration in milliseconds */
    animationDuration?: number;
    /** Custom color for the progress bar fill */
    progressColor?: string;
    /** Custom background color for the progress bar track */
    backgroundColor?: string;
    /** Custom color for the percentage text */
    textColor?: string;
    /** Whether to show animated dots above the progress bar */
    showDots?: boolean;
}

/**
 * Animated Progress Bar Component
 * 
 * A feature-rich progress bar component with smooth animations and customizable styling.
 * 
 * Key Features:
 * - Smooth animated progress bar with cubic easing
 * - Animated number counting up to the progress value
 * - Optional animated dots above the progress bar
 * - Fully customizable colors, dimensions, and timing
 * - TypeScript support with comprehensive prop types
 * 
 * Animation Details:
 * - Progress bar animates from 0% to target percentage
 * - Number counting animates synchronously with progress bar
 * - Dots animation loops continuously when enabled
 * - All animations use native driver for optimal performance
 * 
 * @param progress - Current progress value (0-100)
 * @param height - Height of the progress bar in pixels
 * @param width - Width of the progress bar
 * @param showPercentage - Whether to display percentage text
 * @param animationDuration - Duration for all animations
 * @param progressColor - Color of the progress bar fill
 * @param backgroundColor - Background color of the progress bar track
 * @param textColor - Color of the percentage text
 * @param showDots - Whether to show animated dots above the bar
 */
const Progress: React.FC<ProgressProps> = ({
    progress,
    height = 8,
    width = '100%',
    showPercentage = true,
    animationDuration = 1000,
    progressColor = aliasTokens.color.brand.Primary,
    backgroundColor = aliasTokens.color.border.Light,
    textColor = aliasTokens.color.text.Primary,
    showDots = false,
}) => {
    // Animation references for smooth transitions
    const progressAnimation = useRef(new Animated.Value(0)).current;
    const numberAnimation = useRef(new Animated.Value(0)).current;
    const dotsAnimation = useRef(new Animated.Value(0)).current;
    
    // State for displaying the animated number
    const [displayNumber, setDisplayNumber] = useState(0);
    
    // Convert progress to percentage (multiply by 25 for 4-step process)
    const progressPercentage = progress * 25;
    
    // Ensure progress is within valid range (0-100)
    const clampedProgress = Math.max(0, Math.min(100, progressPercentage));

    useEffect(() => {
        // Animate progress bar width
        Animated.timing(progressAnimation, {
            toValue: clampedProgress,
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false, // Cannot use native driver for width animation
        }).start();

        // Animate number counting up to target value
        Animated.timing(numberAnimation, {
            toValue: clampedProgress,
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false, // Cannot use native driver for number animation
        }).start();

        // Listen to number animation changes and update display
        const listener = numberAnimation.addListener(({ value }) => {
            setDisplayNumber(Math.round(value));
        });

        // Cleanup listener on unmount or dependency change
        return () => {
            numberAnimation.removeListener(listener);
        };
    }, [clampedProgress, animationDuration]);

    // Separate effect for dots animation to avoid interference
    useEffect(() => {
        if (showDots) {
            // Create continuous pulsing animation for dots
            Animated.loop(
                Animated.sequence([
                    Animated.timing(dotsAnimation, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true, // Can use native driver for opacity
                    }),
                    Animated.timing(dotsAnimation, {
                        toValue: 0,
                        duration: 600,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [showDots]);

    // Interpolate progress animation value to width percentage
    const progressWidth = progressAnimation.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp', // Prevent values outside the range
    });

    // Interpolate number animation value for counting effect
    const animatedNumber = numberAnimation.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 100],
        extrapolate: 'clamp',
    });

    // Interpolate dots animation value to opacity
    const dotsOpacity = dotsAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1], // Fade between 30% and 100% opacity
    });

    return (
        <View style={{ width } as ViewStyle}>
            {/* Animated Dots - Optional pulsing dots above progress bar */}
            {showDots && (
                <Animated.View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 8,
                        opacity: dotsOpacity,
                    }}
                >
                    {[1, 2, 3].map((dot) => (
                        <View
                            key={dot}
                            style={{
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: progressColor,
                                marginHorizontal: 2,
                            }}
                        />
                    ))}
                </Animated.View>
            )}

            {/* Progress Bar Track - Background container */}
            <View
                style={{
                    height,
                    backgroundColor,
                    borderRadius: height / 2, // Fully rounded ends
                    overflow: 'hidden', // Ensure fill doesn't exceed bounds
                    position: 'relative',
                }}
            >
                {/* Animated Progress Fill - The actual progress indicator */}
                <Animated.View
                    style={{
                        height: '100%',
                        width: progressWidth, // Animated width based on progress
                        backgroundColor: progressColor,
                        borderRadius: height / 2, // Match track border radius
                    }}
                />
            </View>

            {/* Percentage Text - Optional display of current progress */}
            {showPercentage && (
                <View style={{ alignItems: 'center', marginTop: 8 }}>
                    <Text
                        style={{
                            ...aliasTokens.typography.labelText.Small,
                            color: textColor,
                        }}
                    >
                        {displayNumber}%
                    </Text>
                </View>
            )}
        </View>
    );
};

export default Progress;
