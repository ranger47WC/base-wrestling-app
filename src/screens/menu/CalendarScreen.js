import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';

const CalendarScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Calendar</Text>
        <Card style={styles.placeholder}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.text}>Calendar view coming soon.</Text>
          <Text style={styles.hint}>
            Track your practices, events, and competitions on a visual calendar.
          </Text>
        </Card>
        <Button title="Back" variant="outline" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingTop: SPACING.xl },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  placeholder: { alignItems: 'center', paddingVertical: SPACING.xxl, marginBottom: SPACING.lg },
  icon: { fontSize: 48, marginBottom: SPACING.md },
  text: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  hint: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 20 },
});

export default CalendarScreen;
