import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useWindowDimensions } from "react-native";

import { Colors } from "../../constants/colors";
import { Typography } from "../../constants/typography";

const MAX_TAB_BAR_WIDTH = 1200;
const TAB_BAR_MARGIN = 20;

export default function TabsLayout() {
  const { width: screenWidth } = useWindowDimensions();

  // Keep the tab bar responsive and centered on web
  const tabBarWidth = Math.min(
    Math.max(screenWidth - TAB_BAR_MARGIN * 2, 0),
    MAX_TAB_BAR_WIDTH,
  );

  const tabBarLeft = (screenWidth - tabBarWidth) / 2;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          left: tabBarLeft,
          width: tabBarWidth,
          bottom: 20,
          height: 70,
          borderRadius: 35,
          backgroundColor: Colors.surface,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: Typography.caption,
          marginTop: 2,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textPrimary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="paths"
        options={{
          title: "Paths",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
