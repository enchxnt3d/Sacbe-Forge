import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";

interface AppScreenProps {
  children: ReactNode;
  scrollable?: boolean;
}

const MAX_CONTENT_WIDTH = 1200;
const SCREEN_ENTRY_DURATION = 520;

// Keep this builder stable so every screen uses the same motion
const SCREEN_ENTRANCE = FadeInDown.duration(SCREEN_ENTRY_DURATION)
  .easing(Easing.out(Easing.cubic))
  .withInitialValues({
    opacity: 0,
    translateY: 36,
  });

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
          showsVerticalScrollIndicator={false}
        >
          {/* Limit wide desktop screens without changing mobile */}
          <Animated.View entering={SCREEN_ENTRANCE} style={styles.scrollFrame}>
            {children}
          </Animated.View>
        </ScrollView>
      ) : (
        <Animated.View entering={SCREEN_ENTRANCE} style={styles.contentFrame}>
          {children}
        </Animated.View>
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
