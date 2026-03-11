import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import Button from '../components/Button';
import OptionPicker from '../components/OptionPicker';
import { auth } from '../config/firebase';
import { PREFERENCE_OPTIONS, savePreferences } from '../services/preferencesService';
import { completeOnboarding } from '../services/profileService';

const PreferencesScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState({
    positions: '',
    stancePreference: '',
    battleFocus: [],
    athleticFocus: [],
    skillFocus: [],
    exerciseFocus: [],
    hardDaysPerWeek: '3',
    trainingPurpose: '',
    practiceDuration: '90 minutes',
  });

  const updatePref = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!prefs.positions || !prefs.trainingPurpose) {
      Alert.alert('Missing Info', 'Please select at least positions and training purpose.');
      return;
    }

    try {
      setLoading(true);
      await savePreferences(user.uid, prefs);
      await completeOnboarding(user.uid);
      navigation.replace('Interstitial');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Training Preferences</Text>
        <Text style={styles.subtitle}>
          Customize how BASE builds your practices. You can change these anytime.
        </Text>

        <OptionPicker
          label="Position Focus"
          options={PREFERENCE_OPTIONS.positions}
          selected={prefs.positions}
          onSelect={(v) => updatePref('positions', v)}
        />

        <OptionPicker
          label="Stance Preference"
          options={PREFERENCE_OPTIONS.stancePreference}
          selected={prefs.stancePreference}
          onSelect={(v) => updatePref('stancePreference', v)}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Battle Awareness Focus</Text>
          <Text style={styles.sectionHint}>Select multiple areas</Text>
        </View>
        <OptionPicker
          options={PREFERENCE_OPTIONS.battleFocus}
          selected={prefs.battleFocus}
          onSelect={(v) => updatePref('battleFocus', v)}
          multiple
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Athletic Development Focus</Text>
          <Text style={styles.sectionHint}>Select multiple areas</Text>
        </View>
        <OptionPicker
          options={PREFERENCE_OPTIONS.athleticFocus}
          selected={prefs.athleticFocus}
          onSelect={(v) => updatePref('athleticFocus', v)}
          multiple
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Skill Mastery Focus</Text>
          <Text style={styles.sectionHint}>Select techniques to emphasize</Text>
        </View>
        <OptionPicker
          options={PREFERENCE_OPTIONS.skillFocus}
          selected={prefs.skillFocus}
          onSelect={(v) => updatePref('skillFocus', v)}
          multiple
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercise Conditioning Focus</Text>
          <Text style={styles.sectionHint}>Select conditioning priorities</Text>
        </View>
        <OptionPicker
          options={PREFERENCE_OPTIONS.exerciseFocus}
          selected={prefs.exerciseFocus}
          onSelect={(v) => updatePref('exerciseFocus', v)}
          multiple
        />

        <OptionPicker
          label="Hard Practice Days Per Week"
          options={PREFERENCE_OPTIONS.hardDaysPerWeek}
          selected={prefs.hardDaysPerWeek}
          onSelect={(v) => updatePref('hardDaysPerWeek', v)}
        />

        <OptionPicker
          label="Training Purpose"
          options={PREFERENCE_OPTIONS.trainingPurpose}
          selected={prefs.trainingPurpose}
          onSelect={(v) => updatePref('trainingPurpose', v)}
        />

        <OptionPicker
          label="Practice Duration"
          options={PREFERENCE_OPTIONS.practiceDuration}
          selected={prefs.practiceDuration}
          onSelect={(v) => updatePref('practiceDuration', v)}
        />

        <Button
          title="Build My Practice"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
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
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  saveButton: {
    marginTop: SPACING.lg,
  },
});

export default PreferencesScreen;
