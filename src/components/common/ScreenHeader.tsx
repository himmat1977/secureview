import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LocationPicker } from './LocationPicker';
import { Avatar } from './Avatar';
import { theme } from '../../theme';

interface Location {
  id: number;
  name: string;
}

interface ScreenHeaderProps {
  selectedLocation: string;
  locations?: Location[];
  onLocationChange?: (location: Location) => void;
  onAvatarPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  selectedLocation,
  locations,
  onLocationChange,
  onAvatarPress,
}) => {
  return (
    <View style={styles.container}>
      <LocationPicker
        selectedLocation={selectedLocation}
        locations={locations}
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
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
});
