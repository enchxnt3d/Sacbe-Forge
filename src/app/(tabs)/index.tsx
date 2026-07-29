import { StyleSheet, Text } from "react-native";

import AppScreen from "../../components/AppScreen";
import { Colors } from "../../constants/colors";
import { Typography } from "../../constants/typography";

export default function HomeScreen() {
  return (
    <AppScreen>
      <Text style={styles.title}>Home</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.heading,
    fontWeight: "bold",
  },
});
