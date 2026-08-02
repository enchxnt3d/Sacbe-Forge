import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../constants/colors";

type Point = {
  x: number;
  y: number;
};

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
  state: "completed" | "active" | "locked";
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

function LevelBadge() {
  return (
    <View style={styles.levelBadge}>
      <MaterialCommunityIcons
        name="hexagon-outline"
        size={62}
        color={Colors.primary}
      />

      <Text style={styles.levelBadgeText}>2</Text>
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

export default function PathsScreen() {
  const router = useRouter();
  const [canvasWidth, setCanvasWidth] = useState(360);

  const handleCanvasLayout = (event: LayoutChangeEvent) => {
    setCanvasWidth(event.nativeEvent.layout.width);
  };

  const leftX = canvasWidth * 0.32;
  const rightX = canvasWidth * 0.72;

  const lessons = {
    lesson1: {
      x: leftX,
      y: 70,
    },
    lesson2: {
      x: rightX,
      y: 196,
    },
    lesson3: {
      x: leftX,
      y: 326,
    },
    lesson4: {
      x: rightX,
      y: 456,
    },
    lesson5: {
      x: leftX,
      y: 586,
    },
    lesson6: {
      x: rightX,
      y: 716,
    },
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

          <Text style={styles.screenTitle}>Thinking in Code</Text>

          <View style={styles.titleSpacer} />
        </View>

        <View style={styles.progressCard}>
          <LevelBadge />

          <View style={styles.progressContent}>
            <Text style={styles.levelText}>Level 2</Text>

            <Text style={styles.pathTitle}>Sequencing Commands</Text>

            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>

              <Text style={styles.progressPercent}>35%</Text>
            </View>

            <Text style={styles.description}>
              Master the basics of sequencing commands and discover how programs
              follow instructions to solve problems.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.pathContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.pathCanvas} onLayout={handleCanvasLayout}>
          <View style={styles.connectorLayer}>
            <ConnectorLine
              start={lessons.lesson1}
              end={lessons.lesson2}
              active
            />

            <ConnectorLine start={lessons.lesson2} end={lessons.lesson3} />

            <ConnectorLine start={lessons.lesson3} end={lessons.lesson4} />

            <ConnectorLine start={lessons.lesson4} end={lessons.lesson5} />

            <ConnectorLine start={lessons.lesson5} end={lessons.lesson6} />
          </View>

          <LessonNode
            center={lessons.lesson1}
            number={1}
            title="Welcome to Code"
            status="Completed"
            state="completed"
            labelSide="right"
            onPress={() => router.push("/skill-card/welcome-to-code")}
          />

          <LessonNode
            center={lessons.lesson2}
            number={2}
            title="Sequencing Commands"
            status="In Progress"
            state="active"
            labelSide="left"
            onPress={() => router.push("/skill-card/sequencing-commands")}
          />

          <LessonNode
            center={lessons.lesson3}
            number={3}
            title="Actions & Output"
            status="Locked"
            state="locked"
            labelSide="right"
          />

          <LessonNode
            center={lessons.lesson4}
            number={4}
            title="Simple Algorithms"
            status="Locked"
            state="locked"
            labelSide="left"
          />

          <LessonNode
            center={lessons.lesson5}
            number={5}
            title="Conditional Logic"
            status="Locked"
            state="locked"
            labelSide="right"
          />

          <LessonNode
            center={lessons.lesson6}
            number={6}
            title="Loops & Iteration"
            status="Locked"
            state="locked"
            labelSide="left"
          />
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Pressable
          style={({ pressed }) => [
            styles.scrollHint,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="chevron-down" size={24} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.rewardBar}>
          <View style={styles.rewardSide}>
            <Text style={styles.rewardLabel}>XP Earned</Text>

            <View style={styles.rewardValueRow}>
              <MaterialCommunityIcons
                name="star-four-points"
                size={27}
                color={Colors.success}
              />

              <Text style={styles.rewardValue}>140</Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/skill-card/sequencing-commands")}
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="play" size={22} color={Colors.textPrimary} />

            <Text style={styles.continueText}>Continue</Text>
          </Pressable>

          <View style={[styles.rewardSide, styles.rewardSideRight]}>
            <Text style={styles.rewardLabel}>Next Reward</Text>

            <View style={styles.rewardValueRow}>
              <MaterialCommunityIcons
                name="treasure-chest-outline"
                size={28}
                color={Colors.warning}
              />

              <Text style={styles.rewardValue}>200 XP</Text>
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
    width: "35%",
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
    height: 790,
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
    width: 88,
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

  continueText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },

  pressed: {
    opacity: 0.78,
  },
});
