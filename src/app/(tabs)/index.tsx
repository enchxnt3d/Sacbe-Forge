import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import ProgressBar from "../../components/ProgressBar";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";

interface Course {
  id: number;
  title: string;
  level: number;
  progress: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Thinking in Code",
    level: 2,
    progress: 35,
    icon: "terminal",
    color: Colors.primary,
  },
  {
    id: 2,
    title: "Variables & Data",
    level: 1,
    progress: 0,
    icon: "flask-outline",
    color: Colors.success,
  },
  {
    id: 3,
    title: "Control Flow",
    level: 1,
    progress: 0,
    icon: "repeat",
    color: Colors.orange,
  },
  {
    id: 4,
    title: "Functions",
    level: 1,
    progress: 0,
    icon: "cube-outline",
    color: Colors.blue,
  },
  {
    id: 5,
    title: "Debugging",
    level: 1,
    progress: 0,
    icon: "code-slash",
    color: Colors.warning,
  },
  {
    id: 6,
    title: "Security Basics",
    level: 1,
    progress: 0,
    icon: "lock-closed",
    color: Colors.pink,
  },
];

export default function HomeScreen() {
  return (
    <AppScreen>
      <View style={styles.screenContent}>
        <View style={styles.header}>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={30} color={Colors.orange} />

            <View>
              <Text style={styles.streakNumber}>2</Text>
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

                <Text style={styles.courseTitle}>Thinking in Code</Text>

                <Text style={styles.levelText}>
                  Level 2 - Sequencing Commands
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
              <ProgressBar progress={35} />

              <Text style={styles.progressText}>35% complete</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => alert("Continue lesson")}
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
              <Text style={styles.goalTitle}>Today&apos;s Goal</Text>

              <Text style={styles.goalSubtitle}>Earn 20 XP</Text>

              <View style={styles.goalProgressRow}>
                <View style={styles.goalProgressBar}>
                  <ProgressBar progress={70} />
                </View>

                <Text style={styles.goalProgressText}>14 / 20 XP</Text>
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
              {courses.map((course) => (
                <Pressable
                  key={course.id}
                  style={({ pressed }) => [
                    styles.courseCard,
                    pressed && styles.courseCardPressed,
                  ]}
                  onPress={() => alert(course.title)}
                >
                  <View
                    style={[
                      styles.courseIconContainer,
                      {
                        backgroundColor:
                          course.id === 1 ? course.color : Colors.surface,
                      },
                    ]}
                  >
                    <Ionicons
                      name={course.icon}
                      size={40}
                      color={course.id === 1 ? Colors.background : course.color}
                    />
                  </View>

                  <Text style={styles.courseCardTitle} numberOfLines={2}>
                    {course.title}
                  </Text>

                  <Text style={styles.courseLevel}>Level {course.level}</Text>

                  <Text style={styles.courseProgress}>{course.progress}%</Text>

                  <ProgressBar progress={course.progress} />
                </Pressable>
              ))}
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
