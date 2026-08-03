import { FirebaseError } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type UserCredential,
} from "firebase/auth";

import { auth } from "../config/firebase";
import { createUserProfileIfNeeded, updateUserProfile } from "./userService";

export async function registerUser(
  displayName: string,
  email: string,
  password: string,
): Promise<UserCredential> {
  const cleanName = displayName.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName) {
    throw new Error("Display name is required");
  }

  // Create the Firebase Authentication account
  const credential = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    password,
  );

  // Keep the display name in Firebase Authentication
  await updateProfile(credential.user, {
    displayName: cleanName,
  });

  // Create and synchronize the Firestore profile
  await createUserProfileIfNeeded(credential.user);

  await updateUserProfile(credential.user.uid, {
    displayName: cleanName,
  });

  return credential;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<UserCredential> {
  const cleanEmail = email.trim().toLowerCase();

  // Firebase restores this session when the app reopens
  return signInWithEmailAndPassword(auth, cleanEmail, password);
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error.message : "Something went wrong";
  }

  // Convert Firebase codes into messages the user understands
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email already has an account";

    case "auth/invalid-email":
      return "Enter a valid email address";

    case "auth/weak-password":
      return "Your password must have at least 6 characters";

    case "auth/invalid-credential":
      return "The email or password is incorrect";

    case "auth/too-many-requests":
      return "Too many attempts, please try again later";

    case "auth/network-request-failed":
      return "Check your internet connection and try again";

    default:
      return "Firebase could not complete the request";
  }
}
