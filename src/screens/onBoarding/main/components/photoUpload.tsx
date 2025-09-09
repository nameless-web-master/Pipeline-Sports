import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Alert
} from 'react-native';
import ImageUploader from '../../../../components/ImageUploader';
import Button from '../../../../components/Button';
import { aliasTokens } from '../../../../theme/alias';

/**
 * Props for the PhotoUpload step-screen.
 */
interface PhotoUploadProps {
    /** Called when the Next button is pressed (and photo is present). */
    onNext?: () => void;
    /** Optional: parent can observe a monotonically increasing state counter. */
    onStateChange?: (newState: number) => void;
}

/**
 * PhotoUpload renders an avatar/photo uploader and a Next button.
 * The Next button remains disabled until a photo is selected.
 */
const PhotoUpload: React.FC<PhotoUploadProps> = ({
    onNext,
    onStateChange
}) => {
    // Whether a photo has been selected
    const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);
    // The selected image URI (kept for potential future use)
    const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
    // Local counter that increments when Next is pressed (for demo/progress)
    const [clickCount, setClickCount] = useState<number>(0);

    /**
     * Handle image selection from the ImageUploader component.
     * Stores the URI and enables the Next button.
     */
    const handleImageSelected = (uri: string) => {
        console.log('PhotoUpload: Image selected:', uri);
        setUploadedImageUri(uri);
        setIsImageUploaded(true);
    };

    /**
     * Handle Next button press. If no photo, prompt the user.
     */
    const handleNextPress = () => {
        if (!isImageUploaded) {
            Alert.alert(
                'Photo Required',
                'Please upload a photo before proceeding.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Increment the click counter
        const newClickCount = clickCount + 1;
        setClickCount(newClickCount);

        console.log('PhotoUpload: Next button clicked, count:', newClickCount);

        // Notify parent callbacks if provided
        onNext?.();
        onStateChange?.(newClickCount);
    };

    return (
        <View style={styles.container}>
            {/* Main content area */}
            <View style={styles.content}>
                {/* Image uploader component */}
                <View style={styles.imageUploaderContainer}>
                    <ImageUploader
                        onImageSelected={handleImageSelected}
                        size={140}
                        style={styles.imageUploader}
                    />
                </View>
            </View>

            {/* Footer: Next button (disabled until an image is uploaded) */}
            <View>
                <Button
                    title="Next"
                    onPress={handleNextPress}
                    variant={isImageUploaded ? 'primary' : 'secondary'}
                    disabled={!isImageUploaded}
                    style={{ width: '100%' }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: aliasTokens.spacing.Large
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    imageUploaderContainer: {
        marginBottom: aliasTokens.spacing.Large,
    },
    imageUploader: {
        // Additional styling for the image uploader if needed
    },
    statusContainer: {
        alignItems: 'center',
        marginTop: aliasTokens.spacing.Medium,
    },
    statusText: {
        fontSize: aliasTokens.typography.body.Medium.fontSize,
        color: aliasTokens.color.text.Success,
        fontWeight: '500',
        marginBottom: aliasTokens.spacing.Small,
    },
    clickCountText: {
        fontSize: aliasTokens.typography.body.Small.fontSize,
        color: aliasTokens.color.text.Secondary,
    },
});

export default PhotoUpload;
