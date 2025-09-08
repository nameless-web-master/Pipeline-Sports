import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ListFilter } from 'lucide-react-native';
import { aliasTokens } from '../theme/alias';

interface FilterButtonProps {
  onPress?: () => void;
  hasActiveFilters?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  onPress, 
  hasActiveFilters = false 
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ListFilter 
        size={24} 
        color={aliasTokens.color.text.Secondary}
        strokeWidth={2}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: aliasTokens.sizes.Medium,
    height: aliasTokens.sizes.Medium,
    borderRadius: aliasTokens.borderRadius.Full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FilterButton; 