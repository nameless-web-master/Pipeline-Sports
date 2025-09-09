import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

// Reusable wrapper that fades in and slides content from the right (or top) on trigger changes.
// Defaults match the onboarding animation: opacity 350ms, translate 400ms, start at 20.

type FadeSlideInProps = {
  children: ReactNode;
  trigger: unknown; // changing this value restarts the animation
  style?: StyleProp<ViewStyle>;
  initialTranslate?: number; // px
  opacityDuration?: number; // ms
  translateDuration?: number; // ms
  direction?: 'x' | 'y';
};

const FadeSlideIn: React.FC<FadeSlideInProps> = ({
  children,
  trigger,
  style,
  initialTranslate = 20,
  opacityDuration = 200,
  translateDuration = 250,
  direction = 'y',
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(initialTranslate)).current;

  useEffect(() => {
    opacity.setValue(0);
    translate.setValue(initialTranslate);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: opacityDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: translateDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const animatedStyle: Animated.WithAnimatedValue<ViewStyle> = {
    opacity,
    transform: direction === 'x' ? [{ translateX: translate }] : [{ translateY: translate }],
  };

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};

export default FadeSlideIn;
