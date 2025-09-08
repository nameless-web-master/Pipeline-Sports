import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Plus } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';

export type IconButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'outline' 
  | 'ghost' 
  | 'ghostInverse';

interface IconButtonProps {
  variant?: IconButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ComponentType<{ size: number; color: string }>;
}

const IconButton: React.FC<IconButtonProps> = ({
  variant = 'primary',
  onPress,
  disabled = false,
  style,
  icon: Icon = Plus,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: aliasTokens.color.brand.Primary, // #1660f2
          borderColor: aliasTokens.color.brand.Primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: '#e8effe', // Light blue from design
          borderColor: '#e8effe',
        };
      case 'tertiary':
        return {
          ...baseStyle,
          backgroundColor: aliasTokens.color.background.Tertiary, // #f3f5f5
          borderColor: aliasTokens.color.background.Tertiary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: aliasTokens.color.background.Primary, // White
          borderColor: aliasTokens.color.border.Default, // #cfd8dc
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'ghostInverse':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getIconColor = (): string => {
    switch (variant) {
      case 'primary':
        return aliasTokens.color.text.InversePrimary; // White
      case 'secondary':
        return aliasTokens.color.text.Primary; // Dark
      case 'tertiary':
        return aliasTokens.color.text.Primary; // Dark
      case 'outline':
        return aliasTokens.color.text.Primary; // Dark
      case 'ghost':
        return aliasTokens.color.text.Primary; // Dark
      case 'ghostInverse':
        return aliasTokens.color.text.InversePrimary; // White
      default:
        return aliasTokens.color.text.Primary;
    }
  };

  const iconSize = aliasTokens.sizes.XXSmall; // 24px icon

  const buttonStyle = [
    getButtonStyle(),
    disabled && styles.disabled,
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Icon 
        size={iconSize} 
        color={getIconColor()} 
        strokeWidth={2}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    width: aliasTokens.sizes.Small, // 42px button size
    height: aliasTokens.sizes.Small,
    borderRadius: 100, // Fully rounded (Border Radius/Full)
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default IconButton; 