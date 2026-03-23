import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TextInput } from '../../components/TextInput';
import { GoldButton } from '../../components/GoldButton';
import { mockAuth } from '../../services/mockAuth';
import { colors, fonts, spacing } from '../../theme/theme';
import { RootStackParamList } from '../../navigation/types';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await mockAuth.login(email, password);
      navigation.replace('Onboarding');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>BASE</Text>
          <Text style={styles.subtitle}>WRESTLING</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>TRAIN THE PROCESS</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            placeholder="coach@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            placeholder="Enter password"
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <GoldButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontFamily: fonts.header,
    fontSize: 64,
    letterSpacing: 6,
    color: colors.gold,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: fonts.header,
    fontSize: 28,
    letterSpacing: 8,
    color: colors.whiteText,
    textTransform: 'uppercase',
    marginTop: -8,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: colors.gold,
    marginVertical: spacing.md,
  },
  tagline: {
    fontFamily: fonts.header,
    fontSize: 14,
    letterSpacing: 4,
    color: colors.grayText,
    textTransform: 'uppercase',
  },
  form: {
    width: '100%',
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
