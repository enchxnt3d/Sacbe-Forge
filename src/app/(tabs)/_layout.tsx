import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/colors";

const tabDetails = {
  index: {
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  paths: {
    label: "Paths",
    activeIcon: "map",
    inactiveIcon: "map-outline",
  },
  profile: {
    label: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },
} as const;

type TabName = keyof typeof tabDetails;

function CustomTabBar({ state, navigation }: any) {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBar}>
        {state.routes.map(
          (route: { key: string; name: string }, index: number) => {
            const tabName = route.name as TabName;
            const tab = tabDetails[tabName];
            const isFocused = state.index === index;

            const handlePress = () => {
              if (!isFocused) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={handlePress}
                style={styles.tabItem}
              >
                <Ionicons
                  name={isFocused ? tab.activeIcon : tab.inactiveIcon}
                  size={30}
                  color={isFocused ? Colors.primary : Colors.textPrimary}
                />

                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? Colors.primary : Colors.textPrimary,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          },
        )}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="paths" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 18,
    alignItems: "center",
  },

  tabBar: {
    width: "92%",
    maxWidth: 370,
    height: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: Colors.surface,
    borderRadius: 30,
    paddingHorizontal: 8,
  },

  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  tabLabel: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
  },
});
