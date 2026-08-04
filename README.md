# Sacbé Forge

Skill Forge is a gamified mobile learning application built with React Native, Expo, and Firebase. The app helps users build programming knowledge through structured learning paths, interactive lessons, quizzes, XP progression, achievements, and progress tracking inspired by platforms like Duolingo and Brilliant.

This project was developed for CPRG 303 – Mobile Application Development at the Southern Alberta Institute of Technology (SAIT).

---

# Features

- Firebase Email & Password Authentication
- Secure user accounts
- Six programming learning paths
- Interactive lessons
- Lesson quizzes
- XP reward system
- Sequential lesson unlocking
- Achievement tracking
- Daily streak tracking
- Personal notes for lessons
- User profile with learning statistics
- Progress saved to Firebase Firestore
- Modern mobile interface built with Expo Router

---

# Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- Firebase Authentication
- Firebase Firestore
- AsyncStorage

---

# Prerequisites

Install the following before running the project:

- Node.js (LTS)
- npm
- Expo Go (Android/iOS) or Android Studio Emulator

---

# Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd Sacbe-Forge-main
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create the environment file

Create a file named:

```text
.env
```

in the project root.

Copy the contents of the provided **.env.txt** file into your new `.env` file.

The `.env` file contains the Firebase configuration required for authentication and Firestore.

After creating it, your project should look similar to:

```text
Sacbe-Forge-main
│
├── .env
├── package.json
├── src
├── assets
├── app.json
└── README.md
```

## 4. Start the application

```bash
npx expo start
```

Run the application using:

- Expo Go
- Android Emulator
- iOS Simulator

---

# Project Structure

```text
src/
│
├── app/
│   Application screens and Expo Router navigation
│
├── components/
│   Reusable UI components
│
├── config/
│   Firebase configuration
│
├── constants/
│   Lesson content, colors, achievements, and shared constants
│
├── context/
│   Authentication and application context
│
├── services/
│   Firestore and application services
│
├── types/
│   Shared TypeScript types
│
└── utils/
│   Utility functions

assets/
    Images, fonts, and other static resources
```

---

# Learning Paths

The application currently includes six learning paths:

- Thinking in Code
- Variables & Data
- Control Flow
- Functions
- Debugging
- Security Basics

Each learning path contains:

- Interactive lessons
- Knowledge checks
- XP rewards
- Progress tracking
- Locked lesson progression

---

# Firebase

This project uses Firebase for:

- User Authentication
- Cloud Firestore
- Secure user progress storage
- Achievement and profile synchronization

The Firebase configuration is loaded from the `.env` file.

---

# Notes for Instructors

To run this application successfully:

1. Install all dependencies using `npm install`.
2. Create a `.env` file in the project root.
3. Copy the contents of the provided `.env.txt` file into the `.env` file.
4. Run the project using `npx expo start`.

Without the `.env` file, Firebase Authentication and Firestore will not initialize correctly.

---

# Team

Sacbé Forge

- Jonah Gile
- Joaquin Urbano Feliciano
- Krish Choudhary

---

# Course

**CPRG 303 – Mobile Application Development**

Southern Alberta Institute of Technology (SAIT)

---

# License

This project was created for educational purposes as part of CPRG 303 at SAIT.
