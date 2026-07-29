import { StyleSheet, View } from "react-native";

import { Colors } from "../constants/colors";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const progressWidth = `${safeProgress}%` as `${number}%`;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: progressWidth }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 7,
    backgroundColor: Colors.progressTrack,
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
});
