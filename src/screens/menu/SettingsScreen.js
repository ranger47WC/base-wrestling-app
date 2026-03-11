import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </Card>

        <Button title="Back" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: SPACING.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingTop: SPACING.xl },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  settingCard: { padding: 0, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  settingLabel: { fontSize: 15, color: COLORS.text },
  arrow: { fontSize: 20, color: COLORS.textLight },
});

export default SettingsScreen;
