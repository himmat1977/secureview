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
import { visitorLogService, locationService } from '../services';
import { usePagination } from '../hooks';
import { VisitorLog } from '../types/camera';

export const EntryExitScreen: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [locations, setLocations] = useState<Array<{ id: number; name: string }>>([]);

  const {
    items: visitorLogs,
    loading,
    refresh,
    loadMore,
  } = usePagination<VisitorLog>(visitorLogService.getVisitorLogs, 20);

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
    // TODO: Filter events by location
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date().getTime();
    const eventTime = new Date(timestamp).getTime();
    const diffMinutes = Math.floor((now - eventTime) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  };

  const renderEntryExitCard = ({ item }: { item: VisitorLog }) => {
    const isEntry = item.entry_type === 'entry';
    const isVehicle = item.visitor_type === 'vehicle';
    const isUnknown = !item.visitor_name || item.visitor_name.toLowerCase().includes('unknown');
    const displayName = isVehicle
      ? (item.license_plate ? `Vehicle: ${item.license_plate}` : 'Unknown Vehicle')
      : (item.visitor_name || 'Unknown Person');

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={[styles.avatar, isUnknown && styles.avatarGray]}>
          <Icon
            name={isVehicle ? 'car' : 'person'}
            size={32}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>{displayName}</Text>
            <View style={[styles.typeBadge, isEntry ? styles.entryBadge : styles.exitBadge]}>
              <Icon
                name={isEntry ? 'arrow-forward' : 'arrow-back'}
                size={14}
                color={isEntry ? '#5FBB97' : '#FF9500'}
                style={styles.typeIcon}
              />
              <Text style={[styles.typeText, isEntry ? styles.entryText : styles.exitText]}>
                {isEntry ? 'entry' : 'exit'}
              </Text>
            </View>
          </View>

          <Text style={styles.location} numberOfLines={1}>
            {item.location_name || item.camera_name || 'Main Entrance'}
          </Text>

          <View style={styles.footer}>
            <Text style={styles.time}>{formatTimeAgo(item.capture_time)}</Text>
            {item.confidence && (
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>Confidence</Text>
                <Text style={styles.confidenceValue}>{Math.round(item.confidence)}%</Text>
              </View>
            )}
          </View>
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
        <FlatList
          data={visitorLogs}
          renderItem={renderEntryExitCard}
          keyExtractor={(item) => item.log_id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={refresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="#5FBB97" style={styles.loader} />
            ) : (
              <Text style={styles.emptyText}>No entry/exit logs found</Text>
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
    paddingTop: theme.spacing.md,
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#5FBB97',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarGray: {
    backgroundColor: '#8E8E93',
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
  name: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
  },
  entryBadge: {
    backgroundColor: '#E8F5F0',
  },
  exitBadge: {
    backgroundColor: '#FFF3E0',
  },
  typeIcon: {
    marginRight: 4,
  },
  typeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  entryText: {
    color: '#5FBB97',
  },
  exitText: {
    color: '#FF9500',
  },
  location: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginRight: 4,
  },
  confidenceValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#FF9500',
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
