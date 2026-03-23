import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GoldButton } from '../components/GoldButton';
import { mockAuth } from '../services/mockAuth';
import { colors, fonts, spacing } from '../theme/theme';

type Props = {
  navigation: any;
};

export const CoachDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogout = async () => {
    await mockAuth.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>COACH DASHBOARD</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Welcome to BASE Wrestling</Text>
      </View>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Dashboard screens coming soon.
        </Text>
      </View>

      <View style={styles.footer}>
        <GoldButton title="Sign Out" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.header,
    fontSize: 28,
    letterSpacing: 3,
    color: colors.gold,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.gold,
    marginVertical: spacing.md,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.lightText,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  placeholderText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.grayText,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
