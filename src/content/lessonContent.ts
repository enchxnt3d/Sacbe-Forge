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

export type LessonContent = {
  lessonId: string;
  estimatedMinutes: number;
  objectives: string[];
  sections: LessonContentSection[];
  practiceActivity?: LessonPracticeActivity;
};

// Edit lesson material in this file without touching Firebase
// Keep every lessonId matched with src/constants/lessons.ts
// Do not rename lesson ids after users have saved progress
export const LESSON_CONTENT: Record<string, LessonContent> = {
  "welcome-to-code": {
    lessonId: "welcome-to-code",
    estimatedMinutes: 5,
    objectives: [
      "Understand what computer code is",
      "Recognize that programs follow instructions",
      "Identify simple examples of code in daily life",
    ],
    sections: [
      {
        id: "what-is-code",
        title: "What is code",
        paragraphs: [
          "Code is a collection of instructions that tells a computer what to do",
          "Computers do not guess what we want, so developers must give them clear and organized instructions",
        ],
        bulletPoints: [
          "Apps are created with code",
          "Websites are created with code",
          "Video games use code to control characters and rules",
        ],
      },
      {
        id: "first-command",
        title: "Your first command",
        paragraphs: [
          "A command is a single instruction given to a computer",
          "The following command asks the computer to display a message",
        ],
        codeExample: {
          language: "JavaScript",
          code: 'console.log("Hello, Sacbé Forge")',
        },
        tip: "Small commands can be combined to create complete programs",
      },
    ],
    practiceActivity: {
      title: "Try it yourself",
      instructions:
        "Think of three clear instructions you would give a robot to move from your bedroom to the kitchen",
      expectedResult:
        "Your instructions should be ordered and specific enough for the robot to follow",
    },
  },

  "sequencing-commands": {
    lessonId: "sequencing-commands",
    estimatedMinutes: 7,
    objectives: [
      "Understand why command order matters",
      "Arrange instructions in a logical sequence",
      "Predict the result of a short program",
    ],
    sections: [
      {
        id: "command-order",
        title: "Command order",
        paragraphs: [
          "Programs normally execute instructions from top to bottom",
          "Changing the order of commands can change the final result",
        ],
        codeExample: {
          language: "JavaScript",
          code: `console.log("Step 1: Open the door")
console.log("Step 2: Walk outside")
console.log("Step 3: Close the door")`,
        },
      },
      {
        id: "clear-sequences",
        title: "Creating clear sequences",
        paragraphs: [
          "A good sequence completes actions in the order they are required",
        ],
        bulletPoints: [
          "Start with the first required action",
          "Place dependent actions after their requirements",
          "Check that no important step is missing",
        ],
        tip: "If a program behaves incorrectly, check the order of its commands",
      },
    ],
    practiceActivity: {
      title: "Build a sequence",
      instructions:
        "Write four ordered commands explaining how to make a simple sandwich",
      expectedResult: "Every command should happen in a logical order",
    },
  },

  "actions-output": {
    lessonId: "actions-output",
    estimatedMinutes: 7,
    objectives: [
      "Understand the difference between an action and output",
      "Display information from a program",
      "Recognize how programs communicate results",
    ],
    sections: [
      {
        id: "program-actions",
        title: "Program actions",
        paragraphs: [
          "An action is something a program performs",
          "Actions can calculate values, save information or display a result",
        ],
        bulletPoints: [
          "Calculate a total",
          "Open another screen",
          "Save a user preference",
          "Display a message",
        ],
      },
      {
        id: "displaying-output",
        title: "Displaying output",
        paragraphs: [
          "Output is information produced by a program",
          "We can use console.log to display simple output while learning JavaScript",
        ],
        codeExample: {
          language: "JavaScript",
          code: `const learnerName = "Joaquin"

console.log("Welcome " + learnerName)`,
        },
        tip: "Output helps users understand what a program has done",
      },
    ],
    practiceActivity: {
      title: "Create an output",
      instructions:
        "Write a console.log command that displays the name of your favourite technology",
      expectedResult:
        "The console should display the text you placed inside the command",
    },
  },

  "simple-algorithms": {
    lessonId: "simple-algorithms",
    estimatedMinutes: 8,
    objectives: [
      "Understand what a simple algorithm is",
      "Break a problem into smaller steps",
      "Create an ordered solution",
    ],
    sections: [
      {
        id: "algorithm-definition",
        title: "What is an algorithm",
        paragraphs: [
          "An algorithm is a clear set of steps used to solve a problem",
          "Algorithms do not need to be complicated and can describe normal daily activities",
        ],
        bulletPoints: [
          "The steps have a clear order",
          "Each step performs a specific action",
          "The algorithm produces an expected result",
        ],
      },
      {
        id: "algorithm-example",
        title: "A simple algorithm",
        paragraphs: [
          "This algorithm calculates the total price of two products",
        ],
        codeExample: {
          language: "JavaScript",
          code: `const firstPrice = 10
const secondPrice = 15
const total = firstPrice + secondPrice

console.log(total)`,
        },
        tip: "Solve one small part of the problem at a time",
      },
    ],
    practiceActivity: {
      title: "Design an algorithm",
      instructions:
        "Create an ordered list of steps for calculating the average of three grades",
      expectedResult:
        "Your algorithm should add the grades and divide the total by three",
    },
  },

  "conditional-logic": {
    lessonId: "conditional-logic",
    estimatedMinutes: 9,
    objectives: [
      "Understand how programs make decisions",
      "Recognize true and false conditions",
      "Create a basic if and else statement",
    ],
    sections: [
      {
        id: "program-decisions",
        title: "Program decisions",
        paragraphs: [
          "Conditional logic allows a program to choose between different actions",
          "The program checks whether a condition is true or false before continuing",
        ],
        bulletPoints: [
          "If the condition is true, run one action",
          "If the condition is false, run another action",
        ],
      },
      {
        id: "if-else-example",
        title: "Using if and else",
        paragraphs: [
          "This example checks whether a learner has enough XP to unlock a reward",
        ],
        codeExample: {
          language: "JavaScript",
          code: `const xp = 120

if (xp >= 100) {
  console.log("Reward unlocked")
} else {
  console.log("Keep learning")
}`,
        },
        tip: "Conditions are questions that the program can answer with true or false",
      },
    ],
    practiceActivity: {
      title: "Create a decision",
      instructions:
        "Write a condition that checks whether a learner has completed at least five lessons",
      expectedResult:
        "Display one message when the requirement is met and another when it is not",
    },
  },

  "loops-iteration": {
    lessonId: "loops-iteration",
    estimatedMinutes: 10,
    objectives: [
      "Understand why loops are useful",
      "Recognize repeated actions",
      "Create a basic loop",
    ],
    sections: [
      {
        id: "repeating-actions",
        title: "Repeating actions",
        paragraphs: [
          "A loop repeats a block of code without requiring us to write the same commands many times",
          "Loops are useful when an action must happen a known or repeated number of times",
        ],
        bulletPoints: [
          "Display every lesson in a list",
          "Count completed activities",
          "Repeat an animation",
          "Process multiple pieces of data",
        ],
      },
      {
        id: "loop-example",
        title: "A simple loop",
        paragraphs: ["This loop displays the numbers one through five"],
        codeExample: {
          language: "JavaScript",
          code: `for (let number = 1; number <= 5; number++) {
  console.log(number)
}`,
        },
        tip: "Make sure every loop has a condition that can eventually become false",
      },
    ],
    practiceActivity: {
      title: "Plan a loop",
      instructions:
        "Create a loop that displays the message Practice complete three times",
      expectedResult: "The same message should appear exactly three times",
    },
  },
};

export function getLessonContent(lessonId: string): LessonContent | null {
  return LESSON_CONTENT[lessonId] ?? null;
}
