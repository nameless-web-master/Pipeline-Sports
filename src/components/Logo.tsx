import React from "react";
import { Image, ImageStyle } from "react-native";
import { ImagesAssets } from "../assets";

/**
 * Logo component for general use throughout the app
 * Displays a small version of the Pipeline logo (32x32)
 * 
 * @returns JSX.Element - Small logo image component
 */
export const LogoImage = (): React.JSX.Element => (
    <Image
        source={{ uri: ImagesAssets('Logo') }}
        accessibilityLabel="Pipeline logo"
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
    />
);

/**
 * Home logo component for main screens and headers
 * Displays a larger version of the Pipeline logo (120x100)
 * 
 * @param style - Optional custom styles to apply to the image
 * @returns JSX.Element - Large logo image component
 */
export const HomeLogo = ({ style }: { style?: ImageStyle }): React.JSX.Element => (
    <Image
        source={{ uri: ImagesAssets('HomeLogo') }}
        accessibilityLabel="Pipeline home logo"
        style={[{ width: 120, height: 100 }, style]}
        resizeMode="contain"
    />
);