import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../../constants/theme';
import BASECard from '../../components/BASECard';
import Card from '../../components/Card';
import Button from '../../components/Button';
import TooltipHint from '../../components/TooltipHint';
import { auth } from '../../config/firebase';
import { getProfile, getRoster } from '../../services/profileService';
import { getBASEOverview } from '../../services/dashboardService';

const HomeTab = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [profile, setProfile] = useState(null);
  const [roster, setRoster] = useState([]);
  const [baseData, setBaseData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    loadData();
    checkFirstVisit();
  }, []);

  const checkFirstVisit = async () => {
    const visited = await AsyncStorage.getItem('dashboard_visited');
    if (!visited) {
      setShowTooltip(true);
      await AsyncStorage.setItem('dashboard_visited', 'true');
    }
  };

  const loadData = async () => {
    try {
      const prof = await getProfile(user.uid);
      setProfile(prof);
      if (prof?.teamCode) {
        const athletes = await getRoster(prof.teamCode);
        setRoster(athletes);
        setBaseData(getBASEOverview(athletes));
      } else {
        setBaseData(getBASEOverview([]));
      }
    } catch (error) {
      console.log('Error loading dashboard:', error);
      setBaseData(getBASEOverview([]));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStartPractice = () => {
    navigation.getParent()?.navigate('PracticeOutput');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.teamNameHeader}>
              {profile?.teamName || 'Your Team'}
            </Text>
            <Text style={styles.baseSubtitle}>BASE Wrestling</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{roster.length}</Text>
            <Text style={styles.statLabel}>Athletes</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Practices</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </Card>
        </View>

        {/* BASE Area Cards */}
        <View style={styles.baseSection}>
          <Text style={styles.sectionTitle}>Team BASE Overview</Text>
          <TooltipHint
            message="These cards show your team's average rating in each BASE area."
            visible={showTooltip}
            onDismiss={() => setShowTooltip(false)}
          />
          {baseData.map((item) => (
            <BASECard
              key={item.key}
              area={item.area}
              subtitle={item.subtitle}
              average={item.average}
              color={item.color}
              icon={item.icon}
              description={item.description}
            />
          ))}
        </View>

        {/* Attendance Button */}
        <Button
          title="Take Attendance"
          variant="secondary"
          onPress={() => {}}
          style={styles.attendanceButton}
        />

        {/* Start Practice Button */}
        <Button
          title="Start Practice"
          onPress={handleStartPractice}
          style={styles.startButton}
        />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    paddingTop: SPACING.md,
  },
  teamNameHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  baseSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  baseSection: {
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  attendanceButton: {
    marginTop: SPACING.lg,
  },
  startButton: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.accent,
  },
});

export default HomeTab;
