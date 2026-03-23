import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { TextInput } from '../../components/TextInput';
import { GoldButton } from '../../components/GoldButton';
import { ProgressBar } from '../../components/ProgressBar';
import { colors, fonts, spacing } from '../../theme/theme';
import { OnboardingStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'TeamSetup'>;
  route: RouteProp<OnboardingStackParamList, 'TeamSetup'>;
};

const LEVELS = ['Youth', 'Middle School', 'High School', 'Club'] as const;

export const TeamSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const { coachName, phone } = route.params;
  const [teamName, setTeamName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const canContinue = teamName.trim() && selectedLevel;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topBar}>
        <ProgressBar currentStep={2} totalSteps={3} />
        <Text style={styles.stepLabel}>Step 2 of 3</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>TEAM SETUP</Text>
        <Text style={styles.description}>
          Set up your team so athletes can join your roster.
        </Text>

        <TextInput
          label="Team Name"
          value={teamName}
          onChangeText={setTeamName}
          placeholder="Ranger-47 Wrestling Club"
          autoCapitalize="words"
        />

        <Text style={styles.sectionLabel}>LEVEL</Text>
        <View style={styles.levelGrid}>
          {LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelChip,
                selectedLevel === level && styles.levelChipSelected,
              ]}
              onPress={() => setSelectedLevel(level)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.levelChipText,
                  selectedLevel === level && styles.levelChipTextSelected,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <GoldButton
          title="Continue"
          onPress={() =>
            navigation.navigate('Confirmation', {
              coachName,
              phone,
              teamName,
              level: selectedLevel,
            })
          }
          disabled={!canContinue}
        />
      </View>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
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
  sectionLabel: {
    fontFamily: fonts.header,
    fontSize: 14,
    letterSpacing: 2,
    color: colors.grayText,
    marginBottom: spacing.sm,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  levelChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelChipSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.goldGlow,
  },
  levelChipText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.grayText,
  },
  levelChipTextSelected: {
    color: colors.gold,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
