import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeTab from './tabs/HomeTab';
import PracticeTab from './tabs/PracticeTab';
import RosterScreen from './RosterScreen';
import MenuScreen from './MenuScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused }) => (
  <Text style={{ fontSize: 11, color: focused ? COLORS.primary : COLORS.textLight, fontWeight: focused ? '600' : '400', marginTop: 2 }}>
    {label}
  </Text>
);

const DashboardScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '🏠' : '🏡'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '📋' : '📄'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Roster"
        component={RosterScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '👥' : '👤'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '☰' : '≡'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default DashboardScreen;
