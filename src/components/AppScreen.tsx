import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";

interface AppScreenProps {
  children: ReactNode;
  scrollable?: boolean;
}

const MAX_CONTENT_WIDTH = 1200;

export default function AppScreen({
  children,
  scrollable = false,
}: AppScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Keep the background covering the complete screen */}
      <LinearGradient
        colors={[
          "rgba(124, 58, 237, 0)",
          "rgba(124, 58, 237, 0.08)",
          "rgba(124, 58, 237, 0.3)",
          "rgba(124, 58, 237, 0.75)",
          Colors.primaryDark,
        ]}
        locations={[0, 0.25, 0.5, 0.78, 1]}
        style={styles.glow}
      />

      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          alwaysBounceVertical={false}
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
        >
          {/* Limit wide desktop screens without changing mobile */}
          <View style={styles.scrollFrame}>{children}</View>
        </ScrollView>
      ) : (
        <View style={styles.contentFrame}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  glow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 320,
  },

  contentFrame: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 110,
  },

  scrollContent: {
    flexGrow: 1,
  },

  scrollFrame: {
    flexGrow: 1,
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 110,
  },
});
