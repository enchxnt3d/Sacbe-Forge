import { StyleSheet, Text } from "react-native";

import AppScreen from "../../components/AppScreen";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";

export default function PathsScreen() {
  return (
    <AppScreen>
      <Text style={styles.title}>Learning Paths</Text>
      <Text style={styles.subtitle}>Select a learning path to begin.</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.heading,
    fontWeight: "bold",
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    marginTop: Spacing.sm,
  },
});
