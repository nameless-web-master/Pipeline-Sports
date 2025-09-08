import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Home, Globe, CircleUserRound } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

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
  const { user } = useAuth();
  
  // Animation refs for each tab
  const homeScale = useRef(new Animated.Value(1)).current;
  const globeScale = useRef(new Animated.Value(1)).current;
  const profileScale = useRef(new Animated.Value(1)).current;
  
  // Reset all animations when activeTab changes
  useEffect(() => {
    // Reset all scales to 1
    Animated.parallel([
      Animated.timing(homeScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(globeScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(profileScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [activeTab, homeScale, globeScale, profileScale]);



  const tabs: TabItem[] = [
    {
      name: 'home',
      label: 'Home',
      icon: <Home size={24} color={activeTab === 'home' ? '#1660f2' : '#0f161a'} />,
      showLabel: true
    },
    {
      name: 'globe',
      label: 'Events',
      icon: <Globe size={24} color={activeTab === 'globe' ? '#1660f2' : '#0f161a'} />,
      showLabel: true
    },
    {
      name: 'profile',
      label: 'Account',
      icon: <CircleUserRound size={24} color={activeTab === 'profile' ? '#1660f2' : '#0f161a'} />,
      showLabel: true
    }
  ];

  const getTabScale = (tabName: string) => {
    switch (tabName) {
      case 'home': return homeScale;
      case 'globe': return globeScale;
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
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cfd8dc',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 32, // 32px spacing between tabs
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    // TouchableOpacity wrapper
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56, // 56px width for each tab
    height: 50, // 50px height to match design
    borderRadius: 12,
    paddingHorizontal: 4,
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
});

export default AppBar; 