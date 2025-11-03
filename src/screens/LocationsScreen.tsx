import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenHeader } from '../components/common';
import { theme } from '../theme';
import { locationService } from '../services';
import { usePagination } from '../hooks';
import { CameraLocation } from '../types/camera';
import storageService from '../utils/storage';

export const LocationsScreen: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [isReady, setIsReady] = useState(false);
  const [locationList, setLocationList] = useState<Array<{ id: number; name: string }>>([]);

  const {
    items: locations,
    loading,
    refresh,
    loadMore,
    hasMore,
  } = usePagination<CameraLocation>(locationService.getLocations, 20);

  useEffect(() => {
    // Log to check if we're authenticated and wait before fetching
    const checkAuth = async () => {
      // Wait a bit for auth to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      const token = await storageService.getToken();
      console.log('=== Locations Screen Debug ===');
      console.log('Token status:', token ? `Token exists (${token.substring(0, 20)}...)` : 'NO TOKEN FOUND!');
      if (!token) {
        console.error('CRITICAL: No authentication token found!');
      }
      setIsReady(true);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isReady) {
      console.log('Authentication ready, fetching locations...');
      refresh();
    }
  }, [isReady]);

  useEffect(() => {
    // Update locationList when locations data changes
    if (locations.length > 0) {
      const formattedLocations = locations.map((loc) => ({
        id: loc.ycl_id,
        name: loc.ycl_name,
      }));
      setLocationList([{ id: 0, name: 'All Locations' }, ...formattedLocations]);
    }
  }, [locations]);

  const handleLocationChange = (location: { id: number; name: string }) => {
    setSelectedLocation(location.name);
    // TODO: Filter locations by selected location if needed
  };

  const renderLocationCard = ({ item }: { item: CameraLocation }) => {
    const isOnline = item.status;
    const cameraCount = item.camera_details?.length || 0;

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <Icon name="business" size={36} color="#FFFFFF" />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.locationName}>{item.ycl_name}</Text>
            <View style={[styles.statusBadge, isOnline ? styles.online : styles.offline]}>
              <Icon
                name="ellipse"
                size={8}
                color={isOnline ? '#5FBB97' : '#FF3B30'}
                style={styles.statusDot}
              />
              <Text style={[styles.statusText, isOnline ? styles.onlineText : styles.offlineText]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>

          <Text style={styles.address}>{item.ycl_address || 'No address'}</Text>

          <View style={styles.cameraInfo}>
            <Icon name="videocam" size={16} color={theme.colors.textSecondary} style={styles.cameraIcon} />
            <Text style={styles.cameraCount}>{cameraCount} cameras</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        selectedLocation={selectedLocation}
        locations={locationList}
        onLocationChange={handleLocationChange}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Locations</Text>
        <Text style={styles.subtitle}>Select a location to view cameras</Text>

        <FlatList
          data={locations}
          renderItem={renderLocationCard}
          keyExtractor={(item) => item.ycl_id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={refresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="#5FBB97" style={styles.loader} />
            ) : (
              <Text style={styles.emptyText}>No locations found</Text>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#5FBB97',
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  locationName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.sm,
  },
  online: {
    backgroundColor: '#E8F5F0',
  },
  offline: {
    backgroundColor: '#FFE8E8',
  },
  statusDot: {
    marginRight: 4,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  onlineText: {
    color: '#5FBB97',
  },
  offlineText: {
    color: '#FF3B30',
  },
  address: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  cameraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraIcon: {
    marginRight: 6,
  },
  cameraCount: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  loader: {
    marginTop: theme.spacing['3xl'],
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing['3xl'],
    fontSize: theme.typography.fontSize.base,
  },
});
