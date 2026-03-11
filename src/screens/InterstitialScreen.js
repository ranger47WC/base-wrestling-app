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

  const handleSkip = () => {
    navigation.replace('PracticeOutput');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        onPress={handleSkip}
        activeOpacity={0.9}
      >
        <Animated.View
          style={[
            styles.textContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoB}>B</Text>
            <Text style={styles.logoA}>A</Text>
            <Text style={styles.logoS}>S</Text>
            <Text style={styles.logoE}>E</Text>
          </View>

          <Text style={styles.message}>
            Based on your preferences, BASE builds practices that develop the
            complete wrestler —
          </Text>

          <View style={styles.pillars}>
            <View style={[styles.pillar, { backgroundColor: COLORS.battle }]}>
              <Text style={styles.pillarText}>Battle Awareness</Text>
            </View>
            <View style={[styles.pillar, { backgroundColor: COLORS.athletic }]}>
              <Text style={styles.pillarText}>Athletic Ability</Text>
            </View>
            <View style={[styles.pillar, { backgroundColor: COLORS.skill }]}>
              <Text style={styles.pillarText}>Skill Mastery</Text>
            </View>
            <View style={[styles.pillar, { backgroundColor: COLORS.exercise }]}>
              <Text style={styles.pillarText}>Exercise Conditioning</Text>
            </View>
          </View>

          <Text style={styles.readyText}>Here's your first practice.</Text>

          <View style={styles.button}>
            <Text style={styles.buttonText}>Show me</Text>
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
  logoContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
  logoB: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.battle,
    marginHorizontal: 4,
  },
  logoA: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.athletic,
    marginHorizontal: 4,
  },
  logoS: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.skill,
    marginHorizontal: 4,
  },
  logoE: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.exercise,
    marginHorizontal: 4,
  },
  message: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: SPACING.lg,
  },
  pillars: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  pillar: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  pillarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  readyText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    ...SHADOWS.md,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default InterstitialScreen;
