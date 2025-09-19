import React from "react";
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ImagesAssets } from "../assets";
import { aliasTokens } from "../theme/alias";

/**
 * Logo component for general use throughout the app
 * Displays a small version of the Pipeline logo (32x32)
 * 
 * @returns JSX.Element - Small logo image component
 */

interface LogoImageProps {
    style?: StyleProp<ImageStyle>
}

export const LogoImage: React.FC<LogoImageProps> = ({ style }): React.JSX.Element => (
    <View
        style={[
            style ? style : {
                width: 50, height: 50,
            }, styles.smallLogo
        ]}
    >
        <Image
            source={{ uri: ImagesAssets('Logo') }}
            accessibilityLabel="Pipeline logo"
            style={{ width: "60%", height: "60%" }}
            resizeMode="contain"
        />
    </View>
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
        source={{ uri: ImagesAssets('Logo') }}
        accessibilityLabel="Pipeline home logo"
        style={[{ width: 120, height: 120 }, style]}
        resizeMode="contain"
    />
);

const styles = StyleSheet.create({
    smallLogo: {
        ...aliasTokens.basic.dFlexCenter,
        backgroundColor: aliasTokens.color.background.Home,
        borderRadius: "30%",
    }
});