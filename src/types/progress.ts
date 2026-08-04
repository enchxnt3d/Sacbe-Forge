import type { Timestamp } from "firebase/firestore";

export type LessonProgressStatus = "not-started" | "in-progress" | "completed";

export type LessonProgress = {
  lessonId: string;
  pathId: string;
  status: LessonProgressStatus;
  progressPercent: number;
  progressVersion?: number;
  quizAnswers?: Record<string, number>;
  quizSubmitted?: boolean;
  xpEarned: number;
  startedAt: Timestamp | null;
  completedAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type SaveLessonProgressInput = {
  lessonId: string;
  pathId: string;
  progressPercent: number;
  quizAnswers: Record<string, number>;
  quizSubmitted: boolean;
};

export type CompletedLesson = {
  lessonId: string;
  pathId: string;
  xpEarned: number;
  completedAt: Timestamp | null;
};

export type CompleteLessonInput = {
  lessonId: string;
  pathId: string;
  xpReward: number;
};

export type CompleteLessonResult = {
  alreadyCompleted: boolean;
  xpAwarded: number;
  totalXp: number;
  currentStreak: number;
  completedLessonCount: number;
};

export type AchievementMetric = "completedLessons" | "xp" | "streak";

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  metric: AchievementMetric;
  requirement: number;
};

export type UserAchievement = {
  achievementId: string;
  title: string;
  description: string;
  unlockedAt: Timestamp | null;
};

export type UserNote = {
  noteId: string;
  lessonId: string;
  pathId: string;
  content: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type SaveUserNoteInput = {
  noteId?: string;
  lessonId: string;
  pathId: string;
  content: string;
};
