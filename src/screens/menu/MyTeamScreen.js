import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Share,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { auth } from '../../config/firebase';
import { getProfile, getRoster } from '../../services/profileService';
import { getBASEOverview } from '../../services/dashboardService';

const MyTeamScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState(null);
  const [roster, setRoster] = useState([]);
  const [baseData, setBaseData] = useState([]);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const prof = await getProfile(user.uid);
    setProfile(prof);
    if (prof?.teamCode) {
      const athletes = await getRoster(prof.teamCode);
      setRoster(athletes);
      setBaseData(getBASEOverview(athletes));
    }
  };

  const shareCode = async () => {
    if (profile?.teamCode) {
      await Share.share({
        message: `Join my wrestling team on BASE! Team code: ${profile.teamCode}`,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Team</Text>
        <Card style={styles.teamCard}>
          <Text style={styles.teamName}>{profile?.teamName || 'Your Team'}</Text>
          <Text style={styles.teamCode}>Code: {profile?.teamCode || '—'}</Text>
          <Text style={styles.teamCount}>{roster.length} athletes</Text>
          <Button title="Share Team Code" variant="secondary" onPress={shareCode} style={{ marginTop: SPACING.md }} />
        </Card>

        <Text style={styles.sectionTitle}>Team Averages</Text>
        {baseData.map((item) => (
          <View key={item.key} style={styles.avgRow}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.avgLabel}>{item.area}</Text>
            <Text style={[styles.avgValue, { color: item.color }]}>{item.average.toFixed(1)}</Text>
          </View>
        ))}

        <Button title="Back" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: SPACING.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingTop: SPACING.xl },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  teamCard: { alignItems: 'center', padding: SPACING.lg, marginBottom: SPACING.lg },
  teamName: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  teamCode: { fontSize: 16, color: COLORS.textSecondary, marginTop: 4, letterSpacing: 2 },
  teamCount: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  avgRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: SPACING.sm },
  avgLabel: { flex: 1, fontSize: 15, color: COLORS.text },
  avgValue: { fontSize: 16, fontWeight: '700' },
});

export default MyTeamScreen;
