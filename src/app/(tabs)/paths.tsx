import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../constants/colors";
import {
  getLearningPath,
  getLessonOrder,
  THINKING_IN_CODE_PATH_ID,
  type LessonDefinition,
} from "../../constants/lessons";
import { useAuth } from "../../context/AuthContext";
import {
  isLessonUnlocked,
  subscribeToCompletedLessonIds,
  subscribeToPathProgress,
} from "../../services/progressService";
import type { LessonProgress } from "../../types/progress";

type Point = {
  x: number;
  y: number;
};

type LessonNodeState = "completed" | "active" | "locked";

type ConnectorLineProps = {
  start: Point;
  end: Point;
  active?: boolean;
};

type LessonNodeProps = {
  center: Point;
  number: number;
  title: string;
  status: string;
  state: LessonNodeState;
  labelSide: "left" | "right";
  onPress?: () => void;
};

function ConnectorLine({ start, end, active = false }: ConnectorLineProps) {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  if (active) {
    return (
      <View
        pointerEvents="none"
        style={[
          styles.solidConnector,
          {
            width: length,
            left: (start.x + end.x) / 2 - length / 2,
            top: (start.y + end.y) / 2 - 1,
            transform: [{ rotate: `${angle}deg` }],
          },
        ]}
      />
    );
  }

  const dashWidth = 7;
  const gapWidth = 7;
  const dashCount = Math.max(1, Math.floor(length / (dashWidth + gapWidth)));

  return (
    <View
      pointerEvents="none"
      style={[
        styles.dashedConnectorContainer,
        {
          width: length,
          left: (start.x + end.x) / 2 - length / 2,
          top: (start.y + end.y) / 2 - 1,
          transform: [{ rotate: `${angle}deg` }],
        },
      ]}
    >
      {Array.from({ length: dashCount }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dashSegment,
            {
              left: index * (dashWidth + gapWidth),
              width: dashWidth,
            },
          ]}
        />
      ))}
    </View>
  );
}

function LevelBadge({ level }: { level: number }) {
  return (
    <View style={styles.levelBadge}>
      <MaterialCommunityIcons
        name="hexagon-outline"
        size={62}
        color={Colors.primary}
      />

      <Text style={styles.levelBadgeText}>{level}</Text>
    </View>
  );
}

function CompletedBadge() {
  return (
    <View style={styles.lessonBadge}>
      <MaterialCommunityIcons
        name="hexagon"
        size={82}
        color={Colors.primaryDark}
        style={styles.badgeLayer}
      />

      <MaterialCommunityIcons
        name="hexagon-outline"
        size={72}
        color="#C4B5FD"
        style={styles.badgeLayer}
      />

      <Ionicons
        name="checkmark"
        size={43}
        color={Colors.textPrimary}
        style={styles.badgeIcon}
      />
    </View>
  );
}

function ActiveBadge() {
  return (
    <View style={styles.lessonBadge}>
      <MaterialCommunityIcons
        name="hexagon"
        size={84}
        color={Colors.primaryDark}
        style={styles.badgeLayer}
      />

      <MaterialCommunityIcons
        name="hexagon"
        size={66}
        color={Colors.success}
        style={styles.badgeLayer}
      />

      <Ionicons
        name="flag-outline"
        size={39}
        color={Colors.textPrimary}
        style={styles.badgeIcon}
      />
    </View>
  );
}

function LockedBadge() {
  return (
    <View style={styles.lessonBadge}>
      <MaterialCommunityIcons
        name="hexagon"
        size={84}
        color="#6D6D72"
        style={styles.badgeLayer}
      />

      <Ionicons
        name="lock-closed"
        size={33}
        color="#D7D7DA"
        style={styles.badgeIcon}
      />
    </View>
  );
}

