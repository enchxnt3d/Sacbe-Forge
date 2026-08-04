import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Easing,
  Animated as NativeAnimated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from "react-native";
import Reanimated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../constants/colors";
import {
  getLesson,
  getLessonOrder,
  getPathForLesson,
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

type WebScrollStyle = ViewStyle & {
  overscrollBehavior?: "auto" | "contain" | "none";
};

const WEB_SCROLL_STYLE: WebScrollStyle | undefined =
  Platform.OS === "web" ? { overscrollBehavior: "none" } : undefined;

function quizAnswersMatch(
  firstAnswers: Record<string, number>,
  secondAnswers: Record<string, number>,
) {
  const firstQuestionIds = Object.keys(firstAnswers);
  const secondQuestionIds = Object.keys(secondAnswers);

  return (
    firstQuestionIds.length === secondQuestionIds.length &&
    firstQuestionIds.every(
      (questionId) => firstAnswers[questionId] === secondAnswers[questionId],
    )
  );
}

export default function SkillCardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const { user, profile, authReady, profileReady } = useAuth();

  const cardIdParameter = params.cardId;

  const lessonId = Array.isArray(cardIdParameter)
    ? cardIdParameter[0]
    : cardIdParameter;

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const learningPath = lessonId ? getPathForLesson(lessonId) : undefined;
  const pathId = learningPath?.id;
  const lessonOrder = pathId ? getLessonOrder(pathId) : [];
  const lessonContent = lesson ? getLessonContent(lesson.id) : null;
  const progressDataKey =
    user && pathId && lessonId ? `${user.uid}:${pathId}:${lessonId}` : null;

  const [pathProgress, setPathProgress] = useState<LessonProgress[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [noteContent, setNoteContent] = useState("");
  const [readyProgressDataKey, setReadyProgressDataKey] = useState<
    string | null
  >(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationXp, setCelebrationXp] = useState(0);

  const [celebrationProgress] = useState(() => new NativeAnimated.Value(0));
  const dataReady =
    !user || !pathId || readyProgressDataKey === progressDataKey;
  // Reset every lesson to the real top after loading
  useEffect(() => {
    if (dataReady) {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    }
  }, [dataReady, lessonId]);

  useEffect(() => {
    if (!user) {
      setPathProgress([]);
      setCompletedLessonIds([]);
      setReadyProgressDataKey(null);
      return;
    }

    if (!pathId || !lessonId) {
      setPathProgress([]);
      setCompletedLessonIds([]);
      setReadyProgressDataKey(null);
      return;
    }

    const currentProgressDataKey = `${user.uid}:${pathId}:${lessonId}`;

    let progressLoaded = false;
    let completedLessonsLoaded = false;

    function finishLoadingWhenReady() {
      if (progressLoaded && completedLessonsLoaded) {
        setReadyProgressDataKey(currentProgressDataKey);
      }
    }

    const unsubscribeProgress = subscribeToPathProgress(
      user.uid,
      pathId,
      (progress) => {
        setPathProgress(progress);

        const savedLessonProgress = progress.find(
          (item) => item.lessonId === lessonId,
        );

        // Restore only progress created by the real quiz system
        if (savedLessonProgress?.progressVersion === 2) {
          setSelectedAnswers(savedLessonProgress.quizAnswers ?? {});
          setQuizSubmitted(savedLessonProgress.quizSubmitted ?? false);
        } else {
          setSelectedAnswers({});
          setQuizSubmitted(false);
        }

        progressLoaded = true;
        finishLoadingWhenReady();
      },
      (error) => {
        console.error("Path progress error:", error);
        setErrorMessage("Unable to load lesson progress");

        progressLoaded = true;
        finishLoadingWhenReady();
      },
    );

    const unsubscribeCompleted = subscribeToCompletedLessonIds(
      user.uid,
      (lessonIds) => {
        setCompletedLessonIds(lessonIds);

        completedLessonsLoaded = true;
        finishLoadingWhenReady();
      },
      (error) => {
        console.error("Completed lessons error:", error);
        setErrorMessage("Unable to load completed lessons");

        completedLessonsLoaded = true;
        finishLoadingWhenReady();
      },
    );

    void selectLearningPath(user.uid, pathId).catch((error) => {
      console.error("Selected path error:", error);
    });

    return () => {
      unsubscribeProgress();
      unsubscribeCompleted();
    };
  }, [user, pathId, lessonId]);

  useEffect(() => {
    if (!user || !lesson) {
      setNotes([]);
      return;
    }

    return subscribeToLessonNotes(user.uid, lesson.id, setNotes, (error) => {
      console.error("Lesson notes error:", error);
      setErrorMessage("Unable to load your notes");
    });
  }, [user, lesson]);

  const currentProgress = lesson
    ? pathProgress.find((progress) => progress.lessonId === lesson.id)
    : undefined;

  const lessonCompleted = lesson
    ? completedLessonIds.includes(lesson.id)
    : false;

  const lessonUnlocked =
    lesson && learningPath
      ? isLessonUnlocked(lesson.id, lessonOrder, completedLessonIds)
      : false;

  const quizQuestions = lessonContent?.quiz ?? [];
  const quizRequired = quizQuestions.length > 0;

  const answeredQuestionCount = quizQuestions.filter(
    (question) => selectedAnswers[question.id] !== undefined,
  ).length;

  const quizScore = quizQuestions.filter(
    (question) => selectedAnswers[question.id] === question.correctAnswerIndex,
  ).length;

  const passingScore = Math.ceil(quizQuestions.length * 0.67);

  const quizPassed =
    !quizRequired || (quizSubmitted && quizScore >= passingScore);

  // Quiz answers earn progress while completion stays at 100 percent
  const answerProgress = quizRequired
    ? Math.round((answeredQuestionCount / quizQuestions.length) * 75)
    : 0;

  const activityProgress = lessonCompleted
    ? 100
    : quizSubmitted
      ? 90
      : answerProgress;

  const savedProgress =
    currentProgress?.progressVersion === 2
      ? currentProgress.progressPercent
      : 0;

  const savedQuizAnswers =
    currentProgress?.progressVersion === 2
      ? (currentProgress.quizAnswers ?? {})
      : {};

  const savedQuizSubmitted =
    currentProgress?.progressVersion === 2
      ? (currentProgress.quizSubmitted ?? false)
      : false;

  const nextProgress = Math.max(savedProgress, activityProgress);

  const quizStateChanged =
    !quizAnswersMatch(savedQuizAnswers, selectedAnswers) ||
    savedQuizSubmitted !== quizSubmitted;

  const progressPercent = lessonCompleted ? 100 : nextProgress;

  const hasUnsavedProgress =
    !lessonCompleted &&
    activityProgress > 0 &&
    (nextProgress > savedProgress || quizStateChanged);

  function clearMessages() {
    setMessage("");
    setErrorMessage("");
  }

  async function handleSaveProgress() {
    if (!user || !lesson || !pathId || lessonCompleted || !hasUnsavedProgress) {
      return;
    }

    clearMessages();

    try {
      setBusy(true);

      await saveLessonProgress(user.uid, {
        lessonId: lesson.id,
        pathId,
        progressPercent: nextProgress,
        quizAnswers: selectedAnswers,
        quizSubmitted,
      });

      setMessage(`Progress saved at ${nextProgress}%`);
    } catch (error) {
      console.error("Save progress error:", error);
      setErrorMessage("Unable to save your progress");
    } finally {
      setBusy(false);
    }
  }

  async function handleCompleteLesson() {
    if (!user || !lesson || !pathId || !lessonUnlocked || !quizPassed) {
      return;
    }

    clearMessages();

    try {
      setBusy(true);

      const result = await completeLesson(user.uid, {
        lessonId: lesson.id,
        pathId,
        xpReward: lesson.xpReward,
      });

      if (result.alreadyCompleted) {
        setMessage("This lesson was already completed");
      } else {
        setMessage(`Lesson completed and ${result.xpAwarded} XP earned`);

        playCompletionCelebration(result.xpAwarded);
      }
    } catch (error) {
      console.error("Complete lesson error:", error);
      setErrorMessage("Unable to complete this lesson");
    } finally {
      setBusy(false);
    }
  }

  function playCompletionCelebration(xpAwarded: number) {
    // Make lesson completion feel clear and rewarding
    setCelebrationXp(xpAwarded);
    setShowCelebration(true);

    celebrationProgress.stopAnimation();
    celebrationProgress.setValue(0);

    NativeAnimated.sequence([
      NativeAnimated.spring(celebrationProgress, {
        toValue: 1,
        damping: 9,
        stiffness: 150,
        mass: 0.8,
        useNativeDriver: true,
      }),
      NativeAnimated.delay(1600),
      NativeAnimated.timing(celebrationProgress, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShowCelebration(false);
      }
    });
  }

  function handleSelectAnswer(questionId: string, optionIndex: number) {
    if (quizSubmitted) {
      return;
    }

    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionIndex,
    }));
  }

  function handleSubmitQuiz() {
    if (answeredQuestionCount !== quizQuestions.length) {
      return;
    }

    setQuizSubmitted(true);
  }

  function handleRetryQuiz() {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  }

  async function handleSaveNote() {
    if (!user || !lesson || !pathId || !noteContent.trim()) {
      return;
    }

    clearMessages();

    try {
      setBusy(true);

      await saveUserNote(user.uid, {
        lessonId: lesson.id,
        pathId,
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

  function handleBack() {
    // Use the path screen when this page was opened directly
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/paths" as never);
  }

  const lessonHeader = (
    <View style={styles.headerBar}>
      <View style={styles.headerContent}>
        <View style={styles.topRow}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={28} color={Colors.textPrimary} />
          </Pressable>

          <Text style={styles.pathName} numberOfLines={1}>
            {learningPath?.title ?? "Lesson"}
          </Text>

          {user ? (
            <View style={styles.xpBadge}>
              <Ionicons name="sparkles" size={17} color={Colors.warning} />

              <Text style={styles.xpText}>{profile?.xp ?? 0} XP</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );

  if (!authReady || (user && !profileReady) || (user && !dataReady)) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        {lessonHeader}

        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color={Colors.primary} />

          <Text style={styles.loadingText}>Loading lesson progress</Text>
        </View>
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

  if (!lesson || !learningPath || !pathId) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <Text style={styles.emptyTitle}>Lesson not found</Text>

        <Pressable style={styles.secondaryButton} onPress={handleBack}>
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

        <Pressable style={styles.secondaryButton} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>Back to Path</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {showCelebration ? (
        <View style={styles.celebrationLayer} pointerEvents="none">
          <NativeAnimated.View
            style={[
              styles.celebrationCard,
              {
                opacity: celebrationProgress,
                transform: [
                  {
                    translateY: celebrationProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [45, 0],
                    }),
                  },
                  {
                    scale: celebrationProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.72, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.celebrationIcon}>
              <Ionicons name="trophy" size={42} color="#FACC15" />
            </View>

            <Text style={styles.celebrationTitle}>Lesson Complete</Text>

            <Text style={styles.celebrationXp}>+{celebrationXp} XP</Text>

            <Text style={styles.celebrationText}>
              Your progress and XP have been saved
            </Text>
          </NativeAnimated.View>
        </View>
      ) : null}

      {lessonHeader}

      <ScrollView
        ref={scrollViewRef}
        style={WEB_SCROLL_STYLE}
        contentContainerStyle={styles.content}
        alwaysBounceVertical={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Reanimated.View
            entering={FadeInDown.delay(80).duration(520).withInitialValues({
              opacity: 0,
              translateY: 30,
            })}
            style={styles.lessonCard}
          >
            <View style={styles.lessonNumber}>
              <Text style={styles.lessonNumberText}>{lesson.number}</Text>
            </View>

            <View style={styles.lessonHeading}>
              <Text style={styles.title}>{lesson.title}</Text>

              <Text style={styles.description}>{lesson.description}</Text>
            </View>
          </Reanimated.View>

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
                  <Text style={styles.contentSectionTitle}>
                    {section.title}
                  </Text>

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

              {quizRequired ? (
                <View style={styles.quizCard}>
                  <View style={styles.quizHeader}>
                    <Ionicons
                      name="help-circle-outline"
                      size={24}
                      color={Colors.primary}
                    />

                    <View style={styles.quizHeadingText}>
                      <Text style={styles.quizTitle}>Quick Check</Text>

                      <Text style={styles.quizSubtitle}>
                        Answer at least {passingScore} of {quizQuestions.length}{" "}
                        correctly
                      </Text>
                    </View>
                  </View>

                  {quizQuestions.map((question, questionIndex) => {
                    const selectedAnswer = selectedAnswers[question.id];

                    const isCorrect =
                      selectedAnswer === question.correctAnswerIndex;

                    return (
                      <Reanimated.View
                        key={question.id}
                        entering={FadeInDown.delay(
                          questionIndex * 110,
                        ).duration(520)}
                        style={styles.questionCard}
                      >
                        <Text style={styles.questionNumber}>
                          Question {questionIndex + 1}
                        </Text>

                        <Text style={styles.questionText}>
                          {question.question}
                        </Text>

                        <View style={styles.optionsList}>
                          {question.options.map((option, optionIndex) => {
                            const optionSelected =
                              selectedAnswer === optionIndex;

                            const correctOption =
                              quizSubmitted &&
                              optionIndex === question.correctAnswerIndex;

                            const incorrectOption =
                              quizSubmitted && optionSelected && !correctOption;

                            return (
                              <Pressable
                                key={`${question.id}-option-${optionIndex}`}
                                style={[
                                  styles.optionButton,
                                  optionSelected && styles.optionSelected,
                                  correctOption && styles.optionCorrect,
                                  incorrectOption && styles.optionIncorrect,
                                ]}
                                onPress={() => {
                                  handleSelectAnswer(question.id, optionIndex);
                                }}
                                disabled={quizSubmitted}
                              >
                                <View
                                  style={[
                                    styles.optionCircle,
                                    optionSelected &&
                                      styles.optionCircleSelected,
                                  ]}
                                >
                                  <Text style={styles.optionLetter}>
                                    {String.fromCharCode(65 + optionIndex)}
                                  </Text>
                                </View>

                                <Text style={styles.optionText}>{option}</Text>
                              </Pressable>
                            );
                          })}
                        </View>

                        {quizSubmitted ? (
                          <View
                            style={[
                              styles.explanationCard,
                              isCorrect
                                ? styles.correctExplanation
                                : styles.incorrectExplanation,
                            ]}
                          >
                            <Ionicons
                              name={
                                isCorrect
                                  ? "checkmark-circle-outline"
                                  : "close-circle-outline"
                              }
                              size={21}
                              color={isCorrect ? "#86EFAC" : "#FCA5A5"}
                            />

                            <Text style={styles.explanationText}>
                              {question.explanation}
                            </Text>
                          </View>
                        ) : null}
                      </Reanimated.View>
                    );
                  })}

                  {quizSubmitted ? (
                    <Reanimated.View
                      entering={ZoomIn.duration(520)}
                      style={[
                        styles.quizResult,
                        quizPassed
                          ? styles.quizResultPassed
                          : styles.quizResultFailed,
                      ]}
                    >
                      <Ionicons
                        name={quizPassed ? "trophy" : "refresh-circle"}
                        size={28}
                        color={quizPassed ? "#FACC15" : "#FCA5A5"}
                      />

                      <View style={styles.quizResultText}>
                        <Text style={styles.quizResultTitle}>
                          {quizPassed ? "Quiz passed!" : "Almost there"}
                        </Text>

                        <Text style={styles.quizResultScore}>
                          You answered {quizScore} of {quizQuestions.length}{" "}
                          correctly
                        </Text>
                      </View>

                      {!quizPassed ? (
                        <Pressable
                          style={styles.retryButton}
                          onPress={handleRetryQuiz}
                        >
                          <Text style={styles.retryButtonText}>Try Again</Text>
                        </Pressable>
                      ) : null}
                    </Reanimated.View>
                  ) : (
                    <Pressable
                      style={[
                        styles.submitQuizButton,
                        answeredQuestionCount !== quizQuestions.length &&
                          styles.buttonDisabled,
                      ]}
                      onPress={handleSubmitQuiz}
                      disabled={answeredQuestionCount !== quizQuestions.length}
                    >
                      <Text style={styles.submitQuizButtonText}>
                        Submit Answers ({answeredQuestionCount}/
                        {quizQuestions.length})
                      </Text>
                    </Pressable>
                  )}
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
                  (busy || lessonCompleted || !hasUnsavedProgress) &&
                    styles.buttonDisabled,
                ]}
                onPress={() => {
                  void handleSaveProgress();
                }}
                disabled={busy || lessonCompleted || !hasUnsavedProgress}
              >
                <Text style={styles.secondaryActionText}>
                  {lessonCompleted
                    ? "Progress Complete"
                    : hasUnsavedProgress
                      ? `Save ${nextProgress}% Progress`
                      : progressPercent > 0
                        ? "Progress Saved"
                        : "Answer Quiz to Save"}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.primaryAction,
                  (busy || (!lessonCompleted && !quizPassed)) &&
                    styles.buttonDisabled,
                ]}
                onPress={() => {
                  void handleCompleteLesson();
                }}
                disabled={busy || (!lessonCompleted && !quizPassed)}
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
                      {lessonCompleted
                        ? "Completed"
                        : quizPassed
                          ? "Complete Lesson"
                          : "Pass Quiz First"}
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
                <Text style={styles.noNotes}>
                  No notes saved for this lesson
                </Text>
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
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#F87171"
                      />
                    </Pressable>
                  </View>
                ))
              )}
            </View>
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

  centeredContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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

  headerBar: {
    width: "100%",
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
    zIndex: 10,
  },

  headerContent: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
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

  quizCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
  },

  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },

  quizHeadingText: {
    flex: 1,
  },

  quizTitle: {
    color: Colors.textPrimary,
    fontSize: 21,
    fontWeight: "700",
  },

  quizSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 3,
  },

  questionCard: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 15,
    padding: 16,
    marginBottom: 14,
  },

  questionNumber: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  questionText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 24,
    marginTop: 7,
  },

  optionsList: {
    gap: 9,
    marginTop: 14,
  },

  optionButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#2E1065",
  },

  optionCorrect: {
    borderColor: "#22C55E",
    backgroundColor: "#052E16",
  },

  optionIncorrect: {
    borderColor: "#EF4444",
    backgroundColor: "#450A0A",
  },

  optionCircle: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 16,
    marginRight: 11,
  },

  optionCircleSelected: {
    borderColor: Colors.primary,
  },

  optionLetter: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },

  optionText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },

  explanationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    borderWidth: 1,
    borderRadius: 11,
    padding: 12,
    marginTop: 14,
  },

  correctExplanation: {
    backgroundColor: "#052E16",
    borderColor: "#166534",
  },

  incorrectExplanation: {
    backgroundColor: "#450A0A",
    borderColor: "#991B1B",
  },

  explanationText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    lineHeight: 19,
  },

  submitQuizButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryDark,
    borderRadius: 11,
    marginTop: 4,
  },

  submitQuizButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  quizResult: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderWidth: 1,
    borderRadius: 13,
    padding: 14,
    marginTop: 4,
  },

  quizResultPassed: {
    backgroundColor: "#422006",
    borderColor: "#854D0E",
  },

  quizResultFailed: {
    backgroundColor: "#450A0A",
    borderColor: "#991B1B",
  },

  quizResultText: {
    flex: 1,
  },

  quizResultTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  quizResultScore: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 3,
  },

  retryButton: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
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

  celebrationLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0, 0, 0, 0.34)",
  },

  celebrationCard: {
    width: "100%",
    maxWidth: 370,
    alignItems: "center",
    backgroundColor: "#17111F",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 30,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.38,
    shadowRadius: 24,
    elevation: 16,
  },

  celebrationIcon: {
    width: 82,
    height: 82,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#422006",
    borderWidth: 2,
    borderColor: "#EAB308",
    borderRadius: 41,
    marginBottom: 18,
  },

  celebrationTitle: {
    color: Colors.textPrimary,
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
  },

  celebrationXp: {
    color: "#FACC15",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
  },

  celebrationText: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
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
