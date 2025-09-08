import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { MessageCircle, MoreHorizontal, Play } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';
import PostInteractionButton from './PostInteractionButton';

const { width: screenWidth } = Dimensions.get('window');
const cardPadding = aliasTokens.spacing.Medium * 2; // Left + right padding
const availableWidth = screenWidth - cardPadding;

interface PostCardProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  timestamp: string;
  content: string;
  image?: string;
  mediaUrls?: string[];
  mediaTypes?: ('image' | 'video')[];
  likes: {
    count: number;
    liked: boolean;
  };
  comments: {
    count: number;
  };
  onLike?: () => void;
  onComment?: () => void;
  onMore?: () => void;
  onPress?: () => void;
}

const PostCard: React.FC<PostCardProps> = memo(({
  id,
  author,
  timestamp,
  content,
  image,
  mediaUrls,
  mediaTypes,
  likes,
  comments,
  onLike,
  onComment,
  onMore,
  onPress,
}) => {
  // Memoize avatar rendering to prevent unnecessary re-renders
  const renderAvatar = useMemo(() => {
    // Only use avatar if it's a valid HTTP URL (not local file path)
    if (author.avatar && (author.avatar.startsWith('http://') || author.avatar.startsWith('https://'))) {
      return (
        <Image source={{ uri: author.avatar }} style={styles.avatar} />
      );
    }
    
    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {author.initials || author.name.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  }, [author.avatar, author.initials, author.name]);

  // Memoize video overlay components
  const renderVideoOverlay = useCallback((size: 'large' | 'small' = 'large') => (
    <View style={styles.videoOverlay}>
      <View style={styles.playButtonContainer}>
        <Play 
          size={size === 'large' ? 48 : 32} 
          color={aliasTokens.color.text.InversePrimary} 
          fill={aliasTokens.color.text.InversePrimary} 
        />
      </View>
    </View>
  ), []);

  const renderSingleMedia = useCallback((mediaUrl: string, mediaType: 'image' | 'video') => (
    <View style={styles.imageContainer}>
      <TouchableOpacity activeOpacity={0.9}>
        <Image 
          source={{ uri: mediaUrl }} 
          style={styles.contentImage}
          resizeMode="cover"
        />
        {mediaType === 'video' && renderVideoOverlay('large')}
      </TouchableOpacity>
    </View>
  ), [renderVideoOverlay]);

  const renderMultipleMedia = useCallback((mediaUrls: string[], mediaTypes: ('image' | 'video')[]) => {
    if (mediaUrls.length === 2) {
      // Two items - side by side
      return (
        <View style={styles.imageContainer}>
          <View style={styles.twoImageGrid}>
            {mediaUrls.map((mediaUrl, index) => (
              <TouchableOpacity key={index} style={styles.twoImageItem} activeOpacity={0.9}>
                <Image 
                  source={{ uri: mediaUrl }} 
                  style={styles.twoImageContent}
                  resizeMode="cover"
                />
                {mediaTypes[index] === 'video' && renderVideoOverlay('small')}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else if (mediaUrls.length === 3) {
      // Three items - first large, two small stacked
      return (
        <View style={styles.imageContainer}>
          <View style={styles.threeImageGrid}>
            <TouchableOpacity style={styles.threeImageLarge} activeOpacity={0.9}>
              <Image 
                source={{ uri: mediaUrls[0] }} 
                style={styles.threeImageLargeContent}
                resizeMode="cover"
              />
              {mediaTypes[0] === 'video' && renderVideoOverlay('large')}
            </TouchableOpacity>
            <View style={styles.threeImageSmallContainer}>
              {mediaUrls.slice(1).map((mediaUrl, index) => (
                <TouchableOpacity key={index + 1} style={styles.threeImageSmall} activeOpacity={0.9}>
                  <Image 
                    source={{ uri: mediaUrl }} 
                    style={styles.threeImageSmallContent}
                    resizeMode="cover"
                  />
                  {mediaTypes[index + 1] === 'video' && renderVideoOverlay('small')}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      );
    } else if (mediaUrls.length === 4) {
      // Four items - 2x2 grid
      return (
        <View style={styles.imageContainer}>
          <View style={styles.fourImageGrid}>
            {mediaUrls.map((mediaUrl, index) => (
              <TouchableOpacity key={index} style={styles.fourImageItem} activeOpacity={0.9}>
                <Image 
                  source={{ uri: mediaUrl }} 
                  style={styles.fourImageContent}
                  resizeMode="cover"
                />
                {mediaTypes[index] === 'video' && renderVideoOverlay('small')}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else {
      // More than 4 items - horizontal scroll with more indicator
      const remainingCount = mediaUrls.length - 4;
      return (
        <View style={styles.imageContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.mediaScroll}
            contentContainerStyle={styles.mediaScrollContent}
          >
            {mediaUrls.slice(0, 4).map((mediaUrl, index) => (
              <TouchableOpacity key={index} style={styles.scrollMediaItem} activeOpacity={0.9}>
                <Image 
                  source={{ uri: mediaUrl }} 
                  style={styles.scrollMediaContent}
                  resizeMode="cover"
                />
                {mediaTypes[index] === 'video' && renderVideoOverlay('small')}
                {index === 3 && remainingCount > 0 && (
                  <View style={styles.moreOverlay}>
                    <Text style={styles.moreText}>+{remainingCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }
  }, [renderVideoOverlay]);

  // Memoize media rendering to prevent unnecessary re-calculations
  const renderMedia = useMemo(() => {
    // Priority: Use new media system if available
    if (mediaUrls && mediaUrls.length > 0 && mediaTypes && mediaTypes.length > 0) {
      if (mediaUrls.length === 1 && mediaUrls[0] && mediaTypes[0]) {
        return renderSingleMedia(mediaUrls[0], mediaTypes[0]);
      } else {
        return renderMultipleMedia(mediaUrls, mediaTypes);
      }
    }
    
    // Fallback to old single image system
    if (image) {
      return renderSingleMedia(image, 'image');
    }
    
    return null;
  }, [mediaUrls, mediaTypes, image, renderSingleMedia, renderMultipleMedia]);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorSection}>
          {renderAvatar}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{author.name}</Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={onMore}
          activeOpacity={0.7}
        >
          <MoreHorizontal 
            size={20} 
            color={aliasTokens.color.text.Secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>{content}</Text>
        
        {/* Media */}
        {renderMedia}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <PostInteractionButton
          liked={likes.liked}
          count={likes.count}
          onPress={onLike}
        />
        
        <TouchableOpacity 
          style={styles.commentButton}
          onPress={onComment}
          activeOpacity={0.7}
        >
          <MessageCircle 
            size={20} 
            color={aliasTokens.color.text.Secondary}
            strokeWidth={2}
          />
          <Text style={styles.commentCount}>({comments.count})</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

// Add display name for better debugging
PostCard.displayName = 'PostCard';

const styles = StyleSheet.create({
  container: {
    backgroundColor: aliasTokens.color.background.Primary,
    borderRadius: aliasTokens.borderRadius.Default,
    padding: aliasTokens.spacing.Medium,
    marginHorizontal: aliasTokens.spacing.Medium,
    marginBottom: aliasTokens.spacing.Small,
    borderWidth: 1,
    borderColor: aliasTokens.color.border.Default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: aliasTokens.spacing.Small,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: aliasTokens.sizes.Small,
    height: aliasTokens.sizes.Small,
    borderRadius: aliasTokens.borderRadius.Full,
  },
  avatarPlaceholder: {
    width: aliasTokens.sizes.Small,
    height: aliasTokens.sizes.Small,
    borderRadius: aliasTokens.borderRadius.Full,
    backgroundColor: aliasTokens.color.background.Secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...aliasTokens.typography.title.Small,
    color: aliasTokens.color.text.Primary,
  },
  authorInfo: {
    marginLeft: aliasTokens.spacing.Small,
    flex: 1,
  },
  authorName: {
    ...aliasTokens.typography.title.XSmall,
    color: aliasTokens.color.text.Primary,
  },
  timestamp: {
    ...aliasTokens.typography.body.Small,
    color: aliasTokens.color.text.Secondary,
    marginTop: aliasTokens.spacing.None,
  },
  moreButton: {
    padding: aliasTokens.spacing.XXSmall,
  },
  content: {
    marginBottom: aliasTokens.spacing.Small,
  },
  contentText: {
    ...aliasTokens.typography.body.Medium,
    color: aliasTokens.color.text.Primary,
  },
  imageContainer: {
    marginTop: aliasTokens.spacing.Small,
    borderRadius: aliasTokens.borderRadius.Default,
    overflow: 'hidden',
  },
  
  // Single image styles
  contentImage: {
    width: '100%',
    height: 300,
    borderRadius: aliasTokens.borderRadius.Default,
  },
  
  // Video overlay styles
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Two images layout
  twoImageGrid: {
    flexDirection: 'row',
    gap: 2,
  },
  twoImageItem: {
    flex: 1,
    position: 'relative',
  },
  twoImageContent: {
    width: '100%',
    height: 200,
    borderRadius: aliasTokens.borderRadius.Default,
  },
  
  // Three images layout
  threeImageGrid: {
    flexDirection: 'row',
    gap: 2,
    height: 200,
  },
  threeImageLarge: {
    flex: 2,
    position: 'relative',
  },
  threeImageLargeContent: {
    width: '100%',
    height: '100%',
    borderRadius: aliasTokens.borderRadius.Default,
  },
  threeImageSmallContainer: {
    flex: 1,
    gap: 2,
  },
  threeImageSmall: {
    flex: 1,
    position: 'relative',
  },
  threeImageSmallContent: {
    width: '100%',
    height: '100%',
    borderRadius: aliasTokens.borderRadius.Default,
  },
  
  // Four images layout
  fourImageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  fourImageItem: {
    width: '49%',
    height: 150,
    position: 'relative',
  },
  fourImageContent: {
    width: '100%',
    height: '100%',
    borderRadius: aliasTokens.borderRadius.Default,
  },
  
  // Horizontal scroll layout (5+ images)
  mediaScroll: {
    flexDirection: 'row',
  },
  mediaScrollContent: {
    gap: aliasTokens.spacing.XSmall,
  },
  scrollMediaItem: {
    width: 200,
    height: 150,
    position: 'relative',
  },
  scrollMediaContent: {
    width: '100%',
    height: '100%',
    borderRadius: aliasTokens.borderRadius.Default,
  },
  moreOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: aliasTokens.borderRadius.Default,
  },
  moreText: {
    ...aliasTokens.typography.title.Large,
    color: aliasTokens.color.text.InversePrimary,
    fontWeight: 'bold',
  },
  
  // Action styles
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: aliasTokens.spacing.Small,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: aliasTokens.spacing.XXSmall,
    paddingVertical: aliasTokens.spacing.XXSmall,
    paddingHorizontal: aliasTokens.spacing.XSmall,
  },
  commentCount: {
    ...aliasTokens.typography.body.Small,
    color: aliasTokens.color.text.Secondary,
  },
});

export default PostCard; 