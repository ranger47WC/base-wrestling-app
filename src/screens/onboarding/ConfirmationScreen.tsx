import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { GoldButton } from '../../components/GoldButton';
import { ProgressBar } from '../../components/ProgressBar';
import { colors, fonts, spacing } from '../../theme/theme';
import { OnboardingStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Confirmation'>;
  route: RouteProp<OnboardingStackParamList, 'Confirmation'>;
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export const ConfirmationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { coachName, phone, teamName, level } = route.params;

  const handleFinish = () => {
    // In the future, this will save to Firebase and navigate to Coach Dashboard
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'CoachDashboard' as any }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <ProgressBar currentStep={3} totalSteps={3} />
        <Text style={styles.stepLabel}>Step 3 of 3</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>YOU'RE ALL SET</Text>
        <Text style={styles.description}>
          Review your info below. You can always update this later in settings.
        </Text>

        <View style={styles.card}>
          <InfoRow label="Coach" value={coachName} />
          {phone ? <InfoRow label="Phone" value={phone} /> : null}
          <View style={styles.separator} />
          <InfoRow label="Team" value={teamName} />
          <InfoRow label="Level" value={level} />
        </View>

        <View style={styles.readyBadge}>
          <Text style={styles.readyText}>READY TO COACH</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <GoldButton title="Go to Dashboard" onPress={handleFinish} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  stepLabel: {
    fontFamily: fonts.header,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.grayText,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontFamily: fonts.header,
    fontSize: 32,
    letterSpacing: 3,
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.lightText,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontFamily: fonts.header,
    fontSize: 13,
    letterSpacing: 2,
    color: colors.grayText,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.whiteText,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 6,
  },
  readyBadge: {
    alignSelf: 'center',
    marginTop: spacing.xl,
    backgroundColor: colors.goldGlow,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  readyText: {
    fontFamily: fonts.header,
    fontSize: 16,
    letterSpacing: 3,
    color: colors.gold,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
