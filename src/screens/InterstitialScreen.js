import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';

const InterstitialScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('PracticeOutput');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleTap = () => {
    navigation.replace('PracticeOutput');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        onPress={handleTap}
        activeOpacity={0.9}
      >
        <Animated.View
          style={[
            styles.textContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.welcomeText}>Welcome to</Text>

          <View style={styles.logoContainer}>
            <Text style={styles.logoB}>B</Text>
            <Text style={styles.logoA}>A</Text>
            <Text style={styles.logoS}>S</Text>
            <Text style={styles.logoE}>E</Text>
          </View>

          <Text style={styles.tagline}>
            Build the complete wrestler through{'\n'}
            Battle, Athletic, Skill & Exercise training
          </Text>

          <View style={styles.button}>
            <Text style={styles.buttonText}>Show me my first practice</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  textContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SPACING.md,
  },
  logoContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
  logoB: {
    fontSize: 56,
    fontWeight: '900',
    color: COLORS.battle,
    marginHorizontal: 4,
  },
  logoA: {
    fontSize: 56,
    fontWeight: '900',
    color: COLORS.athletic,
    marginHorizontal: 4,
  },
  logoS: {
    fontSize: 56,
    fontWeight: '900',
    color: COLORS.skill,
    marginHorizontal: 4,
  },
  logoE: {
    fontSize: 56,
    fontWeight: '900',
    color: COLORS.exercise,
    marginHorizontal: 4,
  },
  tagline: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING.xxl,
  },
  button: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 30,
    ...SHADOWS.md,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '700',
  },
});

export default InterstitialScreen;
