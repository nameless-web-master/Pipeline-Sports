import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, PencilLine } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';

interface FloatingActionButtonProps {
  onPress?: () => void;
  icon?: React.ReactNode;
  iconType?: 'plus' | 'pencil-line' | 'custom';
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  iconType = 'plus',
  size = 'large',
  position = 'bottom-right'
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return aliasTokens.sizes.Medium;
      case 'medium':
        return aliasTokens.sizes.Large;
      case 'large':
        return aliasTokens.sizes.XLarge;
      default:
        return aliasTokens.sizes.XLarge;
    }
  };

  const getPosition = () => {
    const sizeValue = getSize();
    const margin = aliasTokens.spacing.Medium;
    const appBarHeight = 95; // Approximate height of AppBar
    
    switch (position) {
      case 'bottom-left':
        return {
          bottom: margin + appBarHeight,
          left: margin,
        };
      case 'top-right':
        return {
          top: margin,
          right: margin,
        };
      case 'top-left':
        return {
          top: margin,
          left: margin,
        };
      case 'bottom-right':
      default:
        return {
          bottom: margin + appBarHeight,
          right: margin,
        };
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    
    switch (iconType) {
      case 'pencil-line':
        return (
          <PencilLine 
            size={24} 
            color={aliasTokens.color.text.InversePrimary}
            strokeWidth={2}
          />
        );
      case 'plus':
      default:
        return (
          <Plus 
            size={24} 
            color={aliasTokens.color.text.InversePrimary}
            strokeWidth={2}
          />
        );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: getSize(),
          height: getSize(),
          borderRadius: getSize() / 2,
          ...getPosition(),
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {getIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: aliasTokens.color.brand.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default FloatingActionButton; 