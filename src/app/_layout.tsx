import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Colors } from "../constants/colors";
import { AuthProvider, useAuth } from "../context/AuthContext";

function ProtectedNavigator() {
  const { user, authReady } = useAuth();

  // Wait until Firebase checks the saved session
  if (!authReady) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      {/* Only logged-out users can access authentication */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="auth" />
      </Stack.Protected>

      {/* Every app screen requires an authenticated user */}
      <Stack.Protected guard={Boolean(user)}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="learning/[pathId]" />
        <Stack.Screen name="skill-tree/[treeId]" />
        <Stack.Screen name="skill-card/[cardId]" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // Give the complete app access to Firebase Auth
    <AuthProvider>
      <ProtectedNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
});
