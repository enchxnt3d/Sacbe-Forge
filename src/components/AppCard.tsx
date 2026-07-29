import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";

interface AppCardProps {
  children: ReactNode;
}

export default function AppCard({ children }: AppCardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.surfaceBorder,
    borderWidth: 2,
    borderRadius: 24,
    padding: Spacing.md,
  },
});
