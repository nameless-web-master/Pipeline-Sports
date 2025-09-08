import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    View,
    ViewStyle,
    StyleProp,
} from 'react-native';
import { aliasTokens } from '../theme/alias';

interface DotsProps {
    total: number;
    count: number; // selected index (0-based)
}

const Dots: React.FC<DotsProps> = ({ total, count }) => {
    // Initialize animations once with refs
    const animations = useRef<Animated.Value[]>(
        Array.from({ length: total }, (_, index) =>
            new Animated.Value(index === count ? 1 : 0)
        )
    ).current;

    // Animate on count change
    useEffect(() => {
        animations.forEach((anim, index) => {
            Animated.timing(anim, {
                toValue: index === count ? 1 : 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });
    }, [count]);

    return (
        <View style={styles.container}>
            {animations.map((anim, index) => {
                const backgroundColor = anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                        aliasTokens.color.dot.inactive,
                        aliasTokens.color.dot.active,
                    ],
                });

                const scale = anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                });

                const animatedStyle: Animated.WithAnimatedValue<ViewStyle> = {
                    backgroundColor,
                    transform: [{ scale }],
                };

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            animatedStyle,
                            index !== total - 1 && styles.dotSpacing,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: index === count }}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    dot: {
        width: aliasTokens.sizes.XXTiny,
        height: aliasTokens.sizes.XXTiny,
        borderRadius: aliasTokens.sizes.XXTiny,
    },
    dotSpacing: {
        marginRight: aliasTokens.spacing.XXSmall,
    },
});

export default Dots;
