import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  ScrollView,
  Image,
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
  const [selectedLog, setSelectedLog] = useState<VisitorLog | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const formatTimeAgo = (timestamp: number): string => {
    const now = new Date().getTime();
    const diffMinutes = Math.floor((now - timestamp) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const formatFullDateTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleCardPress = (log: VisitorLog) => {
    setSelectedLog(log);
    setModalVisible(true);
  };

  const renderEntryExitCard = ({ item }: { item: VisitorLog }) => {
    const isEntry = item.access_type === 'ENTRY';
    const isVehicle = item.vehicle_info && (item.vehicle_info === 'TRUCK' || item.vehicle_info === 'CAR');
    const driverName = item.external_driver_name;
    const isUnknown = !driverName;

    const displayName = isVehicle
      ? (item.license_plate ? `${item.vehicle_info}: ${item.license_plate}` : `Unknown ${item.vehicle_info || 'Vehicle'}`)
      : (driverName || 'Unknown Visitor');

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => handleCardPress(item)}>
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
              />
              <Text style={[styles.typeText, isEntry ? styles.entryText : styles.exitText]}>
                {isEntry ? 'entry' : 'exit'}
              </Text>
            </View>
          </View>

          <Text style={styles.location} numberOfLines={1}>
            {item.visitor_company || item.visitor_purpose || 'Visitor'}
          </Text>

          <View style={styles.footer}>
            <Text style={styles.time}>{formatTimeAgo(item.capture_time)}</Text>
            {item.capture_type && (
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>{item.capture_type}</Text>
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
          keyExtractor={(item) => item.id.toString()}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Visitor Log Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={28} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedLog && (
                <>
                  {/* Header Section */}
                  <View style={styles.detailSection}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Access Type:</Text>
                      <View style={[styles.typeBadge, selectedLog.access_type === 'ENTRY' ? styles.entryBadge : styles.exitBadge]}>
                        <Text style={[styles.typeText, selectedLog.access_type === 'ENTRY' ? styles.entryText : styles.exitText]}>
                          {selectedLog.access_type || 'N/A'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Capture Type:</Text>
                      <Text style={styles.detailValue}>{selectedLog.capture_type || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Capture Time:</Text>
                      <Text style={styles.detailValue}>{formatFullDateTime(selectedLog.capture_time)}</Text>
                    </View>
                  </View>

                  {/* Driver Information */}
                  {(selectedLog.external_driver_name || selectedLog.driver_license_no || selectedLog.driver_email) && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Driver Information</Text>
                      {selectedLog.external_driver_name && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Name:</Text>
                          <Text style={styles.detailValue}>{selectedLog.external_driver_name}</Text>
                        </View>
                      )}
                      {selectedLog.driver_license_no && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>License No:</Text>
                          <Text style={styles.detailValue}>{selectedLog.driver_license_no}</Text>
                        </View>
                      )}
                      {selectedLog.driver_email && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Email:</Text>
                          <Text style={styles.detailValue}>{selectedLog.driver_email}</Text>
                        </View>
                      )}
                      {selectedLog.visitor_phone_number && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Phone:</Text>
                          <Text style={styles.detailValue}>{selectedLog.visitor_phone_number}</Text>
                        </View>
                      )}
                      {selectedLog.driver_type && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Driver Type:</Text>
                          <Text style={styles.detailValue}>{selectedLog.driver_type}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Visitor Information */}
                  {(selectedLog.visitor_company || selectedLog.visitor_purpose) && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Visitor Information</Text>
                      {selectedLog.visitor_company && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Company:</Text>
                          <Text style={styles.detailValue}>{selectedLog.visitor_company}</Text>
                        </View>
                      )}
                      {selectedLog.visitor_purpose && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Purpose:</Text>
                          <Text style={styles.detailValue}>{selectedLog.visitor_purpose}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Vehicle Information */}
                  {(selectedLog.license_plate || selectedLog.vehicle_info || selectedLog.vehicle_make ||
                    selectedLog.vehicle_model || selectedLog.vehicle_color || selectedLog.truck ||
                    selectedLog.trailer || selectedLog.trailer_plate) && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Vehicle Information</Text>
                      {selectedLog.license_plate && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>License Plate:</Text>
                          <Text style={styles.detailValue}>{selectedLog.license_plate}</Text>
                        </View>
                      )}
                      {selectedLog.vehicle_info && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Vehicle Type:</Text>
                          <Text style={styles.detailValue}>{selectedLog.vehicle_info}</Text>
                        </View>
                      )}
                      {selectedLog.vehicle_make && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Make:</Text>
                          <Text style={styles.detailValue}>{selectedLog.vehicle_make}</Text>
                        </View>
                      )}
                      {selectedLog.vehicle_model && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Model:</Text>
                          <Text style={styles.detailValue}>{selectedLog.vehicle_model}</Text>
                        </View>
                      )}
                      {selectedLog.vehicle_color && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Color:</Text>
                          <Text style={styles.detailValue}>{selectedLog.vehicle_color}</Text>
                        </View>
                      )}
                      {selectedLog.truck && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Truck:</Text>
                          <Text style={styles.detailValue}>{selectedLog.truck}</Text>
                        </View>
                      )}
                      {selectedLog.trailer && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Trailer:</Text>
                          <Text style={styles.detailValue}>{selectedLog.trailer}</Text>
                        </View>
                      )}
                      {selectedLog.trailer_plate && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Trailer Plate:</Text>
                          <Text style={styles.detailValue}>{selectedLog.trailer_plate}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Additional Information */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Additional Information</Text>
                    {selectedLog.operator_type && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Operator Type:</Text>
                        <Text style={styles.detailValue}>{selectedLog.operator_type}</Text>
                      </View>
                    )}
                    {selectedLog.safety_vest && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Safety Vest:</Text>
                        <Text style={styles.detailValue}>{selectedLog.safety_vest}</Text>
                      </View>
                    )}
                    {selectedLog.damages && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Damages:</Text>
                        <Text style={styles.detailValue}>{selectedLog.damages}</Text>
                      </View>
                    )}
                    {selectedLog.note && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Note:</Text>
                        <Text style={styles.detailValue}>{selectedLog.note}</Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Log ID:</Text>
                      <Text style={styles.detailValue}>{selectedLog.id}</Text>
                    </View>
                  </View>

                  {/* Images */}
                  {(selectedLog.image || selectedLog.license_image) && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Images</Text>
                      {selectedLog.image && (
                        <View style={styles.imageContainer}>
                          <Text style={styles.imageLabel}>Capture Image:</Text>
                          <Image
                            source={{ uri: selectedLog.image }}
                            style={styles.captureImage}
                            resizeMode="contain"
                          />
                        </View>
                      )}
                      {selectedLog.license_image && (
                        <View style={styles.imageContainer}>
                          <Text style={styles.imageLabel}>License Image:</Text>
                          <Image
                            source={{ uri: selectedLog.license_image }}
                            style={styles.captureImage}
                            resizeMode="contain"
                          />
                        </View>
                      )}
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600' as any,
    color: theme.colors.text,
  },
  modalBody: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  detailSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600' as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    flex: 2,
    textAlign: 'right',
  },
  imageContainer: {
    marginTop: theme.spacing.sm,
  },
  imageLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  captureImage: {
    width: '100%' as any,
    height: 200,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#F2F2F7',
  } as any,
});
