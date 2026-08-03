import { onAuthStateChanged, type User } from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { auth } from "../config/firebase";
import {
  createUserProfileIfNeeded,
  subscribeToUserProfile,
} from "../services/userService";
import type { UserProfile } from "../types/user";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  authReady: boolean;
  profileReady: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    // Listen for sign in, sign out, and restored sessions
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setAuthReady(true);
      },
      (error) => {
        console.error("Firebase auth session error:", error);
        setAuthReady(true);
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    let isActive = true;
    let unsubscribeProfile: (() => void) | undefined;

    setProfile(null);

    if (!user) {
      setProfileReady(true);

      return () => {
        isActive = false;
      };
    }

    // Keep a stable non-null user for the async function
    const currentUser = user;

    setProfileReady(false);

    async function connectUserProfile() {
      try {
        // Create the Firestore profile only for new users
        await createUserProfileIfNeeded(currentUser);

        if (!isActive) {
          return;
        }

        // Keep XP, streak, and profile values synchronized
        unsubscribeProfile = subscribeToUserProfile(
          currentUser.uid,
          (currentProfile) => {
            if (!isActive) {
              return;
            }

            setProfile(currentProfile);
            setProfileReady(true);
          },
          () => {
            if (isActive) {
              setProfileReady(true);
            }
          },
        );
      } catch (error) {
        console.error("User profile setup error:", error);

        if (isActive) {
          setProfileReady(true);
        }
      }
    }
    void connectUserProfile();

    return () => {
      isActive = false;
      unsubscribeProfile?.();
    };
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      authReady,
      profileReady,
    }),
    [user, profile, authReady, profileReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  // Catch components used outside the provider
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
