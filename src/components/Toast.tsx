import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Modal } from 'react-native';
import { Info, CheckCircle, XCircle } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';

export type ToastType = 'success' | 'info' | 'danger';

interface ToastProps {
  type?: ToastType;
  message: string;
  visible: boolean;
  onClose?: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  type = 'info',
  message,
  visible,
  onClose,
  duration = 4000
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Use consistent native driver settings
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true, // Changed to true for consistency
      }),
    ]).start(() => {
      onClose?.();
    });
  }, [fadeAnim, slideAnim, onClose]);

  const showToast = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Use consistent native driver settings
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true, // Changed to true for consistency
      }),
    ]).start();

    // Auto hide after duration
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    }
  }, [fadeAnim, slideAnim, duration, hideToast]);

  useEffect(() => {
    if (visible) {
      showToast();
    } else {
      hideToast();
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [visible, showToast, hideToast]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: aliasTokens.color.semantic.success.Default,
          IconComponent: CheckCircle,
        };
      case 'danger':
        return {
          backgroundColor: aliasTokens.color.semantic.danger.Default,
          IconComponent: XCircle,
        };
      case 'info':
      default:
        return {
          backgroundColor: aliasTokens.color.semantic.info.Default,
          IconComponent: Info,
        };
    }
  };

  const toastStyles = getToastStyles();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: toastStyles.backgroundColor,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.content}
            onPress={hideToast}
            activeOpacity={0.8}
          >
            <toastStyles.IconComponent
              size={22}
              color={aliasTokens.color.text.InversePrimary}
              style={styles.icon}
            />
            <Text style={styles.message}>{message}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    bottom: 60,
    left: aliasTokens.spacing.Large,
    right: aliasTokens.spacing.Large,
    borderRadius: aliasTokens.borderRadius.Default,
    paddingHorizontal: aliasTokens.spacing.Medium,
    paddingVertical: aliasTokens.spacing.Small,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: aliasTokens.spacing.Small,
  },
  icon: {
    marginRight: 4,
  },
  message: {
    flex: 1,
    ...aliasTokens.typography.labelText.Medium,
    color: aliasTokens.color.text.InversePrimary,
  },
});

export default Toast; 