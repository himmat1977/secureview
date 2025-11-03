import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { ScreenHeader } from '../components/common';
import { theme } from '../theme';
import { locationService } from '../services';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface RecentAction {
  id: string;
  title: string;
  user: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
}

export const ActionsScreen: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [locations, setLocations] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
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
  };

  const recentActions: RecentAction[] = [
    {
      id: '1',
      title: 'Called Security',
      user: 'John Smith',
      time: '2 hours ago',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Opened Gate',
      user: 'Sarah Johnson',
      time: '5 hours ago',
      status: 'completed',
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Call 911',
      subtitle: 'Emergency services',
      icon: '📞',
      color: '#D43F3A',
      onPress: () => Alert.alert('Emergency Call', 'This would initiate a 911 call'),
    },
    {
      id: '2',
      title: 'Call Security',
      subtitle: 'On-site security team',
      icon: '🛡️',
      color: theme.colors.background,
      onPress: () => Alert.alert('Security Call', 'Calling security team...'),
    },
    {
      id: '3',
      title: 'Open Gate',
      subtitle: 'Remote gate access',
      icon: '🚪',
      color: theme.colors.background,
      onPress: () => Alert.alert('Gate Control', 'Opening gate...'),
    },
    {
      id: '4',
      title: 'Trigger Siren',
      subtitle: 'Sound alarm',
      icon: '🔔',
      color: theme.colors.background,
      onPress: () => Alert.alert('Alarm', 'Trigger siren alarm?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Trigger', onPress: () => {} },
      ]),
    },
    {
      id: '5',
      title: 'Floodlights',
      subtitle: 'Turn on exterior lights',
      icon: '💡',
      color: theme.colors.background,
      onPress: () => Alert.alert('Lights', 'Turning on floodlights...'),
    },
    {
      id: '6',
      title: 'Create Incident',
      subtitle: 'Log new incident report',
      icon: '📋',
      color: theme.colors.background,
      onPress: () => Alert.alert('Incident Report', 'Create new incident report...'),
    },
  ];

  const renderQuickAction = (action: QuickAction, isEmergency: boolean = false) => (
    <TouchableOpacity
      key={action.id}
      style={[
        styles.actionCard,
        isEmergency ? styles.emergencyCard : styles.normalCard,
        isEmergency && { width: '100%' },
      ]}
      onPress={action.onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.actionIcon, isEmergency && styles.emergencyIcon]}>
        {action.icon}
      </Text>
      <Text style={[styles.actionTitle, isEmergency && styles.emergencyTitle]}>
        {action.title}
      </Text>
      <Text style={[styles.actionSubtitle, isEmergency && styles.emergencySubtitle]}>
        {action.subtitle}
      </Text>
    </TouchableOpacity>
  );

  const renderRecentAction = (action: RecentAction) => (
    <View key={action.id} style={styles.recentActionCard}>
      <View style={styles.recentActionContent}>
        <Text style={styles.recentActionTitle}>{action.title}</Text>
        <Text style={styles.recentActionUser}>{action.user}</Text>
      </View>
      <View style={styles.recentActionRight}>
        <Text style={styles.recentActionTime}>{action.time}</Text>
        <Text style={styles.recentActionStatus}>{action.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        selectedLocation={selectedLocation}
        locations={locations}
        onLocationChange={handleLocationChange}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quick Actions</Text>
        <Text style={styles.subtitle}>Critical controls and responses</Text>

        {/* Quick Actions Grid */}
        <View style={styles.actionsGrid}>
          {/* Emergency Action - Full Width */}
          {renderQuickAction(quickActions[0], true)}

          {/* Other Actions - 2 Column Grid */}
          <View style={styles.row}>
            {quickActions.slice(1).map((action) => renderQuickAction(action))}
          </View>
        </View>

        {/* Recent Actions */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Actions</Text>
          {recentActions.map(renderRecentAction)}
        </View>
      </ScrollView>
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
  actionsGrid: {
    marginBottom: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emergencyCard: {
    backgroundColor: '#D43F3A',
  },
  normalCard: {
    backgroundColor: theme.colors.background,
    width: '48%',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  emergencyIcon: {
    fontSize: 40,
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  emergencyTitle: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.background,
  },
  actionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  emergencySubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  recentSection: {
    marginBottom: theme.spacing['4xl'],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  recentActionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  recentActionContent: {
    flex: 1,
  },
  recentActionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 4,
  },
  recentActionUser: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  recentActionRight: {
    alignItems: 'flex-end',
  },
  recentActionTime: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  recentActionStatus: {
    fontSize: theme.typography.fontSize.sm,
    color: '#5FBB97',
    fontWeight: theme.typography.fontWeight.medium,
  },
});
