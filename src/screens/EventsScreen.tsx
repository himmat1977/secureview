import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenHeader } from '../components/common';
import { theme } from '../theme';
import { eventService, locationService } from '../services';
import { usePagination } from '../hooks';
import { Event } from '../types/camera';

const EVENT_TYPES = ['All', 'Person', 'Vehicle', 'Motion', 'Alert'];

const EVENT_ICONS: Record<string, string> = {
  Person: 'person',
  Vehicle: 'car',
  Motion: 'analytics',
  Alert: 'alert-circle',
  Default: 'videocam',
};

export const EventsScreen: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [locations, setLocations] = useState<Array<{ id: number; name: string }>>([]);

  const {
    items: events,
    loading,
    refresh,
    loadMore,
  } = usePagination<Event>(eventService.getEvents, 20);

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

  const getEventIcon = (eventType?: string) => {
    if (!eventType) return EVENT_ICONS.Default;
    const type = eventType.split('_')[0];
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    return EVENT_ICONS[capitalizedType] || EVENT_ICONS.Default;
  };

  const getEventColor = (eventType?: string): string => {
    if (!eventType) return '#5FBB97';
    if (eventType.includes('person')) return '#5FBB97';
    if (eventType.includes('vehicle')) return '#5AC8FA';
    if (eventType.includes('motion')) return '#FF9500';
    if (eventType.includes('alert') || eventType.includes('tamper')) return '#FF3B30';
    return '#5FBB97';
  };

  const formatDateTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  };

  const renderEventCard = ({ item }: { item: Event }) => {
    const eventColor = getEventColor(item.event_type);
    const eventIcon = getEventIcon(item.event_type);

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={[styles.thumbnail, { backgroundColor: '#E8E8EA' }]}>
          <View style={[styles.iconCircle, { backgroundColor: eventColor + '20' }]}>
            <Icon name={eventIcon} size={28} color={eventColor} />
          </View>
          <TouchableOpacity style={styles.playButton}>
            <Icon name="play" size={16} color="#FFFFFF" style={styles.playIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.twoColumnLayout}>
            <View style={styles.leftColumn}>
              <Text style={styles.eventTitle} numberOfLines={1}>
                {item.event_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Event'}
              </Text>

              {item.event_camera && (
                <View style={styles.cameraNameContainer}>
                  <Icon name="videocam" size={14} color={theme.colors.textSecondary} style={styles.cameraIcon} />
                  <Text style={styles.cameraName} numberOfLines={1}>
                    {item.event_camera}
                  </Text>
                </View>
              )}

              <Text style={styles.location} numberOfLines={2}>
                {item.event_description || 'No description'}
              </Text>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.dateContainer}>
                <Icon name="calendar" size={12} color={theme.colors.textSecondary} style={styles.dateIcon} />
                <Text style={styles.timeRight}>{formatDateTime(item.created_date)}</Text>
              </View>

              {item.event_tag && (
                <View style={styles.tagContainerRight}>
                  <Text style={styles.tagText}>{item.event_tag}</Text>
                </View>
              )}
            </View>
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
        <Text style={styles.title}>Events</Text>
        <Text style={styles.subtitle}>Recent detections and alerts</Text>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {EVENT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterTab,
                selectedFilter === type && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(type)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === type && styles.filterTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.event_id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={refresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="#5FBB97" style={styles.loader} />
            ) : (
              <Text style={styles.emptyText}>No events found</Text>
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
    marginBottom: theme.spacing.md,
  },
  filterContainer: {
    marginBottom: theme.spacing.md,
  },
  filterContent: {
    paddingRight: theme.spacing.md,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  filterTabActive: {
    backgroundColor: theme.colors.text,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  filterTextActive: {
    color: theme.colors.background,
  },
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5FBB97',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    marginLeft: 2,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  middleRow: {
    flexDirection: 'row',
  },
  twoColumnLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    alignItems: 'flex-end',
    marginLeft: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  eventTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  dateIcon: {
    marginRight: 4,
  },
  timeRight: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  confidenceBadge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  confidenceText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
  },
  cameraNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  cameraIcon: {
    marginRight: 4,
  },
  cameraName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
    flex: 1,
  },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#5FBB97',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  tagContainerRight: {
    backgroundColor: '#5FBB97',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xs,
  },
  tagText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600' as any,
    color: theme.colors.background,
  },
  location: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  time: {
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
