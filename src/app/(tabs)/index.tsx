import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import ProgressBar from "../../components/ProgressBar";
import { Colors } from "../../constants/colors";
import {
  getLearningPath,
  THINKING_IN_CODE_PATH_ID,
  VARIABLES_AND_DATA_PATH_ID,
  type LessonDefinition,
} from "../../constants/lessons";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";
import { useAuth } from "../../context/AuthContext";
import {
  subscribeToCompletedLessonIds,
  subscribeToPathProgress,
} from "../../services/progressService";
import { selectLearningPath } from "../../services/userService";
import type { LessonProgress } from "../../types/progress";

interface Course {
  id: number;
  pathId: string;
  title: string;
  level: number;
  progress: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  available: boolean;
}

const baseCourses: Course[] = [
  {
    id: 1,
    pathId: THINKING_IN_CODE_PATH_ID,
    title: "Thinking in Code",
    level: 1,
    progress: 0,
    icon: "terminal",
    color: Colors.primary,
    available: true,
  },
  {
    id: 2,
    pathId: VARIABLES_AND_DATA_PATH_ID,
    title: "Variables & Data",
    level: 1,
    progress: 0,
    icon: "flask-outline",
    color: Colors.success,
    available: true,
  },
  {
    id: 3,
    pathId: "control-flow",
    title: "Control Flow",
    level: 1,
    progress: 0,
    icon: "repeat",
    color: Colors.orange,
    available: true,
  },
  {
    id: 4,
    pathId: "functions",
    title: "Functions",
    level: 1,
    progress: 0,
    icon: "cube-outline",
    color: Colors.blue,
    available: true,
  },
  {
    id: 5,
    pathId: "debugging",
    title: "Debugging",
    level: 1,
    progress: 0,
    icon: "code-slash",
    color: Colors.warning,
    available: true,
  },
  {
    id: 6,
    pathId: "security-basics",
    title: "Security Basics",
    level: 1,
    progress: 0,
    icon: "lock-closed",
    color: Colors.pink,
    available: true,
  },
];

