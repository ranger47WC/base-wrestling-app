import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';

const GUIDES = [
  {
    title: 'What is BASE?',
    content: 'BASE is a holistic wrestling development framework. It stands for Battle awareness, Athletic ability, Skill mastery, and Exercise conditioning. Each practice is built to develop all four areas.',
    color: COLORS.primary,
  },
  {
    title: 'Battle Awareness',
    content: 'Live wrestling IQ — the ability to compete, scramble, and make decisions in real-time match situations. Developed through live drilling, situational wrestling, and match simulations.',
    color: COLORS.battle,
  },
  {
    title: 'Athletic Ability',
    content: 'Physical tools — speed, agility, explosiveness, balance, and coordination. Developed through dynamic warm-ups, agility drills, and sport-specific movement training.',
    color: COLORS.athletic,
  },
  {
    title: 'Skill Mastery',
    content: 'Technical proficiency across all positions. Single legs, double legs, throws, tilts, turns, escapes, and more. Developed through focused drilling and repetition.',
    color: COLORS.skill,
  },
  {
    title: 'Exercise Conditioning',
    content: 'Strength, endurance, and physical preparation. Wrestling-specific conditioning that builds the engine to compete at full speed for 6 minutes and beyond.',
    color: COLORS.exercise,
  },
];

const TrainingGuideScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Training Guide</Text>
        <Text style={styles.subtitle}>
          Understanding the BASE framework for complete wrestler development.
        </Text>
        {GUIDES.map((guide, index) => (
          <Card key={index} style={[styles.guideCard, { borderLeftColor: guide.color }]}>
            <Text style={[styles.guideTitle, { color: guide.color }]}>{guide.title}</Text>
            <Text style={styles.guideContent}>{guide.content}</Text>
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
  guideCard: { borderLeftWidth: 4, marginBottom: SPACING.md },
  guideTitle: { fontSize: 16, fontWeight: '700', marginBottom: SPACING.xs },
  guideContent: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 21 },
});

export default TrainingGuideScreen;
