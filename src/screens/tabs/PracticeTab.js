import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../../constants/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { auth } from '../../config/firebase';
import { getPreferences } from '../../services/preferencesService';
import { generatePractice, generateWeekPlan } from '../../services/practiceService';

const PracticeTab = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);

  const handleStartPractice = async () => {
    try {
      setLoading(true);
      const prefs = await getPreferences(user.uid);
      const practice = generatePractice(prefs || {});
      // Navigate to a practice output view within the main navigator
      navigation.getParent()?.navigate('PracticeOutput');
    } catch (error) {
      Alert.alert('Error', 'Failed to start practice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Practice</Text>
        <Text style={styles.subtitle}>Start or plan your next session.</Text>

        <Card style={styles.quickStart}>
          <View style={styles.quickStartContent}>
            <Text style={styles.quickStartTitle}>Quick Start</Text>
            <Text style={styles.quickStartDesc}>
              Generate a practice based on your saved preferences.
            </Text>
            <Button
              title="Generate Practice"
              onPress={handleStartPractice}
              loading={loading}
              style={styles.generateBtn}
            />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Practice Options</Text>

        <Card style={styles.optionCard} onPress={handleStartPractice}>
          <Text style={styles.optionIcon}>⚡</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Full BASE Practice</Text>
            <Text style={styles.optionDesc}>
              Complete practice with warm-up, technique, battle, and conditioning.
            </Text>
          </View>
        </Card>

        <Card style={styles.optionCard}>
          <Text style={styles.optionIcon}>🎯</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Skill Focus Session</Text>
            <Text style={styles.optionDesc}>
              Shorter session focused on technique drilling and repetition.
            </Text>
          </View>
        </Card>

        <Card style={styles.optionCard}>
          <Text style={styles.optionIcon}>⚔️</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Battle Day</Text>
            <Text style={styles.optionDesc}>
              Heavy live wrestling day — situational, scramble, and match practice.
            </Text>
          </View>
        </Card>

        <Card style={styles.optionCard}>
          <Text style={styles.optionIcon}>💪</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Conditioning Circuit</Text>
            <Text style={styles.optionDesc}>
              Wrestling-specific strength and conditioning workout.
            </Text>
          </View>
        </Card>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    paddingTop: SPACING.md,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    marginTop: 4,
  },
  quickStart: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  quickStartContent: {
    padding: SPACING.sm,
  },
  quickStartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  quickStartDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  generateBtn: {
    backgroundColor: COLORS.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    padding: SPACING.md,
  },
  optionIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default PracticeTab;
