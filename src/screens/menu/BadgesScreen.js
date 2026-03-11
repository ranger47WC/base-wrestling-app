import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';
import { getUserBadges } from '../../services/badgeService';

const BadgesScreen = ({ navigation }) => {
  const badges = getUserBadges({});

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Badges</Text>
        <Text style={styles.subtitle}>
          Earn badges by completing practices, building streaks, and developing your team.
        </Text>

        {badges.map((badge) => (
          <Card key={badge.id} style={[styles.badgeCard, badge.earned && styles.badgeEarned]}>
            <View style={styles.badgeRow}>
              <Text style={[styles.badgeIcon, !badge.earned && styles.badgeIconLocked]}>
                {badge.icon}
              </Text>
              <View style={styles.badgeInfo}>
                <Text style={[styles.badgeName, badge.earned && styles.badgeNameEarned]}>
                  {badge.name}
                </Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>
              </View>
            </View>
            <ProgressBar
              progress={badge.progressPercent}
              color={badge.earned ? COLORS.success : COLORS.primary}
              height={6}
              showLabel
              label={`${badge.progress} / ${badge.requirement}`}
            />
          </Card>
        ))}

        <Button title="Back" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: SPACING.md }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.xxl },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.lg, lineHeight: 20 },
  badgeCard: { marginBottom: SPACING.md, padding: SPACING.md },
  badgeEarned: { borderWidth: 1, borderColor: COLORS.success, backgroundColor: '#F0FDF4' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  badgeIcon: { fontSize: 32, marginRight: SPACING.md },
  badgeIconLocked: { opacity: 0.4 },
  badgeInfo: { flex: 1 },
  badgeName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  badgeNameEarned: { color: COLORS.success },
  badgeDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
});

export default BadgesScreen;
