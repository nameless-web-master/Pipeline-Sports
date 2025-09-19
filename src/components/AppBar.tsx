import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Home, BookOpen, Presentation, CircleUserRound } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';

interface AppBarProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

interface TabItem {
  name: string;
  label: string;
  icon: React.ReactNode;
  showLabel?: boolean;
}

const AppBar: React.FC<AppBarProps> = ({ activeTab, onTabPress }) => {
  // Animation refs for each tab
  const homeScale = useRef(new Animated.Value(1)).current;
  const directoryScale = useRef(new Animated.Value(1)).current;
  const boardScale = useRef(new Animated.Value(1)).current;
  const profileScale = useRef(new Animated.Value(1)).current;
  const [borderLocation, setBorderLocation] = useState(0);
  const borderLeft = useRef(new Animated.Value(0)).current;

  // Reset all animations when activeTab changes
  useEffect(() => {
    // Reset all scales to 1
    Animated.parallel([
      Animated.timing(homeScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(directoryScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(boardScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(profileScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [activeTab, homeScale, directoryScale, boardScale, profileScale]);

  useEffect(() => {
    const Cnt = tabs.findIndex((_itm, _idx) => _itm.name === activeTab);
    const targetLeft = Cnt * 74;
    setBorderLocation(targetLeft);
    Animated.timing(borderLeft, {
      toValue: targetLeft,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [activeTab, borderLeft])


  const tabs: TabItem[] = [
    {
      name: 'home',
      label: 'Home',
      icon: <Home size={24} color={activeTab === 'home' ? '#1660f2' : '#0f161a'} />,
      showLabel: true,
    },
    {
      name: 'directory',
      label: 'Directory',
      icon: <BookOpen size={24} color={activeTab === 'directory' ? '#1660f2' : '#0f161a'} />,
      showLabel: true,
    },
    {
      name: 'board',
      label: 'Board',
      icon: <Presentation size={24} color={activeTab === 'board' ? '#1660f2' : '#0f161a'} />,
      showLabel: true,
    },
    {
      name: 'profile',
      label: 'Account',
      icon: <CircleUserRound size={24} color={activeTab === 'profile' ? '#1660f2' : '#0f161a'} />,
      showLabel: true,
    }
  ];

  const getTabScale = (tabName: string) => {
    switch (tabName) {
      case 'home': return homeScale;
      case 'directory': return directoryScale;
      case 'board': return boardScale;
      case 'profile': return profileScale;
      default: return homeScale;
    }
  };

  const handleTabPress = (tabName: string) => {
    const scale = getTabScale(tabName);

    // Quick scale animation for tactile feedback
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Handle tab navigation
    onTabPress(tabName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Animated.View style={[styles.topBorder, { left: borderLeft }]} />
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          const scale = getTabScale(tab.name);

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => handleTabPress(tab.name)}
              activeOpacity={1}
              style={styles.tabButton}
            >
              <Animated.View
                style={[
                  styles.tabItem,
                  {
                    transform: [{ scale }]
                  }
                ]}
              >
                <View style={styles.iconContainer}>
                  {tab.icon}
                </View>
                <Text style={[
                  styles.tabLabel,
                  isActive ? styles.activeTabLabel : styles.inactiveTabLabel
                ]}>
                  {tab.label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: aliasTokens.color.background.Primary,
    borderTopWidth: 1,
    borderTopColor: '#cfd8dc',
    ...aliasTokens.basic.dFlexCenter
    // paddingHorizontal: aliasTokens.spacing.Medium,
  },
  tabsContainer: {
    ...aliasTokens.basic.dFlexCenter,
    gap: aliasTokens.spacing.Medium,
    paddingTop: aliasTokens.spacing.Small,
    paddingBottom: aliasTokens.spacing.Large,
  },
  tabButton: {
    // TouchableOpacity wrapper
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 54, // 56px width for each tab
    borderRadius: 12,
    // paddingHorizontal: 4,
    gap: 4, // 4px gap between icon and text
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 14,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#1660f2', // Brand blue from Figma
  },
  inactiveTabLabel: {
    color: '#0f161a', // Dark text from Figma
  },
  topBorder: {
    height: 2,
    width: 56,
    backgroundColor: aliasTokens.color.brand.Primary,
    position: 'absolute',
    top: 0,
  }
});

export default AppBar; 