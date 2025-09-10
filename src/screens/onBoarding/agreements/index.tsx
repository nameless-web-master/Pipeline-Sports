import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { aliasTokens } from '../../../theme/alias';
import { LogoImage } from '../../../components/Logo';
import Button from '../../../components/Button';
import { COMMUNITY_COMMITMENT } from '../../../strings';
import type { CommunityCommitmentScreen as CommunityCommitmentScreenProps } from '../../../types/navigation';

/**
 * Community Commitment Agreement Screen
 * 
 * This screen displays the community commitment agreement that users must agree to
 * before continuing with the onboarding process. It includes:
 * - Logo at the top
 * - Title and main heading
 * - Introduction text
 * - Three commitment statements
 * - "Agree and continue" button
 * 
 * The design follows a clean, modern layout with proper spacing and typography
 * that matches the app's design system.
 */
const CommunityCommitmentScreen: React.FC<CommunityCommitmentScreenProps> = ({ navigation }) => {
    /**
     * Handle the "Agree and continue" button press
     * Navigates to the notification permission screen
     */
    const handleAgreeAndContinue = () => {
        console.log('User agreed to community commitment');
        navigation.navigate('NotificationScreen');
    };

    return (
        <SafeAreaView style={aliasTokens.container.bodyPadding}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <LogoImage style={{ width: 29, height: 29 }} />
                </View>

                {/* Title */}
                <Text style={styles.title}>
                    {COMMUNITY_COMMITMENT.title}
                </Text>

                {/* Main Heading */}
                <Text style={styles.heading}>
                    {COMMUNITY_COMMITMENT.heading}
                </Text>

                {/* Introduction Text */}
                <Text style={styles.text}>
                    {COMMUNITY_COMMITMENT.intro}
                </Text>

                {/* Commitment Statements */}
                <View style={styles.commitmentsContainer}>
                    {COMMUNITY_COMMITMENT.commitments.map((commitment, index) => (
                        <Text key={index} style={styles.text}>
                            {commitment}
                        </Text>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View>
                <Button
                    title={COMMUNITY_COMMITMENT.buttonText}
                    onPress={handleAgreeAndContinue}
                    variant="primary"
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    logoContainer: {
        marginBottom: aliasTokens.spacing.Medium,
    },
    title: {
        ...aliasTokens.typography.title.XSmall,
        color: aliasTokens.color.text.Primary,
        marginBottom: aliasTokens.spacing.Small,
        fontWeight: 500
    },
    heading: {
        ...aliasTokens.typography.title.Large,
        color: aliasTokens.color.text.Primary,
        marginBottom: aliasTokens.spacing.Medium,
        letterSpacing: -.25
    },
    text: {
        ...aliasTokens.typography.body.Medium,
        color: aliasTokens.color.text.Secondary,
        fontSize: 14,
        marginBottom: 24,
    },
    commitmentsContainer: {
        marginBottom: aliasTokens.spacing.XLarge,
    },
});

export default CommunityCommitmentScreen;
