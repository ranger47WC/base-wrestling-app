import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import StarRating from '../components/StarRating';
import { auth } from '../config/firebase';
import { getProfile, getRoster, addAthleteToRoster, deleteAthlete } from '../services/profileService';

const GRADES = ['7', '8', '9', '10', '11', '12'];

const RosterScreen = () => {
  const user = auth.currentUser;
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamCode, setTeamCode] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('9');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadRoster();
  }, []);

  const loadRoster = async () => {
    try {
      const profile = await getProfile(user.uid);
      if (profile?.teamCode) {
        setTeamCode(profile.teamCode);
        const athletes = await getRoster(profile.teamCode);
        setRoster(athletes.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.log('Error loading roster:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAthlete = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Please enter the athlete\'s name.');
      return;
    }
    if (!teamCode) {
      Alert.alert('Error', 'No team found. Please set up your profile first.');
      return;
    }

    try {
      setAdding(true);
      await addAthleteToRoster(teamCode, {
        name: newName.trim(),
        grade: parseInt(newGrade),
        baseLevels: {
          battle: 2.0,
          athletic: 2.0,
          skill: 2.0,
          exercise: 2.0,
        },
      });
      setNewName('');
      await loadRoster();
    } catch (error) {
      Alert.alert('Error', 'Failed to add athlete.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteAthlete = (athlete) => {
    Alert.alert(
      'Remove Athlete',
      `Remove ${athlete.name} from the roster?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAthlete(teamCode, athlete.id);
              await loadRoster();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove athlete.');
            }
          },
        },
      ]
    );
  };

  const getOverallRating = (levels) => {
    if (!levels) return 0;
    const { battle = 0, athletic = 0, skill = 0, exercise = 0 } = levels;
    return Math.round(((battle + athletic + skill + exercise) / 4) * 10) / 10;
  };

  const renderAthlete = (athlete) => (
    <TouchableOpacity
      key={athlete.id}
      style={styles.athleteRow}
      onLongPress={() => handleDeleteAthlete(athlete)}
    >
      <View style={styles.athleteAvatar}>
        <Text style={styles.avatarText}>
          {athlete.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </Text>
      </View>
      <View style={styles.athleteInfo}>
        <Text style={styles.athleteName}>{athlete.name}</Text>
        <Text style={styles.athleteGrade}>Grade {athlete.grade}</Text>
      </View>
      <View style={styles.athleteRatings}>
        <StarRating rating={getOverallRating(athlete.baseLevels)} size={12} />
        <View style={styles.miniRatings}>
          <Text style={[styles.miniRating, { color: COLORS.battle }]}>
            B:{athlete.baseLevels?.battle?.toFixed(1) || '—'}
          </Text>
          <Text style={[styles.miniRating, { color: COLORS.athletic }]}>
            A:{athlete.baseLevels?.athletic?.toFixed(1) || '—'}
          </Text>
          <Text style={[styles.miniRating, { color: COLORS.skill }]}>
            S:{athlete.baseLevels?.skill?.toFixed(1) || '—'}
          </Text>
          <Text style={[styles.miniRating, { color: COLORS.exercise }]}>
            E:{athlete.baseLevels?.exercise?.toFixed(1) || '—'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Roster</Text>
            <Text style={styles.subtitle}>{roster.length} athletes</Text>
          </View>
          <Button
            title={showForm ? 'Cancel' : '+ Add'}
            variant={showForm ? 'outline' : 'primary'}
            onPress={() => setShowForm(!showForm)}
            style={styles.addBtn}
          />
        </View>

        {showForm && (
          <Card style={styles.formCard}>
            <Input
              label="Athlete Name"
              value={newName}
              onChangeText={setNewName}
              placeholder="First and last name"
              autoCapitalize="words"
            />
            <View style={styles.gradeRow}>
              <Text style={styles.gradeLabel}>Grade:</Text>
              {GRADES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.gradeOption, newGrade === g && styles.gradeSelected]}
                  onPress={() => setNewGrade(g)}
                >
                  <Text style={[styles.gradeText, newGrade === g && styles.gradeTextSelected]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.formButtons}>
              <Button
                title="Add Athlete"
                onPress={handleAddAthlete}
                loading={adding}
                style={styles.addAthleteBtn}
              />
              <Button
                title="Add Another"
                variant="secondary"
                onPress={async () => {
                  await handleAddAthlete();
                  setNewName('');
                }}
                loading={adding}
              />
            </View>
          </Card>
        )}

        {roster.length === 0 && !loading ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No athletes yet.</Text>
            <Text style={styles.emptyHint}>
              Tap "+ Add" to add athletes to your roster.
            </Text>
          </Card>
        ) : (
          <View style={styles.rosterList}>
            {roster.map(renderAthlete)}
          </View>
        )}

        {roster.length > 0 && (
          <Text style={styles.hint}>
            Long press an athlete to remove them from the roster.
          </Text>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  formCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  gradeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  gradeOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  gradeTextSelected: {
    color: COLORS.white,
  },
  formButtons: {
    gap: SPACING.sm,
  },
  addAthleteBtn: {
    marginBottom: 0,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptyHint: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  rosterList: {
    gap: SPACING.sm,
  },
  athleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  athleteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  athleteInfo: {
    flex: 1,
  },
  athleteName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  athleteGrade: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  athleteRatings: {
    alignItems: 'flex-end',
  },
  miniRatings: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  miniRating: {
    fontSize: 10,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontStyle: 'italic',
  },
});

export default RosterScreen;
