import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

const OptionPicker = ({
  label,
  options = [],
  selected,
  onSelect,
  multiple = false,
  style,
}) => {
  const isSelected = (option) => {
    if (multiple) {
      return Array.isArray(selected) && selected.includes(option);
    }
    return selected === option;
  };

  const handleSelect = (option) => {
    if (multiple) {
      const current = Array.isArray(selected) ? [...selected] : [];
      const index = current.indexOf(option);
      if (index >= 0) {
        current.splice(index, 1);
      } else {
        current.push(option);
      }
      onSelect(current);
    } else {
      onSelect(option);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.optionsWrap}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, isSelected(option) && styles.optionSelected]}
            onPress={() => handleSelect(option)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, isSelected(option) && styles.optionTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.white,
  },
});

export default OptionPicker;
