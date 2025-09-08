import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { designTokens } from '../theme/base';

const { width, height } = Dimensions.get('window');

interface SplashScreenComponentProps {
  onFinish?: () => void;
}

export const SplashScreenComponent: React.FC<SplashScreenComponentProps> = ({ onFinish }) => {
  useEffect(() => {
    // Set a reasonable timeout for the splash screen
    // This ensures we never get stuck loading indefinitely
    const splashTimeout = setTimeout(() => {
      console.log('⏰ Splash screen timeout reached, finishing...');
      if (onFinish) {
        onFinish();
      }
    }, 2500); // 2.5 seconds maximum

    // Also set a minimum display time for branding
    const minDisplayTimeout = setTimeout(() => {
      console.log('⏳ Minimum splash display time reached');
      // Could add additional logic here if needed
    }, 1000); // 1 second minimum

    // Cleanup timeouts on unmount
    return () => {
      clearTimeout(splashTimeout);
      clearTimeout(minDisplayTimeout);
    };
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/splash.png')} 
        style={styles.image}
        resizeMode="contain"
        onError={() => {
          // If image fails to load, still proceed
          console.warn('Splash image failed to load');
          if (onFinish) {
            onFinish();
          }
        }}
      />
      <View style={styles.loaderContainer}>
        <ActivityIndicator 
          size="large" 
          color={designTokens.colors.white}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.blue[500], // Using blue.500 from design tokens
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  image: {
    width: width * 0.6, // Slightly smaller to make room for loader
    height: height * 0.6,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: height * 0.2, // Position loader at bottom portion of screen
    alignSelf: 'center',
  },
}); 