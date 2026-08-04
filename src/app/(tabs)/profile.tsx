import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import ProgressBar from "../../components/ProgressBar";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";
import { db } from "../../firebase";

interface UserProfile {
  name: string;
  role: string;
  level: number;
  xp: number;
  streak: number;
  longestStreak: number;
  lessonsCompleted: number;
  pathsStarted: number;
  pathsCompleted: number;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const docRef = doc(db, "users", "john_doe");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Fallback if document doesn't exist
          setProfile({
            name: "John Doe",
            role: "Code Apprentice",
            level: 2,
            xp: 140,
            streak: 2,
            longestStreak: 7,
            lessonsCompleted: 12,
            pathsStarted: 3,
            pathsCompleted: 1,
          });
        }
      } catch (error) {
        console.error("Error fetching profile from Firebase:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <AppScreen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {profile?.name ? profile.name[0] : "J"}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile?.name}</Text>
            <Text style={styles.userRole}>{profile?.role}</Text>
          </View>

          <View style={styles.levelBadgeContainer}>
            <MaterialCommunityIcons
              name="hexagon"
              size={50}
              color={Colors.primary}
            />
            <Text style={styles.levelBadgeText}>{profile?.level}</Text>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Ionicons name="sparkles" size={16} color={Colors.success} />
            <Text style={styles.xpText}>{profile?.xp} / 300 XP</Text>
          </View>
          <ProgressBar
            progress={Math.min(
              100,
              Math.round(((profile?.xp || 0) / 300) * 100),
            )}
          />
        </View>

        {/* Learning Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Stats</Text>
          <AppCard>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Ionicons name="school" size={24} color={Colors.primary} />
                <Text style={styles.statValue}>
                  {profile?.lessonsCompleted}
                </Text>
                <Text style={styles.statLabel}>Lessons Completed</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="map" size={24} color={Colors.success} />
                <Text style={styles.statValue}>{profile?.pathsStarted}</Text>
                <Text style={styles.statLabel}>Paths Started</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="flag" size={24} color={Colors.primary} />
                <Text style={styles.statValue}>{profile?.pathsCompleted}</Text>
                <Text style={styles.statLabel}>Paths Completed</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="sparkles" size={24} color={Colors.warning} />
                <Text style={styles.statValue}>{profile?.xp}</Text>
                <Text style={styles.statLabel}>Total XP Earned</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="flame" size={24} color={Colors.orange} />
                <Text style={styles.statValue}>{profile?.streak} Days</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons
                  name="flame-outline"
                  size={24}
                  color={Colors.orange}
                />
                <Text style={styles.statValue}>
                  {profile?.longestStreak} Days
                </Text>
                <Text style={styles.statLabel}>Longest Streak</Text>
              </View>
            </View>
          </AppCard>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Ionicons
              name="chevron-down"
              size={24}
              color={Colors.textPrimary}
            />
          </View>

          <View style={styles.achievementsRow}>
            <View style={styles.achievementCard}>
              <View style={styles.achievementIconContainer}>
                <Ionicons
                  name="hardware-chip"
                  size={28}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.achievementTitle}>First Steps</Text>
            </View>

            <View style={styles.achievementCard}>
              <View style={styles.achievementIconContainer}>
                <Ionicons name="trophy" size={28} color={Colors.warning} />
              </View>
              <Text style={styles.achievementTitle}>Streak Starter</Text>
            </View>

            <View style={styles.achievementCard}>
              <View style={styles.achievementIconContainer}>
                <Ionicons
                  name="lock-closed"
                  size={28}
                  color={Colors.textMuted}
                />
              </View>
              <Text style={styles.achievementTitle}>XP Collector</Text>
            </View>
          </View>
        </View>

        {/* Goal Card */}
        <View style={styles.section}>
          <AppCard>
            <View style={styles.goalCard}>
              <MaterialCommunityIcons
                name="target"
                size={32}
                color={Colors.textPrimary}
              />
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Today&apos;s Goal</Text>
                <Text style={styles.goalSubtitle}>Earn 20 XP</Text>
                <View style={styles.goalProgressRow}>
                  <View style={styles.goalBar}>
                    <ProgressBar progress={70} />
                  </View>
                  <Text style={styles.goalProgressText}>14 / 20 XP</Text>
                </View>
              </View>
              <Ionicons name="gift-outline" size={28} color={Colors.warning} />
            </View>
          </AppCard>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingBottom: Spacing.xl,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.textPrimary,
    fontSize: Typography.heading,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: Typography.title,
    fontWeight: "bold",
  },
  userRole: {
    color: Colors.primary,
    fontSize: Typography.caption,
    marginTop: 2,
  },
  levelBadgeContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadgeText: {
    position: "absolute",
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: Typography.body,
  },
  xpContainer: {
    gap: 6,
  },
  xpHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  xpText: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.title,
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  statBox: {
    width: "30%",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: "bold",
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    textAlign: "center",
  },
  achievementsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  achievementCard: {
    width: "31%",
    backgroundColor: Colors.surface,
    borderColor: Colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.sm,
    alignItems: "center",
    gap: 8,
  },
  achievementIconContainer: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementTitle: {
    color: Colors.textMuted,
    fontSize: 10,
    textAlign: "center",
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.label,
  },
  goalSubtitle: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    marginBottom: 4,
  },
  goalProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalBar: {
    flex: 1,
  },
  goalProgressText: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
  },
});
