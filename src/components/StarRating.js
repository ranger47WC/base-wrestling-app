import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const StarRating = ({ rating, size = 14, color = COLORS.secondary }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <View style={styles.container}>
      <Text style={[styles.stars, { fontSize: size, color }]}>
        {'★'.repeat(full)}
        {half ? '½' : ''}
        {'☆'.repeat(empty)}
      </Text>
      <Text style={[styles.value, { fontSize: size - 2, color }]}>{rating.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    marginRight: 4,
  },
  value: {
    fontWeight: '600',
  },
});

export default StarRating;
