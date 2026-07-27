import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SkillTreeScreen() {
  const { treeId } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Skill Tree</Text>
        <Text style={styles.subtitle}>Tree ID: {treeId}</Text>
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
  subtitle: {
    color: "#BBBBBB",
    fontSize: 16,
    marginTop: 10,
  },
});