function LessonNode({
  center,
  number,
  title,
  status,
  state,
  labelSide,
  onPress,
}: LessonNodeProps) {
  const badgeSize = 104;
  const labelWidth = state === "active" ? 168 : 145;
  const labelHeight = state === "active" ? 58 : 52;

  const badgeLeft = center.x - badgeSize / 2;
  const badgeTop = center.y - badgeSize / 2;

  const labelLeft =
    labelSide === "left"
      ? center.x - badgeSize / 2 - labelWidth - 4
      : center.x + badgeSize / 2 + 4;

  const labelTop = center.y - labelHeight / 2;

  return (
    <>
      <Pressable
        disabled={!onPress}
        onPress={onPress}
        style={({ pressed }) => [
          styles.lessonBadgePosition,
          {
            left: badgeLeft,
            top: badgeTop,
            width: badgeSize,
            height: badgeSize,
          },
          pressed && styles.pressed,
        ]}
      >
        {state === "completed" && <CompletedBadge />}
        {state === "active" && <ActiveBadge />}
        {state === "locked" && <LockedBadge />}
      </Pressable>

      <View
        pointerEvents="none"
        style={[
          styles.lessonLabel,
          state === "active" && styles.activeLessonLabel,
          {
            left: labelLeft,
            top: labelTop,
            width: labelWidth,
            minHeight: labelHeight,
          },
        ]}
      >
        <Text
          style={[
            styles.lessonTitle,
            state === "locked" && styles.lockedLessonTitle,
          ]}
        >
          {number}. {title}
        </Text>

        <Text
          style={[
            styles.lessonStatus,
            state === "completed" && styles.completedStatus,
          ]}
        >
          {status}
        </Text>
      </View>
    </>
  );
}

function findCurrentLesson(
  lessons: LessonDefinition[],
  progressByLesson: Map<string, LessonProgress>,
  completedLessonIds: string[],
): LessonDefinition {
  const inProgressLessons = lessons
    .filter((lesson) => {
      const progress = progressByLesson.get(lesson.id);

      return (
        progress?.status === "in-progress" &&
        !completedLessonIds.includes(lesson.id)
      );
    })
    .sort((firstLesson, secondLesson) => {
      const firstUpdatedAt =
        progressByLesson.get(firstLesson.id)?.updatedAt?.toMillis() ?? 0;

      const secondUpdatedAt =
        progressByLesson.get(secondLesson.id)?.updatedAt?.toMillis() ?? 0;

      return secondUpdatedAt - firstUpdatedAt;
    });

  if (inProgressLessons.length > 0) {
    return inProgressLessons[0];
  }

  const firstIncompleteLesson = lessons.find(
    (lesson) => !completedLessonIds.includes(lesson.id),
  );

  if (firstIncompleteLesson) {
    return firstIncompleteLesson;
  }

  return lessons[lessons.length - 1];
}

