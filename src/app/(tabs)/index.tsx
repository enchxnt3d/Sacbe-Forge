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

import AppButton from "../../components/AppButton";
import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import ProgressBar from "../../components/ProgressBar";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";
import { db } from "../../firebase";

interface UserHomeData {
  streak: number;
  xp: number;
  currentCourse: string;
  currentLesson: string;
  lessonLevel: number;
  progressPercent: number;
  todayGoalEarned: number;
  todayGoalTotal: number;
}

export default function HomeScreen() {
  const [data, setData] = useState<UserHomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const docRef = doc(db, "users", "john_doe");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setData({
            streak: userData.streak || 2,
            xp: userData.xp || 140,
            currentCourse: userData.currentCourse || "Thinking in Code",
            currentLesson: userData.currentLesson || "Sequencing Commands",
            lessonLevel: userData.level || 2,
            progressPercent: userData.progressPercent || 35,
            todayGoalEarned: userData.todayGoalEarned || 14,
            todayGoalTotal: userData.todayGoalTotal || 20,
          });
        } else {
          // Default fallback
          setData({
            streak: 2,
            xp: 140,
            currentCourse: "Thinking in Code",
            currentLesson: "Sequencing Commands",
            lessonLevel: 2,
            progressPercent: 35,
            todayGoalEarned: 14,
            todayGoalTotal: 20,
          });
        }
      } catch (error) {
        console.error("Error fetching home data from Firebase:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
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
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={20} color={Colors.orange} />
            <View>
              <Text style={styles.streakCount}>{data?.streak}</Text>
              <Text style={styles.streakLabel}>Day streak</Text>
            </View>
          </View>
          <Text style={styles.appTitle}>SkillForge</Text>
        </View>

        {/* Continue Learning Card */}
        <AppCard>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderText}>
              <Text style={styles.subtitle}>Continue Learning</Text>
              <Text style={styles.mainTitle}>{data?.currentCourse}</Text>
              <Text style={styles.levelText}>
                Level {data?.lessonLevel} - {data?.currentLesson}
              </Text>
            </View>
            <View style={styles.hexagonIcon}>
              <MaterialCommunityIcons
                name="flag-variant"
                size={28}
                color={Colors.success}
              />
            </View>
          </View>

          <View style={styles.progressContainer}>
            <ProgressBar progress={data?.progressPercent || 0} />
            <Text style={styles.progressText}>
              {data?.progressPercent}% complete
            </Text>
          </View>

          <AppButton
            title="Continue Lesson"
            icon="chevron-forward"
            onPress={() => {}}
          />
        </AppCard>

        {/* Today's Goal Card */}
        <AppCard>
          <View style={styles.goalCard}>
            <MaterialCommunityIcons
              name="target"
              size={28}
              color={Colors.textPrimary}
            />
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>Today&apos;s Goal</Text>
              <Text style={styles.goalSubtitle}>
                Earn {data?.todayGoalTotal} XP
              </Text>
              <View style={styles.goalProgressRow}>
                <View style={styles.goalBar}>
                  <ProgressBar
                    progress={Math.round(
                      ((data?.todayGoalEarned || 0) /
                        (data?.todayGoalTotal || 1)) *
                        100,
                    )}
                  />
                </View>
                <Text style={styles.goalProgressText}>
                  {data?.todayGoalEarned} / {data?.todayGoalTotal} XP
                </Text>
              </View>
            </View>
            <Ionicons name="gift-outline" size={26} color={Colors.warning} />
          </View>
        </AppCard>
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
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  streakCount: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: Typography.body,
    lineHeight: 16,
  },
  streakLabel: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  appTitle: {
    color: Colors.primary,
    fontSize: Typography.title,
    fontWeight: "bold",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardHeaderText: {
    flex: 1,
  },
  subtitle: {
    color: Colors.primary,
    fontSize: Typography.caption,
    fontWeight: "600",
  },
  mainTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.heading,
    fontWeight: "bold",
    marginVertical: 2,
  },
  levelText: {
    color: Colors.primary,
    fontSize: Typography.caption,
  },
  hexagonIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    marginVertical: Spacing.md,
    gap: 6,
  },
  progressText: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
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
    fontWeight: "bold",
  },
  goalSubtitle: {
    color: Colors.textMuted,
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
