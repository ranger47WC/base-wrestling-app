import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants/theme';

// Auth
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import InterstitialScreen from '../screens/InterstitialScreen';
import PracticeOutputScreen from '../screens/PracticeOutputScreen';
import DashboardScreen from '../screens/DashboardScreen';

// Menu sub-screens
import MyProfileScreen from '../screens/menu/MyProfileScreen';
import MyTeamScreen from '../screens/menu/MyTeamScreen';
import TrainingGuideScreen from '../screens/menu/TrainingGuideScreen';
import BadgesScreen from '../screens/menu/BadgesScreen';
import CalendarScreen from '../screens/menu/CalendarScreen';
import SettingsScreen from '../screens/menu/SettingsScreen';
import HelpScreen from '../screens/menu/HelpScreen';

import { subscribeToAuthChanges, checkOnboardingComplete } from '../services/authService';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const onboardingComplete = await checkOnboardingComplete(firebaseUser.uid);
          setInitialRoute(onboardingComplete ? 'Dashboard' : 'Profile');
        } catch {
          setInitialRoute('Profile');
        }
      } else {
        setUser(null);
        setInitialRoute('Login');
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_right',
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
        <Stack.Screen name="Interstitial" component={InterstitialScreen} />
        <Stack.Screen name="PracticeOutput" component={PracticeOutputScreen} />

        {/* Main App (Dashboard with bottom tabs) */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        {/* Menu Sub-screens */}
        <Stack.Screen
          name="MyProfile"
          component={MyProfileScreen}
          options={{ headerShown: true, headerTitle: 'My Profile', headerTintColor: COLORS.primary }}
        />
        <Stack.Screen
          name="MyTeam"
          component={MyTeamScreen}
          options={{ headerShown: true, headerTitle: 'My Team', headerTintColor: COLORS.primary }}
        />
        <Stack.Screen
          name="TrainingGuide"
          component={TrainingGuideScreen}
          options={{ headerShown: true, headerTitle: 'Training Guide', headerTintColor: COLORS.primary }}
        />
        <Stack.Screen
          name="Badges"
          component={BadgesScreen}
          options={{ headerShown: true, headerTitle: 'My Badges', headerTintColor: COLORS.primary }}
        />
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ headerShown: true, headerTitle: 'Calendar', headerTintColor: COLORS.primary }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: true, headerTitle: 'Settings', headerTintColor: COLORS.primary }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ headerShown: true, headerTitle: 'Help / Contact', headerTintColor: COLORS.primary }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default AppNavigator;
