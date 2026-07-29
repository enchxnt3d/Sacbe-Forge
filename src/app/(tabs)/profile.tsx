import { StyleSheet, Text } from "react-native";

import AppScreen from "../../components/AppScreen";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";

export default function ProfileScreen() {
  return (
    <AppScreen>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>
        User profile information will appear here.
      </Text>
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
