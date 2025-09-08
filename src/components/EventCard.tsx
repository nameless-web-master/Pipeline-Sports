import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { aliasTokens } from '../theme/alias';
import Chip from './Chip';

interface EventCardProps {
  id: string;
  teamName: string;
  teamLogo?: string;
  sport: string;
  ageGroup: string;
  level: string;
  date: string;
  heroImage?: string;
  onPress?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  teamName,
  teamLogo,
  sport,
  ageGroup,
  level,
  date,
  heroImage,
  onPress
}) => {
  const handlePress = () => {
    onPress?.(id);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.content}>
        {/* Hero Image Section */}
        <View style={styles.heroImageContainer}>
          {heroImage ? (
            <Image source={{ uri: heroImage }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroImagePlaceholder} />
          )}
          
          {/* Date Chip Overlay */}
          <View style={styles.dateChip}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>

        {/* Team Info Section */}
        <View style={styles.teamInfoSection}>
          <View style={styles.teamLogoContainer}>
            {teamLogo ? (
              <Image source={{ uri: teamLogo }} style={styles.teamLogo} resizeMode="cover" />
            ) : (
              <View style={styles.teamLogoPlaceholder} />
            )}
          </View>
          
          <View style={styles.teamDetails}>
            <Text style={styles.teamName}>{teamName}</Text>
            <View style={styles.teamTags}>
              <Chip label={sport} />
              <Chip label={ageGroup} />
              <Chip label={level} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: aliasTokens.color.background.Primary,
    borderRadius: aliasTokens.borderRadius.Default,
    borderWidth: 1,
    borderColor: aliasTokens.color.border.Default,
    marginBottom: aliasTokens.spacing.Small,
    overflow: 'hidden',
  },
  content: {
    padding: aliasTokens.spacing.Small,
    gap: aliasTokens.spacing.Small,
  },
  heroImageContainer: {
    height: 200,
    width: '100%',
    borderRadius: aliasTokens.borderRadius.Small,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: aliasTokens.color.background.Tertiary,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: aliasTokens.color.background.Tertiary,
  },
  dateChip: {
    position: 'absolute',
    top: aliasTokens.spacing.Small,
    right: aliasTokens.spacing.Small,
    backgroundColor: aliasTokens.color.background.Primary,
    paddingHorizontal: aliasTokens.spacing.Small,
    paddingVertical: 0,
    borderRadius: 20,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    ...aliasTokens.typography.labelText.Medium,
    color: aliasTokens.color.text.Primary,
  },
  teamInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: aliasTokens.spacing.Small,
  },
  teamLogoContainer: {
    width: 58,
    height: 58,
    borderRadius: 58 / 2, // Full circle
    overflow: 'hidden',
    backgroundColor: aliasTokens.color.background.Tertiary,
  },
  teamLogo: {
    width: '100%',
    height: '100%',
  },
  teamLogoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: aliasTokens.color.background.Tertiary,
  },
  teamDetails: {
    flex: 1,
    gap: aliasTokens.spacing.XSmall,
  },
  teamName: {
    ...aliasTokens.typography.title.Small,
    color: aliasTokens.color.text.Primary,
  },
  teamTags: {
    flexDirection: 'row',
    gap: aliasTokens.spacing.XSmall,
    flexWrap: 'wrap',
  },
});

export default EventCard; 