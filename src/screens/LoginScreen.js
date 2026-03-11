import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  checkOnboardingComplete,
} from '../services/authService';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response.authentication);
    }
  }, [response]);

  const handleGoogleResponse = async (authentication) => {
    try {
      setGoogleLoading(true);
      const user = await loginWithGoogle(authentication.idToken);
      await navigateAfterAuth(user.uid);
    } catch (error) {
      Alert.alert('Google Sign-In Error', error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    try {
      setLoading(true);
      let user;
      if (isLogin) {
        user = await loginWithEmail(email, password);
      } else {
        user = await registerWithEmail(email, password);
      }
      await navigateAfterAuth(user.uid);
    } catch (error) {
      const message = error.code === 'auth/user-not-found'
        ? 'No account found. Create one instead?'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password.'
        : error.code === 'auth/email-already-in-use'
        ? 'Email already in use. Try logging in.'
        : error.message;
      Alert.alert('Authentication Error', message);
    } finally {
      setLoading(false);
    }
  };

  const navigateAfterAuth = async (uid) => {
    const onboardingComplete = await checkOnboardingComplete(uid);
    if (onboardingComplete) {
      navigation.replace('Dashboard');
    } else {
      navigation.replace('Profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>BASE</Text>
            </View>
            <Text style={styles.title}>Wrestling App</Text>
            <Text style={styles.subtitle}>
              Build the complete wrestler through{'\n'}
              Battle, Athletic, Skill & Exercise training
            </Text>
          </View>

          <View style={styles.form}>
            <Button
              title="Continue with Google"
              variant="google"
              icon="G"
              onPress={() => promptAsync()}
              loading={googleLoading}
              disabled={!request}
              style={styles.googleButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="coach@school.edu"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />

            <Button
              title={isLogin ? 'Log In' : 'Create Account'}
              onPress={handleEmailAuth}
              loading={loading}
              style={styles.authButton}
            />

            <Button
              title={isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
              variant="outline"
              onPress={() => setIsLogin(!isLogin)}
              style={styles.toggleButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  googleButton: {
    marginBottom: SPACING.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.textLight,
    fontSize: 13,
  },
  authButton: {
    marginTop: SPACING.sm,
  },
  toggleButton: {
    marginTop: SPACING.sm,
  },
});

export default LoginScreen;
