import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { aliasTokens } from '../../../../theme/alias';
import ChipSelectable from '../../../../components/ChipSelectable';
import { INTERESTS } from '../../../../strings';

/**
 * Onboarding: Interests selection screen
 *
 * Builds the layout shown in the provided mock using existing components.
 * - Uses `ChipSelectable` for each interest item
 * - Uses `Button` for the bottom CTA
 * - Wraps chips so they flow naturally across lines regardless of screen size
 */

interface SetInterestProps {
    /** Currently selected interests */
    selectedInterests: Set<string>;
    /** Handler for when interests selection changes */
    onInterestsChange: (interests: Set<string>) => void;
    /** Notify parent whether this step is currently valid to proceed. */
    onValidityChange?: (isValid: boolean) => void;
}

const SetInterest: React.FC<SetInterestProps> = ({ 
    selectedInterests, 
    onInterestsChange, 
    onValidityChange 
}) => {

    // Call onValidityChange on first render to set initial validity state
    useEffect(() => {
        onValidityChange?.(selectedInterests.size > 0);
    }, []); // Empty dependency array means this runs only on mount

    const toggle = (label: string) => {
        const draft = new Set(selectedInterests);
        if (draft.has(label)) {
            draft.delete(label);
        } else {
            draft.add(label);
        }
        onInterestsChange(draft);
        onValidityChange?.(draft.size > 0);
    };

    return (
        <View style={styles.container}>
            {/* Content scrolls if needed; bottom action remains visible */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Title and helper text */}
                <Text style={styles.subtitle}>Please select at least one.</Text>

                {/* Chips grid */}
                <View style={styles.chipsWrap}>
                    {INTERESTS.map(label => (
                        <View key={label}>
                            <ChipSelectable
                                label={label}
                                variant="outline"
                                size="medium"
                                selected={selectedInterests.has(label)}
                                onPress={() => toggle(label)}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom CTA is centralized in parent; button removed here. */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: aliasTokens.color.background.Primary,
    },
    scrollContent: {
        paddingTop: aliasTokens.spacing.XSmall,
        paddingBottom: aliasTokens.spacing.Large,
    },
    subtitle: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
        marginBottom: aliasTokens.spacing.Large,
        textAlign: 'center'
    },
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: aliasTokens.spacing.Small
    },
});

export default SetInterest;


