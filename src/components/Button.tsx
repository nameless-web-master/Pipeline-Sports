import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, GestureResponderEvent, Animated, StyleProp } from 'react-native';
import { aliasTokens } from '../theme/alias';

/**
 * Visual variants supported by the Button component.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'danger' | 'ghost' | 'dark';

/**
 * Props for the Button component
 */
interface ButtonProps {
  /** Button label text */
  title: string;
  /** Callback fired on press */
  onPress: (event: GestureResponderEvent) => void;
  /** Visual style variant (default: 'primary') */
  variant?: ButtonVariant;
  /** Disable interactions and apply disabled styles */
  disabled?: boolean;
  /** Optional style overrides for the container */
  style?: StyleProp<ViewStyle>;
  /** Optional style overrides for the label */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * A theme-aware button with pressed-state animation and variant-driven styles.
 */
const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', disabled = false, style, textStyle }) => {
  const [pressed, setPressed] = React.useState(false);
  const backgroundColorAnim = React.useRef(new Animated.Value(0)).current;

  // Map variant and pressed state to color tokens
  const getBackgroundColor = () => {
    if (disabled) {
      return aliasTokens.button.primary.fillDisabled;
    }
    if (variant === 'danger') return aliasTokens.color.text.Error;
    if (variant === 'ghost') return pressed ? aliasTokens.button.ghost.fillPressed : aliasTokens.button.ghost.fillEnabled;
    if (variant === 'primary' || variant === 'secondary' || variant === 'tertiary' || variant === 'outline') {
      return pressed ? aliasTokens.button[variant].fillPressed : aliasTokens.button[variant].fillEnabled;
    }
    return aliasTokens.button.primary.fillEnabled;
  };
  const getBorderColor = () => {
    if (disabled) {
      return aliasTokens.button.primary.borderDisabled;
    }
    if (variant === 'danger') return 'transparent';
    if (variant === 'dark') return aliasTokens.color.text.Dark;
    if (variant === 'ghost') return pressed ? aliasTokens.button.ghost.borderPressed : aliasTokens.button.ghost.borderEnabled;
    if (variant === 'primary' || variant === 'secondary' || variant === 'tertiary' || variant === 'outline') {
      return pressed ? aliasTokens.button[variant].borderPressed : aliasTokens.button[variant].borderEnabled;
    }
    return aliasTokens.button.primary.borderEnabled;
  };
  const getTextColor = () => {
    if (disabled) {
      return aliasTokens.button.primary.textDisabled;
    }
    if (variant === 'primary' || variant === 'danger' || variant === 'dark') return aliasTokens.color.text.InversePrimary;
    if (variant === 'secondary' || variant === 'ghost') return aliasTokens.color.brand.Primary;
    if (variant === 'outline') return aliasTokens.color.text.Primary;
    if (variant === 'tertiary') return aliasTokens.color.brand.Primary;
    return aliasTokens.color.text.Primary;
  };
  /**
   * Interpolated background color used for press-in/out animation
   */
  const getAnimatedBackgroundColor = () => {
    if (disabled) {
      return aliasTokens.button.primary.fillDisabled;
    }
    if (variant === 'danger') return aliasTokens.color.text.Error;
    if (variant === 'dark') return aliasTokens.color.text.Dark;

    if (variant === 'primary' || variant === 'secondary' || variant === 'tertiary' || variant === 'outline') {
      const enabledColor = aliasTokens.button[variant].fillEnabled;
      const pressedColor = aliasTokens.button[variant].fillPressed;

      return backgroundColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [enabledColor, pressedColor],
      });
    }

    // Default for other variants
    return aliasTokens.button.primary.fillEnabled;
  };

  /** Animate to pressed state */
  const handlePressIn = () => {
    setPressed(true);
    Animated.timing(backgroundColorAnim, {
      toValue: 1,
      duration: aliasTokens.motion.duration.Base,
      useNativeDriver: false,
    }).start();
  };

  /** Animate back to enabled state */
  const handlePressOut = () => {
    setPressed(false);
    Animated.timing(backgroundColorAnim, {
      toValue: 0,
      duration: aliasTokens.motion.duration.Base,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={[
      styles.base,
      {
        backgroundColor: getAnimatedBackgroundColor(),
        borderColor: getBorderColor(),
        borderWidth: (variant === 'outline' || variant === 'secondary') ? 1 : 0,
      },
      style,
    ]}>
      <Pressable
        style={styles.pressable}
        onPress={onPress}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={[
          styles.text,
          { color: getTextColor() },
          textStyle,
        ]}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    height: aliasTokens.sizes.Medium,
    borderRadius: aliasTokens.borderRadius.Default,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: aliasTokens.spacing.Large,
    flexDirection: 'row',
  },
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...aliasTokens.typography.buttonText.Default,
    textAlign: 'center',
  },
});

export default Button;
