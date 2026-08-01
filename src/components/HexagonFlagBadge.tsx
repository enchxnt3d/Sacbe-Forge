import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { Colors } from "../constants/colors";

export default function HexagonFlagBadge() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="hexagon"
        size={94}
        color={Colors.primary}
        style={styles.outerHexagon}
      />

      <MaterialCommunityIcons
        name="hexagon"
        size={70}
        color={Colors.success}
        style={styles.innerHexagon}
      />

      <Ionicons
        name="flag-outline"
        size={38}
        color={Colors.textPrimary}
        style={styles.flag}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 94,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  outerHexagon: {
    position: "absolute",
  },
  innerHexagon: {
    position: "absolute",
  },
  flag: {
    position: "absolute",
  },
});
