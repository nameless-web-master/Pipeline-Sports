import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';

interface BackButtonProps {
  onPress: () => void;
  variant?: 'outline' | 'ghost';
  style?: any;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress, variant = 'outline', style }) => {
  const buttonStyle = variant === 'outline' ? styles.outlineButton : styles.ghostButton;
  const iconColor = variant === 'outline' ? aliasTokens.color.text.Primary : aliasTokens.color.text.InversePrimary;
  
  return (
    <TouchableOpacity 
      style={[buttonStyle, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ArrowLeft 
        size={24} 
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outlineButton: {
    width: aliasTokens.sizes.Small,
    height: aliasTokens.sizes.Small,
    backgroundColor: aliasTokens.button.outline.fillEnabled,
    borderRadius: aliasTokens.borderRadius.Default,
    borderWidth: aliasTokens.borderWidth.Default,
    borderColor: aliasTokens.button.outline.borderEnabled,
    justifyContent: "center",
    alignItems: "center",
  },
  ghostButton: {
    width: aliasTokens.sizes.Small,
    height: aliasTokens.sizes.Small,
    backgroundColor: aliasTokens.button.ghost.fillEnabled,
    borderRadius: aliasTokens.borderRadius.Default,
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BackButton; 