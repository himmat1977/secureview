import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
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
        <Text style={styles.locationText}>{selectedLocation}</Text>
        <Text style={styles.arrow}>▼</Text>
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
  locationText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  arrow: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
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
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  locationItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  locationItemText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
});
