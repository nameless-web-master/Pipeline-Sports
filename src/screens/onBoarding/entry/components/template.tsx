import React, { ReactElement } from "react";
import { Image, Text, View, StyleSheet } from "react-native";

import { ImagesAssets } from "../../../../assets";
import { aliasTokens } from "../../../../theme/alias";
import { StaticContent, ENTRY_SLIDES } from "../../../../strings";
import { entryMain } from "../../../../types/navigation";

import Dots from "../../../../components/dots";
import Button from "../../../../components/Button";
import FadeSlideIn from "../../../../components/FadeSlideIn";
import BottomGradient from "../../../../components/BottomGradient";
import { LogoImage } from "../../../../components/Logo";

/**
 * Static configuration for onboarding slides
 * Each slide contains an image reference and corresponding content text
 */
const EntryList = ENTRY_SLIDES;

/**
 * Props interface for the EntryTemplate component
 */
type EntryTemplateProps = {
    /** Current slide index (0-based) */
    Nr: number;
    /** Function to update the current slide index */
    setNr: (next: number) => void;
    /** Navigation object for screen transitions */
    navigation: entryMain['navigation'];
};

/**
 * Onboarding entry template component
 * 
 * Renders a carousel-style onboarding experience with:
 * - Animated image slides with fade transitions
 * - Progress indicators (dots)
 * - Navigation controls (Skip/Next/Login buttons)
 * - Brand logo and content text
 * 
 * @param props - Component props containing slide state and navigation
 * @returns JSX element representing the onboarding template
 */
export const EntryTemplate = ({ Nr, setNr, navigation }: EntryTemplateProps): ReactElement => {
    // Determine slide position for conditional rendering
    const isFirstSlide = Nr === 0;
    const isLastSlide = Nr >= EntryList.length - 1;

    return (
        <View style={styles.back}>
            {/* Main image section with conditional layout */}
            <View style={isFirstSlide ? { flex: 1 } : styles.mainImageContainer}>
                <View style={styles.imageWrapper}>
                    {/* Animated image with fade transition */}
                    <FadeSlideIn trigger={Nr} style={styles.mainImage}>
                        <Image
                            source={{ uri: ImagesAssets(EntryList[Nr].image) }}
                            accessibilityLabel={`Entry${Nr}`}
                            style={styles.mainImage}
                            resizeMode="stretch"
                        />
                    </FadeSlideIn>
                    {/* Bottom gradient overlay for text readability */}
                    <BottomGradient height={180} />
                </View>
            </View>

            {/* Content section with logo, text, and controls */}
            <View style={{ padding: aliasTokens.spacing.Large }}>
                {/* Brand header */}
                <View style={aliasTokens.basic.dFlexLeft}>
                    <LogoImage style={{
                        width: 32,
                        height: 32
                    }} />
                    <Text style={styles.titleText}>Pipeline</Text>
                </View>

                {/* Slide content text */}
                <Text style={styles.mainText}>{EntryList[Nr].content}</Text>

                {/* Navigation controls */}
                <View style={aliasTokens.basic.dFlexBetween}>
                    {/* Progress indicators */}
                    <Dots total={EntryList.length} count={Nr} />

                    {/* Action buttons */}
                    <View style={aliasTokens.basic.dFlexBetween}>
                        <Button
                            title="Skip"
                            variant="dark"
                            style={styles.defaultButton}
                            onPress={() => navigation.navigate('Gateway')}
                        />
                        <Button
                            title={isLastSlide ? "Login" : "Next"}
                            variant="primary"
                            style={styles.defaultButton}
                            onPress={() => isLastSlide ? navigation.navigate('Gateway') : setNr(Nr + 1)}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

// Component styles using design system tokens
const styles = StyleSheet.create({
    // Main container with inverse background
    back: {
        backgroundColor: aliasTokens.color.background.Inverse,
        flex: 1
    },

    // Brand title styling
    titleText: {
        ...aliasTokens.typography.entryText,
        color: aliasTokens.color.text.InversePrimary,
        marginLeft: aliasTokens.spacing.XSmall
    },

    // Main content text styling
    mainText: {
        ...aliasTokens.typography.display.Medium,
        color: aliasTokens.color.text.InversePrimary,
        marginTop: aliasTokens.spacing.Small,
        marginBottom: aliasTokens.spacing.XXLarge
    },

    // Navigation button styling
    defaultButton: {
        width: 100,
        height: 48,
        borderRadius: aliasTokens.borderRadius.Default,
        marginLeft: aliasTokens.spacing.Small
    },

    // Image container with padding for non-first slides
    mainImageContainer: {
        flex: 1,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 80,
    },

    // Full-size image styling
    mainImage: {
        ...aliasTokens.sizes.allFullSize,
    },

    // Image wrapper with relative positioning
    imageWrapper: {
        position: "relative",
        ...aliasTokens.sizes.allFullSize
    },
});