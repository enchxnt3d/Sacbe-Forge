# Sacbé Forge

A mobile learning application built with React Native, Expo, and Firebase.

Sacbé Forge helps users learn concepts through structured learning paths, interactive lessons, quizzes, and experience (XP) progression inspired by learning platforms such as Duolingo and Brilliant.

---

## Features

- User registration and login using Firebase Authentication
- Multiple programming learning paths
- Interactive lessons and quizzes
- XP and lesson progression
- Persistent progress saved with Firebase Firestore
- User profile with statistics
- Modern mobile interface built with Expo Router

---

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- Firebase Authentication
- Firebase Firestore
- Formik
- Yup

---

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js (LTS)
- npm
- Expo Go (Android/iOS) or Android Studio Emulator

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Sacbe-Forge-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a file named

```
.env
```

in the root directory.

Copy the contents of the provided

```
.env.txt
```

file into your new `.env` file. This file contains the Firebase configuration required for authentication and database connectivity.

Your project should now look similar to:

```
Sacbe-Forge-main
│
├── .env
├── .env.txt
├── app
├── assets
├── src
├── package.json
└── README.md
```

### 4. Start the application

```bash
npx expo start
```

Open the application using:

- Expo Go
- Android Emulator
- iOS Simulator

---

## Project Structure

```
app/
    Application screens and routing

src/
    Components, services, context, constants, and utilities

assets/
    Images and application assets
```

---

## Learning Paths

Current learning paths included in the application:

- Thinking in Code
- Variables & Data
- Control Flow
- Functions
- Debugging
- Security Basics

Each learning path contains multiple lessons, quizzes, XP rewards, and progress tracking.

---

## Firebase

This project uses Firebase for:

- Authentication
- Cloud Firestore
- User progress storage

The Firebase configuration is loaded through environment variables stored inside the `.env` file.

---

## Team

Sacbé Forge

- Jonah Gile
- Joaquin Urbano Feliciano
- Krish Choudhary

---

## Course

CPRG 303 — Mobile Application Development

Southern Alberta Institute of Technology (SAIT)

---

## License

This project was developed for educational purposes as part of CPRG 303 at SAIT.
