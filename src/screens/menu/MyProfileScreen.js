import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { auth } from '../../config/firebase';
import { getProfile, saveProfile } from '../../services/profileService';

const MyProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const prof = await getProfile(user.uid);
    if (prof) setProfile(prof);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveProfile(user.uid, profile);
      Alert.alert('Saved', 'Profile updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Profile</Text>
        <Input
          label="Full Name"
          value={profile.fullName || ''}
          onChangeText={(v) => setProfile({ ...profile, fullName: v })}
          autoCapitalize="words"
        />
        <Input
          label="Email"
          value={profile.email || user?.email || ''}
          editable={false}
        />
        <Input
          label="Role"
          value={profile.role || ''}
          editable={false}
        />
        <Input
          label="Team Name"
          value={profile.teamName || ''}
          onChangeText={(v) => setProfile({ ...profile, teamName: v })}
          autoCapitalize="words"
        />
        <Button title="Save Changes" onPress={handleSave} loading={loading} />
        <Button title="Back" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: SPACING.sm }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingTop: SPACING.xl },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
});

export default MyProfileScreen;
