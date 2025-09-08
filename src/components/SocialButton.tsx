import React, { ReactElement } from 'react';
import { Pressable, Image, Text, StyleSheet } from 'react-native';
import { aliasTokens } from '../theme/alias';

/**
 * Props for social auth button
 */
export type SocialButtonProps = {
    /** Button label */
    title: string;
    /** Remote icon URI for the provider */
    iconUri: string;
    /** Press handler */
    onPress: () => void;
};

/**
 * Compact social sign-in button with icon and pressed feedback.
 */
const SocialButton = ({ title, iconUri, onPress }: SocialButtonProps): ReactElement => {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.socialBtn, pressed && styles.socialPressed]}>
            <Image source={{ uri: iconUri }} style={styles.socialIcon} />
            <Text style={styles.socialText}>{title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    socialBtn: {
        height: aliasTokens.sizes.Medium,
        borderRadius: aliasTokens.borderRadius.Default,
        borderWidth: 1,
        borderColor: aliasTokens.color.border.Default,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: aliasTokens.color.background.Primary,
        // marginBottom: aliasTokens.spacing.Small,
    },
    socialIcon: {
        width: 22,
        height: 22,
        marginRight: aliasTokens.spacing.Small,
        resizeMode: 'contain',
    },
    socialPressed: {
        backgroundColor: aliasTokens.button.ghost.fillPressed,
    },
    socialText: {
        ...aliasTokens.typography.buttonText.Default,
        color: aliasTokens.color.text.Primary,
    },
});

export default SocialButton;


