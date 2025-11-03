import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../theme';

interface Location {
  id: number;
  name: string;
}

interface LocationPickerProps {
  selectedLocation: string;
  locations?: Location[];
  onLocationChange?: (location: Location) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  selectedLocation,
  locations = [],
  onLocationChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelectLocation = (location: Location) => {
    setIsVisible(false);
    onLocationChange?.(location);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Icon name="location" size={20} color={theme.colors.primary} style={styles.locationIcon} />
        <Text style={styles.locationText}>{selectedLocation}</Text>
        <Icon name="chevron-down" size={16} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location</Text>
            <FlatList
              data={locations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.locationItem}
                  onPress={() => handleSelectLocation(item)}
                >
                  <Icon name="location-outline" size={18} color={theme.colors.primary} style={styles.locationItemIcon} />
                  <Text style={styles.locationItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  locationIcon: {
    marginRight: theme.spacing.xs,
  },
  locationText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold as any,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  locationItemIcon: {
    marginRight: theme.spacing.sm,
  },
  locationItemText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
});
