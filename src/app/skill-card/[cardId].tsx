import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../constants/colors";
import {
  getThinkingInCodeLesson,
  THINKING_IN_CODE_LESSON_ORDER,
  THINKING_IN_CODE_PATH_ID,
} from "../../constants/lessons";
import { getLessonContent } from "../../content/lessonContent";
import { useAuth } from "../../context/AuthContext";
import {
  deleteUserNote,
  saveUserNote,
  subscribeToLessonNotes,
} from "../../services/noteService";
import {
  completeLesson,
  isLessonUnlocked,
  saveLessonProgress,
  subscribeToCompletedLessonIds,
  subscribeToPathProgress,
} from "../../services/progressService";
import { selectLearningPath } from "../../services/userService";
import type { LessonProgress, UserNote } from "../../types/progress";

export default function SkillCardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { user, profile, authReady, profileReady } = useAuth();

  // Load the lesson id from the route
  const cardIdParameter = params.cardId;

  const lessonId = Array.isArray(cardIdParameter)
    ? cardIdParameter[0]
    : cardIdParameter;

  const lesson = lessonId ? getThinkingInCodeLesson(lessonId) : undefined;

  // Load the editable material for this lesson
  const lessonContent = lesson ? getLessonContent(lesson.id) : null;

  const [pathProgress, setPathProgress] = useState<LessonProgress[]>([]);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  const [notes, setNotes] = useState<UserNote[]>([]);
  const [noteContent, setNoteContent] = useState("");
  const [dataReady, setDataReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setPathProgress([]);
      setCompletedLessonIds([]);
      setDataReady(true);

      return;
    }

    setDataReady(false);

    // Listen to progress owned by the active Firebase user
    const unsubscribeProgress = subscribeToPathProgress(
      user.uid,
      THINKING_IN_CODE_PATH_ID,
      setPathProgress,
      (error) => {
        console.error("Path progress error:", error);
        setErrorMessage("Unable to load lesson progress");
      },
    );

    // Listen to completed lessons for unlocking nodes
    const unsubscribeCompleted = subscribeToCompletedLessonIds(
      user.uid,
      (lessonIds) => {
        setCompletedLessonIds(lessonIds);
        setDataReady(true);
      },
      (error) => {
        console.error("Completed lessons error:", error);
        setErrorMessage("Unable to load completed lessons");
        setDataReady(true);
      },
    );

    // Save the learning path selected by this user
    void selectLearningPath(user.uid, THINKING_IN_CODE_PATH_ID).catch(
      (error) => {
        console.error("Selected path error:", error);
      },
    );

    return () => {
      unsubscribeProgress();
      unsubscribeCompleted();
    };
  }, [user]);

  useEffect(() => {
    if (!user || !lesson) {
      setNotes([]);

      return;
    }

    // Keep notes synchronized for this lesson
    return subscribeToLessonNotes(user.uid, lesson.id, setNotes, (error) => {
      console.error("Lesson notes error:", error);
      setErrorMessage("Unable to load your notes");
    });
  }, [user, lesson]);

  // Find the progress record for this lesson
  const currentProgress = lesson
    ? pathProgress.find((progress) => progress.lessonId === lesson.id)
    : undefined;

  const progressPercent = currentProgress?.progressPercent ?? 0;

  const lessonCompleted = lesson
    ? completedLessonIds.includes(lesson.id)
    : false;

  const lessonUnlocked = lesson
    ? isLessonUnlocked(
        lesson.id,
        THINKING_IN_CODE_LESSON_ORDER,
        completedLessonIds,
      )
    : false;

  function clearMessages() {
    setMessage("");
    setErrorMessage("");
  }

  async function handleSaveProgress() {
    if (!user || !lesson || lessonCompleted) {
      return;
    }

    clearMessages();

    // Increase unfinished progress in small testable steps
    const nextProgress =
      progressPercent === 0 ? 25 : Math.min(99, progressPercent + 25);

    try {
      setBusy(true);

      await saveLessonProgress(
        user.uid,
        lesson.id,
        THINKING_IN_CODE_PATH_ID,
        nextProgress,
      );

      setMessage(`Progress saved at ${nextProgress}%`);
    } catch (error) {
      console.error("Save progress error:", error);
      setErrorMessage("Unable to save your progress");
    } finally {
      setBusy(false);
    }
  }

  async function handleCompleteLesson() {
    if (!user || !lesson || !lessonUnlocked) {
      return;
    }

    clearMessages();

    try {
      setBusy(true);

      // Complete the lesson and reward XP only once
      const result = await completeLesson(user.uid, {
        lessonId: lesson.id,
        pathId: THINKING_IN_CODE_PATH_ID,
        xpReward: lesson.xpReward,
      });

      if (result.alreadyCompleted) {
        setMessage("This lesson was already completed");
      } else {
        setMessage(`Lesson completed and ${result.xpAwarded} XP earned`);
      }
    } catch (error) {
      console.error("Complete lesson error:", error);
      setErrorMessage("Unable to complete this lesson");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveNote() {
    if (!user || !lesson || !noteContent.trim()) {
      return;
    }

    clearMessages();

    try {
      setBusy(true);

      // Save this note inside the active user document
      await saveUserNote(user.uid, {
        lessonId: lesson.id,
        pathId: THINKING_IN_CODE_PATH_ID,
        content: noteContent,
      });

      setNoteContent("");
      setMessage("Note saved");
    } catch (error) {
      console.error("Save note error:", error);
      setErrorMessage("Unable to save your note");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!user) {
      return;
    }

    clearMessages();

    try {
      setBusy(true);

      await deleteUserNote(user.uid, noteId);
      setMessage("Note deleted");
    } catch (error) {
      console.error("Delete note error:", error);
      setErrorMessage("Unable to delete your note");
    } finally {
      setBusy(false);
    }
  }

  // Wait for Auth and Firestore before showing the lesson
  if (!authReady || (user && !profileReady) || (user && !dataReady)) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <ActivityIndicator size="large" color={Colors.primary} />

        <Text style={styles.loadingText}>Loading lesson progress</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <Ionicons
          name="person-circle-outline"
          size={70}
          color={Colors.primary}
        />

        <Text style={styles.emptyTitle}>Sign in required</Text>

        <Text style={styles.emptyText}>
          Sign in to save progress, earn XP and create notes
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/auth" as never)}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <Text style={styles.emptyTitle}>Lesson not found</Text>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!lessonUnlocked) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <Ionicons name="lock-closed" size={58} color={Colors.textMuted} />

        <Text style={styles.emptyTitle}>Lesson locked</Text>

        <Text style={styles.emptyText}>
          Complete the previous lesson to unlock this node
        </Text>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Back to Path</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={28} color={Colors.textPrimary} />
          </Pressable>

          <Text style={styles.pathName}>Thinking in Code</Text>

          <View style={styles.xpBadge}>
            <Ionicons name="sparkles" size={17} color={Colors.warning} />

            <Text style={styles.xpText}>{profile?.xp ?? 0} XP</Text>
          </View>
        </View>

        <View style={styles.lessonCard}>
          <View style={styles.lessonNumber}>
            <Text style={styles.lessonNumberText}>{lesson.number}</Text>
          </View>

          <View style={styles.lessonHeading}>
            <Text style={styles.title}>{lesson.title}</Text>

            <Text style={styles.description}>{lesson.description}</Text>
          </View>
        </View>

        {lessonContent ? (
          <>
            <View style={styles.overviewCard}>
              <View style={styles.overviewTopRow}>
                <View style={styles.overviewMeta}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={Colors.primary}
                  />

                  <Text style={styles.overviewMetaText}>
                    About {lessonContent.estimatedMinutes} minutes
                  </Text>
                </View>

                <View style={styles.overviewMeta}>
                  <Ionicons
                    name="trophy-outline"
                    size={20}
                    color={Colors.warning}
                  />

                  <Text style={styles.overviewMetaText}>
                    {lesson.xpReward} XP
                  </Text>
                </View>
              </View>

              <Text style={styles.objectivesTitle}>Learning objectives</Text>

              {lessonContent.objectives.map((objective, index) => (
                <View
                  key={`${lesson.id}-objective-${index}`}
                  style={styles.objectiveRow}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={19}
                    color={Colors.success}
                    style={styles.objectiveIcon}
                  />

                  <Text style={styles.objectiveText}>{objective}</Text>
                </View>
              ))}
            </View>

            {lessonContent.sections.map((section) => (
              <View key={section.id} style={styles.contentSection}>
                <Text style={styles.contentSectionTitle}>{section.title}</Text>

                {section.paragraphs.map((paragraph, index) => (
                  <Text
                    key={`${section.id}-paragraph-${index}`}
                    style={styles.paragraphText}
                  >
                    {paragraph}
                  </Text>
                ))}

                {section.bulletPoints && section.bulletPoints.length > 0 ? (
                  <View style={styles.bulletList}>
                    {section.bulletPoints.map((bulletPoint, index) => (
                      <View
                        key={`${section.id}-bullet-${index}`}
                        style={styles.bulletRow}
                      >
                        <View style={styles.bulletDot} />

                        <Text style={styles.bulletText}>{bulletPoint}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                {section.codeExample ? (
                  <View style={styles.codeCard}>
                    <View style={styles.codeHeader}>
                      <Ionicons
                        name="code-slash"
                        size={18}
                        color={Colors.primary}
                      />

                      <Text style={styles.codeLanguage}>
                        {section.codeExample.language}
                      </Text>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <Text selectable style={styles.codeText}>
                        {section.codeExample.code}
                      </Text>
                    </ScrollView>
                  </View>
                ) : null}

                {section.tip ? (
                  <View style={styles.tipCard}>
                    <Ionicons
                      name="bulb-outline"
                      size={22}
                      color={Colors.warning}
                    />

                    <Text style={styles.tipText}>{section.tip}</Text>
                  </View>
                ) : null}
              </View>
            ))}

            {lessonContent.practiceActivity ? (
              <View style={styles.practiceCard}>
                <View style={styles.practiceHeader}>
                  <Ionicons
                    name="flask-outline"
                    size={23}
                    color={Colors.primary}
                  />

                  <Text style={styles.practiceTitle}>
                    {lessonContent.practiceActivity.title}
                  </Text>
                </View>

                <Text style={styles.practiceInstructions}>
                  {lessonContent.practiceActivity.instructions}
                </Text>

                {lessonContent.practiceActivity.expectedResult ? (
                  <View style={styles.expectedCard}>
                    <Text style={styles.expectedLabel}>Expected result</Text>

                    <Text style={styles.expectedText}>
                      {lessonContent.practiceActivity.expectedResult}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.contentUnavailableCard}>
            <Ionicons
              name="construct-outline"
              size={35}
              color={Colors.textMuted}
            />

            <Text style={styles.contentUnavailableTitle}>
              Lesson material coming soon
            </Text>

            <Text style={styles.contentUnavailableText}>
              The progress system is ready for this lesson
            </Text>
          </View>
        )}

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Lesson Progress</Text>

            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent}%` as `${number}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.rewardText}>Reward: {lesson.xpReward} XP</Text>

          <View style={styles.buttonRow}>
            <Pressable
              style={[
                styles.secondaryAction,
                (busy || lessonCompleted) && styles.buttonDisabled,
              ]}
              onPress={() => {
                void handleSaveProgress();
              }}
              disabled={busy || lessonCompleted}
            >
              <Text style={styles.secondaryActionText}>
                {lessonCompleted ? "Progress Complete" : "Save Progress"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.primaryAction, busy && styles.buttonDisabled]}
              onPress={() => {
                void handleCompleteLesson();
              }}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name={
                      lessonCompleted ? "checkmark-circle" : "trophy-outline"
                    }
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text style={styles.primaryActionText}>
                    {lessonCompleted ? "Completed" : "Complete Lesson"}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        {message ? (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>{message}</Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.notesCard}>
          <Text style={styles.sectionTitle}>My Notes</Text>

          <TextInput
            style={styles.noteInput}
            value={noteContent}
            onChangeText={setNoteContent}
            placeholder="Write something you want to remember"
            placeholderTextColor={Colors.textMuted}
            multiline
            editable={!busy}
          />

          <Pressable
            style={[
              styles.saveNoteButton,
              (!noteContent.trim() || busy) && styles.buttonDisabled,
            ]}
            onPress={() => {
              void handleSaveNote();
            }}
            disabled={!noteContent.trim() || busy}
          >
            <Ionicons name="save-outline" size={19} color="#FFFFFF" />

            <Text style={styles.saveNoteText}>Save Note</Text>
          </Pressable>

          <View style={styles.notesList}>
            {notes.length === 0 ? (
              <Text style={styles.noNotes}>No notes saved for this lesson</Text>
            ) : (
              notes.map((note) => (
                <View key={note.noteId} style={styles.noteItem}>
                  <View style={styles.noteContent}>
                    <Text style={styles.noteText}>{note.content}</Text>

                    <Text style={styles.noteDate}>
                      {note.updatedAt
                        ? note.updatedAt.toDate().toLocaleString()
                        : "Saving"}
                    </Text>
                  </View>

                  <Pressable
                    style={styles.deleteNoteButton}
                    onPress={() => {
                      void handleDeleteNote(note.noteId);
                    }}
                    disabled={busy}
                    accessibilityRole="button"
                    accessibilityLabel="Delete note"
                  >
                    <Ionicons name="trash-outline" size={20} color="#F87171" />
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  centeredScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    padding: 24,
  },

  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 80,
  },

  loadingText: {
    color: Colors.textMuted,
    fontSize: 15,
    marginTop: 14,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  pathName: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },

  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  xpText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },

  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
  },

  lessonNumber: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryDark,
    borderRadius: 29,
    marginRight: 16,
  },

  lessonNumberText: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
  },

  lessonHeading: {
    flex: 1,
  },

  title: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
  },

  description: {
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },

  overviewCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
  },

  overviewTopRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },

  overviewMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  overviewMetaText: {
    color: Colors.textMuted,
    fontSize: 14,
  },

  objectivesTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  objectiveRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 9,
  },

  objectiveIcon: {
    marginTop: 1,
    marginRight: 9,
  },

  objectiveText: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },

  contentSection: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
  },

  contentSectionTitle: {
    color: Colors.textPrimary,
    fontSize: 21,
    fontWeight: "700",
    marginBottom: 13,
  },

  paragraphText: {
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 10,
  },

  bulletList: {
    marginTop: 4,
    marginBottom: 10,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },

  bulletDot: {
    width: 7,
    height: 7,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginTop: 7,
    marginRight: 11,
  },

  bulletText: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },

  codeCard: {
    overflow: "hidden",
    backgroundColor: "#09090B",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 13,
    marginTop: 14,
  },

  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#27272A",
    borderBottomWidth: 1,
    borderBottomColor: "#3F3F46",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  codeLanguage: {
    color: "#D4D4D8",
    fontSize: 12,
    fontWeight: "600",
  },

  codeText: {
    color: "#C4B5FD",
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "monospace",
    padding: 16,
  },

  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#422006",
    borderWidth: 1,
    borderColor: "#854D0E",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },

  tipText: {
    flex: 1,
    color: "#FDE68A",
    fontSize: 14,
    lineHeight: 20,
  },

  practiceCard: {
    backgroundColor: "#2E1065",
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
  },

  practiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 13,
  },

  practiceTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },

  practiceInstructions: {
    color: "#DDD6FE",
    fontSize: 15,
    lineHeight: 23,
  },

  expectedCard: {
    backgroundColor: "rgba(9, 9, 11, 0.5)",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },

  expectedLabel: {
    color: "#C4B5FD",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  expectedText: {
    color: "#EDE9FE",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },

  contentUnavailableCard: {
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    borderRadius: 22,
    padding: 30,
    marginBottom: 18,
  },

  contentUnavailableTitle: {
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: "700",
    marginTop: 12,
  },

  contentUnavailableText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },

  progressCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: "700",
  },

  progressPercent: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  progressTrack: {
    height: 10,
    overflow: "hidden",
    backgroundColor: Colors.progressTrack,
    borderRadius: 10,
    marginTop: 16,
  },

  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },

  rewardText: {
    color: Colors.warning,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },

  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },

  secondaryAction: {
    flexGrow: 1,
    minWidth: 170,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 11,
  },

  secondaryActionText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  primaryAction: {
    flexGrow: 1,
    minWidth: 190,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primaryDark,
    borderRadius: 11,
  },

  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  successMessage: {
    backgroundColor: "#052E16",
    borderWidth: 1,
    borderColor: "#166534",
    borderRadius: 12,
    padding: 13,
    marginBottom: 18,
  },

  successText: {
    color: "#86EFAC",
    textAlign: "center",
  },

  errorMessage: {
    backgroundColor: "#450A0A",
    borderWidth: 1,
    borderColor: "#991B1B",
    borderRadius: 12,
    padding: 13,
    marginBottom: 18,
  },

  errorText: {
    color: "#FCA5A5",
    textAlign: "center",
  },

  notesCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    borderRadius: 22,
    padding: 20,
  },

  noteInput: {
    minHeight: 110,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    textAlignVertical: "top",
  },

  saveNoteButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primaryDark,
    borderRadius: 11,
    marginTop: 12,
  },

  saveNoteText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  notesList: {
    gap: 10,
    marginTop: 18,
  },

  noNotes: {
    color: Colors.textMuted,
    textAlign: "center",
    paddingVertical: 12,
  },

  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 12,
    padding: 13,
  },

  noteContent: {
    flex: 1,
  },

  noteText: {
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },

  noteDate: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 7,
  },

  deleteNoteButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 25,
    fontWeight: "700",
    marginTop: 16,
  },

  emptyText: {
    maxWidth: 420,
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
  },

  primaryButton: {
    minWidth: 180,
    alignItems: "center",
    backgroundColor: Colors.primaryDark,
    borderRadius: 11,
    paddingVertical: 14,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    minWidth: 180,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 11,
    paddingVertical: 14,
    marginTop: 20,
  },

  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  buttonDisabled: {
    opacity: 0.45,
  },
});
