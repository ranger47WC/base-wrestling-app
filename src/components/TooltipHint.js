import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from '../constants/theme';

const TooltipHint = ({ message, visible, onDismiss, position = 'bottom' }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' && styles.top,
        { opacity: fadeAnim },
      ]}
    >
      <View style={styles.tooltip}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={onDismiss} style={styles.dismiss}>
          <Text style={styles.dismissText}>Got it</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  top: {
    bottom: undefined,
    top: -60,
  },
  tooltip: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  message: {
    color: COLORS.white,
    fontSize: 13,
    flex: 1,
    marginRight: SPACING.sm,
  },
  dismiss: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dismissText: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: 13,
  },
});

export default TooltipHint;
