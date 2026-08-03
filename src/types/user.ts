import type { Timestamp } from "firebase/firestore";

export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  selectedPathId: string | null;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  completedLessonCount: number;
  lastActivityDate: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

// These are the profile values the user is allowed to edit directly
export type UserProfileUpdates = Partial<
  Pick<UserProfile, "displayName" | "photoURL" | "selectedPathId">
>;
