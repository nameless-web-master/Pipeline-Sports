import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { aliasTokens } from '../../../../theme/alias';
import ChipSelectable from '../../../../components/ChipSelectable';
import Button from '../../../../components/Button';
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
    /** Invoked when the user taps Continue. Receives the selected interests. */
    onNext?: (selected: string[]) => void;
}

const SetInterest: React.FC<SetInterestProps> = ({ onNext }) => {
    // Store selected interests as a Set for O(1) add/remove/lookup
    const [selected, setSelected] = React.useState<Set<string>>(new Set());

    const toggle = (label: string) => {
        setSelected(prev => {
            const draft = new Set(prev);
            if (draft.has(label)) draft.delete(label); else draft.add(label);
            return draft;
        });
    };

    const handleContinue = () => {
        onNext?.(Array.from(selected));
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
                                selected={selected.has(label)}
                                onPress={() => toggle(label)}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View>
                <Button
                    title="Continue"
                    onPress={handleContinue}
                    disabled={selected.size === 0}
                />
            </View>
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


