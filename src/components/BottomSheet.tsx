import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';
import { aliasTokens } from '../theme/alias';

interface BottomSheetOption {
  label: string;
  value: string;
}

interface BottomSheetProps {
  visible: boolean;
  title?: string;
  options: BottomSheetOption[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  title,
  options,
  onSelect,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 100, // Faster close animation
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleOptionPress = (option: BottomSheetOption) => {
    onSelect(option.value);
    onClose();
  };

  const handleClose = () => {
    // Start fast close animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 100, // Very fast close
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };



  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View 
          style={[
            styles.bottomSheet,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0], // Slide up from bottom
                })
              }]
            }
          ]}
        >
          {/* Handle */}
          <View style={styles.handleBar} />
          
          {/* Content */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {title && (
                <Text style={styles.title}>{title}</Text>
              )}
              
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.option}
                  onPress={() => handleOptionPress(option)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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
    backgroundColor: aliasTokens.color.background.Primary,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  handleBar: {
    width: 52,
    height: 4,
    backgroundColor: aliasTokens.color.border.Default,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 460,
  },
  content: {
    paddingBottom: aliasTokens.spacing.Large,
  },
  title: {
    ...aliasTokens.typography.title.Medium,
    color: aliasTokens.color.text.Primary,
    textAlign: 'center',
    marginBottom: aliasTokens.spacing.Medium,
  },
  option: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  optionText: {
    ...aliasTokens.typography.body.Large,
    color: aliasTokens.color.text.Primary,
    textAlign: 'center',
  },
});

export default BottomSheet; 