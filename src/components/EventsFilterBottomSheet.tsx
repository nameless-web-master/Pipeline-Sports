import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import ChipSelectable from './ChipSelectable';
import Button from './Button';
import { aliasTokens } from '../theme/alias';

interface EventsFilterBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  sport?: string[];
  ageGroup?: string[];
}

const EventsFilterBottomSheet: React.FC<EventsFilterBottomSheetProps> = ({
  isVisible,
  onClose,
  onApplyFilters,
  initialFilters = {},
}) => {
  const [selectedSport, setSelectedSport] = useState<string[]>(initialFilters.sport || []);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string[]>(initialFilters.ageGroup || []);
  const slideAnim = useRef(new Animated.Value(0)).current;

  console.log('🔍 EventsFilterBottomSheet render:', { isVisible, selectedSport, selectedAgeGroup });

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleReset = () => {
    console.log('🔄 Reset pressed');
    setSelectedSport([]);
    setSelectedAgeGroup([]);
  };

  const handleFilter = () => {
    console.log('🎯 Filter pressed:', { selectedSport, selectedAgeGroup });
    onApplyFilters({
      sport: selectedSport.length > 0 ? selectedSport : undefined,
      ageGroup: selectedAgeGroup.length > 0 ? selectedAgeGroup : undefined,
    });
    
    // Close with animation like AccountBottomSheet
    handleClose();
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleSportPress = (sport: string) => {
    console.log('⚾ Sport pressed:', sport);
    setSelectedSport(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const handleAgePress = (age: string) => {
    console.log('🏷️ Age pressed:', age);
    setSelectedAgeGroup(prev => 
      prev.includes(age) 
        ? prev.filter(a => a !== age)
        : [...prev, age]
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Modal 
      visible={isVisible} 
      transparent 
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1}
          onPress={() => {
            console.log('👆 Backdrop pressed');
            handleClose();
          }}
        />
        <Animated.View 
          style={[
            styles.bottomSheet,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                })
              }]
            }
          ]}
        >
          {/* Handle */}
          <View style={styles.handleBar} />
          
          {/* Test Title */}
          <Text style={styles.testTitle}>Events Filters</Text>
          
          {/* Sport Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Sport</Text>
            <View style={styles.chipRow}>
              <ChipSelectable
                label="Baseball"
                variant="outline"
                size="medium"
                selected={selectedSport.includes('Baseball')}
                onPress={() => handleSportPress('Baseball')}
              />
              
              <ChipSelectable
                label="Softball"
                variant="outline"
                size="medium"
                selected={selectedSport.includes('Softball')}
                onPress={() => handleSportPress('Softball')}
              />
            </View>
          </View>

          {/* Age Group Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Age Group</Text>
            <View style={styles.chipRow}>
              {['6U', '7U', '8U', '9U', '10U'].map((age) => (
                <ChipSelectable
                  key={age}
                  label={age}
                  variant="outline"
                  size="medium"
                  selected={selectedAgeGroup.includes(age)}
                  onPress={() => handleAgePress(age)}
                />
              ))}
            </View>
            <View style={styles.chipRow}>
              {['11U', '12U', '13U', '14U', '15U'].map((age) => (
                <ChipSelectable
                  key={age}
                  label={age}
                  variant="outline"
                  size="medium"
                  selected={selectedAgeGroup.includes(age)}
                  onPress={() => handleAgePress(age)}
                />
              ))}
            </View>
            <View style={styles.chipRow}>
              {['16U', '17U', '18U', '18O'].map((age) => (
                <ChipSelectable
                  key={age}
                  label={age}
                  variant="outline"
                  size="medium"
                  selected={selectedAgeGroup.includes(age)}
                  onPress={() => handleAgePress(age)}
                />
              ))}
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Reset"
              variant="outline"
              onPress={handleReset}
              style={styles.button}
            />
            <Button
              title="Filter"
              variant="primary"
              onPress={handleFilter}
              style={styles.button}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  handleBar: {
    width: 52,
    height: 4,
    backgroundColor: '#cfd8dc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f161a',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...aliasTokens.typography.labelText.Medium,
    color: aliasTokens.color.text.Primary,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: aliasTokens.spacing.Small,
  },
  button: {
    flex: 1,
  },
});

export default EventsFilterBottomSheet; 