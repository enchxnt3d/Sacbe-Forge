import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          "rgba(124, 58, 237, 0)",
          "rgba(124, 58, 237, 0.08)",
          "rgba(124, 58, 237, 0.3)",
          "rgba(124, 58, 237, 0.75)",
          "#7C3AED",
        ]}
        locations={[0, 0.25, 0.5, 0.78, 1]}
        style={styles.glow}
      />

      <View>
        <Text style={styles.title}>Home</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  glow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 320,
  },
});
