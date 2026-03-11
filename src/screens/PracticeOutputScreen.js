import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { auth } from '../config/firebase';
import { getPreferences } from '../services/preferencesService';
import { generatePractice, generateWeekPlan, generate21DayPlan } from '../services/practiceService';

const AREA_COLORS = {
  battle: COLORS.battle,
  athletic: COLORS.athletic,
  skill: COLORS.skill,
  exercise: COLORS.exercise,
};

const PracticeOutputScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [practice, setPractice] = useState(null);
  const [weekPlan, setWeekPlan] = useState([]);
  const [challengePlan, setChallengePlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    loadPractice();
  }, []);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const loadPractice = async () => {
    try {
      const prefs = await getPreferences(user.uid);
      const generatedPractice = generatePractice(prefs || {});
      const week = generateWeekPlan(prefs || {});
      const challenge = generate21DayPlan(prefs || {});
      setPractice(generatedPractice);
      setWeekPlan(week);
      setChallengePlan(challenge);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate practice.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startPracticeTimer = () => {
    setShowTimer(true);
    setTimerRunning(true);
    setTimerSeconds(0);
    setCurrentDrillIndex(0);
  };

  const stopTimer = () => {
    setTimerRunning(false);
    setShowTimer(false);
  };

  const printWeekPlan = async () => {
    const html = `
      <html>
        <head><style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #1B3A5C; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #1B3A5C; color: white; }
          .hard { color: #C0392B; font-weight: bold; }
          .light { color: #27AE60; }
          .rest { color: #6B7280; }
        </style></head>
        <body>
          <h1>BASE Wrestling — Week Plan</h1>
          <table>
            <tr><th>Day</th><th>Type</th><th>Focus</th><th>Intensity</th></tr>
            ${weekPlan.map((d) => `
              <tr>
                <td>${d.day}</td>
                <td class="${d.type.toLowerCase()}">${d.type}</td>
                <td>${d.focus}</td>
                <td>${d.intensity}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'Could not print week plan.');
    }
  };

  const allDrills = practice?.sections?.flatMap((s) => s.drills) || [];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating your practice...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Practice Header */}
        <Text style={styles.title}>{practice?.title}</Text>
        <Text style={styles.duration}>
          Total Duration: {practice?.totalDuration} minutes
        </Text>

        {/* Practice Sections */}
        {practice?.sections?.map((section, sIndex) => (
          <Card key={sIndex} style={[styles.sectionCard, { borderLeftColor: AREA_COLORS[section.area] || COLORS.primary }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionName, { color: AREA_COLORS[section.area] || COLORS.primary }]}>
                {section.name}
              </Text>
              <Text style={styles.sectionDuration}>{section.duration} min</Text>
            </View>
            {section.drills.map((drill, dIndex) => (
              <View key={dIndex} style={styles.drillItem}>
                <View style={styles.drillHeader}>
                  <Text style={styles.drillName}>{drill.name}</Text>
                  <Text style={styles.drillDuration}>{drill.duration} min</Text>
                </View>
                <Text style={styles.drillCue}>{drill.cue}</Text>
              </View>
            ))}
          </Card>
        ))}

        {/* Start Practice Button */}
        <Button
          title="Start This Practice"
          onPress={startPracticeTimer}
          style={styles.startButton}
        />

        {/* Week Plan */}
        <Text style={styles.sectionTitle}>Week Plan</Text>
        {weekPlan.map((day, index) => (
          <View key={index} style={styles.weekDay}>
            <View style={[styles.dayIndicator, {
              backgroundColor: day.type === 'Hard' ? COLORS.battle
                : day.type === 'Rest' ? COLORS.textLight
                : COLORS.skill
            }]} />
            <View style={styles.dayContent}>
              <Text style={styles.dayName}>{day.day}</Text>
              <Text style={styles.dayFocus}>{day.focus}</Text>
            </View>
            <View style={styles.dayMeta}>
              <Text style={[styles.dayType, {
                color: day.type === 'Hard' ? COLORS.battle
                  : day.type === 'Rest' ? COLORS.textLight
                  : COLORS.skill
              }]}>{day.type}</Text>
              <Text style={styles.dayIntensity}>{day.intensity}</Text>
            </View>
          </View>
        ))}

        <Button
          title="Print Week Plan"
          variant="secondary"
          onPress={printWeekPlan}
          style={styles.printButton}
        />

        {/* 21-Day Challenge Calendar Grid */}
        <Text style={styles.sectionTitle}>21-Day Challenge</Text>
        <View style={styles.calendarGrid}>
          {challengePlan.map((day, index) => (
            <View
              key={index}
              style={[
                styles.calendarDay,
                day.intensity === 'Rest' && styles.calendarRest,
                day.completed && styles.calendarCompleted,
              ]}
            >
              <Text style={styles.calendarDayNum}>Day {day.day}</Text>
              <Text style={styles.calendarTheme} numberOfLines={1}>{day.theme}</Text>
              <Text style={[styles.calendarIntensity, {
                color: day.intensity === 'Hard' ? COLORS.battle
                  : day.intensity === 'Rest' ? COLORS.textLight
                  : COLORS.skill
              }]}>{day.intensity}</Text>
            </View>
          ))}
        </View>

        <Button
          title="Go to Dashboard"
          variant="secondary"
          onPress={() => navigation.replace('Dashboard')}
          style={styles.dashButton}
        />
      </ScrollView>

      {/* Practice Timer Modal */}
      <Modal visible={showTimer} animationType="slide">
        <SafeAreaView style={styles.timerContainer}>
          <Text style={styles.timerTitle}>Practice Timer</Text>
          <Text style={styles.timerClock}>{formatTime(timerSeconds)}</Text>
          {allDrills[currentDrillIndex] && (
            <Card style={styles.timerDrillCard}>
              <Text style={styles.timerDrillName}>
                {allDrills[currentDrillIndex].name}
              </Text>
              <Text style={styles.timerDrillCue}>
                {allDrills[currentDrillIndex].cue}
              </Text>
              <Text style={styles.timerDrillDuration}>
                {allDrills[currentDrillIndex].duration} minutes
              </Text>
            </Card>
          )}
          <View style={styles.timerButtons}>
            <Button
              title={timerRunning ? 'Pause' : 'Resume'}
              onPress={() => setTimerRunning(!timerRunning)}
              style={styles.timerBtn}
            />
            {currentDrillIndex < allDrills.length - 1 && (
              <Button
                title="Next Drill"
                variant="secondary"
                onPress={() => setCurrentDrillIndex((i) => i + 1)}
                style={styles.timerBtn}
              />
            )}
            <Button
              title="End Practice"
              variant="outline"
              onPress={stopTimer}
              style={styles.timerBtn}
            />
          </View>
          <Text style={styles.timerProgress}>
            Drill {currentDrillIndex + 1} of {allDrills.length}
          </Text>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  duration: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  sectionCard: {
    borderLeftWidth: 4,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  sectionDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  drillItem: {
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  drillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drillName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  drillDuration: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  drillCue: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
    lineHeight: 19,
  },
  startButton: {
    marginVertical: SPACING.lg,
    backgroundColor: COLORS.accent,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  weekDay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  dayIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: SPACING.sm,
  },
  dayContent: {
    flex: 1,
  },
  dayName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayFocus: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dayMeta: {
    alignItems: 'flex-end',
  },
  dayType: {
    fontSize: 13,
    fontWeight: '700',
  },
  dayIntensity: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  printButton: {
    marginTop: SPACING.md,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  calendarDay: {
    width: '30%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  calendarRest: {
    backgroundColor: '#F3F4F6',
  },
  calendarCompleted: {
    backgroundColor: '#D1FAE5',
    borderColor: COLORS.success,
    borderWidth: 1,
  },
  calendarDayNum: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  calendarTheme: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  calendarIntensity: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  dashButton: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  // Timer styles
  timerContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  timerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  timerClock: {
    fontSize: 72,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.lg,
    fontVariant: ['tabular-nums'],
  },
  timerDrillCard: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  timerDrillName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  timerDrillCue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  timerDrillDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  timerButtons: {
    width: '100%',
    gap: SPACING.sm,
  },
  timerBtn: {
    marginBottom: SPACING.xs,
  },
  timerProgress: {
    color: COLORS.white,
    marginTop: SPACING.md,
    fontSize: 14,
  },
});

export default PracticeOutputScreen;
