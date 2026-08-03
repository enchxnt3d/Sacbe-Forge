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

import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";

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
          Sign in to load your Firebase profile and progress
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace("/auth" as never)}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </Pressable>
      </View>
    );
  }

  // Use Firestore data first and Firebase Auth as fallback
  const displayName = profile?.displayName ?? user.displayName ?? "Learner";

  const email = profile?.email ?? user.email ?? "No email";
  const selectedPath = profile?.selectedPathId ?? "Not selected";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
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

      <Text style={styles.sectionTitle}>Account Details</Text>

      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Selected path</Text>
          <Text style={styles.detailValue}>{selectedPath}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Firebase User ID</Text>
          <Text selectable style={styles.userId}>
            {user.uid}
          </Text>
        </View>
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
          <Text style={styles.signOutText}>Sign Out</Text>
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
    alignItems: "center",
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 20,
    padding: 22,
    marginBottom: 30,
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
  detailsCard: {
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  detailColumn: {
    gap: 7,
  },
  detailLabel: {
    color: "#A1A1AA",
    fontSize: 14,
  },
  detailValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#3F3F46",
    marginVertical: 18,
  },
  userId: {
    color: "#D4D4D8",
    fontSize: 13,
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
    alignItems: "center",
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
