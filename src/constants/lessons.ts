export type LessonDefinition = {
  id: string;
  number: number;
  title: string;
  description: string;
  xpReward: number;
};

export type LearningPathDefinition = {
  id: string;
  title: string;
  description: string;
  lessons: LessonDefinition[];
};

export const THINKING_IN_CODE_PATH_ID = "thinking-in-code";
export const VARIABLES_AND_DATA_PATH_ID = "variables-and-data";

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

export const VARIABLES_AND_DATA_LESSONS: LessonDefinition[] = [
  {
    id: "variables-data-introduction",
    number: 1,
    title: "Understanding Variables",
    description:
      "Learn how variables store information that programs can use later",
    xpReward: 20,
  },
  {
    id: "variables-data-declarations",
    number: 2,
    title: "Declaring Variables",
    description:
      "Create variables using const and let and understand when to use each",
    xpReward: 25,
  },
  {
    id: "variables-data-strings-numbers",
    number: 3,
    title: "Strings & Numbers",
    description: "Work with text and numeric values in TypeScript programs",
    xpReward: 25,
  },
  {
    id: "variables-data-booleans",
    number: 4,
    title: "Boolean Values",
    description:
      "Represent true and false values and use them to describe program state",
    xpReward: 30,
  },
  {
    id: "variables-data-arrays",
    number: 5,
    title: "Arrays",
    description:
      "Store multiple related values together in an ordered collection",
    xpReward: 35,
  },
  {
    id: "variables-data-objects",
    number: 6,
    title: "Objects",
    description: "Group related information together using key and value pairs",
    xpReward: 40,
  },
];

export const LEARNING_PATHS: LearningPathDefinition[] = [
  {
    id: THINKING_IN_CODE_PATH_ID,
    title: "Thinking in Code",
    description:
      "Learn how programs use instructions, decisions, algorithms and repetition",
    lessons: THINKING_IN_CODE_LESSONS,
  },
  {
    id: VARIABLES_AND_DATA_PATH_ID,
    title: "Variables & Data",
    description:
      "Learn how programs store and organize text, numbers and other values",
    lessons: VARIABLES_AND_DATA_LESSONS,
  },
];

export const THINKING_IN_CODE_LESSON_ORDER = THINKING_IN_CODE_LESSONS.map(
  (lesson) => lesson.id,
);

export const VARIABLES_AND_DATA_LESSON_ORDER = VARIABLES_AND_DATA_LESSONS.map(
  (lesson) => lesson.id,
);

export function getLearningPath(
  pathId: string,
): LearningPathDefinition | undefined {
  return LEARNING_PATHS.find((path) => path.id === pathId);
}

export function getLesson(lessonId: string): LessonDefinition | undefined {
  for (const path of LEARNING_PATHS) {
    const lesson = path.lessons.find(
      (pathLesson) => pathLesson.id === lessonId,
    );

    if (lesson) {
      return lesson;
    }
  }

  return undefined;
}

export function getPathForLesson(
  lessonId: string,
): LearningPathDefinition | undefined {
  return LEARNING_PATHS.find((path) =>
    path.lessons.some((lesson) => lesson.id === lessonId),
  );
}

export function getLessonOrder(pathId: string): string[] {
  const path = getLearningPath(pathId);

  return path?.lessons.map((lesson) => lesson.id) ?? [];
}

export function getThinkingInCodeLesson(
  lessonId: string,
): LessonDefinition | undefined {
  return THINKING_IN_CODE_LESSONS.find((lesson) => lesson.id === lessonId);
}

export function getVariablesAndDataLesson(
  lessonId: string,
): LessonDefinition | undefined {
  return VARIABLES_AND_DATA_LESSONS.find((lesson) => lesson.id === lessonId);
}
