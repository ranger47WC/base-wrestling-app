import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import OptionPicker from '../components/OptionPicker';
import Card from '../components/Card';
import { auth } from '../config/firebase';
import { saveProfile, createTeam } from '../services/profileService';
import { SEED_ATHLETES } from '../constants/seedData';
import { addAthleteToRoster } from '../services/profileService';

const ROLES = ['Head Coach', 'Assistant Coach', 'Athlete'];

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [teamName, setTeamName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [teamCode, setTeamCode] = useState(null);

  const isCoach = role === 'Head Coach' || role === 'Assistant Coach';

  const handleSave = async () => {
    if (!fullName || !role) {
      Alert.alert('Missing Info', 'Please fill in your name and select a role.');
      return;
    }
    if (isCoach && !teamName) {
      Alert.alert('Missing Info', 'Please enter your team/club name.');
      return;
    }

    try {
      setLoading(true);

      const profileData = {
        fullName,
        email,
        role,
        teamName: isCoach ? teamName : '',
        createdAt: new Date().toISOString(),
      };

      await saveProfile(user.uid, profileData);

      let code = teamCode;
      if (isCoach && !teamCode) {
        code = await createTeam(user.uid, teamName);
        setTeamCode(code);

        // Seed roster with 30 placeholder athletes
        for (const athlete of SEED_ATHLETES) {
          await addAthleteToRoster(code, athlete);
        }
      }

      navigation.replace('Preferences');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const shareTeamCode = async () => {
    if (teamCode) {
      await Share.share({
        message: `Join my wrestling team on BASE! Use team code: ${teamCode}`,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Set Up Your Profile</Text>
        <Text style={styles.subtitle}>
          Tell us about yourself so we can customize your experience.
        </Text>

        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          autoCapitalize="words"
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          keyboardType="email-address"
          editable={false}
        />

        <OptionPicker
          label="Your Role"
          options={ROLES}
          selected={role}
          onSelect={setRole}
        />

        {isCoach && (
          <Input
            label="Team / Club Name"
            value={teamName}
            onChangeText={setTeamName}
            placeholder="e.g., Lincoln High Wrestling"
            autoCapitalize="words"
          />
        )}

        {teamCode && (
          <Card style={styles.codeCard}>
            <Text style={styles.codeLabel}>Your Team Code</Text>
            <Text style={styles.codeValue}>{teamCode}</Text>
            <Text style={styles.codeHint}>
              Share this code with your assistant coaches and athletes.
            </Text>
            <Button
              title="Share Code"
              variant="secondary"
              onPress={shareTeamCode}
              style={styles.shareButton}
            />
          </Card>
        )}

        <Button
          title="Continue"
          onPress={handleSave}
          loading={loading}
          style={styles.continueButton}
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
  codeCard: {
    backgroundColor: '#EBF5FB',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  codeLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  codeValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 4,
    marginBottom: SPACING.sm,
  },
  codeHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  shareButton: {
    marginTop: SPACING.xs,
  },
  continueButton: {
    marginTop: SPACING.md,
  },
});

export default ProfileScreen;
