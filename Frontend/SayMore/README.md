# SayMore Frontend - React Native Application

## Overview

SayMore is a public speaking and stuttering analysis application that leverages deep learning and speech processing techniques to assess and improve users' speech quality. This frontend, built with React Native, provides a seamless and dynamic user interface to interact with the backend services, offering features such as public speaking analysis, stuttering detection, and personalized feedback.

## Features

- **Cross-Platform Support**: Runs on both Android and iOS devices.
- **Live Reloading**: Hot-reload functionality for a rapid development cycle.
- **Custom Components**: Reusable UI components for charts, notifications, and more.
- **Seamless Integration**: Connects with backend APIs and Firebase for user data management.
- **Responsive Design**: Ensures a smooth user experience across various devices.

## Installation

### Prerequisites

- Node.js (>=18)
- React Native CLI
- Android Studio and/or Xcode (for Android/iOS development)

### Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-repo/saymore-frontend.git
   cd saymore-frontend
    ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the application:**

   For Android:
   ```sh
   npx react-native run-android
   ```

   For iOS:
   ```sh
   npx react-native run-ios
   ```

## Usage

After launching the app, you can modify it by editing App.tsx or other components. To see your changes in real-time:
- Android: Press <kbd>R</kbd> twice or open the Developer Menu using <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- iOS: Press <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in the simulator.

## Additional Commands

- **Lint the Code**: 
  ```sh
  npm run lint
  ```
  
- **Format the Code**: 
  ```sh
    npm run format
    ```
  
- **Clean the Project**:
- ```sh
  npm run clean
  ```
  
## Deployment

### Android Release Build

- **To generate a release build for Android**:
- ```sh
  cd android
  ./gradlew assembleRelease
  ```

## Project Structure

```
SayMore/
│── .bundle/
│── **tests**/
│ │── App.test.tsx
│── android/
│── ios/
│── assets/
│── components/
│ │── Analysis_PS.tsx
│ │── Analysis_S.tsx
│ │── AudioRecorder.tsx
│ │── Authentication.tsx
│ │── Charts.tsx
│ │── LandingPage.tsx
│ │── Notifications.tsx
│ │── TabNavigator.tsx
│ │── ThemeContext.tsx
│── screens/
│ │── AccountScreen.tsx
│ │── ActivityScreen.tsx
│ │── AdditionalDetailsScreen.tsx
│ │── AnalysisScreen.tsx
│ │── AppInfoScreen.tsx
│ │── AudioScreen.tsx
│ │── ChangePasswordScreen.tsx
│ │── ClarityAndPitchScreen.tsx
│ │── CommunicationAndStageFrightScreen.tsx
│ │── Difficulty.tsx
│ │── EditProfileScreen.tsx
│ │── FeedbackScreen_PS.tsx
│ │── FeedbackScreen_S.tsx
│ │── HistoryScreen.tsx
│ │── HomeScreen.tsx
│ │── LessonRedirectionPS.tsx
│ │── LessonRedirectionStuttering.tsx
│ │── LessonsPointsScreen.tsx
│ │── LessonsScreen.tsx
│ │── MoreScreen.tsx
│ │── PersonalDetailsScreen.tsx
│ │── PointsCategoryScreen.tsx
│ │── PointsScreen.tsx
│ │── PrivacyCookiesScreen.tsx
│ │── ProgressCategoryScreen.tsx
│ │── ProgressScreen.tsx
│ │── PublicSpeakQuestionScreen.tsx
│ │── QuizPointHistoryScreen.tsx
│ │── QuizProgressScreen.tsx
│ │── QuizzesNavScreen.tsx
│ │── SettingsScreen.tsx
│ │── SignInScreen.tsx
│ │── SignUpScreen.tsx
│ │── SpeakingWithEnergyScreen.tsx
│ │── SpeechTherapyScreen.tsx
│ │── StutteringQuestionScreen.tsx
│ │── StutterQuizType.tsx
│ │── TermsAndConditionsScreen.tsx
│ │── TestHistory.tsx
│ │── TestHistory_PS.tsx
│ │── TestHistory_S.tsx
│ │── TotalPointsScreen.tsx
│ │── UnderstandingAndOvercomingStutteringScreen.tsx
│ │── VideoListScreen.tsx
│ │── VideoPlayerScreen.tsx
│ │── WelcomeScreen.tsx
│── types/
│ │── types.ts
│── .eslintrc.js
│── .eslintignore
│── .prettierrc.js
│── .prettierignore
│── .watchmanconfig
│── app.json
│── App.tsx
│── babel.config.js
│── firebase-messaging-headless-task.js
│── Gemfile
│── index.js
│── jest.config.js
│── metro.config.js
│── package.json
│── package-lock.json
│── README.md
│── tsconfig.json

```