function findResumeLesson(
  lessons: LessonDefinition[],
  progress: LessonProgress[],
): LessonDefinition {
  const firstLesson = lessons[0]!;

  const latestInProgress = progress
    .filter((lessonProgress) => lessonProgress.status === "in-progress")
    .sort((firstProgress, secondProgress) => {
      const firstTime = firstProgress.updatedAt?.toMillis() ?? 0;
      const secondTime = secondProgress.updatedAt?.toMillis() ?? 0;

      return secondTime - firstTime;
    })[0];

  if (latestInProgress) {
    const matchingLesson = lessons.find(
      (lesson) => lesson.id === latestInProgress.lessonId,
    );

    if (matchingLesson) {
      return matchingLesson;
    }
  }

  const completedLessonIds = new Set(
    progress
      .filter((lessonProgress) => lessonProgress.status === "completed")
      .map((lessonProgress) => lessonProgress.lessonId),
  );

  const nextLesson = lessons.find(
    (lesson) => !completedLessonIds.has(lesson.id),
  );

  if (nextLesson) {
    return nextLesson;
  }

  return lessons.at(-1) ?? firstLesson;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const selectedPathId = profile?.selectedPathId ?? THINKING_IN_CODE_PATH_ID;

  const selectedLearningPath =
    getLearningPath(selectedPathId) ??
    getLearningPath(THINKING_IN_CODE_PATH_ID)!;

  const selectedLessons = selectedLearningPath.lessons;

  const [pathProgress, setPathProgress] = useState<LessonProgress[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    setPathProgress([]);

    if (!user) {
      return;
    }

    return subscribeToPathProgress(
      user.uid,
      selectedLearningPath.id,
      setPathProgress,
      (error) => {
        console.error("Home progress listener error:", error);
      },
    );
  }, [user, selectedLearningPath.id]);

  useEffect(() => {
    setCompletedLessonIds([]);

    if (!user) {
      return;
    }

    return subscribeToCompletedLessonIds(
      user.uid,
      setCompletedLessonIds,
      (error) => {
        console.error("Completed lessons listener error:", error);
      },
    );
  }, [user]);

  const currentLesson = useMemo(
    () => findResumeLesson(selectedLessons, pathProgress),
    [selectedLessons, pathProgress],
  );

  const pathProgressPercent = useMemo(() => {
    const totalProgress = selectedLessons.reduce((total, lesson) => {
      const lessonProgress = pathProgress.find(
        (progress) => progress.lessonId === lesson.id,
      );

      return total + (lessonProgress?.progressPercent ?? 0);
    }, 0);

    if (selectedLessons.length === 0) {
      return 0;
    }

    return Math.round(totalProgress / selectedLessons.length);
  }, [selectedLessons, pathProgress]);

  const currentStreak = profile?.currentStreak ?? 0;
  const totalXp = profile?.xp ?? 0;

  const xpGoal = 20;
  const xpTowardGoal = Math.min(totalXp, xpGoal);

  const xpGoalPercent = Math.min(
    100,
    Math.round((xpTowardGoal / xpGoal) * 100),
  );

  const courses = useMemo(
    () =>
      baseCourses.map((course) => {
        const learningPath = getLearningPath(course.pathId);

        if (!learningPath || learningPath.lessons.length === 0) {
          return course;
        }

        const completedCount = learningPath.lessons.filter((lesson) =>
          completedLessonIds.includes(lesson.id),
        ).length;

        const progress = Math.round(
          (completedCount / learningPath.lessons.length) * 100,
        );

        const nextLesson =
          learningPath.lessons.find(
            (lesson) => !completedLessonIds.includes(lesson.id),
          ) ?? learningPath.lessons[learningPath.lessons.length - 1]!;

        return {
          ...course,
          level: nextLesson.number,
          progress,
        };
      }),
    [completedLessonIds],
  );

  function openCurrentLesson() {
    router.push(`/skill-card/${currentLesson.id}` as never);
  }

  async function openCourse(course: Course) {
    if (!course.available) {
      alert(`${course.title} is coming soon`);
      return;
    }

    if (user) {
      await selectLearningPath(user.uid, course.pathId);
    }

    router.push({
      pathname: "/paths",
      params: {
        pathId: course.pathId,
      },
    } as never);
  }

  return (
    <AppScreen>
      <View style={styles.screenContent}>
        <View style={styles.header}>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={30} color={Colors.orange} />

            <View>
              <Text style={styles.streakNumber}>{currentStreak}</Text>

              <Text style={styles.streakLabel}>Day streak</Text>
            </View>
          </View>

          <Text style={styles.appTitle}>SkillForge</Text>
        </View>

        <AppCard>
          <View style={styles.continueCard}>
            <View style={styles.continueTopRow}>
              <View style={styles.continueText}>
                <Text style={styles.sectionLabel}>Continue Learning</Text>

                <Text style={styles.courseTitle}>
                  {selectedLearningPath.title}
                </Text>

                <Text style={styles.levelText}>
                  Level {currentLesson.number} - {currentLesson.title}
                </Text>
              </View>

              <View style={styles.courseBadge}>
                <MaterialCommunityIcons
                  name="hexagon"
                  size={96}
                  color={Colors.primary}
                  style={styles.outerHexagon}
                />

                <MaterialCommunityIcons
                  name="hexagon"
                  size={76}
                  color={Colors.success}
                  style={styles.middleHexagon}
                />

                <MaterialCommunityIcons
                  name="hexagon"
                  size={54}
                  color={Colors.background}
                  style={styles.innerHexagon}
                />

                <Ionicons
                  name="flag-outline"
                  size={30}
                  color={Colors.textPrimary}
                  style={styles.flagIcon}
                />
              </View>
            </View>

            <View style={styles.progressArea}>
              <ProgressBar progress={pathProgressPercent} />

              <Text style={styles.progressText}>
                {pathProgressPercent}% complete
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={openCurrentLesson}
            >
              <Text style={styles.continueButtonText}>Continue Lesson</Text>

              <Ionicons
                name="chevron-forward"
                size={28}
                color={Colors.textPrimary}
              />
            </Pressable>
          </View>
        </AppCard>

        <AppCard>
          <View style={styles.goalCard}>
            <MaterialCommunityIcons
              name="target"
              size={34}
              color={Colors.textPrimary}
            />

            <View style={styles.goalInformation}>
              <Text style={styles.goalTitle}>XP Goal</Text>

              <Text style={styles.goalSubtitle}>Earn {xpGoal} XP</Text>

              <View style={styles.goalProgressRow}>
                <View style={styles.goalProgressBar}>
                  <ProgressBar progress={xpGoalPercent} />
                </View>

                <Text style={styles.goalProgressText}>
                  {xpTowardGoal} / {xpGoal} XP
                </Text>
              </View>
            </View>

            <Ionicons name="gift-outline" size={30} color={Colors.warning} />
          </View>
        </AppCard>

        <View style={styles.coursesSection}>
          <View style={styles.coursesHeader}>
            <Text style={styles.coursesTitle}>Courses</Text>

            <Ionicons
              name="chevron-down"
              size={30}
              color={Colors.textPrimary}
            />
          </View>

          <View style={styles.coursesViewport}>
            <ScrollView
              contentContainerStyle={styles.coursesGrid}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {courses.map((course) => {
                const isSelected = course.pathId === selectedLearningPath.id;

                return (
                  <Pressable
                    key={course.id}
                    style={({ pressed }) => [
                      styles.courseCard,
                      pressed && styles.courseCardPressed,
                    ]}
                    onPress={() => openCourse(course)}
                  >
                    <View
                      style={[
                        styles.courseIconContainer,
                        {
                          backgroundColor: isSelected
                            ? course.color
                            : Colors.surface,
                        },
                      ]}
                    >
                      <Ionicons
                        name={course.icon}
                        size={40}
                        color={isSelected ? Colors.background : course.color}
                      />
                    </View>

                    <Text style={styles.courseCardTitle} numberOfLines={2}>
                      {course.title}
                    </Text>

                    <Text style={styles.courseLevel}>Level {course.level}</Text>

                    <Text style={styles.courseProgress}>
                      {course.progress}%
                    </Text>

                    <ProgressBar progress={course.progress} />
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    gap: 36,
  },

  header: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
  },

  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  streakNumber: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
  },

  streakLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
  },

  appTitle: {
    color: Colors.primary,
    fontSize: Typography.heading,
    marginLeft: Spacing.xl,
  },

  continueCard: {
    minHeight: 205,
    justifyContent: "space-between",
    gap: 18,
  },

  continueTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  continueText: {
    flex: 1,
    paddingRight: Spacing.md,
  },

  sectionLabel: {
    color: Colors.primary,
    fontSize: Typography.label,
    marginBottom: 8,
  },

  courseTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.title,
    marginBottom: 8,
  },

  levelText: {
    color: Colors.primary,
    fontSize: Typography.caption,
  },

  courseBadge: {
    width: 96,
    height: 86,
    alignItems: "center",
    justifyContent: "center",
  },

  outerHexagon: {
    position: "absolute",
  },

  middleHexagon: {
    position: "absolute",
  },

  innerHexagon: {
    position: "absolute",
  },

  flagIcon: {
    position: "absolute",
  },

  progressArea: {
    width: "70%",
    gap: 8,
  },

  progressText: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
  },

  continueButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
  },

  continueButtonText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.body,
    textAlign: "center",
    marginLeft: 28,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  goalCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  goalInformation: {
    flex: 1,
  },

  goalTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.label,
  },

  goalSubtitle: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    marginBottom: 6,
  },

  goalProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  goalProgressBar: {
    flex: 1,
  },

  goalProgressText: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
  },

  coursesSection: {
    marginTop: 2,
  },

  coursesHeader: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  coursesTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.title,
  },

  coursesViewport: {
    height: 190,
    overflow: "hidden",
  },

  coursesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 20,
    paddingBottom: Spacing.md,
  },

  courseCard: {
    width: "31%",
    height: 184,
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderColor: Colors.surfaceBorder,
    borderWidth: 2,
    borderRadius: 22,
    padding: Spacing.sm,
  },

  courseCardPressed: {
    opacity: 0.8,
  },

  courseIconContainer: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },

  courseCardTitle: {
    minHeight: 28,
    color: Colors.textPrimary,
    fontSize: 10,
  },

  courseLevel: {
    color: Colors.primary,
    fontSize: Typography.caption,
  },

  courseProgress: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
  },
});
