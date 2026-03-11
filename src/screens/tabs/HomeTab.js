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
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../../constants/theme';
import BASECard from '../../components/BASECard';
import Card from '../../components/Card';
import TooltipHint from '../../components/TooltipHint';
import { auth } from '../../config/firebase';
import { getProfile } from '../../services/profileService';
import { getRoster } from '../../services/profileService';
import { getBASEOverview } from '../../services/dashboardService';

const HomeTab = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Welcome back{profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}
            </Text>
            <Text style={styles.teamName}>
              {profile?.teamName || 'Your Team'}
            </Text>
          </View>
          {profile?.teamCode && (
            <View style={styles.codeBadge}>
              <Text style={styles.codeLabel}>Team Code</Text>
              <Text style={styles.codeText}>{profile.teamCode}</Text>
            </View>
          )}
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
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  teamName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  codeBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 9,
    color: COLORS.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  codeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1,
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
});

export default HomeTab;
