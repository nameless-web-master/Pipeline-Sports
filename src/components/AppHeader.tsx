import React, { useState, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search, X } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';
import { LogoImage } from './Logo';
import { AppHeaderProps } from '../types/props';



const AppHeader: React.FC<AppHeaderProps> = ({
  variant = 'primary',
  onNotificationPress,
  title,
  leftComponent,
  rightComponent,
  searchPlaceholder = 'Search...',
  onSearchChange,
  searchValue = ''
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  const handleSearchChange = (text: string) => {
    setLocalSearchValue(text);
    onSearchChange?.(text);
  };

  const clearSearch = () => {
    setLocalSearchValue('');
    onSearchChange?.('');
  };

  // Search variant
  if (variant === 'search') {
    return (
      <SafeAreaView style={styles.searchContainer} edges={['top']}>
        <View style={styles.searchContent}>
          <View style={styles.searchInputContainer}>
            <Search
              size={24}
              color={aliasTokens.color.text.Primary}
              strokeWidth={2}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor={aliasTokens.color.text.Primary}
              value={localSearchValue}
              onChangeText={handleSearchChange}
            />
            {localSearchValue.length > 0 && (
              <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
                <X
                  size={24}
                  color={aliasTokens.color.text.Primary}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Secondary variant
  if (variant === 'secondary') {
    return (
      <SafeAreaView style={styles.secondaryContainer} edges={['top']}>
        <View style={styles.secondaryContent}>
          {/* Left Component */}
          <View style={styles.leftSection}>
            {leftComponent}
          </View>

          {/* Title */}
          <View style={styles.centerSection}>
            <Text style={styles.secondaryTitle}>{title}</Text>
          </View>

          {/* Right Component */}
          <View style={styles.rightSection}>
            {rightComponent}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Primary variant (default)
  return (
    <SafeAreaView style={styles.primaryContainer} edges={['top']}>
      <View style={styles.primaryContent}>
        {/* Logo and Title Section */}
        <View style={styles.logoAndTitle}>
          <LogoImage style={{
            width: 32,
            height: 32
          }} />
          <Text style={styles.primaryTitle}>Pipeline</Text>
        </View>

        {/* Notification Icon */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Bell
            size={24}
            color={aliasTokens.color.text.InversePrimary}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Primary variant styles
  primaryContainer: {
    backgroundColor: aliasTokens.color.background.Inverse,
  },
  primaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: aliasTokens.spacing.Medium,
    paddingTop: aliasTokens.spacing.Large,
    paddingBottom: aliasTokens.spacing.Small,
  },
  logoAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: aliasTokens.spacing.XSmall,
  },
  primaryTitle: {
    ...aliasTokens.typography.labelText.Medium,
    color: aliasTokens.color.text.InversePrimary,
    fontSize: 16
  },
  notificationButton: {
    width: aliasTokens.sizes.Medium,
    height: aliasTokens.sizes.Medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: aliasTokens.borderRadius.Full,
  },

  // Secondary variant styles
  secondaryContainer: {
    backgroundColor: aliasTokens.color.background.Inverse,
  },
  secondaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: aliasTokens.spacing.Small,
    paddingTop: aliasTokens.spacing.Medium,
    paddingBottom: aliasTokens.spacing.Small,
  },
  leftSection: {
    width: aliasTokens.sizes.Small,
    alignItems: 'flex-start',
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: aliasTokens.spacing.Medium,
    right: aliasTokens.spacing.Medium,
    top: aliasTokens.spacing.Medium,
    bottom: aliasTokens.spacing.Small,
    zIndex: -1,
  },
  rightSection: {
    width: aliasTokens.sizes.Small,
    alignItems: 'flex-end',
  },
  secondaryTitle: {
    ...aliasTokens.typography.labelText.Default,
    color: aliasTokens.color.text.InversePrimary,
    fontSize: 15,
    verticalAlign: 'bottom'
  },

  // Search variant styles
  searchContainer: {
    backgroundColor: aliasTokens.color.background.Inverse,
  },
  searchContent: {
    paddingHorizontal: aliasTokens.spacing.Medium,
    paddingTop: aliasTokens.spacing.Small,
    paddingBottom: aliasTokens.spacing.XSmall,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: aliasTokens.input.FillEnabled,
    borderRadius: aliasTokens.borderRadius.Default,
    paddingHorizontal: aliasTokens.spacing.Small,
    height: aliasTokens.sizes.Medium,
    gap: aliasTokens.spacing.XSmall,
  },
  searchInput: {
    flex: 1,
    ...aliasTokens.typography.inputText.Medium,
    color: aliasTokens.color.text.Primary,
    paddingVertical: 0, // Remove default padding
  },
});

export default AppHeader; 