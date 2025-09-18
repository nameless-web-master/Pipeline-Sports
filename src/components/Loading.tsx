import { View } from "react-native"
import { ActivityIndicator, StyleSheet, Text } from "react-native"
import { aliasTokens } from "../theme/alias"

export const LoadingStates = () =>
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={aliasTokens.color.brand.Primary} />
        <Text style={styles.loadingText} >Loading states...</Text>
    </View>;

const styles = StyleSheet.create({
    loadingContainer: {
        ...aliasTokens.sizes.allFullSize,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: aliasTokens.spacing.Large,
        paddingHorizontal: aliasTokens.spacing.Medium,
    },
    loadingText: {
        marginLeft: aliasTokens.spacing.Small,
        fontSize: 14,
        color: aliasTokens.color.text.Secondary,
    }
});