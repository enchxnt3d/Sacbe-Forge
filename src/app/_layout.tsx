import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="learning/[pathId]" />
      <Stack.Screen name="skill-tree/[treeId]" />
      <Stack.Screen name="skill-card/[cardId]" />
    </Stack>
  );
}
