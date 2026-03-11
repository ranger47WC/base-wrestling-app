import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

const BASECard = ({ area, subtitle, average, color, icon, description, onPress }) => {
  const starDisplay = () => {
    const full = Math.floor(average);
    const half = average % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      '★'.repeat(full) +
      (half ? '½' : '') +
      '☆'.repeat(empty)
    );
  };

  return (
    <Card style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.area}>{area}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, { color }]}>{average.toFixed(1)}</Text>
          <Text style={[styles.stars, { color }]}>{starDisplay()}</Text>
        </View>
      </View>
      {description && <Text style={styles.description}>{description}</Text>}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  area: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: 20,
    fontWeight: '700',
  },
  stars: {
    fontSize: 10,
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 18,
  },
});

export default BASECard;
