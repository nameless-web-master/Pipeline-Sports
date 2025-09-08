import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { aliasTokens } from '../theme/alias';

interface ButtonTabsProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

interface TabItem {
  name: string;
  label: string;
}

const tabs: TabItem[] = [
  { name: 'all', label: 'All Events' },
  { name: 'tryouts', label: 'Tryouts' },
  { name: 'camps', label: 'Camps' },
];

const ButtonTabs: React.FC<ButtonTabsProps> = ({ activeTab, onTabPress }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={[
            styles.tab,
            activeTab === tab.name ? styles.activeTab : styles.inactiveTab
          ]}
          onPress={() => onTabPress(tab.name)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab.name ? styles.activeTabText : styles.inactiveTabText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: aliasTokens.spacing.Medium,
    gap: aliasTokens.spacing.XSmall,
  },
  tab: {
    paddingHorizontal: aliasTokens.spacing.Medium,
    paddingVertical: 0,
    borderRadius: aliasTokens.borderRadius.Full,
    height: aliasTokens.sizes.XSmall, // 32px
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: aliasTokens.color.brand.Primary,
  },
  inactiveTab: {
    backgroundColor: aliasTokens.color.background.Primary,
    borderColor: aliasTokens.color.border.Default,
    borderWidth: 1,
  },
  tabText: {
    ...aliasTokens.typography.labelText.Medium,
    textAlign: 'center',
  },
  activeTabText: {
    color: aliasTokens.color.text.InversePrimary,
  },
  inactiveTabText: {
    color: aliasTokens.color.text.Primary,
  },
});

export default ButtonTabs; 