import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LocationPicker } from './LocationPicker';
import { Avatar } from './Avatar';
import { theme } from '../../theme';

interface ScreenHeaderProps {
  selectedLocation: string;
  onLocationChange?: (location: any) => void;
  onAvatarPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  selectedLocation,
  onLocationChange,
  onAvatarPress,
}) => {
  return (
    <View style={styles.container}>
      <LocationPicker
        selectedLocation={selectedLocation}
        onLocationChange={onLocationChange}
      />
      <Avatar onPress={onAvatarPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
});
