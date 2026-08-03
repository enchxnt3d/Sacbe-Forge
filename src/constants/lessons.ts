export type LessonDefinition = {
  id: string;
  number: number;
  title: string;
  description: string;
  xpReward: number;
};

// Main learning path used by the first six lessons
export const THINKING_IN_CODE_PATH_ID = "thinking-in-code";

export const THINKING_IN_CODE_LESSONS: LessonDefinition[] = [
  {
    id: "welcome-to-code",
    number: 1,
    title: "Welcome to Code",
    description:
      "Learn what code is and how developers use instructions to solve problems",
    xpReward: 20,
  },
  {
    id: "sequencing-commands",
    number: 2,
    title: "Sequencing Commands",
    description: "Learn how programs follow commands in a specific order",
    xpReward: 25,
  },
  {
    id: "actions-output",
    number: 3,
    title: "Actions & Output",
    description: "Explore how programs perform actions and display results",
    xpReward: 25,
  },
  {
    id: "simple-algorithms",
    number: 4,
    title: "Simple Algorithms",
    description: "Create simple step-by-step solutions for common problems",
    xpReward: 30,
  },
  {
    id: "conditional-logic",
    number: 5,
    title: "Conditional Logic",
    description: "Make programs choose different actions using conditions",
    xpReward: 35,
  },
  {
    id: "loops-iteration",
    number: 6,
    title: "Loops & Iteration",
    description: "Repeat actions efficiently using loops and iteration",
    xpReward: 40,
  },
];

// Keep the lesson sequence available for unlocking logic
export const THINKING_IN_CODE_LESSON_ORDER = THINKING_IN_CODE_LESSONS.map(
  (lesson) => lesson.id,
);

// Find the complete lesson information using its route id
export function getThinkingInCodeLesson(
  lessonId: string,
): LessonDefinition | undefined {
  return THINKING_IN_CODE_LESSONS.find((lesson) => lesson.id === lessonId);
}
