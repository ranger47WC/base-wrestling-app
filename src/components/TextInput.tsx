import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors, fonts } from '../theme/theme';

interface TextInputProps extends RNTextInputProps {
  label: string;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error ? styles.inputError : undefined,
        ]}
        placeholderTextColor={colors.grayText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontFamily: fonts.header,
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.grayText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    height: 52,
    paddingHorizontal: 16,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.whiteText,
  },
  inputFocused: {
    borderColor: colors.gold,
  },
  inputError: {
    borderColor: colors.red,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.red,
    marginTop: 6,
  },
});
