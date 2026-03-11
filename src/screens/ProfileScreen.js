import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import OptionPicker from '../components/OptionPicker';
import Card from '../components/Card';
import { auth } from '../config/firebase';
import { saveProfile, createTeam, getProfile } from '../services/profileService';
import { SEED_ATHLETES } from '../constants/seedData';
import { addAthleteToRoster } from '../services/profileService';

const ROLES = ['Head Coach', 'Assistant Coach', 'Volunteer Coach'];
const AGE_GROUPS = ['Middle School', 'High School', 'Club'];
const GENDERS = ['Coed', 'Boys Only', 'Girls Only'];

const ProfileScreen = ({ navigation, route }) => {
  const user = auth.currentUser;
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [role, setRole] = useState('');
  const [teams, setTeams] = useState([
    { teamName: '', ageGroup: '', gender: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    try {
      const prof = await getProfile(user.uid);
      if (prof) {
        setFullName(prof.fullName || user?.displayName || '');
        setEmail(prof.email || user?.email || '');
        setCity(prof.city || '');
        setState(prof.state || '');
        setRole(prof.role || '');
        if (prof.teams && prof.teams.length > 0) {
          setTeams(prof.teams);
        } else if (prof.teamName) {
          setTeams([{
            teamName: prof.teamName,
            ageGroup: prof.ageGroup || '',
            gender: prof.gender || '',
            teamCode: prof.teamCode || null,
          }]);
        }
      }
    } catch (error) {
      // First time - no profile yet
    } finally {
      setLoadingProfile(false);
    }
  };

  const updateTeam = (index, field, value) => {
    setTeams((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addTeam = () => {
    setTeams((prev) => [...prev, { teamName: '', ageGroup: '', gender: '' }]);
  };

  const removeTeam = (index) => {
    if (teams.length <= 1) return;
    setTeams((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!fullName || !role) {
      Alert.alert('Missing Info', 'Please fill in your name and select a role.');
      return;
    }
    if (!teams[0].teamName) {
      Alert.alert('Missing Info', 'Please enter at least one team name.');
      return;
    }

    try {
      setLoading(true);

      // Create teams and generate codes for any that don't have one
      const updatedTeams = [];
      for (const team of teams) {
        if (!team.teamName) continue;
        let teamCode = team.teamCode || null;
        if (!teamCode) {
          teamCode = await createTeam(user.uid, team.teamName);
          // Seed roster with placeholder athletes for new team
          for (const athlete of SEED_ATHLETES) {
            await addAthleteToRoster(teamCode, athlete);
          }
        }
        updatedTeams.push({
          teamName: team.teamName,
          ageGroup: team.ageGroup,
          gender: team.gender,
          teamCode,
        });
      }

      const profileData = {
        fullName,
        email,
        city,
        state,
        role,
        teams: updatedTeams,
        teamName: updatedTeams[0]?.teamName || '',
        teamCode: updatedTeams[0]?.teamCode || '',
        ageGroup: updatedTeams[0]?.ageGroup || '',
        gender: updatedTeams[0]?.gender || '',
        createdAt: new Date().toISOString(),
      };

      await saveProfile(user.uid, profileData);

      navigation.replace('Preferences');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Input
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="e.g., Lincoln"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.halfField}>
            <Input
              label="State"
              value={state}
              onChangeText={setState}
              placeholder="e.g., NE"
              autoCapitalize="characters"
            />
          </View>
        </View>

        <OptionPicker
          label="Your Role"
          options={ROLES}
          selected={role}
          onSelect={setRole}
        />

        {teams.map((team, index) => (
          <Card key={index} style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <Text style={styles.teamLabel}>
                {teams.length > 1 ? `Team ${index + 1}` : 'Team Info'}
              </Text>
              {teams.length > 1 && (
                <TouchableOpacity onPress={() => removeTeam(index)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            <Input
              label="Team Name"
              value={team.teamName}
              onChangeText={(v) => updateTeam(index, 'teamName', v)}
              placeholder="e.g., Lincoln High Wrestling"
              autoCapitalize="words"
            />

            <OptionPicker
              label="Age Group"
              options={AGE_GROUPS}
              selected={team.ageGroup}
              onSelect={(v) => updateTeam(index, 'ageGroup', v)}
            />

            <OptionPicker
              label="Gender"
              options={GENDERS}
              selected={team.gender}
              onSelect={(v) => updateTeam(index, 'gender', v)}
            />
          </Card>
        ))}

        <TouchableOpacity style={styles.addTeamBtn} onPress={addTeam}>
          <Text style={styles.addTeamText}>+ Add Another Team</Text>
        </TouchableOpacity>

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
    paddingBottom: SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
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
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfField: {
    flex: 1,
  },
  teamCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  teamLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  removeText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '500',
  },
  addTeamBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  addTeamText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  continueButton: {
    marginTop: SPACING.md,
  },
});

export default ProfileScreen;
