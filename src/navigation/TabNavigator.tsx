import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  LocationsScreen,
  LiveScreen,
  EntryExitScreen,
  EventsScreen,
  ActionsScreen,
} from '../screens';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ iconName, label, focused }: { iconName: string; label: string; focused: boolean }) => (
  <View style={styles.tabItem}>
    <Icon
      name={iconName}
      size={26}
      color={focused ? '#5FBB97' : theme.colors.textSecondary}
      style={styles.tabIcon}
    />
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

const Badge = ({ count }: { count?: number }) => {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Locations"
        component={LocationsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="location" label="Locations" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Live"
        component={LiveScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="videocam" label="Live" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="EntryExit"
        component={EntryExitScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon iconName="log-in" label="Entry/Exit" focused={focused} />
              <Badge count={12} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon iconName="alert-circle" label="Events" focused={focused} />
              <Badge count={8} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Actions"
        component={ActionsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon iconName="flash" label="Actions" focused={focused} />
              <Badge count={3} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    backgroundColor: theme.colors.background,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '600' as any,
  },
  tabLabelActive: {
    color: '#5FBB97',
    fontWeight: '700' as any,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -12,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: theme.colors.background,
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
