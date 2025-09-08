import React, { ReactElement } from 'react';
import { Text, StyleSheet, GestureResponderEvent, TextStyle } from 'react-native';
import { aliasTokens } from '../theme/alias';

type LegalTextProps = {
    style?: TextStyle;
    onPressTerms?: (event: GestureResponderEvent) => void;
    onPressPrivacy?: (event: GestureResponderEvent) => void;
};

const LegalText = ({ style, onPressTerms, onPressPrivacy }: LegalTextProps): ReactElement => {
    return (
        <Text style={[styles.legal, style]}
            accessibilityRole="text"
            accessible
        >
            By proceeding, you acknowledge and agree to our
            <Text style={styles.link} onPress={onPressTerms}> Terms</Text>
            <Text> and</Text>
            <Text style={styles.link} onPress={onPressPrivacy}> Privacy Policy</Text>
            <Text>.</Text>
        </Text>
    );
};

const styles = StyleSheet.create({
    legal: {
        ...aliasTokens.typography.body.XSmall,
        color: aliasTokens.color.text.Tertiary,
        textAlign: 'center',
        marginTop: aliasTokens.spacing.Large,
        marginHorizontal: 29
    },
    link: {
        color: aliasTokens.color.brand.Primary,
    },
});

export default LegalText;


