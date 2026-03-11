import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Linking } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';

const HelpScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Help / Contact</Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Need Help?</Text>
          <Text style={styles.cardText}>
            If you have questions about using the BASE Wrestling App, setting up your team, or understanding the training framework, we're here to help.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Contact Us</Text>
          <Text style={styles.cardText}>Email: support@basewrestling.com</Text>
          <Text style={styles.cardText}>We typically respond within 24 hours.</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>FAQs</Text>
          <Text style={styles.faq}>Q: How do I add athletes?</Text>
          <Text style={styles.faqAnswer}>A: Go to the Roster tab and tap "+ Add" to add athletes by name and grade.</Text>
          <Text style={styles.faq}>Q: What is a team code?</Text>
          <Text style={styles.faqAnswer}>A: A unique code generated when you create a team. Share it with assistant coaches.</Text>
          <Text style={styles.faq}>Q: Can I change my preferences?</Text>
          <Text style={styles.faqAnswer}>A: Yes, visit Settings to update your training preferences anytime.</Text>
        </Card>

        <Button title="Back" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: SPACING.md }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.xxl },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  card: { marginBottom: SPACING.md },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  cardText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 21, marginBottom: 4 },
  faq: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: SPACING.sm },
  faqAnswer: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginTop: 2 },
});

export default HelpScreen;
