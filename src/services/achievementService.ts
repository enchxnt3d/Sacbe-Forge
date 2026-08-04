import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type FirestoreError,
} from "firebase/firestore";

import { db } from "../config/firebase";
import type {
  AchievementDefinition,
  CompleteLessonResult,
  UserAchievement,
} from "../types/progress";

const USERS_COLLECTION = "users";
const ACHIEVEMENTS_COLLECTION = "achievements";

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first-lesson",
    title: "First Step",
    description: "Complete your first lesson.",
    metric: "completedLessons",
    requirement: 1,
  },
  {
    id: "five-lessons",
    title: "Building Momentum",
    description: "Complete five lessons.",
    metric: "completedLessons",
    requirement: 5,
  },
  {
    id: "xp-20",
    title: "Forge Initiate",
    description: "Earn your first 20 XP.",
    metric: "xp",
    requirement: 20,
  },
  {
    id: "xp-100",
    title: "XP Explorer",
    description: "Earn 100 XP.",
    metric: "xp",
    requirement: 100,
  },
  {
    id: "streak-3",
    title: "Three Day Flame",
    description: "Reach a three-day learning streak.",
    metric: "streak",
    requirement: 3,
  },
];

function getAchievementReference(userId: string, achievementId: string) {
  return doc(
    db,
    USERS_COLLECTION,
    userId,
    ACHIEVEMENTS_COLLECTION,
    achievementId,
  );
}

function hasReachedAchievement(
  achievement: AchievementDefinition,
  result: CompleteLessonResult,
): boolean {
  switch (achievement.metric) {
    case "completedLessons":
      return result.completedLessonCount >= achievement.requirement;

    case "xp":
      return result.totalXp >= achievement.requirement;

    case "streak":
      return result.currentStreak >= achievement.requirement;

    default:
      return false;
  }
}

export async function unlockAchievement(
  userId: string,
  achievement: AchievementDefinition,
): Promise<boolean> {
  const achievementReference = getAchievementReference(userId, achievement.id);

  const achievementSnapshot = await getDoc(achievementReference);

  // Do not unlock the same achievement twice
  if (achievementSnapshot.exists()) {
    return false;
  }

  await setDoc(achievementReference, {
    achievementId: achievement.id,
    title: achievement.title,
    description: achievement.description,
    unlockedAt: serverTimestamp(),
  });

  return true;
}

export async function awardProgressAchievements(
  userId: string,
  result: CompleteLessonResult,
): Promise<void> {
  const earnedAchievements = ACHIEVEMENTS.filter((achievement) =>
    hasReachedAchievement(achievement, result),
  );

  await Promise.all(
    earnedAchievements.map((achievement) =>
      unlockAchievement(userId, achievement),
    ),
  );
}

export function subscribeToAchievements(
  userId: string,
  onAchievementsChange: (achievements: UserAchievement[]) => void,
  onError?: (error: FirestoreError) => void,
) {
  return onSnapshot(
    collection(db, USERS_COLLECTION, userId, ACHIEVEMENTS_COLLECTION),
    (snapshot) => {
      const achievements = snapshot.docs.map(
        (achievementDocument) => achievementDocument.data() as UserAchievement,
      );

      onAchievementsChange(achievements);
    },
    (error) => {
      console.error("Achievements listener error:", error);
      onError?.(error);
    },
  );
}
