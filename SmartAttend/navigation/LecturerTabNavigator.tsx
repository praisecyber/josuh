import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';

import LecturerDashboardScreen from '../screens/lecturer/LecturerDashboardScreen';
import GenerateQRScreen from '../screens/lecturer/GenerateQRScreen';
import LecturerRecordsScreen from '../screens/lecturer/LecturerRecordsScreen';
import LecturerBooksScreen from '../screens/lecturer/LecturerBooksScreen';

const Tab = createBottomTabNavigator();

export default function LecturerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'GenerateQR') iconName = focused ? 'qr-code' : 'qr-code-outline';
          else if (route.name === 'Records') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'Books') iconName = focused ? 'library' : 'library-outline';
          return (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={LecturerDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="GenerateQR" component={GenerateQRScreen} options={{ title: 'Generate QR' }} />
      <Tab.Screen name="Records" component={LecturerRecordsScreen} options={{ title: 'Records' }} />
      <Tab.Screen name="Books" component={LecturerBooksScreen} options={{ title: 'Books' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
    ...SHADOW.md,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconContainer: {
    width: 40,
    height: 32,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
});
