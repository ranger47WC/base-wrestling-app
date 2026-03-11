import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { auth } from '../config/firebase';
import { getProfile } from '../services/profileService';
import { logout } from '../services/authService';
import { getUserBadges } from '../services/badgeService';

const MENU_ITEMS = [
  { key: 'profile', label: 'My Profile', icon: '👤', screen: 'MyProfile' },
  { key: 'team', label: 'My Team', icon: '🏟️', screen: 'MyTeam' },
  { key: 'guide', label: 'Training Guide', icon: '📖', screen: 'TrainingGuide' },
  { key: 'badges', label: 'My Badges', icon: '🏅', screen: 'Badges' },
  { key: 'calendar', label: 'Calendar', icon: '📅', screen: 'Calendar' },
  { key: 'settings', label: 'Settings', icon: '⚙️', screen: 'Settings' },
  { key: 'help', label: 'Help / Contact', icon: '❓', screen: 'Help' },
];

const MenuScreen = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const prof = await getProfile(user.uid);
      setProfile(prof);
      const userBadges = getUserBadges({});
      setBadges(userBadges);
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const handleMenuPress = (item) => {
    // Navigate to the menu sub-screen via the parent navigator
    navigation.getParent()?.navigate(item.screen);
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

  const earnedBadges = badges.filter((b) => b.earned).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2) || '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.fullName || 'Coach'}</Text>
            <Text style={styles.profileRole}>{profile?.role || 'Role'}</Text>
            <Text style={styles.profileEmail}>{profile?.email || user?.email}</Text>
          </View>
        </View>

        {/* Badge Preview */}
        <Card style={styles.badgePreview}>
          <View style={styles.badgeHeader}>
            <Text style={styles.badgeTitle}>Badges</Text>
            <Text style={styles.badgeCount}>
              {earnedBadges} / {badges.length} earned
            </Text>
          </View>
          <ProgressBar
            progress={Math.round((earnedBadges / Math.max(badges.length, 1)) * 100)}
            color={COLORS.secondary}
            height={6}
          />
        </Card>

        {/* Menu Items */}
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>BASE Wrestling v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.secondary,
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  profileRole: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: 1,
  },
  profileEmail: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 1,
  },
  badgePreview: {
    marginBottom: SPACING.lg,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badgeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  badgeCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  menuList: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
    width: 28,
    textAlign: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  menuArrow: {
    fontSize: 22,
    color: COLORS.textLight,
  },
  logoutBtn: {
    marginTop: SPACING.lg,
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
    marginTop: SPACING.md,
  },
});

export default MenuScreen;
