import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { aliasTokens } from '../theme/alias';

// Bottom-attached gradient overlay, defaults to transparent -> inverse background.
// Used to improve text contrast over images at the bottom.

type BottomGradientProps = {
  height?: number;
  colors?: Readonly<[string, string, ...string[]]>;
  locations?: Readonly<[number, number, ...number[]]>;
  style?: ViewStyle;
};

const BottomGradient: React.FC<BottomGradientProps> = ({
  height = 180,
  colors = ['transparent', aliasTokens.color.background.Inverse] as const,
  locations = [0, 1] as const,
  style,
}) => {
  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      style={[styles.bottomGradient, { height }, style]}
    />
  );
};

const styles = StyleSheet.create({
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default BottomGradient;
