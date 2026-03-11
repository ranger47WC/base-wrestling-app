import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

const ProgressBar = ({ progress = 0, color = COLORS.primary, height = 8, showLabel = false, label }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label || ''}</Text>
          <Text style={styles.percent}>{clampedProgress}%</Text>
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            { width: `${clampedProgress}%`, backgroundColor: color, height },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  percent: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  track: {
    backgroundColor: '#E5E7EB',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BORDER_RADIUS.full,
  },
});

export default ProgressBar;
