import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { aliasTokens } from '../theme/alias';

interface ProgressBarProps {
  progress: number | Animated.Value; // 0 to 1 or animated value
  style?: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, style }) => {
  const isAnimated = progress instanceof Animated.Value;
  
  if (isAnimated) {
    return (
      <View style={[styles.container, style]}>
        <Animated.View 
          style={[
            styles.progressFill, 
            { 
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              })
            }
          ]} 
        />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.progressFill, { width: `${(progress as number) * 100}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 4,
    backgroundColor: aliasTokens.color.background.Tertiary,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: aliasTokens.color.brand.Primary,
    borderRadius: 100,
    width: '33%', // This will be dynamically set based on progress
  },
});

export default ProgressBar; 