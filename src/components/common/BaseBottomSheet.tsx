import React, { useRef, useEffect, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { X } from 'lucide-react-native';
import { aliasTokens } from '../../theme/alias';

/**
 * Props for the BaseBottomSheet component
 */
interface BaseBottomSheetProps {
  /** Controls visibility of the bottom sheet */
  visible: boolean;
  /** Callback when the bottom sheet is closed */
  onClose: () => void;
  /** Title displayed at the top of the sheet */
  title?: string;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Custom content to render inside the bottom sheet */
  children: ReactNode;
  /** Custom styles for the container */
  style?: any;
  /** Animation duration for opening */
  openDuration?: number;
  /** Animation duration for closing */
  closeDuration?: number;
}

/**
 * Base bottom sheet component with common functionality
 * Provides consistent animation, styling, and structure for all bottom sheets
 * 
 * Features:
 * - Smooth slide-up animation from bottom
 * - Backdrop tap to close
 * - Consistent styling and layout
 * - Optional title and close button
 */
const BaseBottomSheet: React.FC<BaseBottomSheetProps> = ({
  visible,
  onClose,
  title,
  showCloseButton = true,
  children,
  style,
  openDuration = 300,
  closeDuration = 200,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  /**
   * Animation effect for showing/hiding the bottom sheet
   * Slides up from bottom when visible, slides down when hidden
   */
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: openDuration,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: closeDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, openDuration, closeDuration]);

  /**
   * Handle close with animation
   * Animates the sheet down before calling onClose
   */
  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: closeDuration,
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
      {/* Modal overlay with backdrop */}
      <View style={styles.modalOverlay}>
        {/* Backdrop - tap to close */}
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        {/* Animated bottom sheet container */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0], // Slide up from 400px below
                })
              }]
            },
            style,
          ]}
        >
          {/* Handle bar for visual indication */}
          <View style={styles.handleBar} />

          {/* Header with title and close button */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && <Text style={styles.title}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  activeOpacity={0.7}
                >
                  <X size={24} color={aliasTokens.color.text.Primary} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Custom content area */}
          {children}
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
    zIndex: -1
  },
  modalBackdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: aliasTokens.color.background.Primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: aliasTokens.spacing.Medium,
    paddingBottom: aliasTokens.spacing.Large,
    maxHeight: '85%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  handleBar: {
    width: 52,
    height: 4,
    backgroundColor: aliasTokens.color.border.Default,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: aliasTokens.spacing.XXSmall
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: aliasTokens.spacing.Medium,
  },
  title: {
    ...aliasTokens.typography.labelText.Medium,
    color: aliasTokens.color.text.Primary,
    flex: 1,
    fontSize: 16,
    marginTop: aliasTokens.spacing.Large
  },
  closeButton: {
    padding: aliasTokens.spacing.XSmall,
  },
});

export default BaseBottomSheet;
