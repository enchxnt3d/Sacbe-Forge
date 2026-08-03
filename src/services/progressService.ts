import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    runTransaction,
    serverTimestamp,
    setDoc,
    where,
    type FirestoreError,
} from "firebase/firestore";

import { db } from "../config/firebase";
import type {
    CompleteLessonInput,
    CompleteLessonResult,
    LessonProgress,
} from "../types/progress";
import type { UserProfile } from "../types/user";
import { awardProgressAchievements } from "./achievementService";

// Firestore collection names
const USERS_COLLECTION = "users";
const PROGRESS_COLLECTION = "lessonProgress";
const COMPLETED_COLLECTION = "completedLessons";

function getUserReference(userId: string) {
  return doc(db, USERS_COLLECTION, userId);
}

function getProgressReference(userId: string, lessonId: string) {
  return doc(db, USERS_COLLECTION, userId, PROGRESS_COLLECTION, lessonId);
}

function getCompletedLessonReference(userId: string, lessonId: string) {
  return doc(db, USERS_COLLECTION, userId, COMPLETED_COLLECTION, lessonId);
}

function getLocalDateKey(date = new Date()): string {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export async function saveLessonProgress(
  userId: string,
  lessonId: string,
  pathId: string,
  progressPercent: number,
): Promise<void> {
  const progressReference = getProgressReference(userId, lessonId);
  const progressSnapshot = await getDoc(progressReference);

  const existingProgress = progressSnapshot.exists()
    ? (progressSnapshot.data() as LessonProgress)
    : null;

  // Never move a completed lesson backwards
  if (existingProgress?.status === "completed") {
    return;
  }

  // Keep unfinished progress between 0 and 99
  const safeProgress = Math.min(99, Math.max(0, Math.round(progressPercent)));

  await setDoc(
    progressReference,
    {
      lessonId,
      pathId,
      status: safeProgress > 0 ? "in-progress" : "not-started",
      progressPercent: safeProgress,
      xpEarned: existingProgress?.xpEarned ?? 0,
      startedAt: existingProgress?.startedAt ?? serverTimestamp(),
      completedAt: null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getLessonProgress(
  userId: string,
  lessonId: string,
): Promise<LessonProgress | null> {
  const progressSnapshot = await getDoc(getProgressReference(userId, lessonId));

  if (!progressSnapshot.exists()) {
    return null;
  }

  return progressSnapshot.data() as LessonProgress;
}

export function subscribeToPathProgress(
  userId: string,
  pathId: string,
  onProgressChange: (progress: LessonProgress[]) => void,
  onError?: (error: FirestoreError) => void,
) {
  const progressQuery = query(
    collection(db, USERS_COLLECTION, userId, PROGRESS_COLLECTION),
    where("pathId", "==", pathId),
  );

  // Keep the learning path synchronized with Firestore
  return onSnapshot(
    progressQuery,
    (snapshot) => {
      const progress = snapshot.docs.map(
        (progressDocument) => progressDocument.data() as LessonProgress,
      );

      onProgressChange(progress);
    },
    (error) => {
      console.error("Learning progress listener error:", error);
      onError?.(error);
    },
  );
}

export function subscribeToCompletedLessonIds(
  userId: string,
  onLessonsChange: (lessonIds: string[]) => void,
  onError?: (error: FirestoreError) => void,
) {
  return onSnapshot(
    collection(db, USERS_COLLECTION, userId, COMPLETED_COLLECTION),
    (snapshot) => {
      const lessonIds = snapshot.docs.map(
        (completedLesson) => completedLesson.id,
      );

      onLessonsChange(lessonIds);
    },
    (error) => {
      console.error("Completed lessons listener error:", error);
      onError?.(error);
    },
  );
}

export function isLessonUnlocked(
  lessonId: string,
  lessonOrder: string[],
  completedLessonIds: string[],
): boolean {
  const lessonIndex = lessonOrder.indexOf(lessonId);

  if (lessonIndex === -1) {
    return false;
  }

  // Completed lessons and the first lesson stay available
  if (lessonIndex === 0 || completedLessonIds.includes(lessonId)) {
    return true;
  }

  const previousLessonId = lessonOrder[lessonIndex - 1];

  return completedLessonIds.includes(previousLessonId);
}

export async function completeLesson(
  userId: string,
  input: CompleteLessonInput,
): Promise<CompleteLessonResult> {
  const userReference = getUserReference(userId);

  const progressReference = getProgressReference(userId, input.lessonId);

  const completedReference = getCompletedLessonReference(
    userId,
    input.lessonId,
  );

  // Prevent negative or decimal XP rewards
  const safeXpReward = Math.max(0, Math.round(input.xpReward));

  const result = await runTransaction(
    db,
    async (transaction): Promise<CompleteLessonResult> => {
      // Read everything before making transaction writes
      const userSnapshot = await transaction.get(userReference);

      const completedSnapshot = await transaction.get(completedReference);

      const progressSnapshot = await transaction.get(progressReference);

      if (!userSnapshot.exists()) {
        throw new Error("The user profile does not exist");
      }

      const profile = userSnapshot.data() as UserProfile;

      // Prevent XP farming from the same lesson
      if (completedSnapshot.exists()) {
        return {
          alreadyCompleted: true,
          xpAwarded: 0,
          totalXp: profile.xp,
          currentStreak: profile.currentStreak,
          completedLessonCount: profile.completedLessonCount,
        };
      }

      // Compare learning activity using local calendar dates
      const today = getLocalDateKey();
      const yesterdayDate = new Date();

      yesterdayDate.setDate(yesterdayDate.getDate() - 1);

      const yesterday = getLocalDateKey(yesterdayDate);

      let nextStreak = 1;

      if (profile.lastActivityDate === today) {
        nextStreak = Math.max(profile.currentStreak, 1);
      } else if (profile.lastActivityDate === yesterday) {
        nextStreak = profile.currentStreak + 1;
      }

      const nextXp = profile.xp + safeXpReward;
      const nextCompletedCount = profile.completedLessonCount + 1;

      const nextLongestStreak = Math.max(profile.longestStreak, nextStreak);

      const existingProgress = progressSnapshot.exists()
        ? (progressSnapshot.data() as LessonProgress)
        : null;

      // Update the main profile totals
      transaction.update(userReference, {
        xp: nextXp,
        currentStreak: nextStreak,
        longestStreak: nextLongestStreak,
        completedLessonCount: nextCompletedCount,
        lastActivityDate: today,
        updatedAt: serverTimestamp(),
      });

      // Save a permanent completion record
      transaction.set(completedReference, {
        lessonId: input.lessonId,
        pathId: input.pathId,
        xpEarned: safeXpReward,
        completedAt: serverTimestamp(),
      });

      // Mark the lesson progress as fully completed
      transaction.set(
        progressReference,
        {
          lessonId: input.lessonId,
          pathId: input.pathId,
          status: "completed",
          progressPercent: 100,
          xpEarned: safeXpReward,
          startedAt: existingProgress?.startedAt ?? serverTimestamp(),
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      return {
        alreadyCompleted: false,
        xpAwarded: safeXpReward,
        totalXp: nextXp,
        currentStreak: nextStreak,
        completedLessonCount: nextCompletedCount,
      };
    },
  );

  // Only check achievements after a new completion
  if (!result.alreadyCompleted) {
    await awardProgressAchievements(userId, result);
  }

  return result;
}
