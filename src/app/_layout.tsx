import { Stack } from "expo-router";

import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    // Give every screen access to the Firebase user
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="learning/[pathId]" />
        <Stack.Screen name="skill-tree/[treeId]" />
        <Stack.Screen name="skill-card/[cardId]" />
      </Stack>
    </AuthProvider>
  );
}
