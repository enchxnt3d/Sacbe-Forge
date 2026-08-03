import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  getAuthErrorMessage,
  loginUser,
  registerUser,
} from "../services/authService";

type AuthMode = "sign-in" | "sign-up";

export default function AuthScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "sign-up";

  const formIsValid =
    email.trim().length > 0 &&
    password.length >= (isSignUp ? 8 : 6) &&
    (!isSignUp ||
      (displayName.trim().length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword));

  async function handleSubmit() {
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    if (isSignUp && !displayName.trim()) {
      setErrorMessage("Display name is required");
      return;
    }

    if (isSignUp && password.length < 8) {
      setErrorMessage("Password must have at least 8 characters");
      return;
    }

    if (!isSignUp && password.length < 6) {
      setErrorMessage("Enter your complete password");
      return;
    }

    if (isSignUp && !confirmPassword) {
      setErrorMessage("Please confirm your password");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Use the right Firebase action for each mode
      if (isSignUp) {
        await registerUser(displayName, email, password);
      } else {
        await loginUser(email, password);
      }

      // Return to the app after authentication
      router.replace("/" as never);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(isSignUp ? "sign-in" : "sign-up");
    setErrorMessage("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.screen}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>

        <Text style={styles.subtitle}>
          {isSignUp
            ? "Start saving your Sacbé learning progress"
            : "Sign in to continue your learning path"}
        </Text>

        {isSignUp && (
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display name"
            placeholderTextColor="#71717A"
            autoCapitalize="words"
            autoComplete="name"
            editable={!loading}
          />
        )}

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#71717A"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!loading}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#71717A"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            editable={!loading}
          />

          <Pressable
            style={styles.eyeButton}
            onPress={() => setShowPassword((current) => !current)}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={23}
              color="#A1A1AA"
            />
          </Pressable>
        </View>

        {isSignUp && (
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor="#71717A"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              editable={!loading}
              onSubmitEditing={() => {
                void handleSubmit();
              }}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword((current) => !current)}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={23}
                color="#A1A1AA"
              />
            </Pressable>
          </View>
        )}

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
            (!formIsValid || loading) && styles.buttonDisabled,
          ]}
          onPress={() => {
            void handleSubmit();
          }}
          disabled={!formIsValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isSignUp ? "Create Account" : "Sign In"}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.switchButton}
          onPress={switchMode}
          disabled={loading}
        >
          <Text style={styles.switchText}>
            {isSignUp
              ? "Already have an account? Sign in"
              : "Do not have an account? Sign up"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
  },
  screen: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 20,
    padding: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#A1A1AA",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 24,
  },
  input: {
    minHeight: 52,
    backgroundColor: "#27272A",
    borderWidth: 1,
    borderColor: "#52525B",
    borderRadius: 12,
    color: "#FFFFFF",
    fontSize: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  passwordContainer: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27272A",
    borderWidth: 1,
    borderColor: "#52525B",
    borderRadius: 12,
    marginBottom: 14,
  },
  passwordInput: {
    flex: 1,
    minHeight: 50,
    color: "#FFFFFF",
    fontSize: 16,
    paddingLeft: 16,
    paddingRight: 8,
  },
  eyeButton: {
    minWidth: 48,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#F87171",
    fontSize: 14,
    marginBottom: 14,
  },
  primaryButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  switchButton: {
    alignItems: "center",
    paddingTop: 20,
  },
  switchText: {
    color: "#A78BFA",
    fontSize: 15,
    fontWeight: "600",
  },
});
