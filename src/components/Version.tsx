import { StyleSheet, Text, View } from "react-native"
import { aliasTokens } from "../theme/alias";

/**
 * Version component
 * Displays the current version of the application.
 */
export const Version = () => {
    return (
        <View style={styles.versionContainer}>
            <Text style={styles.versionText}>
                Version 0.0.1
            </Text>
        </View>
    );
};

// Style definitions for the Version component
const styles = StyleSheet.create({
    versionContainer: {
        // Applies flexbox centering and background styling
        ...aliasTokens.basic.dFlexCenter,
        backgroundColor: aliasTokens.color.background.Tertiary,
        paddingVertical: aliasTokens.spacing.Large
    },
    versionText: {
        // Applies small label typography and secondary text color
        ...aliasTokens.typography.labelText.Small,
        color: aliasTokens.color.text.Secondary
    }
});
