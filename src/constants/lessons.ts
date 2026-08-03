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
export const CONTROL_FLOW_PATH_ID = "control-flow";
export const FUNCTIONS_PATH_ID = "functions";
export const DEBUGGING_PATH_ID = "debugging";
export const SECURITY_BASICS_PATH_ID = "security-basics";

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

export const CONTROL_FLOW_LESSONS: LessonDefinition[] = [
  {
    id: "control-flow-comparisons",
    number: 1,
    title: "Comparison Operators",
    description:
      "Compare values and create conditions that evaluate to true or false",
    xpReward: 20,
  },
  {
    id: "control-flow-if-statements",
    number: 2,
    title: "If Statements",
    description: "Run code only when a specific condition has been satisfied",
    xpReward: 25,
  },
  {
    id: "control-flow-else-statements",
    number: 3,
    title: "Else & Else If",
    description:
      "Choose between multiple actions using else and else if statements",
    xpReward: 25,
  },
  {
    id: "control-flow-logical-operators",
    number: 4,
    title: "Logical Operators",
    description:
      "Combine and reverse conditions using AND, OR and NOT operators",
    xpReward: 30,
  },
  {
    id: "control-flow-loops",
    number: 5,
    title: "Loops",
    description: "Repeat blocks of code using controlled loop conditions",
    xpReward: 35,
  },
  {
    id: "control-flow-challenge",
    number: 6,
    title: "Control Flow Challenge",
    description:
      "Combine conditions and loops to solve a programming challenge",
    xpReward: 40,
  },
];

export const FUNCTIONS_LESSONS: LessonDefinition[] = [
  {
    id: "functions-introduction",
    number: 1,
    title: "Understanding Functions",
    description:
      "Learn how functions organize reusable blocks of program logic",
    xpReward: 20,
  },
  {
    id: "functions-parameters",
    number: 2,
    title: "Parameters & Arguments",
    description:
      "Pass information into functions using parameters and arguments",
    xpReward: 25,
  },
  {
    id: "functions-return-values",
    number: 3,
    title: "Return Values",
    description:
      "Send calculated information back from a function using return",
    xpReward: 25,
  },
  {
    id: "functions-arrow-functions",
    number: 4,
    title: "Arrow Functions",
    description:
      "Create concise functions using modern TypeScript arrow syntax",
    xpReward: 30,
  },
  {
    id: "functions-scope",
    number: 5,
    title: "Function Scope",
    description:
      "Understand where variables can be accessed inside and outside functions",
    xpReward: 35,
  },
  {
    id: "functions-challenge",
    number: 6,
    title: "Function Challenge",
    description:
      "Build reusable functions that accept values and return useful results",
    xpReward: 40,
  },
];

export const DEBUGGING_LESSONS: LessonDefinition[] = [
  {
    id: "debugging-introduction",
    number: 1,
    title: "Understanding Bugs",
    description: "Learn what software bugs are and why they occur in programs",
    xpReward: 20,
  },
  {
    id: "debugging-error-messages",
    number: 2,
    title: "Reading Error Messages",
    description:
      "Use error messages and file locations to identify broken code",
    xpReward: 25,
  },
  {
    id: "debugging-console-logs",
    number: 3,
    title: "Using Console Logs",
    description: "Inspect program values and execution flow using console.log",
    xpReward: 25,
  },
  {
    id: "debugging-type-errors",
    number: 4,
    title: "TypeScript Errors",
    description: "Recognize and correct common type and syntax errors",
    xpReward: 30,
  },
  {
    id: "debugging-runtime-errors",
    number: 5,
    title: "Runtime & Async Errors",
    description:
      "Handle errors that occur while an app or asynchronous operation runs",
    xpReward: 35,
  },
  {
    id: "debugging-challenge",
    number: 6,
    title: "Debugging Challenge",
    description:
      "Find and repair several problems inside a short TypeScript program",
    xpReward: 40,
  },
];

export const SECURITY_BASICS_LESSONS: LessonDefinition[] = [
  {
    id: "security-authentication",
    number: 1,
    title: "Authentication Basics",
    description:
      "Understand how applications identify and authenticate their users",
    xpReward: 20,
  },
  {
    id: "security-passwords",
    number: 2,
    title: "Protecting Passwords",
    description:
      "Learn why passwords should be managed by secure authentication services",
    xpReward: 25,
  },
  {
    id: "security-protected-screens",
    number: 3,
    title: "Protected Screens",
    description: "Restrict app screens based on whether a user is signed in",
    xpReward: 25,
  },
  {
    id: "security-user-data",
    number: 4,
    title: "User Data Ownership",
    description:
      "Connect saved data to the correct user using a unique user ID",
    xpReward: 30,
  },
  {
    id: "security-firestore-rules",
    number: 5,
    title: "Firestore Security Rules",
    description:
      "Control who can read, create, update and delete database information",
    xpReward: 35,
  },
  {
    id: "security-challenge",
    number: 6,
    title: "Security Challenge",
    description:
      "Review an application and identify authentication and database risks",
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
  {
    id: CONTROL_FLOW_PATH_ID,
    title: "Control Flow",
    description: "Control how programs make decisions and repeat actions",
    lessons: CONTROL_FLOW_LESSONS,
  },
  {
    id: FUNCTIONS_PATH_ID,
    title: "Functions",
    description:
      "Create reusable blocks of code that accept values and return results",
    lessons: FUNCTIONS_LESSONS,
  },
  {
    id: DEBUGGING_PATH_ID,
    title: "Debugging",
    description: "Find, understand and repair errors in TypeScript programs",
    lessons: DEBUGGING_LESSONS,
  },
  {
    id: SECURITY_BASICS_PATH_ID,
    title: "Security Basics",
    description: "Protect user accounts, app screens and database information",
    lessons: SECURITY_BASICS_LESSONS,
  },
];

export const THINKING_IN_CODE_LESSON_ORDER = THINKING_IN_CODE_LESSONS.map(
  (lesson) => lesson.id,
);

export const VARIABLES_AND_DATA_LESSON_ORDER = VARIABLES_AND_DATA_LESSONS.map(
  (lesson) => lesson.id,
);

export const CONTROL_FLOW_LESSON_ORDER = CONTROL_FLOW_LESSONS.map(
  (lesson) => lesson.id,
);

export const FUNCTIONS_LESSON_ORDER = FUNCTIONS_LESSONS.map(
  (lesson) => lesson.id,
);

export const DEBUGGING_LESSON_ORDER = DEBUGGING_LESSONS.map(
  (lesson) => lesson.id,
);

export const SECURITY_BASICS_LESSON_ORDER = SECURITY_BASICS_LESSONS.map(
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
