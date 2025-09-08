import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Heart } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';

interface PostInteractionButtonProps {
  liked?: boolean;
  count: number;
  onPress?: () => void;
  disabled?: boolean;
}

const PostInteractionButton: React.FC<PostInteractionButtonProps> = ({ 
  liked = false, 
  count, 
  onPress,
  disabled = false 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Heart 
        size={20} 
        color={liked ? aliasTokens.color.semantic.danger.Default : aliasTokens.color.text.Secondary}
        fill={liked ? aliasTokens.color.semantic.danger.Default : 'transparent'}
        strokeWidth={2}
      />
      <Text style={[
        styles.count, 
        liked && styles.countLiked
      ]}>
        ({count})
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: aliasTokens.spacing.XXSmall,
    paddingVertical: aliasTokens.spacing.XXSmall,
    paddingHorizontal: aliasTokens.spacing.XSmall,
  },
  disabled: {
    opacity: 0.5,
  },
  count: {
    ...aliasTokens.typography.body.Small,
    color: aliasTokens.color.text.Secondary,
    fontWeight: '500',
  },
  countLiked: {
    color: aliasTokens.color.semantic.danger.Default,
  },
});

export default PostInteractionButton; 