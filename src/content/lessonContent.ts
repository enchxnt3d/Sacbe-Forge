export type LessonCodeExample = {
  language: string;
  code: string;
};

export type LessonContentSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bulletPoints?: string[];
  codeExample?: LessonCodeExample;
  tip?: string;
};

export type LessonPracticeActivity = {
  title: string;
  instructions: string;
  expectedResult?: string;
};

export type LessonQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export type LessonContent = {
  lessonId: string;
  estimatedMinutes: number;
  objectives: string[];
  sections: LessonContentSection[];
  practiceActivity?: LessonPracticeActivity;
  quiz?: LessonQuizQuestion[];
};

// Edit lesson material in this file without touching Firebase
// Keep every lessonId matched with src/constants/lessons.ts
// Do not rename lesson ids after users have saved progress
export const LESSON_CONTENT: Record<string, LessonContent> = {
  "welcome-to-code": {
    lessonId: "welcome-to-code",
    estimatedMinutes: 6,
    objectives: [
      "Explain what computer code is",
      "Understand that programs follow exact instructions",
      "Recognize examples of code in everyday technology",
    ],
    sections: [
      {
        id: "what-is-code",
        title: "What is code",
        paragraphs: [
          "Code is a collection of instructions that tells a computer what to do",
          "Computers do not guess what we mean. Developers must give them clear, complete and correctly ordered instructions",
        ],
        bulletPoints: [
          "Mobile apps are created with code",
          "Websites use code to display content and respond to users",
          "Video games use code to control characters, scoring and rules",
          "Smart devices use code to respond to buttons, sensors and commands",
        ],
      },
      {
        id: "instructions-and-results",
        title: "Instructions create results",
        paragraphs: [
          "A program receives instructions, performs actions and produces results",
          "Even large applications are built from many smaller instructions working together",
        ],
        codeExample: {
          language: "TypeScript",
          code: `console.log("Welcome to SkillForge")
console.log("Your first lesson is ready")`,
        },
        tip: "When learning to code, focus on understanding one instruction at a time",
      },
      {
        id: "clear-instructions",
        title: "Computers need precision",
        paragraphs: [
          "Humans can often understand incomplete directions, but computers follow only the instructions they are given",
          "Small details such as spelling, punctuation and order can change what a program does",
        ],
      },
    ],
    practiceActivity: {
      title: "Give instructions to a robot",
      instructions:
        "Write five clear steps that would guide a robot from a bedroom to a kitchen",
      expectedResult:
        "The steps should be specific, ordered and complete enough that the robot would not need to guess",
    },
    quiz: [
      {
        id: "welcome-to-code-1",
        question: "What is code?",
        options: [
          "A collection of instructions for a computer",
          "A type of phone battery",
          "A computer screen",
          "A password only",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Code gives a computer instructions that describe what actions to perform",
      },
      {
        id: "welcome-to-code-2",
        question: "Why must programming instructions be clear?",
        options: [
          "Computers follow instructions exactly",
          "Computers can guess missing steps",
          "Code only works on websites",
          "Clear instructions make files larger",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A computer cannot safely guess what the developer intended",
      },
      {
        id: "welcome-to-code-3",
        question: "Which is an example of something controlled by code?",
        options: [
          "A video game's scoring system",
          "A paper notebook",
          "A wooden chair",
          "A printed poster",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Game rules, scores and character behaviour are controlled by code",
      },
    ],
  },

  "sequencing-commands": {
    lessonId: "sequencing-commands",
    estimatedMinutes: 7,
    objectives: [
      "Explain why instruction order matters",
      "Arrange commands into a logical sequence",
      "Predict the output of a short program",
    ],
    sections: [
      {
        id: "command-order",
        title: "Programs follow an order",
        paragraphs: [
          "Programs normally execute instructions from top to bottom",
          "Changing the order of commands can change the result or make the program behave incorrectly",
        ],
        codeExample: {
          language: "TypeScript",
          code: `console.log("Step 1: Open the door")
console.log("Step 2: Walk outside")
console.log("Step 3: Close the door")`,
        },
      },
      {
        id: "dependent-steps",
        title: "Some steps depend on earlier steps",
        paragraphs: [
          "A command may require another command to happen first",
          "For example, a program must calculate a value before it can display the result",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const firstScore = 20
const secondScore = 30
const totalScore = firstScore + secondScore

console.log(totalScore)`,
        },
      },
      {
        id: "building-sequences",
        title: "Build reliable sequences",
        paragraphs: [
          "A useful sequence includes every required action in the correct position",
        ],
        bulletPoints: [
          "Begin with the first required action",
          "Place dependent steps after the values they need",
          "Avoid missing or duplicated instructions",
          "Read the sequence from top to bottom before running it",
        ],
        tip: "When output is unexpected, trace the commands in the exact order they run",
      },
    ],
    practiceActivity: {
      title: "Build a sequence",
      instructions:
        "Write five ordered commands explaining how to make a simple sandwich",
      expectedResult:
        "Every step should occur in a logical order and no required action should be missing",
    },
    quiz: [
      {
        id: "sequencing-commands-1",
        question: "How do programs normally execute commands?",
        options: [
          "From top to bottom",
          "From bottom to top",
          "In random order",
          "Only the final line",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Most statements run in the order they appear from top to bottom",
      },
      {
        id: "sequencing-commands-2",
        question: "Why must a total be calculated before it is displayed?",
        options: [
          "The value must exist before it can be used",
          "console.log always runs first",
          "Numbers cannot be stored",
          "The display creates the calculation",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A later instruction can only use a value after an earlier instruction creates it",
      },
      {
        id: "sequencing-commands-3",
        question: "What is a good way to check a sequence?",
        options: [
          "Trace each command in order",
          "Skip directly to the last command",
          "Rename every variable",
          "Delete the first step",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Tracing reveals missing, duplicated or incorrectly ordered commands",
      },
    ],
  },

  "actions-output": {
    lessonId: "actions-output",
    estimatedMinutes: 7,
    objectives: [
      "Distinguish program actions from output",
      "Display information using console.log",
      "Explain how output communicates results",
    ],
    sections: [
      {
        id: "program-actions",
        title: "Programs perform actions",
        paragraphs: [
          "An action is something a program does",
          "Actions may calculate values, update information, navigate between screens or communicate with a user",
        ],
        bulletPoints: [
          "Add two numbers",
          "Save a completed lesson",
          "Open a profile screen",
          "Check whether a user is signed in",
        ],
      },
      {
        id: "program-output",
        title: "Programs produce output",
        paragraphs: [
          "Output is information a program produces after performing an action",
          "Output can appear as text, images, sounds, notifications or changes in the interface",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const learnerName = "Jonah"
const completedLessons = 3

console.log(\`Welcome, \${learnerName}\`)
console.log(\`Lessons completed: \${completedLessons}\`)`,
        },
      },
      {
        id: "useful-output",
        title: "Make output meaningful",
        paragraphs: [
          "Useful output clearly tells the user or developer what happened",
          "While learning and debugging, console.log is a simple way to inspect results",
        ],
        tip: "Include a label with logged values so the output is easy to understand",
      },
    ],
    practiceActivity: {
      title: "Create useful output",
      instructions:
        "Create variables for a path name and lesson number, then display both values in one message",
      expectedResult:
        "The console message should clearly identify the path and current lesson",
    },
    quiz: [
      {
        id: "actions-output-1",
        question: "What is program output?",
        options: [
          "Information produced by a program",
          "A variable declaration only",
          "A file name",
          "A programming error",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Output communicates a result through text, visuals, sound or interface changes",
      },
      {
        id: "actions-output-2",
        question: "Which command displays a value in the console?",
        options: ["console.log", "const", "if", "return"],
        correctAnswerIndex: 0,
        explanation:
          "console.log displays values and messages in the development console",
      },
      {
        id: "actions-output-3",
        question: "Why include labels in output?",
        options: [
          "To make the meaning of values clear",
          "To change every value into a number",
          "To hide the output",
          "To stop the program",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Labels make it easier to understand what each displayed value represents",
      },
    ],
  },

  "simple-algorithms": {
    lessonId: "simple-algorithms",
    estimatedMinutes: 8,
    objectives: [
      "Define a simple algorithm",
      "Break a problem into smaller ordered steps",
      "Trace an algorithm to verify its result",
    ],
    sections: [
      {
        id: "algorithm-definition",
        title: "What is an algorithm",
        paragraphs: [
          "An algorithm is a clear set of steps used to solve a problem or complete a task",
          "Algorithms can describe both everyday activities and computer programs",
        ],
        bulletPoints: [
          "The steps have a clear order",
          "Each step performs a specific action",
          "The process eventually finishes",
          "The algorithm produces an expected result",
        ],
      },
      {
        id: "algorithm-example",
        title: "A calculation algorithm",
        paragraphs: ["This algorithm calculates the average of three grades"],
        codeExample: {
          language: "TypeScript",
          code: `const firstGrade = 70
const secondGrade = 80
const thirdGrade = 90

const total = firstGrade + secondGrade + thirdGrade
const average = total / 3

console.log(average)`,
        },
      },
      {
        id: "problem-decomposition",
        title: "Break large problems into smaller parts",
        paragraphs: [
          "A complicated problem becomes easier when it is divided into smaller steps",
          "This approach is called decomposition",
        ],
        bulletPoints: [
          "Identify the required input",
          "Decide what actions must happen",
          "Determine the expected output",
          "Test the steps with example values",
        ],
        tip: "Before writing code, explain the solution in plain language",
      },
    ],
    practiceActivity: {
      title: "Design an algorithm",
      instructions:
        "Create an ordered algorithm that calculates the total cost of three products and then applies a 10 percent discount",
      expectedResult:
        "The algorithm should add the prices, calculate the discount and subtract it from the total",
    },
    quiz: [
      {
        id: "simple-algorithms-1",
        question: "What is an algorithm?",
        options: [
          "A set of steps for solving a problem",
          "A screen component",
          "A password",
          "A database collection",
        ],
        correctAnswerIndex: 0,
        explanation:
          "An algorithm provides an ordered process for completing a task",
      },
      {
        id: "simple-algorithms-2",
        question: "What does decomposition mean?",
        options: [
          "Breaking a problem into smaller parts",
          "Running every step twice",
          "Deleting the final output",
          "Changing numbers into strings",
        ],
        correctAnswerIndex: 0,
        explanation: "Smaller pieces are easier to understand, code and test",
      },
      {
        id: "simple-algorithms-3",
        question: "What should an algorithm eventually do?",
        options: [
          "Finish and produce a result",
          "Continue forever",
          "Avoid all input",
          "Remove every variable",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A useful algorithm reaches an end and produces its intended result",
      },
    ],
  },

  "conditional-logic": {
    lessonId: "conditional-logic",
    estimatedMinutes: 9,
    objectives: [
      "Explain how conditional logic controls decisions",
      "Evaluate true and false conditions",
      "Write a basic if and else statement",
    ],
    sections: [
      {
        id: "program-decisions",
        title: "Programs can choose actions",
        paragraphs: [
          "Conditional logic allows a program to choose between different actions",
          "The program evaluates a condition and follows the branch that matches the result",
        ],
        bulletPoints: [
          "A true condition can run one block",
          "A false condition can skip that block",
          "An else block can provide another action",
        ],
      },
      {
        id: "conditions",
        title: "Conditions produce true or false",
        paragraphs: [
          "Conditions are often created using comparison operators",
          "The result of a comparison is a boolean value",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const xp = 120
const rewardUnlocked = xp >= 100

console.log(rewardUnlocked)`,
        },
      },
      {
        id: "if-else-example",
        title: "Using if and else",
        paragraphs: [
          "This example checks whether a learner has enough XP to unlock a reward",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const xp = 120

if (xp >= 100) {
  console.log("Reward unlocked")
} else {
  console.log("Keep learning")
}`,
        },
        tip: "Read a condition as a yes-or-no question before predicting the branch",
      },
    ],
    practiceActivity: {
      title: "Create a decision",
      instructions:
        "Write a condition that checks whether a learner has completed at least five lessons and displays the appropriate message",
      expectedResult:
        "One message should appear when the requirement is met and another when it is not",
    },
    quiz: [
      {
        id: "conditional-logic-1",
        question: "What does a condition evaluate to?",
        options: [
          "true or false",
          "A screen only",
          "A file path",
          "An array only",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Conditions produce boolean results that control program decisions",
      },
      {
        id: "conditional-logic-2",
        question: "When does an else block run?",
        options: [
          "When the if condition is false",
          "When the if condition is true",
          "Before the condition is checked",
          "Every time",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Else provides an alternative action when the if condition is false",
      },
      {
        id: "conditional-logic-3",
        question: "What does xp >= 100 check?",
        options: [
          "Whether XP is at least 100",
          "Whether XP is below 100 only",
          "Whether XP is a string",
          "Whether XP is undefined",
        ],
        correctAnswerIndex: 0,
        explanation:
          "The >= operator includes values greater than or equal to 100",
      },
    ],
  },

  "loops-iteration": {
    lessonId: "loops-iteration",
    estimatedMinutes: 10,
    objectives: [
      "Explain why loops are useful",
      "Identify the parts of a basic for loop",
      "Avoid common infinite-loop mistakes",
    ],
    sections: [
      {
        id: "repeating-actions",
        title: "Repeat actions efficiently",
        paragraphs: [
          "A loop repeats a block of code without requiring developers to copy the same commands",
          "Loops are useful when processing lists or repeating an action a controlled number of times",
        ],
        bulletPoints: [
          "Display every lesson in a path",
          "Count completed activities",
          "Process multiple scores",
          "Repeat an animation step",
        ],
      },
      {
        id: "for-loop-example",
        title: "A simple for loop",
        paragraphs: [
          "A for loop normally contains a starting value, a condition and an update",
        ],
        codeExample: {
          language: "TypeScript",
          code: `for (let number = 1; number <= 5; number++) {
  console.log(number)
}`,
        },
      },
      {
        id: "looping-arrays",
        title: "Process every array item",
        paragraphs: ["A for-of loop can visit each value in an array"],
        codeExample: {
          language: "TypeScript",
          code: `const lessons = ["Code", "Algorithms", "Loops"]

for (const lesson of lessons) {
  console.log(lesson)
}`,
        },
      },
      {
        id: "safe-loops",
        title: "Make sure the loop can stop",
        paragraphs: [
          "A loop becomes infinite when its condition never becomes false",
          "Before running a loop, identify how the counter or condition changes",
        ],
        tip: "Trace the first few repetitions manually before running a new loop",
      },
    ],
    practiceActivity: {
      title: "Create a loop",
      instructions:
        "Write a loop that displays Practice complete three times and then write a second loop that displays every value in an array of lesson names",
      expectedResult:
        "The first message should appear exactly three times and each array item should appear once",
    },
    quiz: [
      {
        id: "loops-iteration-1",
        question: "Why are loops useful?",
        options: [
          "They repeat actions without duplicated code",
          "They store passwords securely",
          "They replace every condition",
          "They create Firebase projects",
        ],
        correctAnswerIndex: 0,
        explanation: "Loops organize repeated work into one reusable block",
      },
      {
        id: "loops-iteration-2",
        question: "What happens after number++?",
        options: [
          "The number increases by one",
          "The number becomes a string",
          "The loop ends immediately",
          "The number becomes false",
        ],
        correctAnswerIndex: 0,
        explanation: "The ++ operator increments the numeric value by one",
      },
      {
        id: "loops-iteration-3",
        question: "What can cause an infinite loop?",
        options: [
          "The condition never becomes false",
          "The loop contains console.log",
          "The loop starts at one",
          "The loop processes an array",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A loop cannot stop when its continuation condition always remains true",
      },
    ],
  },

  "variables-data-introduction": {
    lessonId: "variables-data-introduction",
    estimatedMinutes: 5,
    objectives: [
      "Explain what a variable is",
      "Understand why programs store information",
      "Recognize variables in simple TypeScript code",
    ],
    sections: [
      {
        id: "variable-definition",
        title: "What is a variable",
        paragraphs: [
          "A variable is a named place where a program stores information",
          "You can think of a variable as a labelled container. The label is the variable name and the value inside is the information being stored",
        ],
        bulletPoints: [
          "A player's name",
          "A game's score",
          "The number of completed lessons",
          "Whether a user is signed in",
        ],
      },
      {
        id: "variable-example",
        title: "Variables in TypeScript",
        paragraphs: [
          "The variable name appears on the left side of the equals sign and the stored value appears on the right",
          "Clear variable names make code easier to read and understand",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const playerName = "Alex"
const level = 3
const score = 1250`,
        },
        tip: "Choose names that describe the information being stored, such as playerScore instead of x",
      },
    ],
    practiceActivity: {
      title: "Identify the variables",
      instructions:
        "Look at the example and list the name and stored value of each variable",
      expectedResult:
        "playerName stores Alex, level stores 3 and score stores 1250",
    },
    quiz: [
      {
        id: "variables-introduction-1",
        question: "What is a variable used for?",
        options: [
          "Storing information",
          "Drawing a screen",
          "Installing an app",
          "Deleting TypeScript",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Variables give programs a named place to store information",
      },
      {
        id: "variables-introduction-2",
        question: "Which variable name is the clearest?",
        options: ["x", "thing", "playerHealth", "data"],
        correctAnswerIndex: 2,
        explanation:
          "playerHealth clearly describes the value the variable stores",
      },
      {
        id: "variables-introduction-3",
        question: "In const score = 100, what value is stored?",
        options: ["const", "score", "100", "="],
        correctAnswerIndex: 2,
        explanation:
          "The value on the right side of the equals sign is stored in score",
      },
    ],
  },

  "variables-data-declarations": {
    lessonId: "variables-data-declarations",
    estimatedMinutes: 7,
    objectives: [
      "Declare variables using const and let",
      "Choose between const and let",
      "Understand why var is avoided in modern React Native code",
    ],
    sections: [
      {
        id: "using-const",
        title: "Using const",
        paragraphs: [
          "Use const when the variable will not be assigned a different value",
          "const is the best default choice because it prevents accidental reassignment",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const appName = "SkillForge"
const maxLessons = 6`,
        },
      },
      {
        id: "using-let",
        title: "Using let",
        paragraphs: [
          "Use let when the variable must be assigned a new value later",
          "A score, counter or changing status may need let",
        ],
        codeExample: {
          language: "TypeScript",
          code: `let score = 0
score = 20

let currentLevel = 1
currentLevel = 2`,
        },
        tip: "Start with const and change it to let only when reassignment is required",
      },
      {
        id: "avoiding-var",
        title: "Why we avoid var",
        paragraphs: [
          "var is an older way to declare variables and does not use block scope like const and let",
          "There is normally no reason to use var in modern React Native TypeScript code",
        ],
      },
    ],
    practiceActivity: {
      title: "Choose const or let",
      instructions:
        "Declare an app name that never changes and a score that can increase",
      expectedResult: "Use const for the app name and let for the score",
    },
    quiz: [
      {
        id: "variables-declarations-1",
        question: "Which keyword should be your default choice?",
        options: ["var", "const", "change", "value"],
        correctAnswerIndex: 1,
        explanation: "Use const by default when reassignment is not needed",
      },
      {
        id: "variables-declarations-2",
        question: "Which variable should usually use let?",
        options: [
          "An app name",
          "A fixed tax rate",
          "A score that increases",
          "A permanent lesson id",
        ],
        correctAnswerIndex: 2,
        explanation:
          "A changing score must be reassigned, so let is appropriate",
      },
      {
        id: "variables-declarations-3",
        question: "Why is var usually avoided?",
        options: [
          "It cannot store values",
          "It is not block-scoped like const and let",
          "It only stores strings",
          "It is required in React Native",
        ],
        correctAnswerIndex: 1,
        explanation:
          "var follows older scoping rules that can make code harder to manage",
      },
    ],
  },

  "variables-data-strings-numbers": {
    lessonId: "variables-data-strings-numbers",
    estimatedMinutes: 8,
    objectives: [
      "Store text using strings",
      "Store numeric values using numbers",
      "Combine values using template literals and arithmetic",
    ],
    sections: [
      {
        id: "strings",
        title: "Strings",
        paragraphs: [
          "A string stores text and is written inside quotation marks",
          "Strings can hold names, messages, labels and other text values",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const learnerName: string = "Jonah"
const message: string = "Lesson complete"`,
        },
      },
      {
        id: "numbers",
        title: "Numbers",
        paragraphs: [
          "The number type stores both whole numbers and decimal values",
          "Numbers can be used in calculations",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const completedLessons: number = 4
const progressPercent: number = 66.7
const totalXp = 20 + 25 + 25`,
        },
      },
      {
        id: "template-literals",
        title: "Template literals",
        paragraphs: [
          "Template literals use backticks and allow values to be inserted into text with ${}",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'const learnerName = "Jonah"\nconst xp = 70\nconst result = `${learnerName} has earned ${xp} XP`',
        },
        tip: "Use template literals when a message includes one or more variable values",
      },
    ],
    practiceActivity: {
      title: "Create a progress message",
      instructions:
        "Create a learnerName string and an xp number, then display both in one template literal",
      expectedResult:
        "The result should include the learner's name and XP amount",
    },
    quiz: [
      {
        id: "variables-strings-numbers-1",
        question: "Which value is a string?",
        options: ["42", "true", '"SkillForge"', "undefined"],
        correctAnswerIndex: 2,
        explanation: "Text inside quotation marks is a string",
      },
      {
        id: "variables-strings-numbers-2",
        question: "Which operation adds two numbers?",
        options: ["10 + 5", '"10"', "true", "name"],
        correctAnswerIndex: 0,
        explanation:
          "The + operator adds numeric values when both values are numbers",
      },
      {
        id: "variables-strings-numbers-3",
        question: "What punctuation begins and ends a template literal?",
        options: ["Quotation marks", "Backticks", "Parentheses", "Brackets"],
        correctAnswerIndex: 1,
        explanation: "Template literals are written between backticks",
      },
    ],
  },

  "variables-data-booleans": {
    lessonId: "variables-data-booleans",
    estimatedMinutes: 7,
    objectives: [
      "Understand true and false values",
      "Use booleans to represent program state",
      "Recognize comparisons that create boolean results",
    ],
    sections: [
      {
        id: "boolean-values",
        title: "True or false",
        paragraphs: [
          "A boolean can store only one of two values: true or false",
          "Booleans are useful for representing whether something is active, complete, visible or allowed",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const isSignedIn: boolean = true
const lessonComplete: boolean = false`,
        },
      },
      {
        id: "boolean-comparisons",
        title: "Comparisons create booleans",
        paragraphs: [
          "Comparison expressions evaluate to true or false",
          "The program can store that result in a boolean variable",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const xp = 120
const rewardUnlocked = xp >= 100

console.log(rewardUnlocked)`,
        },
        tip: "Name boolean variables like yes-or-no questions, such as isSignedIn or hasCompletedLesson",
      },
    ],
    practiceActivity: {
      title: "Represent program state",
      instructions:
        "Create one boolean for whether a lesson is unlocked and another for whether it is complete",
      expectedResult: "Each variable should store either true or false",
    },
    quiz: [
      {
        id: "variables-booleans-1",
        question: "Which values can a boolean store?",
        options: ["Text only", "Numbers only", "true or false", "Any object"],
        correctAnswerIndex: 2,
        explanation: "The boolean type has only the values true and false",
      },
      {
        id: "variables-booleans-2",
        question: "What does 10 > 5 evaluate to?",
        options: ["10", "5", "true", "false"],
        correctAnswerIndex: 2,
        explanation: "Ten is greater than five, so the comparison is true",
      },
      {
        id: "variables-booleans-3",
        question: "Which is the clearest boolean name?",
        options: ["status", "x", "hasCompletedLesson", "value"],
        correctAnswerIndex: 2,
        explanation:
          "hasCompletedLesson clearly describes a true-or-false state",
      },
    ],
  },

  "variables-data-arrays": {
    lessonId: "variables-data-arrays",
    estimatedMinutes: 9,
    objectives: [
      "Store multiple related values in an array",
      "Access array values using indexes",
      "Add and transform array items",
    ],
    sections: [
      {
        id: "array-definition",
        title: "Ordered collections",
        paragraphs: [
          "An array stores multiple related values in a specific order",
          "TypeScript arrays normally contain values of the same type",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const lessonTitles: string[] = [
  "Variables",
  "Control Flow",
  "Functions"
]`,
        },
      },
      {
        id: "array-indexes",
        title: "Array indexes",
        paragraphs: [
          "Every array item has an index and the first index is 0",
          "Use square brackets to access an item at a specific index",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const paths = ["Variables", "Control Flow", "Functions"]

console.log(paths[0])
console.log(paths[2])`,
        },
      },
      {
        id: "array-methods",
        title: "Working with arrays",
        paragraphs: ["Array methods help us add, remove or transform values"],
        bulletPoints: [
          "push adds an item to the end",
          "pop removes the final item",
          "map creates a transformed array",
          "filter creates an array containing matching items",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const completedLessons = ["Variables"]
completedLessons.push("Strings & Numbers")`,
        },
        tip: "Remember that array indexes begin at 0, not 1",
      },
    ],
    practiceActivity: {
      title: "Build a learning path array",
      instructions:
        "Create an array containing three lesson titles, then access the second title",
      expectedResult: "Use index 1 to access the second item",
    },
    quiz: [
      {
        id: "variables-arrays-1",
        question: "What does an array store?",
        options: [
          "Only one value",
          "Multiple ordered values",
          "Only true and false",
          "A function definition",
        ],
        correctAnswerIndex: 1,
        explanation: "Arrays store multiple values in an ordered collection",
      },
      {
        id: "variables-arrays-2",
        question: "What is the index of the first array item?",
        options: ["-1", "0", "1", "2"],
        correctAnswerIndex: 1,
        explanation: "JavaScript and TypeScript arrays start at index 0",
      },
      {
        id: "variables-arrays-3",
        question: "Which method adds an item to the end of an array?",
        options: ["pop", "filter", "push", "map"],
        correctAnswerIndex: 2,
        explanation: "push adds a new item to the end of an array",
      },
    ],
  },

  "variables-data-objects": {
    lessonId: "variables-data-objects",
    estimatedMinutes: 10,
    objectives: [
      "Group related information in an object",
      "Access and update object properties",
      "Describe object shapes with TypeScript interfaces",
    ],
    sections: [
      {
        id: "object-definition",
        title: "Key and value pairs",
        paragraphs: [
          "An object groups related information together using properties",
          "Each property has a key and a value",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const learner = {
  name: "Alex",
  xp: 120,
  isActive: true
}`,
        },
      },
      {
        id: "object-properties",
        title: "Accessing properties",
        paragraphs: [
          "Dot notation is the most common way to access an object property",
          "A const object can still have its properties updated because the variable itself is not being reassigned",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const learner = {
  name: "Alex",
  xp: 120
}

console.log(learner.name)
learner.xp = 145`,
        },
      },
      {
        id: "object-interfaces",
        title: "Describing object shapes",
        paragraphs: [
          "An interface defines the properties and value types an object should contain",
          "This helps TypeScript find mistakes before the app runs",
        ],
        codeExample: {
          language: "TypeScript",
          code: `interface Learner {
  name: string
  xp: number
  isActive: boolean
}

const learner: Learner = {
  name: "Alex",
  xp: 120,
  isActive: true
}`,
        },
        tip: "Use objects when several values describe one thing, such as a user, lesson or learning path",
      },
    ],
    practiceActivity: {
      title: "Create a lesson object",
      instructions:
        "Create an object with a title string, xpReward number and isComplete boolean",
      expectedResult: "The object should group all three properties together",
    },
    quiz: [
      {
        id: "variables-objects-1",
        question: "How do objects organize information?",
        options: [
          "With ordered indexes only",
          "With key and value pairs",
          "With loops only",
          "With true values only",
        ],
        correctAnswerIndex: 1,
        explanation: "Object properties are stored as key and value pairs",
      },
      {
        id: "variables-objects-2",
        question: "How do you access the name property of learner?",
        options: [
          "learner(name)",
          "learner.name",
          "learner->name",
          "name.learner",
        ],
        correctAnswerIndex: 1,
        explanation:
          "Dot notation accesses a property with objectName.propertyName",
      },
      {
        id: "variables-objects-3",
        question: "What does an interface describe?",
        options: [
          "The shape of an object",
          "The app's screen colour",
          "The order of a loop",
          "A Firebase password",
        ],
        correctAnswerIndex: 0,
        explanation:
          "An interface defines expected object properties and their types",
      },
    ],
  },

  "control-flow-comparisons": {
    lessonId: "control-flow-comparisons",
    estimatedMinutes: 6,
    objectives: [
      "Understand what comparison operators do",
      "Compare numbers, strings and other values",
      "Recognize that comparisons produce boolean results",
    ],
    sections: [
      {
        id: "comparison-results",
        title: "Comparisons create boolean values",
        paragraphs: [
          "Comparison operators check how two values relate to each other",
          "Every comparison produces either true or false, which allows a program to make decisions",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const score = 80

console.log(score > 50)   // true
console.log(score < 50)   // false
console.log(score === 80) // true`,
        },
      },
      {
        id: "common-comparison-operators",
        title: "Common comparison operators",
        paragraphs: [
          "TypeScript provides operators for equality, inequality and numeric comparisons",
        ],
        bulletPoints: [
          "=== checks whether two values are equal",
          "!== checks whether two values are not equal",
          "> and < compare whether one number is greater or smaller",
          ">= and <= include equality in the comparison",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const level = 5

const isLevelFive = level === 5
const canEnter = level >= 3
const isLocked = level < 3`,
        },
        tip: "Use === instead of == so TypeScript compares both the value and its type",
      },
    ],
    practiceActivity: {
      title: "Compare a player score",
      instructions:
        "Create a score variable with a value of 75, then write comparisons that check whether it is at least 50 and exactly 100",
      expectedResult:
        "The first comparison should be true and the second should be false",
    },
    quiz: [
      {
        id: "control-flow-comparisons-1",
        question: "What value does a comparison produce?",
        options: ["A string", "A boolean", "An array", "An object"],
        correctAnswerIndex: 1,
        explanation: "A comparison always evaluates to either true or false",
      },
      {
        id: "control-flow-comparisons-2",
        question: "Which operator checks whether two values are equal?",
        options: ["=", "===", "!==", ">="],
        correctAnswerIndex: 1,
        explanation: "The === operator performs a strict equality comparison",
      },
      {
        id: "control-flow-comparisons-3",
        question: "What is the result of 10 < 4?",
        options: ["true", "false", "10", "4"],
        correctAnswerIndex: 1,
        explanation: "Ten is not smaller than four, so the comparison is false",
      },
    ],
  },

  "control-flow-if-statements": {
    lessonId: "control-flow-if-statements",
    estimatedMinutes: 7,
    objectives: [
      "Understand how an if statement controls execution",
      "Write a condition inside an if statement",
      "Predict whether a block of code will run",
    ],
    sections: [
      {
        id: "making-decisions",
        title: "Making decisions with if",
        paragraphs: [
          "An if statement runs a block of code only when its condition is true",
          "If the condition is false, TypeScript skips the block and continues with the rest of the program",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const score = 90

if (score >= 50) {
  console.log("Lesson passed")
}`,
        },
      },
      {
        id: "if-statement-parts",
        title: "Parts of an if statement",
        paragraphs: [
          "The condition is written inside parentheses and the controlled code is placed inside braces",
        ],
        bulletPoints: [
          "The if keyword starts the statement",
          "The condition must evaluate to true or false",
          "The braces contain the code that may run",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const hasKey = true

if (hasKey) {
  console.log("The door opens")
}

console.log("The program continues")`,
        },
        tip: "Keep each condition simple and give boolean variables clear names such as isComplete or hasAccess",
      },
    ],
    practiceActivity: {
      title: "Check a player's health",
      instructions:
        "Create a health variable and write an if statement that displays Low health when the value is below 25",
      expectedResult:
        "The message should appear only when the health comparison is true",
    },
    quiz: [
      {
        id: "control-flow-if-1",
        question: "When does the code inside an if statement run?",
        options: [
          "Every time",
          "Only when the condition is true",
          "Only when the condition is false",
          "Before the condition is checked",
        ],
        correctAnswerIndex: 1,
        explanation:
          "An if block runs only after its condition evaluates to true",
      },
      {
        id: "control-flow-if-2",
        question: "Where is the condition written in an if statement?",
        options: [
          "Inside parentheses",
          "Inside quotation marks",
          "After the closing brace",
          "Inside an array",
        ],
        correctAnswerIndex: 0,
        explanation:
          "The condition is placed inside parentheses after the if keyword",
      },
      {
        id: "control-flow-if-3",
        question: "What happens when an if condition is false?",
        options: [
          "The app always crashes",
          "The if block is skipped",
          "The condition becomes a string",
          "The block runs twice",
        ],
        correctAnswerIndex: 1,
        explanation:
          "TypeScript skips the controlled block and continues after it",
      },
    ],
  },

  "control-flow-else-statements": {
    lessonId: "control-flow-else-statements",
    estimatedMinutes: 7,
    objectives: [
      "Use else to provide a fallback action",
      "Use else if to test additional conditions",
      "Understand that only one branch in a chain runs",
    ],
    sections: [
      {
        id: "using-else",
        title: "Providing another path with else",
        paragraphs: [
          "An else block runs when the preceding if condition is false",
          "This allows a program to choose between two different actions",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const isLoggedIn = false

if (isLoggedIn) {
  console.log("Welcome back")
} else {
  console.log("Please sign in")
}`,
        },
      },
      {
        id: "using-else-if",
        title: "Checking multiple conditions",
        paragraphs: [
          "Use else if when a program needs to test more than two possible paths",
          "Conditions are checked from top to bottom, and the first true branch runs",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const score = 72

if (score >= 90) {
  console.log("Excellent")
} else if (score >= 60) {
  console.log("Passed")
} else {
  console.log("Try again")
}`,
        },
        tip: "Place the most specific or highest condition first so an earlier branch does not capture it incorrectly",
      },
    ],
    practiceActivity: {
      title: "Create a level message",
      instructions:
        "Write an if, else if and else chain that displays Advanced for level 10 or higher, Intermediate for level 5 or higher, and Beginner otherwise",
      expectedResult:
        "Exactly one message should be displayed for any level value",
    },
    quiz: [
      {
        id: "control-flow-else-1",
        question: "When does an else block run?",
        options: [
          "When the if condition is false",
          "When the if condition is true",
          "Before the if condition",
          "Every time the program runs",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Else provides the fallback branch when earlier conditions are false",
      },
      {
        id: "control-flow-else-2",
        question: "Why would you use else if?",
        options: [
          "To repeat code forever",
          "To test another condition",
          "To declare a constant",
          "To create an array",
        ],
        correctAnswerIndex: 1,
        explanation: "Else if adds another condition to the decision chain",
      },
      {
        id: "control-flow-else-3",
        question: "How many branches run in one if, else if and else chain?",
        options: [
          "All of them",
          "Exactly one at most",
          "Always two",
          "None ever",
        ],
        correctAnswerIndex: 1,
        explanation:
          "The first matching branch runs and the remaining branches are skipped",
      },
    ],
  },

  "control-flow-logical-operators": {
    lessonId: "control-flow-logical-operators",
    estimatedMinutes: 7,
    objectives: [
      "Combine conditions using AND and OR",
      "Reverse a boolean condition using NOT",
      "Choose the correct logical operator for a rule",
    ],
    sections: [
      {
        id: "and-operator",
        title: "AND requires both conditions",
        paragraphs: [
          "The && operator evaluates to true only when both conditions are true",
          "It is useful when several requirements must be satisfied at the same time",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const hasAccount = true
const hasAcceptedRules = true

if (hasAccount && hasAcceptedRules) {
  console.log("Access granted")
}`,
        },
      },
      {
        id: "or-and-not",
        title: "OR and NOT",
        paragraphs: [
          "The || operator is true when at least one condition is true",
          "The ! operator reverses a boolean value, turning true into false and false into true",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const isAdmin = false
const isOwner = true
const isBlocked = false

if ((isAdmin || isOwner) && !isBlocked) {
  console.log("Settings available")
}`,
        },
        bulletPoints: ["&& means AND", "|| means OR", "! means NOT"],
        tip: "Use parentheses when combining several logical operators so the intended grouping is clear",
      },
    ],
    practiceActivity: {
      title: "Build an access condition",
      instructions:
        "Create boolean variables for hasTicket and isMember, then allow entry when either value is true and the user is not banned",
      expectedResult:
        "The condition should use || to allow either requirement and ! to reverse the banned value",
    },
    quiz: [
      {
        id: "control-flow-logical-1",
        question: "When does conditionA && conditionB evaluate to true?",
        options: [
          "When both conditions are true",
          "When either condition is true",
          "When both conditions are false",
          "It never evaluates to true",
        ],
        correctAnswerIndex: 0,
        explanation: "AND requires every connected condition to be true",
      },
      {
        id: "control-flow-logical-2",
        question: "Which operator means OR?",
        options: ["&&", "||", "!", "==="],
        correctAnswerIndex: 1,
        explanation:
          "The || operator is true when at least one condition is true",
      },
      {
        id: "control-flow-logical-3",
        question: "What is the result of !true?",
        options: ["true", "false", "undefined", "1"],
        correctAnswerIndex: 1,
        explanation: "The NOT operator reverses true to false",
      },
    ],
  },

  "control-flow-loops": {
    lessonId: "control-flow-loops",
    estimatedMinutes: 8,
    objectives: [
      "Understand why loops are useful",
      "Use a for loop to repeat code a set number of times",
      "Use a while loop with a controlled condition",
    ],
    sections: [
      {
        id: "why-loops",
        title: "Repeating work efficiently",
        paragraphs: [
          "A loop repeats a block of code while a condition allows it",
          "Loops prevent developers from copying the same instruction many times",
        ],
        codeExample: {
          language: "TypeScript",
          code:
            `for (let count = 1; count <= 3; count++) {
  console.log(` +
            "`Round ${count}`" +
            `)
}`,
        },
      },
      {
        id: "for-loop-parts",
        title: "Understanding a for loop",
        paragraphs: [
          "A for loop normally contains a starting value, a condition and an update",
        ],
        bulletPoints: [
          "Initialization runs once before the loop starts",
          "The condition is checked before each repetition",
          "The update runs after each repetition",
        ],
        codeExample: {
          language: "TypeScript",
          code: `const lessons = ["Variables", "Conditions", "Loops"]

for (let index = 0; index < lessons.length; index++) {
  console.log(lessons[index])
}`,
        },
      },
      {
        id: "while-loops",
        title: "Repeating with while",
        paragraphs: [
          "A while loop continues as long as its condition remains true",
          "The loop must eventually change something in the condition or it may never stop",
        ],
        codeExample: {
          language: "TypeScript",
          code: `let energy = 3

while (energy > 0) {
  console.log("Action performed")
  energy--
}`,
        },
        tip: "Before running a while loop, identify exactly how its condition will become false",
      },
    ],
    practiceActivity: {
      title: "Count from one to five",
      instructions:
        "Write a for loop that displays the numbers 1 through 5, then predict how many times the loop body runs",
      expectedResult:
        "The loop should display five values and run exactly five times",
    },
    quiz: [
      {
        id: "control-flow-loops-1",
        question: "What is the main purpose of a loop?",
        options: [
          "To repeat a block of code",
          "To store an object",
          "To create a screen",
          "To rename a variable",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Loops efficiently repeat instructions while a condition permits them",
      },
      {
        id: "control-flow-loops-2",
        question: "When is a for loop especially useful?",
        options: [
          "When the number of repetitions is controlled",
          "When no code should run",
          "Only when creating strings",
          "Only when using Firebase",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A for loop clearly organizes a starting value, condition and update",
      },
      {
        id: "control-flow-loops-3",
        question: "What can cause an infinite while loop?",
        options: [
          "The condition never becomes false",
          "The loop contains console.log",
          "The loop uses a number",
          "The code has an array",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A while loop continues forever when its condition always remains true",
      },
    ],
  },

  "control-flow-challenge": {
    lessonId: "control-flow-challenge",
    estimatedMinutes: 10,
    objectives: [
      "Combine loops, comparisons and conditional branches",
      "Trace a program one repetition at a time",
      "Build a small control flow solution",
    ],
    sections: [
      {
        id: "combining-control-flow",
        title: "Combining the tools",
        paragraphs: [
          "Real programs often place conditions inside loops",
          "The loop handles repetition while the condition chooses what should happen during each repetition",
        ],
        codeExample: {
          language: "TypeScript",
          code:
            `const scores = [45, 72, 91, 58]

for (const score of scores) {
  if (score >= 60) {
    console.log(` +
            "`Passed: ${score}`" +
            `)
  } else {
    console.log(` +
            "`Try again: ${score}`" +
            `)
  }
}`,
        },
      },
      {
        id: "tracing-the-program",
        title: "Trace before you run",
        paragraphs: [
          "Tracing means following a program manually and recording how values change",
          "It is one of the best ways to understand control flow and find logic mistakes",
        ],
        bulletPoints: [
          "Write down the current loop value",
          "Evaluate the condition as true or false",
          "Record which branch runs",
          "Move to the next repetition",
        ],
        tip: "When a challenge feels complicated, solve one loop repetition first and then repeat the same reasoning",
      },
      {
        id: "challenge-solution-pattern",
        title: "Challenge pattern",
        paragraphs: ["The following program labels each number as even or odd"],
        codeExample: {
          language: "TypeScript",
          code:
            `const numbers = [1, 2, 3, 4, 5]

for (const number of numbers) {
  if (number % 2 === 0) {
    console.log(` +
            "`${number} is even`" +
            `)
  } else {
    console.log(` +
            "`${number} is odd`" +
            `)
  }
}`,
        },
      },
    ],
    practiceActivity: {
      title: "FizzBuzz mini challenge",
      instructions:
        "Loop from 1 to 10. Display Fizz when a number is divisible by 3, Buzz when it is divisible by 5, and the number otherwise",
      expectedResult:
        "The output should include Fizz for 3, 6 and 9, Buzz for 5 and 10, and the remaining numbers unchanged",
    },
    quiz: [
      {
        id: "control-flow-challenge-1",
        question: "Why place an if statement inside a loop?",
        options: [
          "To choose an action for each repeated value",
          "To stop TypeScript from using variables",
          "To turn every value into a string",
          "To remove the loop condition",
        ],
        correctAnswerIndex: 0,
        explanation:
          "The loop repeats while the if statement makes a decision during each repetition",
      },
      {
        id: "control-flow-challenge-2",
        question: "What does number % 2 === 0 check?",
        options: [
          "Whether the number is even",
          "Whether the number is negative",
          "Whether the number is a string",
          "Whether the number is greater than two",
        ],
        correctAnswerIndex: 0,
        explanation:
          "An even number has a remainder of zero when divided by two",
      },
      {
        id: "control-flow-challenge-3",
        question: "What is a useful first step when tracing a loop?",
        options: [
          "Record the current loop value",
          "Delete the condition",
          "Change every const to var",
          "Skip directly to the final result",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Tracking the current value makes each condition and branch easier to evaluate",
      },
    ],
  },

  "functions-introduction": {
    lessonId: "functions-introduction",
    estimatedMinutes: 6,
    objectives: [
      "Explain what a function is",
      "Recognize why reusable code is useful",
      "Call a simple function",
    ],
    sections: [
      {
        id: "function-purpose",
        title: "Reusable blocks of code",
        paragraphs: [
          "A function is a named block of code that performs a task",
          "Functions help organize programs and prevent repeated code",
        ],
        bulletPoints: [
          "A function can be called many times",
          "Its code runs only when the function is called",
          "Clear names describe the task the function performs",
        ],
      },
      {
        id: "first-function",
        title: "Creating and calling a function",
        paragraphs: [
          "A function declaration begins with the function keyword",
          "Calling the function runs the instructions inside its braces",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'function greetLearner(): void {\n  console.log("Welcome to SkillForge")\n}\n\ngreetLearner()',
        },
        tip: "Use a verb in function names because functions usually perform actions",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Create a function named showGoal that displays one learning goal, then call it twice",
      expectedResult:
        "The same message should appear twice without duplicating the console.log statement",
    },
    quiz: [
      {
        id: "functions-introduction-1",
        question: "What is a function?",
        options: [
          "A reusable block of code",
          "A type of database",
          "A screen color",
          "A password",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A function groups instructions that perform a specific task",
      },
      {
        id: "functions-introduction-2",
        question: "When does code inside a function run?",
        options: [
          "When the function is called",
          "Whenever a variable is declared",
          "Only when the app closes",
          "Before the file loads",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A function declaration defines the task, and a call executes it",
      },
      {
        id: "functions-introduction-3",
        question: "Why are functions useful?",
        options: [
          "They reduce repeated code",
          "They remove all errors automatically",
          "They replace every variable",
          "They make passwords visible",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Reusable functions keep code shorter and easier to maintain",
      },
    ],
  },

  "functions-parameters": {
    lessonId: "functions-parameters",
    estimatedMinutes: 7,
    objectives: [
      "Define parameters in a function",
      "Pass arguments when calling a function",
      "Use parameter types in TypeScript",
    ],
    sections: [
      {
        id: "parameters-input",
        title: "Parameters are function inputs",
        paragraphs: [
          "Parameters are variables listed in a function definition",
          "They allow the same function to work with different values",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'function greet(name: string): void {\n  console.log(`Hello, ${name}`)\n}\n\ngreet("Jonah")\ngreet("Krish")',
        },
      },
      {
        id: "arguments-values",
        title: "Parameters and arguments",
        paragraphs: [
          "A parameter is the name used inside the function",
          "An argument is the actual value supplied during a call",
        ],
        bulletPoints: [
          "name is a parameter in the definition",
          '"Jonah" is an argument in the call',
          "TypeScript checks that arguments match parameter types",
        ],
        tip: "Give parameters descriptive names such as price, userName or score",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Create a function named displayLevel with a number parameter and call it with levels 1 and 5",
      expectedResult: "The function should display both level values",
    },
    quiz: [
      {
        id: "functions-parameters-1",
        question: "What is a parameter?",
        options: [
          "A variable listed in a function definition",
          "The final app screen",
          "A Firestore document",
          "An error message",
        ],
        correctAnswerIndex: 0,
        explanation: "Parameters receive values when a function is called",
      },
      {
        id: "functions-parameters-2",
        question: "What is an argument?",
        options: [
          "A value passed into a function call",
          "A function name",
          "A TypeScript file",
          "A loop condition",
        ],
        correctAnswerIndex: 0,
        explanation: "Arguments are the actual values supplied to parameters",
      },
      {
        id: "functions-parameters-3",
        question: "What does name: string require?",
        options: [
          "The argument must be text",
          "The argument must be a number",
          "The function cannot be called",
          "The function must return true",
        ],
        correctAnswerIndex: 0,
        explanation: "The string annotation requires a string argument",
      },
    ],
  },

  "functions-return-values": {
    lessonId: "functions-return-values",
    estimatedMinutes: 7,
    objectives: [
      "Explain what return does",
      "Define a function return type",
      "Use a returned value in another expression",
    ],
    sections: [
      {
        id: "returning-results",
        title: "Sending a result back",
        paragraphs: [
          "The return statement sends a value back to the code that called the function",
          "Returned values can be stored, displayed or used in another calculation",
        ],
        codeExample: {
          language: "TypeScript",
          code: "function add(first: number, second: number): number {\n  return first + second\n}\n\nconst total = add(8, 4)\nconsole.log(total)",
        },
      },
      {
        id: "return-stops",
        title: "Return ends the function",
        paragraphs: [
          "When return runs, the function stops immediately",
          "Code placed after an unconditional return cannot run",
        ],
        codeExample: {
          language: "TypeScript",
          code: "function isPassing(score: number): boolean {\n  return score >= 60\n}",
        },
        tip: "Match the declared return type with the value the function actually returns",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Write a multiply function that accepts two numbers and returns their product",
      expectedResult: "Calling multiply(3, 4) should produce 12",
    },
    quiz: [
      {
        id: "functions-return-values-1",
        question: "What does return do?",
        options: [
          "Sends a value back to the caller",
          "Repeats a loop forever",
          "Creates a Firebase user",
          "Changes a file name",
        ],
        correctAnswerIndex: 0,
        explanation: "Return provides the result of a function call",
      },
      {
        id: "functions-return-values-2",
        question: "What return type fits return score >= 60?",
        options: ["boolean", "string", "number[]", "void only"],
        correctAnswerIndex: 0,
        explanation: "A comparison produces true or false, which is a boolean",
      },
      {
        id: "functions-return-values-3",
        question: "What happens after return runs?",
        options: [
          "The function ends",
          "Every function restarts",
          "All variables are deleted",
          "The app signs out",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Return stops the current function and sends its result back",
      },
    ],
  },

  "functions-arrow-functions": {
    lessonId: "functions-arrow-functions",
    estimatedMinutes: 7,
    objectives: [
      "Recognize arrow function syntax",
      "Convert a simple named function to an arrow function",
      "Use typed parameters and returns",
    ],
    sections: [
      {
        id: "arrow-syntax",
        title: "Modern function syntax",
        paragraphs: [
          "Arrow functions provide another way to write functions in TypeScript",
          "They are commonly stored in const variables",
        ],
        codeExample: {
          language: "TypeScript",
          code: "const calculateXP = (lessons: number): number => {\n  return lessons * 20\n}\n\nconsole.log(calculateXP(3))",
        },
      },
      {
        id: "concise-arrow",
        title: "Concise returns",
        paragraphs: [
          "When an arrow function contains one expression, braces and return can be omitted",
        ],
        codeExample: {
          language: "TypeScript",
          code: "const double = (value: number): number => value * 2",
        },
        tip: "Use the longer form when the function needs several statements",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Convert function square(value: number) into an arrow function",
      expectedResult:
        "The arrow function should return value multiplied by itself",
    },
    quiz: [
      {
        id: "functions-arrow-functions-1",
        question: "Which symbol identifies an arrow function?",
        options: ["=>", "===", "&&", "??"],
        correctAnswerIndex: 0,
        explanation: "Arrow functions use the => symbol",
      },
      {
        id: "functions-arrow-functions-2",
        question: "Why is const commonly used for arrow functions?",
        options: [
          "The function variable is not reassigned",
          "It makes every parameter optional",
          "It disables TypeScript",
          "It creates a database",
        ],
        correctAnswerIndex: 0,
        explanation:
          "The variable holding the function normally stays assigned to that function",
      },
      {
        id: "functions-arrow-functions-3",
        question: "When can return be omitted?",
        options: [
          "When one expression is returned directly",
          "Whenever there are multiple statements",
          "Only in async code",
          "Never",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A concise arrow function can return a single expression automatically",
      },
    ],
  },

  "functions-scope": {
    lessonId: "functions-scope",
    estimatedMinutes: 8,
    objectives: [
      "Explain local function scope",
      "Distinguish local and outer variables",
      "Avoid accessing variables outside their block",
    ],
    sections: [
      {
        id: "local-scope",
        title: "Variables inside functions",
        paragraphs: [
          "A variable declared inside a function is local to that function",
          "Code outside the function cannot access that local variable",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'function showStatus(): void {\n  const status = "Ready"\n  console.log(status)\n}\n\nshowStatus()\n// console.log(status) would cause an error',
        },
      },
      {
        id: "outer-scope",
        title: "Using outer values",
        paragraphs: [
          "A function can access variables declared in an outer scope",
          "Keeping most data local reduces accidental changes and makes code easier to understand",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'const appName = "SkillForge"\n\nfunction showAppName(): void {\n  console.log(appName)\n}',
        },
        tip: "Declare variables in the smallest scope where they are needed",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Create a function with a local variable named message, then try to predict whether code outside can access it",
      expectedResult:
        "The local variable should only be available inside the function",
    },
    quiz: [
      {
        id: "functions-scope-1",
        question: "Where can a local function variable be used?",
        options: [
          "Inside that function",
          "In every file automatically",
          "Only in Firestore",
          "Only in JSX",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Local variables exist within the function block where they are declared",
      },
      {
        id: "functions-scope-2",
        question: "Can a function access an outer variable?",
        options: [
          "Yes, when it is in an enclosing scope",
          "No, never",
          "Only if it is an array",
          "Only after logout",
        ],
        correctAnswerIndex: 0,
        explanation: "Functions can read values from their enclosing scope",
      },
      {
        id: "functions-scope-3",
        question: "Why prefer a small scope?",
        options: [
          "It reduces unintended access and changes",
          "It makes every variable global",
          "It removes return types",
          "It disables errors",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Limited scope makes code safer and easier to reason about",
      },
    ],
  },

  "functions-challenge": {
    lessonId: "functions-challenge",
    estimatedMinutes: 10,
    objectives: [
      "Combine parameters and return values",
      "Break a problem into helper functions",
      "Test functions with different arguments",
    ],
    sections: [
      {
        id: "challenge-plan",
        title: "Plan the function",
        paragraphs: [
          "A useful function has a clear purpose, inputs and output",
          "Before coding, decide what values enter the function and what result should come back",
        ],
        bulletPoints: [
          "Name the task",
          "List the required parameters",
          "Choose a return type",
          "Test normal and edge-case values",
        ],
      },
      {
        id: "discount-example",
        title: "Reusable calculation example",
        paragraphs: [
          "This function calculates a discounted price without changing the original value",
        ],
        codeExample: {
          language: "TypeScript",
          code: "const applyDiscount = (price: number, percent: number): number => {\n  const discount = price * (percent / 100)\n  return price - discount\n}\n\nconsole.log(applyDiscount(80, 25))",
        },
        tip: "Test a function with more than one set of arguments to confirm it is truly reusable",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Create calculateAverage that accepts three numbers and returns their average",
      expectedResult: "calculateAverage(70, 80, 90) should return 80",
    },
    quiz: [
      {
        id: "functions-challenge-1",
        question: "What should be decided before writing a function?",
        options: [
          "Its purpose, inputs and output",
          "Its screen background only",
          "A random variable name",
          "A Firestore password",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Planning the contract makes the function easier to build and test",
      },
      {
        id: "functions-challenge-2",
        question: "Why test several arguments?",
        options: [
          "To confirm the function works with different inputs",
          "To convert it into a loop",
          "To hide all errors",
          "To delete its return type",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Reusable functions should behave correctly for multiple valid inputs",
      },
      {
        id: "functions-challenge-3",
        question: "What should calculateAverage return?",
        options: [
          "A number",
          "A screen component",
          "An authentication token",
          "A string array only",
        ],
        correctAnswerIndex: 0,
        explanation: "An average of numeric values is a number",
      },
    ],
  },

  "debugging-introduction": {
    lessonId: "debugging-introduction",
    estimatedMinutes: 6,
    objectives: [
      "Define a software bug",
      "Distinguish syntax, runtime and logic problems",
      "Use a calm debugging process",
    ],
    sections: [
      {
        id: "bugs-defined",
        title: "What is a bug",
        paragraphs: [
          "A bug is a problem that causes software to behave differently from what was intended",
          "Bugs are a normal part of development and debugging is the process of finding and fixing them",
        ],
        bulletPoints: [
          "Syntax errors break language rules",
          "Runtime errors occur while code runs",
          "Logic errors produce the wrong result",
        ],
      },
      {
        id: "debug-process",
        title: "A simple debugging process",
        paragraphs: [
          "Start by reproducing the problem consistently",
          "Then narrow the problem to a small section of code before changing anything",
        ],
        bulletPoints: [
          "Observe the exact behaviour",
          "Read available error messages",
          "Check recent changes",
          "Test one fix at a time",
        ],
        tip: "Do not change many unrelated lines at once because you will not know which change fixed the issue",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Think of a program that calculates 2 + 2 as 5 and identify the bug category",
      expectedResult:
        "This is a logic error because the program runs but produces the wrong answer",
    },
    quiz: [
      {
        id: "debugging-introduction-1",
        question: "What is debugging?",
        options: [
          "Finding and fixing software problems",
          "Adding random features",
          "Publishing the app store listing",
          "Creating a password",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Debugging is the structured process of locating and correcting bugs",
      },
      {
        id: "debugging-introduction-2",
        question:
          "Which bug produces a wrong result while the program still runs?",
        options: [
          "Logic error",
          "File extension",
          "Authentication provider",
          "Layout component",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Logic errors allow execution but produce unintended results",
      },
      {
        id: "debugging-introduction-3",
        question: "What is a good first step?",
        options: [
          "Reproduce and observe the problem",
          "Rewrite the entire app",
          "Delete all console logs",
          "Ignore the error message",
        ],
        correctAnswerIndex: 0,
        explanation:
          "A reliable reproduction gives you clear evidence to investigate",
      },
    ],
  },

  "debugging-error-messages": {
    lessonId: "debugging-error-messages",
    estimatedMinutes: 7,
    objectives: [
      "Identify useful parts of an error message",
      "Use file names and line numbers",
      "Focus on the first relevant error",
    ],
    sections: [
      {
        id: "message-parts",
        title: "Reading the clues",
        paragraphs: [
          "Error messages often contain the error type, a description, a file and a line number",
          "These details point toward where TypeScript or the runtime noticed the problem",
        ],
        bulletPoints: [
          "Read the complete message",
          "Open the listed file",
          "Inspect the reported line and nearby lines",
          "Check whether an earlier error caused later errors",
        ],
      },
      {
        id: "example-error",
        title: "Example syntax error",
        paragraphs: [
          "A missing closing quotation mark can cause several errors after the real mistake",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'const title = "Control Flow\nconsole.log(title)',
        },
        tip: "Fix the earliest relevant error first, then check whether the later errors disappear",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Create a missing bracket error, read the reported location, then restore the bracket",
      expectedResult:
        "The error should disappear after the syntax is corrected",
    },
    quiz: [
      {
        id: "debugging-error-messages-1",
        question: "What information often appears in an error message?",
        options: [
          "A file and line number",
          "The user password",
          "A guaranteed complete fix",
          "The final app grade",
        ],
        correctAnswerIndex: 0,
        explanation: "File locations help developers inspect the relevant code",
      },
      {
        id: "debugging-error-messages-2",
        question: "Which error should usually be handled first?",
        options: [
          "The earliest relevant error",
          "The last warning only",
          "A random one",
          "None of them",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Later errors may be side effects of the first syntax problem",
      },
      {
        id: "debugging-error-messages-3",
        question: "Why inspect nearby lines?",
        options: [
          "The reported location may be affected by an earlier mistake",
          "TypeScript never reports lines",
          "Nearby code is always deleted",
          "It changes the database",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Missing punctuation or brackets can make the parser notice a problem slightly later",
      },
    ],
  },

  "debugging-console-logs": {
    lessonId: "debugging-console-logs",
    estimatedMinutes: 7,
    objectives: [
      "Inspect values with console.log",
      "Trace which branch or function runs",
      "Remove unnecessary logs after debugging",
    ],
    sections: [
      {
        id: "inspect-values",
        title: "Checking program values",
        paragraphs: [
          "console.log displays values while the program runs",
          "Logging labels with values makes the output easier to understand",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'const score = 75\nconsole.log("Current score:", score)',
        },
      },
      {
        id: "trace-flow",
        title: "Tracing execution",
        paragraphs: [
          "Logs can show whether a function or conditional branch was reached",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'function checkAccess(isLoggedIn: boolean): void {\n  console.log("checkAccess started")\n\n  if (isLoggedIn) {\n    console.log("Logged-in branch")\n  } else {\n    console.log("Logged-out branch")\n  }\n}',
        },
        tip: "Log only useful checkpoints and remove noisy temporary logs after the issue is solved",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Add logs before and after a calculation to compare the input and output values",
      expectedResult: "The console should clearly identify both values",
    },
    quiz: [
      {
        id: "debugging-console-logs-1",
        question: "What can console.log help inspect?",
        options: [
          "Current values and execution flow",
          "Firestore rules automatically",
          "A hidden password",
          "The app store price",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Logs provide evidence about what the running program is doing",
      },
      {
        id: "debugging-console-logs-2",
        question: "Why include labels in logs?",
        options: [
          "To identify what each value means",
          "To make the value private",
          "To disable the console",
          "To change its type",
        ],
        correctAnswerIndex: 0,
        explanation: "Labels make multiple logged values easier to distinguish",
      },
      {
        id: "debugging-console-logs-3",
        question: "What should happen to unnecessary temporary logs?",
        options: [
          "Remove them after debugging",
          "Store passwords in them",
          "Commit hundreds of them",
          "Use them as authentication",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Removing noisy logs keeps the console useful and avoids exposing data",
      },
    ],
  },

  "debugging-type-errors": {
    lessonId: "debugging-type-errors",
    estimatedMinutes: 8,
    objectives: [
      "Recognize common TypeScript type errors",
      "Correct mismatched values and annotations",
      "Identify basic syntax mistakes",
    ],
    sections: [
      {
        id: "type-mismatch",
        title: "Type mismatches",
        paragraphs: [
          "TypeScript reports an error when a value does not match the declared type",
          "The message usually describes the type it received and the type it expected",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'let lessonCount: number = 6\n// lessonCount = "six" causes a type error',
        },
      },
      {
        id: "syntax-checks",
        title: "Syntax mistakes",
        paragraphs: [
          "Missing commas, quotes, brackets or parentheses can prevent TypeScript from understanding the file",
        ],
        bulletPoints: [
          "Match opening and closing symbols",
          "Check commas between object properties",
          "Check quotation marks inside strings",
          "Use VS Code formatting to expose unusual structure",
        ],
        tip: "Do not use any just to silence an error before understanding the mismatch",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Correct a variable declared as number but assigned a string",
      expectedResult:
        "The variable and assigned value should use compatible types",
    },
    quiz: [
      {
        id: "debugging-type-errors-1",
        question: 'Why does assigning "six" to a number variable fail?',
        options: [
          "The value has the wrong type",
          "Strings cannot exist in TypeScript",
          "The variable is inside a file",
          "Numbers require Firebase",
        ],
        correctAnswerIndex: 0,
        explanation: "The declared number type does not accept a string value",
      },
      {
        id: "debugging-type-errors-2",
        question: "What can cause a syntax error?",
        options: [
          "A missing bracket",
          "A correctly typed variable",
          "A valid function call",
          "A completed quiz",
        ],
        correctAnswerIndex: 0,
        explanation: "Missing punctuation can make the code invalid",
      },
      {
        id: "debugging-type-errors-3",
        question: "Why avoid immediately using any?",
        options: [
          "It hides useful type checking",
          "It always improves safety",
          "It creates protected screens",
          "It fixes runtime logic",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Understanding the mismatch is better than bypassing TypeScript",
      },
    ],
  },

  "debugging-runtime-errors": {
    lessonId: "debugging-runtime-errors",
    estimatedMinutes: 8,
    objectives: [
      "Explain runtime and asynchronous errors",
      "Use try and catch with awaited operations",
      "Show safe failure behaviour",
    ],
    sections: [
      {
        id: "runtime-problems",
        title: "Errors while the app runs",
        paragraphs: [
          "Runtime errors happen after code starts executing",
          "They may come from missing data, invalid assumptions, network failures or rejected promises",
        ],
      },
      {
        id: "try-catch",
        title: "Handling async failures",
        paragraphs: [
          "An awaited operation that rejects can be handled with try and catch",
          "The catch block can log the technical error and display a useful message to the user",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'async function loadProfile(): Promise<void> {\n  try {\n    const profile = await getProfile()\n    console.log(profile)\n  } catch (error) {\n    console.log("Unable to load profile", error)\n  }\n}',
        },
        tip: "Handle the failure, but do not silently pretend the operation succeeded",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Write an async function with try and catch around a simulated rejected promise",
      expectedResult:
        "The catch block should run and display a clear failure message",
    },
    quiz: [
      {
        id: "debugging-runtime-errors-1",
        question: "When does a runtime error occur?",
        options: [
          "While the program is running",
          "Only before code is written",
          "Only in comments",
          "During app naming",
        ],
        correctAnswerIndex: 0,
        explanation: "Runtime errors occur during execution",
      },
      {
        id: "debugging-runtime-errors-2",
        question: "How are rejected awaited promises commonly handled?",
        options: [
          "With try and catch",
          "With a StyleSheet only",
          "By changing const to var",
          "By deleting await",
        ],
        correctAnswerIndex: 0,
        explanation: "try/catch handles errors thrown by awaited promises",
      },
      {
        id: "debugging-runtime-errors-3",
        question: "What should an app do after a failed request?",
        options: [
          "Report or handle the failure honestly",
          "Pretend it succeeded",
          "Expose user credentials",
          "Repeat forever without limits",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Clear failure handling keeps the app understandable and reliable",
      },
    ],
  },

  "debugging-challenge": {
    lessonId: "debugging-challenge",
    estimatedMinutes: 10,
    objectives: [
      "Use evidence to locate several bugs",
      "Fix syntax, type and logic problems",
      "Verify each correction with a test",
    ],
    sections: [
      {
        id: "broken-program",
        title: "Inspect the broken program",
        paragraphs: [
          "This example contains a type mismatch and an incorrect condition",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'const passingScore: number = 60\nconst studentScore: number = 75\n\nif (studentScore < passingScore) {\n  console.log("Passed")\n} else {\n  console.log("Try again")\n}',
        },
      },
      {
        id: "repair-strategy",
        title: "Repair one issue at a time",
        paragraphs: [
          "Compare the expected behaviour with the actual output",
          "After each change, run the same test again",
        ],
        bulletPoints: [
          "Confirm the data types",
          "Evaluate the condition manually",
          "Check the selected branch",
          "Test a passing and failing score",
        ],
        tip: "A fix is not complete until the original problem can no longer be reproduced",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Correct the condition so scores of 60 or greater pass, then test 59, 60 and 75",
      expectedResult: "59 should fail while 60 and 75 should pass",
    },
    quiz: [
      {
        id: "debugging-challenge-1",
        question:
          "What is wrong with studentScore < passingScore for a Passed branch?",
        options: [
          "It selects scores below the passing mark",
          "It compares two strings",
          "It creates an infinite loop",
          "It removes the score",
        ],
        correctAnswerIndex: 0,
        explanation:
          "The Passed branch should use studentScore >= passingScore",
      },
      {
        id: "debugging-challenge-2",
        question: "Why test boundary value 60?",
        options: [
          "It verifies the exact passing threshold",
          "It changes the variable type",
          "It creates a user account",
          "It avoids all other tests",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Boundary values often reveal incorrect comparison operators",
      },
      {
        id: "debugging-challenge-3",
        question: "When is the fix confirmed?",
        options: [
          "When the original issue no longer occurs in tests",
          "Immediately after editing one line",
          "When all logs are hidden",
          "When the app compiles without testing",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Verification requires rerunning the scenario and checking the result",
      },
    ],
  },

  "security-authentication": {
    lessonId: "security-authentication",
    estimatedMinutes: 6,
    objectives: [
      "Explain authentication",
      "Distinguish authentication from authorization",
      "Recognize a managed authentication service",
    ],
    sections: [
      {
        id: "auth-purpose",
        title: "Knowing who the user is",
        paragraphs: [
          "Authentication verifies the identity of a user",
          "Apps use authentication so people can access their own accounts and data",
        ],
        bulletPoints: [
          "Email and password is one method",
          "Firebase Auth manages accounts and sessions",
          "A signed-in user receives a unique uid",
        ],
      },
      {
        id: "auth-vs-authorization",
        title: "Identity and permission",
        paragraphs: [
          "Authentication asks who the user is",
          "Authorization asks what that authenticated user is allowed to do",
        ],
        tip: "Signing in should not automatically grant access to every user's data",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Describe one feature that requires authentication and one permission that requires authorization",
      expectedResult:
        "Authentication could identify the user, while authorization could limit editing to their own profile",
    },
    quiz: [
      {
        id: "security-authentication-1",
        question: "What does authentication verify?",
        options: [
          "A user identity",
          "A screen color",
          "A loop count",
          "A font size",
        ],
        correctAnswerIndex: 0,
        explanation: "Authentication confirms who is using the app",
      },
      {
        id: "security-authentication-2",
        question: "What does authorization control?",
        options: [
          "What an authenticated user may access or change",
          "How TypeScript formats code",
          "How arrays are indexed",
          "How many tabs exist",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Authorization applies permissions after identity is known",
      },
      {
        id: "security-authentication-3",
        question: "What Firebase feature manages user accounts?",
        options: [
          "Firebase Authentication",
          "StyleSheet",
          "Expo Image",
          "console.log",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Firebase Authentication manages accounts, sessions and login methods",
      },
    ],
  },

  "security-passwords": {
    lessonId: "security-passwords",
    estimatedMinutes: 7,
    objectives: [
      "Explain why apps should not store plain-text passwords",
      "Use managed authentication",
      "Avoid exposing credentials in logs or databases",
    ],
    sections: [
      {
        id: "password-risk",
        title: "Passwords are sensitive",
        paragraphs: [
          "A plain-text password can be read directly if storage or logs are exposed",
          "Application code should not save user passwords in Firestore or AsyncStorage",
        ],
      },
      {
        id: "managed-service",
        title: "Let Firebase handle passwords",
        paragraphs: [
          "Firebase Authentication securely manages password-based accounts",
          "The app sends credentials to the authentication service rather than building its own password storage system",
        ],
        bulletPoints: [
          "Do not log passwords",
          "Do not place passwords in Firestore documents",
          "Do not commit private secrets",
          "Use secure reset flows",
        ],
        tip: "Configuration values and user passwords are different: neither should be casually exposed, but passwords should never be stored by your app",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Review a mock signup function and remove any console.log that prints the password",
      expectedResult:
        "The password should be passed only to the authentication call and never displayed or saved manually",
    },
    quiz: [
      {
        id: "security-passwords-1",
        question: "Where should an app store a user password?",
        options: [
          "It should rely on a secure authentication service",
          "In a public Firestore document",
          "In console.log output",
          "Inside the profile name",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Managed authentication avoids unsafe manual password storage",
      },
      {
        id: "security-passwords-2",
        question: "Why is plain-text storage dangerous?",
        options: [
          "Anyone with access can read the password directly",
          "It makes the password too long",
          "It prevents all logins",
          "It changes the email",
        ],
        correctAnswerIndex: 0,
        explanation: "Plain text provides no protection when data is exposed",
      },
      {
        id: "security-passwords-3",
        question: "Should passwords appear in logs?",
        options: [
          "No",
          "Yes, for easier debugging",
          "Only after login",
          "Only on Android",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Logs may be visible to developers or tools and must not expose credentials",
      },
    ],
  },

  "security-protected-screens": {
    lessonId: "security-protected-screens",
    estimatedMinutes: 7,
    objectives: [
      "Separate public and protected screens",
      "Use auth state as a navigation guard",
      "Include a loading state during startup",
    ],
    sections: [
      {
        id: "public-protected",
        title: "Screen access",
        paragraphs: [
          "Public screens such as sign in and registration are available when a user is logged out",
          "Protected screens such as home and profile should require a signed-in user",
        ],
      },
      {
        id: "guarding-routes",
        title: "Guarding with auth state",
        paragraphs: [
          "Expo Router protected routes can use a boolean guard",
          "The app should wait while Firebase checks the existing session to avoid briefly showing the wrong screen",
        ],
        codeExample: {
          language: "TypeScript",
          code: '<Stack.Protected guard={user !== null}>\n  <Stack.Screen name="(tabs)" />\n</Stack.Protected>',
        },
        tip: "A visual redirect alone is not enough to secure database data; Firestore rules are still required",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "List the public and protected screens in SkillForge and explain the guard for each group",
      expectedResult:
        "Auth screens should be public while the main learning screens require a user",
    },
    quiz: [
      {
        id: "security-protected-screens-1",
        question: "Which screen is normally public?",
        options: ["Sign in", "User profile", "Saved progress", "Private notes"],
        correctAnswerIndex: 0,
        explanation: "Sign-in must be reachable before authentication",
      },
      {
        id: "security-protected-screens-2",
        question: "Why include an auth loading state?",
        options: [
          "To wait for the existing session check",
          "To award extra XP",
          "To create arrays",
          "To bypass Firebase",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Loading prevents incorrect screen flashes while auth state is being restored",
      },
      {
        id: "security-protected-screens-3",
        question: "Do protected routes replace Firestore rules?",
        options: [
          "No",
          "Yes, completely",
          "Only for arrays",
          "Only during development",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Route guards protect navigation, while security rules protect database access",
      },
    ],
  },

  "security-user-data": {
    lessonId: "security-user-data",
    estimatedMinutes: 8,
    objectives: [
      "Associate records with a user uid",
      "Query only the current user data",
      "Avoid trusting client ownership fields alone",
    ],
    sections: [
      {
        id: "ownership-field",
        title: "Recording ownership",
        paragraphs: [
          "Firestore documents can include a userId or ownerId field containing the authenticated user uid",
          "This allows the app and security rules to identify who owns each record",
        ],
        codeExample: {
          language: "TypeScript",
          code: 'const progress = {\n  userId: user.uid,\n  lessonId: "functions-introduction",\n  completed: true\n}',
        },
      },
      {
        id: "ownership-checks",
        title: "Enforcing ownership",
        paragraphs: [
          "Client-side filtering improves the interface but does not provide security by itself",
          "Firestore rules must compare the stored owner ID with request.auth.uid",
        ],
        tip: "Never let a user gain access merely by changing an owner ID sent from the client",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Design a note document with userId, lessonId and text fields",
      expectedResult: "The userId should come from the authenticated user uid",
    },
    quiz: [
      {
        id: "security-user-data-1",
        question: "What identifies a Firebase user uniquely?",
        options: ["uid", "display color", "lesson title", "password length"],
        correctAnswerIndex: 0,
        explanation: "Firebase assigns each authenticated user a unique uid",
      },
      {
        id: "security-user-data-2",
        question: "Why store userId on owned documents?",
        options: [
          "To connect the document to its owner",
          "To replace the document ID",
          "To make every user an admin",
          "To remove authentication",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Ownership fields allow queries and rules to check who controls the data",
      },
      {
        id: "security-user-data-3",
        question: "Is client-side filtering enough for security?",
        options: ["No", "Yes", "Only with console.log", "Only for strings"],
        correctAnswerIndex: 0,
        explanation:
          "A modified client can bypass UI filtering, so server-side rules are necessary",
      },
    ],
  },

  "security-firestore-rules": {
    lessonId: "security-firestore-rules",
    estimatedMinutes: 9,
    objectives: [
      "Explain Firestore security rules",
      "Require authentication for database access",
      "Restrict updates and deletes to document owners",
    ],
    sections: [
      {
        id: "rules-purpose",
        title: "Database enforcement",
        paragraphs: [
          "Firestore security rules run on Firebase and decide whether each request is allowed",
          "Rules protect data even when a user modifies the client application",
        ],
      },
      {
        id: "owner-rule",
        title: "Checking the authenticated uid",
        paragraphs: [
          "A basic ownership rule compares the document owner with request.auth.uid",
        ],
        codeExample: {
          language: "TypeScript",
          code: "rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /notes/{noteId} {\n      allow create: if request.auth != null\n                    && request.resource.data.userId == request.auth.uid;\n      allow read, update, delete: if request.auth != null\n                                  && resource.data.userId == request.auth.uid;\n    }\n  }\n}",
        },
        tip: "Test both allowed and denied requests because a rule that is too broad can expose every user's data",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Explain why allow read, write: if request.auth != null is weaker than an ownership rule",
      expectedResult:
        "It allows every signed-in user to access every matching document, not only their own",
    },
    quiz: [
      {
        id: "security-firestore-rules-1",
        question: "Where are Firestore rules enforced?",
        options: [
          "On Firebase",
          "Only in the screen UI",
          "Inside a Text component",
          "In the phone keyboard",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Server-side enforcement protects data from modified clients",
      },
      {
        id: "security-firestore-rules-2",
        question: "What does request.auth.uid represent?",
        options: [
          "The current authenticated user ID",
          "The document title",
          "The lesson XP amount",
          "The app package name",
        ],
        correctAnswerIndex: 0,
        explanation: "request.auth.uid identifies the user making the request",
      },
      {
        id: "security-firestore-rules-3",
        question: "Why compare an owner field to request.auth.uid?",
        options: [
          "To allow access only to the owner",
          "To make all documents public",
          "To remove document IDs",
          "To increase font size",
        ],
        correctAnswerIndex: 0,
        explanation: "The comparison enforces per-user ownership",
      },
    ],
  },

  "security-challenge": {
    lessonId: "security-challenge",
    estimatedMinutes: 10,
    objectives: [
      "Review an app for authentication risks",
      "Identify exposed credentials and weak rules",
      "Recommend layered security fixes",
    ],
    sections: [
      {
        id: "review-scenario",
        title: "Security review",
        paragraphs: [
          "Imagine an app that stores passwords in Firestore, allows every signed-in user to read all notes and only hides private screens with navigation",
          "Several layers are weak even though users can sign in",
        ],
        bulletPoints: [
          "Passwords must move to Firebase Authentication",
          "Documents need owner IDs",
          "Firestore rules must enforce ownership",
          "Protected screens should use auth guards",
          "Sensitive values must not be logged",
        ],
      },
      {
        id: "defence-layers",
        title: "Use several layers",
        paragraphs: [
          "Good security does not depend on one check",
          "Authentication, route guards, ownership fields and Firestore rules work together",
        ],
        tip: "Assume the client can be inspected or modified and place critical access checks in Firebase rules",
      },
    ],
    practiceActivity: {
      title: "Practice activity",
      instructions:
        "Write three fixes for the insecure scenario and explain which layer each fix protects",
      expectedResult:
        "Your answer should include managed passwords, protected routes and ownership-based Firestore rules",
    },
    quiz: [
      {
        id: "security-challenge-1",
        question: "What is the most serious password issue?",
        options: [
          "Storing passwords in Firestore",
          "Using a protected route",
          "Using a uid",
          "Showing a loading spinner",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Apps should rely on Firebase Authentication instead of saving passwords manually",
      },
      {
        id: "security-challenge-2",
        question:
          "What is wrong with allowing all signed-in users to read all notes?",
        options: [
          "Authentication exists but ownership is not enforced",
          "The notes have document IDs",
          "The app uses TypeScript",
          "The screen has navigation",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Signed-in status alone does not prove ownership of every document",
      },
      {
        id: "security-challenge-3",
        question: "Where should critical data permissions be enforced?",
        options: [
          "Firestore security rules",
          "Only by hiding buttons",
          "Only in console logs",
          "Only in component styles",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Server-side rules continue protecting data even if the client is changed",
      },
    ],
  },
};

export function getLessonContent(lessonId: string): LessonContent | null {
  return LESSON_CONTENT[lessonId] ?? null;
}
