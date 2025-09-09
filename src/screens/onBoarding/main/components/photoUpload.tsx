import React, { useEffect } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import ImageUploader from '../../../../components/ImageUploader';
import { aliasTokens } from '../../../../theme/alias';

/**
 * Props for the PhotoUpload step-screen.
 * Now receives data and handlers from parent instead of managing local state.
 */
interface PhotoUploadProps {
    /** Whether an image has been uploaded */
    isImageUploaded: boolean;
    /** The URI of the uploaded image */
    uploadedImageUri: string | null;
    /** Called when an image is selected */
    onImageSelected: (uri: string) => void;
    /** Notify parent whether this step is currently valid to proceed. */
    onValidityChange?: (isValid: boolean) => void;
}

/**
 * PhotoUpload renders an avatar/photo uploader.
 * Now uses props for data and delegates state management to parent.
 */
const PhotoUpload: React.FC<PhotoUploadProps> = ({
    isImageUploaded,
    uploadedImageUri,
    onImageSelected,
    onValidityChange
}) => {
    // Call onValidityChange on first render to set initial validity state
    useEffect(() => {
        onValidityChange?.(isImageUploaded);
    }, []); // Empty dependency array means this runs only on mount

    /**
     * Handle image selection from the ImageUploader component.
     * Delegates to parent handler and notifies validity change.
     */
    const handleImageSelected = (uri: string) => {
        console.log('PhotoUpload: Image selected:', uri);
        onImageSelected(uri);
        onValidityChange?.(true);
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
                        initialImageUri={uploadedImageUri}
                    />
                </View>
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
});

export default PhotoUpload;