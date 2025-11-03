import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { ScreenHeader } from '../components/common';
import { theme } from '../theme';
import { cameraService, locationService } from '../services';
import { usePagination } from '../hooks';
import { Camera } from '../types/camera';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.md * 3) / 2;

export const LiveScreen: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [locations, setLocations] = useState<Array<{ id: number; name: string }>>([]);

  const {
    items: cameras,
    loading,
    refresh,
    loadMore,
  } = usePagination<Camera>(cameraService.getCameras, 20);

  useEffect(() => {
    refresh();
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await locationService.getLocations({ page: 1, size: 100 });
      const locationData = response._embedded?.content || response.content || [];
      const formattedLocations = locationData.map((loc: any) => ({
        id: loc.ycl_id,
        name: loc.ycl_name,
      }));
      setLocations([{ id: 0, name: 'All Locations' }, ...formattedLocations]);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleLocationChange = (location: { id: number; name: string }) => {
    setSelectedLocation(location.name);
    // TODO: Filter cameras by location
  };

  const renderCameraCard = ({ item }: { item: Camera }) => {
    const quality = item.camera_id % 3 === 0 ? '4K' : 'HD';
    const isLive = item.status;

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.videoPlaceholder}>
          {isLive && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>● LIVE</Text>
            </View>
          )}
          <View style={styles.qualityBadge}>
            <Text style={styles.qualityText}>{quality}</Text>
          </View>

          <View style={styles.videoIcon}>
            <Text style={styles.videoIconText}>📹</Text>
          </View>

          <TouchableOpacity style={styles.expandButton}>
            <Text style={styles.expandIcon}>⤢</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cameraInfo}>
          <Text style={styles.cameraStatusIcon}>📹</Text>
          <Text style={styles.cameraName} numberOfLines={1}>
            {item.camera_location || 'Camera'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        selectedLocation={selectedLocation}
        locations={locations}
        onLocationChange={handleLocationChange}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Live Cameras</Text>
        <Text style={styles.subtitle}>Tap any camera to view fullscreen</Text>

        <FlatList
          data={cameras}
          renderItem={renderCameraCard}
          keyExtractor={(item) => item.camera_id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          refreshing={loading}
          onRefresh={refresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="#5FBB97" style={styles.loader} />
            ) : (
              <Text style={styles.emptyText}>No cameras found</Text>
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
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.md,
  },
  videoPlaceholder: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#E8E8EA',
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  liveBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: '#D43F3A',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  liveText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  qualityBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  qualityText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  videoIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoIconText: {
    fontSize: 48,
    opacity: 0.3,
  },
  expandButton: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandIcon: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  cameraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  cameraStatusIcon: {
    fontSize: 12,
    marginRight: 4,
    color: '#5FBB97',
  },
  cameraName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    flex: 1,
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
