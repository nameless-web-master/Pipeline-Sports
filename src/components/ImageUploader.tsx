import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Plus, User } from 'lucide-react-native';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImageUri || null);

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

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      console.log('ImageUploader: Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('ImageUploader: Image picker result:', {
        canceled: result.canceled,
        hasAssets: result.assets && result.assets.length > 0,
        assetsCount: result.assets?.length || 0
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('ImageUploader: Selected image URI:', imageUri);
        setSelectedImage(imageUri);
        onImageSelected?.(imageUri);
      } else {
        console.log('ImageUploader: User canceled image selection or no assets returned');
      }
    } catch (error) {
      console.log('ImageUploader: Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    console.log('ImageUploader: Requesting camera permissions...');
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
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('ImageUploader: Camera result:', {
        canceled: result.canceled,
        hasAssets: result.assets && result.assets.length > 0,
        assetsCount: result.assets?.length || 0
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('ImageUploader: Captured image URI:', imageUri);
        setSelectedImage(imageUri);
        onImageSelected?.(imageUri);
      } else {
        console.log('ImageUploader: User canceled camera or no assets returned');
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
          <Plus
            size={20}
            color={aliasTokens.color.text.InversePrimary}
          />
        </View>
      </View>
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
});

export default ImageUploader; 