import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { aliasTokens } from '../theme/alias';

/**
 * Props interface for CircleIcon component
 */
interface CircleIconProps {
  /** Render mode: 'image' displays an Image, 'icon' uses @expo/vector-icons */
  type?: 'image' | 'icon';

  /** Image source - can be a URI string or require() object (when type is 'image') */
  source?: { uri: string } | number;

  /** Icon name from selected library (when type is 'icon') */
  iconName?: string;

  /** Icon library to use (limited set for tree-shaking) */
  iconLibrary?: 'Feather' | 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'FontAwesome5';

  /** Optional style variant for specific libraries (currently FontAwesome5) */
  iconVariant?: 'regular' | 'solid' | 'brands';

  /** Icon color (only for vector icons) */
  iconColor?: string;

  /** Size of the inner glyph (image or icon) in pixels (default: 40) */
  iconSize?: number;

  /** Size of the circular background in pixels (default: 100) */
  circleSize?: number;

  /** Background color of the circle (default: secondary background) */
  backgroundColor?: string;

  /** Additional styles for the container */
  containerStyle?: ViewStyle;

  /** Additional styles for the image */
  imageStyle?: ImageStyle;

  /** Image resize mode (default: 'contain') */
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';
}

/**
 * CircleIcon Component
 * 
 * A reusable component that displays an icon inside a circular background.
 * Perfect for displaying status icons, feature icons, or any visual indicators
 * that need to be contained within a circular shape.
 * 
 * Features:
 * - Customizable icon and circle sizes
 * - Flexible background colors
 * - Consistent styling with design system
 * - Support for both URI and local image sources
 * - Customizable resize modes
 * 
 * @param props - CircleIconProps containing all configuration options
 * @returns JSX element representing the circular icon
 * 
 * @example
 * // Basic usage with URI image
 * <CircleIcon source={{ uri: ImagesAssets('Email') }} />
 * 
 * @example
 * // Custom size and background
 * <CircleIcon 
 *   source={{ uri: ImagesAssets('BellRing') }}
 *   iconSize={50}
 *   circleSize={120}
 *   backgroundColor={aliasTokens.color.semantic.danger.Light}
 * />
 * 
 * @example
 * // With custom styles
 * <CircleIcon 
 *   source={{ uri: ImagesAssets('Profile') }}
 *   containerStyle={{ marginBottom: 20 }}
 *   imageStyle={{ tintColor: 'blue' }}
 * />
 */
const CircleIcon: React.FC<CircleIconProps> = ({
  type = 'image',
  source,
  iconName,
  iconLibrary = 'Feather',
  iconVariant,
  iconColor = aliasTokens.color.text.Primary,
  iconSize = 40,
  circleSize = 100,
  backgroundColor = aliasTokens.color.background.Secondary,
  containerStyle,
  imageStyle,
  resizeMode = 'contain',
}) => {
  /**
   * Selects the icon component from the chosen library
   */
  const renderVectorIcon = () => {
    if (!iconName) return null;

    switch (iconLibrary) {
      case 'Ionicons':
        return <Ionicons name={iconName as never} size={iconSize} color={iconColor} />;
      case 'MaterialIcons':
        return <MaterialIcons name={iconName as never} size={iconSize} color={iconColor} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconName as never} size={iconSize} color={iconColor} />;
      case 'FontAwesome5': {
        const solid = iconVariant === 'solid';
        const brand = iconVariant === 'brands';
        return (
          <FontAwesome5
            name={iconName as never}
            size={iconSize}
            color={iconColor}
            solid={solid as never}
            brand={brand as never}
          />
        );
      }
      case 'Feather':
      default:
        return <Feather name={iconName as never} size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View style={[
      styles.container,
      {
        width: circleSize,
        height: circleSize,
        backgroundColor,
      },
      containerStyle,
    ]}>
      {type === 'icon' ? (
        renderVectorIcon()
      ) : (
        <Image
          source={source as NonNullable<CircleIconProps['source']>}
          style={[
            styles.image,
            {
              width: iconSize,
              height: iconSize,
            },
            imageStyle,
          ]}
          resizeMode={resizeMode}
        />
      )}
    </View>
  );
};

/**
 * Component styles using design system tokens
 */
const styles = StyleSheet.create({
  /**
   * Main container for the circular icon
   * - Uses flexbox for centering
   * - Applies full border radius for perfect circle
   * - Centers content both horizontally and vertically
   */
  container: {
    ...aliasTokens.basic.dFlexCenter,
    borderRadius: aliasTokens.borderRadius.Full,
  },

  /**
   * Image styling
   * - Ensures proper image display within the circle
   * - Maintains aspect ratio with resizeMode
   */
  image: {
    // Additional image-specific styles can be added here if needed
  },
});

export default CircleIcon;
