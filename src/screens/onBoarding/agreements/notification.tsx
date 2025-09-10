import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { GestureResponderEvent } from 'react-native';
import { aliasTokens } from '../../../theme/alias';
import { NOTIFICATION_PERMISSION } from '../../../strings';
import Button from '../../../components/Button';
import CircleIcon from '../../../components/CircleIcon';
import { ImagesAssets } from '../../../assets';

/**
 * Notification Permission Screen
 * 
 * This screen prompts users to enable push notifications for the app.
 * It displays a bell icon, explanatory text, and two action buttons.
 * 
 * Features:
 * - Clean, centered layout matching the design
 * - Bell icon with notification indicators
 * - Clear explanation of notification benefits
 * - Primary action button (Yes, notify me)
 * - Secondary action button (Skip)
 */
const NotificationScreen: React.FC = () => {

  /**
   * Handles the primary action when user agrees to enable notifications
   * This would typically request notification permissions from the system
   */
  const handleEnableNotifications = (event: GestureResponderEvent) => {
    // TODO: Implement notification permission request
    // This would typically call a service to request push notification permissions
    console.log('User agreed to enable notifications');

    // Example implementation:
    // await requestNotificationPermissions();
    // navigate to next screen
  };

  /**
   * Handles the secondary action when user chooses to skip notifications
   * This allows users to continue without enabling notifications
   */
  const handleSkipNotifications = (event: GestureResponderEvent) => {
    // TODO: Navigate to next screen without enabling notifications
    console.log('User chose to skip notifications');

    // Example implementation:
    // navigate to next screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={aliasTokens.color.background.Primary} />

      {/* Main content container */}
      <View style={styles.content}>

        {/* Bell Icon Container */}
        <View style={styles.iconContainer}>
          {/* Bell Icon with circular background */}
          <CircleIcon
            source={{ uri: ImagesAssets('BellRing') }}
            backgroundColor={aliasTokens.color.semantic.danger.Light}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {NOTIFICATION_PERMISSION.title}
        </Text>

        {/* Description Text */}
        <View style={styles.descriptionContainer}>
          {NOTIFICATION_PERMISSION.description.map((text, index) => (
            <Text key={index} style={styles.description}>
              {text}
            </Text>
          ))}
        </View>

        {/* Action Buttons Container */}
        <View style={styles.buttonsContainer}>

          {/* Primary Button - Enable Notifications */}
          <Button
            title={NOTIFICATION_PERMISSION.primaryButtonText}
            onPress={handleEnableNotifications}
            variant="primary"
          />

          {/* Secondary Button - Skip */}
          <Button
            title={NOTIFICATION_PERMISSION.secondaryButtonText}
            onPress={handleSkipNotifications}
            variant="outline"
          />

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: aliasTokens.color.background.Primary,
  },

  content: {
    ...aliasTokens.container.bodyPadding,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  // Icon styling
  iconContainer: {
    marginBottom: aliasTokens.spacing.Large,
    alignItems: 'center',
  },

  // Typography styling
  title: {
    ...aliasTokens.typography.labelText.Medium,
    color: aliasTokens.color.text.Primary,
    textAlign: 'center',
    marginBottom: aliasTokens.spacing.Medium,
    fontSize: 16
  },

  descriptionContainer: {
    marginBottom: aliasTokens.spacing.MaxLarge,
  },

  description: {
    ...aliasTokens.typography.body.Medium,
    color: aliasTokens.color.text.Secondary,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 24,
  },

  // Button styling
  buttonsContainer: {
    width: aliasTokens.sizes.full,
    gap: aliasTokens.spacing.Medium,
    marginTop: 54
  },
});

export default NotificationScreen;
