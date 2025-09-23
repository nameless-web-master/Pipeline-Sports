import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  Text
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Plus, Pencil, Check, Undo2 } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';

interface ImageUploaderProps {
  onImageSelected?: (uri: string) => void;
  size?: number;
  style?: any;
  initialImageUri?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  size = 140,
  style,
  initialImageUri
}) => {
  // The committed image shown in the UI and returned via callback
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImageUri || null);
  // A temporary preview image shown in a modal for confirmation
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  // Keep internal state in sync when the initial image uri prop arrives/changes
  useEffect(() => {
    setSelectedImage(initialImageUri || null);
  }, [initialImageUri]);

  // Ask for photo library permission (no-op on web)
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      console.log('ImageUploader: Requesting media library permissions...');
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('ImageUploader: Media library permission status:', status);

        if (status !== 'granted') {
          Alert.alert(
            'Permission needed',
            'Please grant camera roll permissions to upload photos.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Settings', onPress: () => {
                  // On iOS, this will prompt user to go to Settings
                  Alert.alert('Permission Required', 'Please go to Settings > Privacy > Photos and enable access for this app.');
                }
              }
            ]
          );
          return false;
        }
      } catch (error) {
        console.log('ImageUploader: Error requesting permissions:', error);
        Alert.alert('Error', 'Failed to request permissions. Please try again.');
        return false;
      }
    }
    return true;
  };

  // Open system image library and show preview modal (no cropping)
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      console.log('ImageUploader: Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 1
      });

      console.log('ImageUploader: Image picker result:', {
        canceled: result.canceled,
        hasAssets: result.assets && result.assets.length > 0,
        assetsCount: result.assets?.length || 0
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setPreviewImage(imageUri);
        setIsPreviewVisible(true);
      }
    } catch (error) {
      console.log('ImageUploader: Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Open system camera and show preview modal (no cropping)
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('ImageUploader: Camera permission status:', status);

      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Please grant camera permissions to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Settings', onPress: () => {
                Alert.alert('Permission Required', 'Please go to Settings > Privacy > Camera and enable access for this app.');
              }
            }
          ]
        );
        return;
      }
    } catch (error) {
      console.log('ImageUploader: Error requesting camera permissions:', error);
      Alert.alert('Error', 'Failed to request camera permissions. Please try again.');
      return;
    }

    try {
      console.log('ImageUploader: Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.9
      });

      console.log('ImageUploader: Camera result:', {
        canceled: result.canceled,
        hasAssets: result.assets && result.assets.length > 0,
        assetsCount: result.assets?.length || 0
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setPreviewImage(imageUri);
        setIsPreviewVisible(true);
      }
    } catch (error) {
      console.log('ImageUploader: Error taking photo:', error);
      // Defensive fallback for Android emulators or devices without camera app
      Alert.alert(
        'Camera unavailable',
        'Opening your photo library instead.',
        [
          {
            text: 'OK',
            onPress: () => {
              pickImage();
            }
          }
        ]
      );
    }
  };

  // Confirm selection: commit preview image and notify parent
  const confirmPreview = () => {
    if (previewImage) {
      setSelectedImage(previewImage);
      onImageSelected?.(previewImage);
    }
    setIsPreviewVisible(false);
    setPreviewImage(null);
  };

  // Cancel selection: close modal and discard preview
  const cancelPreview = () => {
    setIsPreviewVisible(false);
    setPreviewImage(null);
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add your photo',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: size, height: size },
        style
      ]}
      onPress={showImageOptions}
    >
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.image}
        />
      )}

      {/* Add Photo Button */}
      <View style={styles.addButtonContainer}>
        <View style={styles.addButton}>
          {
            initialImageUri ?
              <Pencil
                size={18}
                color={aliasTokens.color.text.InversePrimary}
              />
              : <Plus
                size={18}
                color={aliasTokens.color.text.InversePrimary}
              />

          }
        </View>
      </View>

      {/* Full-screen preview modal with controls matching native camera UI */}
      <Modal
        visible={isPreviewVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={cancelPreview}
      >
        <View style={styles.previewContainer}>
          {previewImage && (
            <Image
              source={{ uri: previewImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}

          {/* Bottom-left back button */}
          <TouchableOpacity style={styles.backButton} onPress={cancelPreview} activeOpacity={0.8}>
            <View style={styles.backButtonOuter}>
              <View style={styles.backButtonInner}>
                <Undo2 size={20} color={"#F9DCCD"} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Center large confirm button with ring */}
          <TouchableOpacity style={styles.confirmButton} onPress={confirmPreview} activeOpacity={0.85}>
            <View style={styles.confirmOuterRing}>
              <View style={styles.confirmInnerButton}>
                <Check size={24} color={aliasTokens.color.text.Primary} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...aliasTokens.basic.dFlexCenter,
    backgroundColor: aliasTokens.color.background.Secondary,
    borderRadius: aliasTokens.borderRadius.Full, // Circular    
    position: 'relative',
  },
  image: {
    ...aliasTokens.sizes.allFullSize,
    borderRadius: aliasTokens.borderRadius.Full,
  },
  placeholder: {
    ...aliasTokens.basic.dFlexCenter,
  },
  addButtonContainer: {
    ...aliasTokens.basic.dFlexCenter,
    width: aliasTokens.sizes.Medium,
    height: aliasTokens.sizes.Medium,
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: aliasTokens.color.background.Primary,
    borderRadius: aliasTokens.borderRadius.Full,
  },
  addButton: {
    width: aliasTokens.sizes.Small,
    height: aliasTokens.sizes.Small,
    backgroundColor: aliasTokens.color.brand.Primary,
    borderRadius: aliasTokens.borderRadius.Full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Full-screen preview modal styles
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  // Bottom-left back button: outer ring + inner filled circle
  backButton: {
    position: 'absolute',
    left: 38,
    bottom: 80,
  },
  backButtonOuter: {
    width: aliasTokens.sizes.Medium,
    height: aliasTokens.sizes.Medium,
    ...aliasTokens.basic.dFlexCenter,
    borderWidth: 2,
    borderColor: '#F9DCCD',
    borderRadius: aliasTokens.sizes.Medium / 2,
  },
  backButtonInner: {
    ...aliasTokens.basic.dFlexCenter,
  },
  // Center confirm button: big outer ring and inner white button
  confirmButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 80,
  },
  confirmOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 44,
    borderWidth: 2.5,
    borderColor: '#F9DCCD',
    ...aliasTokens.basic.dFlexCenter,
  },
  confirmInnerButton: {
    width: 58,
    height: 58,
    borderRadius: 34,
    backgroundColor: '#F9DCCD',
    ...aliasTokens.basic.dFlexCenter,
  }
});

export default ImageUploader; 