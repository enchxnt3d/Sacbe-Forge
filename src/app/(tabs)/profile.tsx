import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { THINKING_IN_CODE_PATH_ID } from "../../constants/lessons";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";

// Add future learning paths here
const PATH_DISPLAY_NAMES: Record<string, string> = {
  [THINKING_IN_CODE_PATH_ID]: "Thinking in Code",
};

function getPathDisplayName(pathId: string | null | undefined): string {
  if (!pathId) {
    return "No path selected";
  }

  const savedPathName = PATH_DISPLAY_NAMES[pathId];

  if (savedPathName) {
    return savedPathName;
  }

  // Create a readable fallback for future path ids
  return pathId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, authReady, profileReady } = useAuth();

  const [signingOut, setSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignOut() {
    try {
      setSigningOut(true);
      setErrorMessage("");

      // Clear the saved Firebase session
      await logoutUser();

      router.replace("/auth" as never);
    } catch (error) {
      console.error("Sign out error:", error);
      setErrorMessage("Unable to sign out right now");
    } finally {
      setSigningOut(false);
    }
  }

  // Wait while Firebase restores the saved session
  if (!authReady || (user && !profileReady)) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />

        <Text style={styles.loadingText}>Loading your profile</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>No active session</Text>

        <Text style={styles.mutedText}>
          Sign in to load your profile and learning progress
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/auth" as never)}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </Pressable>
      </View>
    );
  }

  // Use Firestore data first and Firebase Auth as fallback
  const displayName = profile?.displayName ?? user.displayName ?? "Learner";

  const email = profile?.email ?? user.email ?? "No email available";

  const selectedPath = getPathDisplayName(profile?.selectedPathId);

  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "L";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.sessionBadge}>
          <View style={styles.sessionDot} />
          <Text style={styles.sessionText}>Session active</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Learning Progress</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.xp ?? 0}</Text>

          <Text style={styles.statLabel}>Total XP</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.currentStreak ?? 0}</Text>

          <Text style={styles.statLabel}>Current streak</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.longestStreak ?? 0}</Text>

          <Text style={styles.statLabel}>Longest streak</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {profile?.completedLessonCount ?? 0}
          </Text>

          <Text style={styles.statLabel}>Lessons completed</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Learning Path</Text>

      <View style={styles.pathCard}>
        <View style={styles.pathIcon}>
          <Ionicons name="map-outline" size={26} color="#A78BFA" />
        </View>

        <View style={styles.pathInformation}>
          <Text style={styles.pathLabel}>Selected path</Text>

          <Text style={styles.pathName}>{selectedPath}</Text>
        </View>

        <Ionicons name="checkmark-circle" size={25} color="#22C55E" />
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.signOutButton,
          pressed && styles.buttonPressed,
          signingOut && styles.buttonDisabled,
        ]}
        onPress={() => {
          void handleSignOut();
        }}
        disabled={signingOut}
      >
        {signingOut ? (
          <ActivityIndicator color="#F87171" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={21} color="#F87171" />

            <Text style={styles.signOutText}>Sign Out</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
  },

  content: {
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
    padding: 24,
    paddingBottom: 120,
  },

  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#09090B",
    padding: 24,
  },

  loadingText: {
    color: "#A1A1AA",
    fontSize: 16,
    marginTop: 14,
  },

  mutedText: {
    maxWidth: 420,
    color: "#A1A1AA",
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 22,
  },

  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 20,
    padding: 22,
    marginBottom: 30,
    rowGap: 14,
  },

  avatar: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
    borderRadius: 32,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },

  headerText: {
    flex: 1,
    minWidth: 180,
    marginLeft: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "700",
  },

  email: {
    color: "#A1A1AA",
    fontSize: 15,
    marginTop: 4,
  },

  sessionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#052E16",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginLeft: 12,
  },

  sessionDot: {
    width: 8,
    height: 8,
    backgroundColor: "#22C55E",
    borderRadius: 4,
    marginRight: 7,
  },

  sessionText: {
    color: "#86EFAC",
    fontSize: 13,
    fontWeight: "600",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 30,
  },

  statCard: {
    flexGrow: 1,
    minWidth: 170,
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 16,
    padding: 20,
  },

  statValue: {
    color: "#A78BFA",
    fontSize: 28,
    fontWeight: "700",
  },

  statLabel: {
    color: "#A1A1AA",
    fontSize: 14,
    marginTop: 5,
  },

  pathCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },

  pathIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E1065",
    borderRadius: 14,
  },

  pathInformation: {
    flex: 1,
    marginHorizontal: 15,
  },

  pathLabel: {
    color: "#A1A1AA",
    fontSize: 13,
  },

  pathName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 4,
  },

  errorText: {
    color: "#F87171",
    textAlign: "center",
    marginBottom: 14,
  },

  primaryButton: {
    minWidth: 180,
    alignItems: "center",
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#7F1D1D",
    borderRadius: 12,
    paddingVertical: 14,
  },

  signOutText: {
    color: "#F87171",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.5,
  },
});