export default function PathsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, profile } = useAuth();

  const pathIdParameter = params.pathId;

  const selectedPathId = Array.isArray(pathIdParameter)
    ? pathIdParameter[0]
    : pathIdParameter;

  const activePathId =
    selectedPathId ?? profile?.selectedPathId ?? THINKING_IN_CODE_PATH_ID;

  const learningPath =
    getLearningPath(activePathId) ?? getLearningPath(THINKING_IN_CODE_PATH_ID)!;

  const lessons = learningPath.lessons;
  const lessonOrder = getLessonOrder(learningPath.id);

  const [canvasWidth, setCanvasWidth] = useState(360);
  const [pathProgress, setPathProgress] = useState<LessonProgress[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [progressReady, setProgressReady] = useState(false);
  const [completedReady, setCompletedReady] = useState(false);

  useEffect(() => {
    if (!user) {
      setPathProgress([]);
      setCompletedLessonIds([]);
      setProgressReady(false);
      setCompletedReady(false);

      return;
    }

    setProgressReady(false);
    setCompletedReady(false);

    // Keep lesson progress synchronized with Firestore
    const unsubscribeProgress = subscribeToPathProgress(
      user.uid,
      learningPath.id,
      (currentProgress) => {
        setPathProgress(currentProgress);
        setProgressReady(true);
      },
      () => {
        setProgressReady(true);
      },
    );

    // Keep completed lessons synchronized for unlock checks
    const unsubscribeCompleted = subscribeToCompletedLessonIds(
      user.uid,
      (lessonIds) => {
        setCompletedLessonIds(lessonIds);
        setCompletedReady(true);
      },
      () => {
        setCompletedReady(true);
      },
    );

    return () => {
      unsubscribeProgress();
      unsubscribeCompleted();
    };
  }, [user, learningPath.id]);

  const handleCanvasLayout = (event: LayoutChangeEvent) => {
    setCanvasWidth(event.nativeEvent.layout.width);
  };

  const progressByLesson = useMemo(
    () =>
      new Map(
        pathProgress.map((lessonProgress) => [
          lessonProgress.lessonId,
          lessonProgress,
        ]),
      ),
    [pathProgress],
  );

  const allCompletedLessonIds = useMemo(() => {
    const completedIds = new Set(completedLessonIds);

    // Protect the UI if both Firestore listeners update at different times
    pathProgress.forEach((lessonProgress) => {
      if (lessonProgress.status === "completed") {
        completedIds.add(lessonProgress.lessonId);
      }
    });

    return Array.from(completedIds);
  }, [completedLessonIds, pathProgress]);

  const currentLesson = useMemo(
    () => findCurrentLesson(lessons, progressByLesson, allCompletedLessonIds),
    [lessons, progressByLesson, allCompletedLessonIds],
  );

  const pathProgressPercent = useMemo(() => {
    const totalProgress = lessons.reduce((total, lesson) => {
      if (allCompletedLessonIds.includes(lesson.id)) {
        return total + 100;
      }

      return total + (progressByLesson.get(lesson.id)?.progressPercent ?? 0);
    }, 0);

    return lessons.length === 0
      ? 0
      : Math.round(totalProgress / lessons.length);
  }, [lessons, progressByLesson, allCompletedLessonIds]);

  const leftX = canvasWidth * 0.32;
  const rightX = canvasWidth * 0.72;

  // Lesson positions are generated from the lesson catalog
  const lessonCenters = useMemo(
    () =>
      lessons.map((_, index) => ({
        x: index % 2 === 0 ? leftX : rightX,
        y: 70 + index * 130,
      })),
    [lessons, leftX, rightX],
  );

  const pathCanvasHeight = Math.max(790, 140 + lessons.length * 130);

  const dataReady = progressReady && completedReady;
  const totalXp = profile?.xp ?? 0;

  const openLesson = (lessonId: string) => {
    router.push(`/skill-card/${lessonId}` as never);
  };

  const getLessonState = (lesson: LessonDefinition): LessonNodeState => {
    if (allCompletedLessonIds.includes(lesson.id)) {
      return "completed";
    }

    const unlocked = isLessonUnlocked(
      lesson.id,
      lessonOrder,
      allCompletedLessonIds,
    );

    return unlocked ? "active" : "locked";
  };

  const getLessonStatus = (
    lesson: LessonDefinition,
    state: LessonNodeState,
  ) => {
    if (state === "completed") {
      return "Completed";
    }

    if (state === "locked") {
      return "Locked";
    }

    const lessonProgress = progressByLesson.get(lesson.id);

    if (
      lessonProgress?.status === "in-progress" &&
      lessonProgress.progressPercent > 0
    ) {
      return `${lessonProgress.progressPercent}% Complete`;
    }

    return "Start Lesson";
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <LinearGradient
        colors={[
          "rgba(124, 58, 237, 0)",
          "rgba(124, 58, 237, 0.04)",
          "rgba(124, 58, 237, 0.22)",
          "rgba(124, 58, 237, 0.82)",
        ]}
        locations={[0, 0.43, 0.75, 1]}
        style={styles.backgroundGlow}
      />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={34} color={Colors.textPrimary} />
          </Pressable>

          <Text style={styles.screenTitle}>{learningPath.title}</Text>

          <View style={styles.titleSpacer} />
        </View>

        <View style={styles.progressCard}>
          <LevelBadge level={currentLesson.number} />

          <View style={styles.progressContent}>
            <Text style={styles.levelText}>Level {currentLesson.number}</Text>

            <Text style={styles.pathTitle}>{currentLesson.title}</Text>

            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${pathProgressPercent}%` as `${number}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.progressPercent}>{pathProgressPercent}%</Text>
            </View>

            <Text style={styles.description}>{currentLesson.description}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.pathContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View
          style={[styles.pathCanvas, { height: pathCanvasHeight }]}
          onLayout={handleCanvasLayout}
        >
          {!dataReady ? (
            <View style={styles.loadingPath}>
              <ActivityIndicator size="large" color={Colors.primary} />

              <Text style={styles.loadingText}>Loading your learning path</Text>
            </View>
          ) : (
            <>
              <View style={styles.connectorLayer}>
                {lessons.slice(0, -1).map((lesson, index) => (
                  <ConnectorLine
                    key={`${lesson.id}-connector`}
                    start={lessonCenters[index]}
                    end={lessonCenters[index + 1]}
                    active={allCompletedLessonIds.includes(lesson.id)}
                  />
                ))}
              </View>

              {lessons.map((lesson, index) => {
                const lessonState = getLessonState(lesson);
                const lessonStatus = getLessonStatus(lesson, lessonState);

                return (
                  <LessonNode
                    key={lesson.id}
                    center={lessonCenters[index]}
                    number={lesson.number}
                    title={lesson.title}
                    status={lessonStatus}
                    state={lessonState}
                    labelSide={index % 2 === 0 ? "right" : "left"}
                    onPress={
                      lessonState !== "locked"
                        ? () => openLesson(lesson.id)
                        : undefined
                    }
                  />
                );
              })}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <View style={styles.scrollHint}>
          <Ionicons name="chevron-down" size={24} color={Colors.textPrimary} />
        </View>

        <View style={styles.rewardBar}>
          <View style={styles.rewardSide}>
            <Text style={styles.rewardLabel}>XP Earned</Text>

            <View style={styles.rewardValueRow}>
              <MaterialCommunityIcons
                name="star-four-points"
                size={27}
                color={Colors.success}
              />

              <Text style={styles.rewardValue}>{totalXp}</Text>
            </View>
          </View>

          <Pressable
            disabled={!dataReady}
            onPress={() => openLesson(currentLesson.id)}
            style={({ pressed }) => [
              styles.continueButton,
              !dataReady && styles.disabledButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="play" size={22} color={Colors.textPrimary} />

            <Text style={styles.continueText}>
              {lessons.every((lesson) =>
                allCompletedLessonIds.includes(lesson.id),
              )
                ? "Review"
                : "Continue"}
            </Text>
          </Pressable>

          <View style={[styles.rewardSide, styles.rewardSideRight]}>
            <Text style={styles.rewardLabel}>Lesson Reward</Text>

            <View style={styles.rewardValueRow}>
              <MaterialCommunityIcons
                name="treasure-chest-outline"
                size={28}
                color={Colors.warning}
              />

              <Text style={styles.rewardValue}>
                +{currentLesson.xpReward} XP
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  backgroundGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 310,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  titleRow: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  screenTitle: {
    color: Colors.textPrimary,
    fontSize: 23,
    fontWeight: "500",
  },

  titleSpacer: {
    width: 44,
  },

  progressCard: {
    minHeight: 142,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderColor: Colors.surfaceBorder,
    borderWidth: 2,
    borderRadius: 24,
  },

  levelBadge: {
    width: 72,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  levelBadgeText: {
    position: "absolute",
    color: Colors.textPrimary,
    fontSize: 23,
    fontWeight: "500",
  },

  progressContent: {
    flex: 1,
  },

  levelText: {
    color: Colors.primary,
    fontSize: 12,
    marginBottom: 4,
  },

  pathTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  progressTrack: {
    flex: 1,
    height: 8,
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: Colors.progressTrack,
  },

  progressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },

  progressPercent: {
    width: 42,
    color: Colors.primary,
    fontSize: 12,
    textAlign: "right",
  },

  description: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 10,
    paddingRight: 8,
  },

  scrollArea: {
    flex: 1,
    marginTop: 2,
  },

  pathContent: {
    paddingHorizontal: 14,
    paddingBottom: 18,
  },

  pathCanvas: {
    position: "relative",
    minHeight: 790,
  },

  loadingPath: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
  },

  connectorLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },

  solidConnector: {
    position: "absolute",
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.primary,
  },

  dashedConnectorContainer: {
    position: "absolute",
    height: 2,
  },

  dashSegment: {
    position: "absolute",
    top: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#66666B",
  },

  lessonBadgePosition: {
    position: "absolute",
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  lessonBadge: {
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeLayer: {
    position: "absolute",
  },

  badgeIcon: {
    position: "absolute",
  },

  lessonLabel: {
    position: "absolute",
    zIndex: 2,
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  activeLessonLabel: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primaryDark,
    borderWidth: 1,
    borderRadius: 11,
  },

  lessonTitle: {
    color: "#D7D7DA",
    fontSize: 11,
  },

  lockedLessonTitle: {
    color: "#B5B5B9",
  },

  lessonStatus: {
    color: "#696970",
    fontSize: 12,
    marginTop: 7,
  },

  completedStatus: {
    color: "#74747A",
  },

  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 101,
  },

  scrollHint: {
    position: "absolute",
    left: 20,
    top: -52,
    width: 42,
    height: 42,
    zIndex: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    borderColor: Colors.surfaceBorder,
    borderWidth: 1,
    backgroundColor: Colors.surface,
  },

  rewardBar: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderColor: Colors.surfaceBorder,
    borderWidth: 2,
    borderRadius: 24,
  },

  rewardSide: {
    width: 80,
    alignItems: "center",
  },

  rewardSideRight: {
    width: 98,
  },

  rewardLabel: {
    color: Colors.textPrimary,
    fontSize: 11,
  },

  rewardValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  rewardValue: {
    color: "#DADADD",
    fontSize: 12,
  },

  continueButton: {
    height: 42,
    minWidth: 126,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 9,
    backgroundColor: Colors.primaryDark,
  },

  disabledButton: {
    opacity: 0.5,
  },

  continueText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },

  pressed: {
    opacity: 0.78,
  },
});
