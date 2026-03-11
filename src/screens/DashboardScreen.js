import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import HomeTab from './tabs/HomeTab';
import PracticeTab from './tabs/PracticeTab';
import RosterScreen from './RosterScreen';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { auth } from '../config/firebase';
import { logout } from '../services/authService';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const DRAWER_ITEMS = [
  { key: 'profile', label: 'My Profile', screen: 'MyProfile' },
  { key: 'team', label: 'My Team', screen: 'MyTeam' },
  { key: 'guide', label: 'Training Guide', screen: 'TrainingGuide' },
  { key: 'badges', label: 'My Badges', screen: 'Badges' },
  { key: 'calendar', label: 'Calendar', screen: 'Calendar' },
  { key: 'settings', label: 'Settings', screen: 'Settings' },
  { key: 'help', label: 'Help / Contact', screen: 'Help' },
];

const CustomDrawerContent = (props) => {
  const rootNavigation = props.navigation.getParent()?.getParent?.() || props.navigation.getParent();

  const handleMenuPress = (item) => {
    props.navigation.closeDrawer();
    if (rootNavigation) {
      rootNavigation.navigate(item.screen);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>BASE Wrestling</Text>
      </View>

      <View style={styles.drawerItems}>
        {DRAWER_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.drawerItem}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.drawerItemLabel}>{item.label}</Text>
            <Text style={styles.drawerItemArrow}>></Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>BASE Wrestling v1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const DummyMenuScreen = () => null;

const TabNavigator = () => {
  const navigation = useNavigation();

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
            <Text style={{ fontSize: 22 }}>{focused ? '\u{1F3E0}' : '\u{1F3E1}'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '\u{1F4CB}' : '\u{1F4C4}'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Roster"
        component={RosterScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '\u{1F465}' : '\u{1F464}'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={DummyMenuScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '\u2630' : '\u2261'}</Text>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.openDrawer();
          },
        }}
      />
    </Tab.Navigator>
  );
};

const DashboardScreen = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="TabNavigator" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  drawerItems: {
    flex: 1,
    paddingTop: SPACING.sm,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  drawerItemLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  drawerItemArrow: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.lg,
  },
  logoutBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
});

export default DashboardScreen;
