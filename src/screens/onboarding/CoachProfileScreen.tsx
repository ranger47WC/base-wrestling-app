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
import { TextInput } from '../../components/TextInput';
import { GoldButton } from '../../components/GoldButton';
import { ProgressBar } from '../../components/ProgressBar';
import { colors, fonts, spacing } from '../../theme/theme';
import { OnboardingStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'CoachProfile'>;
};

export const CoachProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const canContinue = firstName.trim() && lastName.trim();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topBar}>
        <ProgressBar currentStep={1} totalSteps={3} />
        <Text style={styles.stepLabel}>Step 1 of 3</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>COACH PROFILE</Text>
        <Text style={styles.description}>
          Tell us about yourself so your athletes can find you.
        </Text>

        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Andy"
          autoCapitalize="words"
        />

        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Hrovat"
          autoCapitalize="words"
        />

        <TextInput
          label="Phone (optional)"
          value={phone}
          onChangeText={setPhone}
          placeholder="(555) 123-4567"
          keyboardType="phone-pad"
        />
      </ScrollView>

      <View style={styles.footer}>
        <GoldButton
          title="Continue"
          onPress={() =>
            navigation.navigate('TeamSetup', {
              coachName: `${firstName} ${lastName}`,
              phone,
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
