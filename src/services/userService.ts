import type { User } from "firebase/auth";
import {
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc,
    updateDoc,
    type FirestoreError,
} from "firebase/firestore";

import { db } from "../config/firebase";
import type { UserProfile, UserProfileUpdates } from "../types/user";

const USERS_COLLECTION = "users";

function getUserReference(userId: string) {
  return doc(db, USERS_COLLECTION, userId);
}

export async function createUserProfileIfNeeded(user: User): Promise<void> {
  const userReference = getUserReference(user.uid);
  const existingProfile = await getDoc(userReference);

  // Never reset XP or progress when an existing user signs in
  if (existingProfile.exists()) {
    return;
  }

  // The Firebase Auth UID is also the Firestore document ID
  await setDoc(userReference, {
    uid: user.uid,
    displayName: user.displayName ?? "Learner",
    email: user.email ?? "",
    photoURL: user.photoURL ?? null,
    selectedPathId: null,
    xp: 0,
    currentStreak: 0,
    longestStreak: 0,
    completedLessonCount: 0,
    lastActivityDate: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const profileSnapshot = await getDoc(getUserReference(userId));

  if (!profileSnapshot.exists()) {
    return null;
  }

  return profileSnapshot.data() as UserProfile;
}

export function subscribeToUserProfile(
  userId: string,
  onProfileChange: (profile: UserProfile | null) => void,
  onError?: (error: FirestoreError) => void,
) {
  // Keep Profile, XP, and streak values updated in real time
  return onSnapshot(
    getUserReference(userId),
    (snapshot) => {
      const profile = snapshot.exists()
        ? (snapshot.data() as UserProfile)
        : null;

      onProfileChange(profile);
    },
    (error) => {
      console.error("User profile listener error:", error);
      onError?.(error);
    },
  );
}

export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdates,
): Promise<void> {
  await updateDoc(getUserReference(userId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function selectLearningPath(
  userId: string,
  pathId: string,
): Promise<void> {
  await updateUserProfile(userId, {
    selectedPathId: pathId,
  });
}
