# Firebase Integration Guide

This project is now connected to Firebase with support for Authentication, Firestore Database, and Cloud Storage.

## Setup Instructions

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the setup wizard
3. Create a web app in your Firebase project
4. Copy the Firebase configuration credentials

### 2. Configure Environment Variables
1. Copy `.env.example` to `.env.local` in the project root
2. Replace the placeholders with your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_from_firebase
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 3. Configure Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your region

### 4. Configure Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider

### 5. (Optional) Set Up Firestore Rules
For production, update your Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /analyses/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

## Firebase Services Available

### Authentication (`authService.ts`)
- `signUp(email, password)` - Register new users
- `signIn(email, password)` - Login users
- `logout()` - Sign out current user
- `onAuthChange(callback)` - Listen for auth state changes
- `getCurrentUser()` - Get current authenticated user

### Database (`dbService.ts`)
- `saveThreatAnalysis(userId, analysis)` - Save threat analysis records
- `getThreatAnalyses(userId)` - Fetch all analyses for a user
- `getThreatAnalysis(userId, analysisId)` - Get specific analysis
- `updateThreatAnalysis(userId, analysisId, updates)` - Update analysis
- `deleteThreatAnalysis(userId, analysisId)` - Delete analysis

### Auth Context (`AuthContext.tsx`)
Use the `useAuth()` hook in components to access:
- `user` - Current authenticated user
- `loading` - Loading state
- `logout()` - Logout function

## Usage Example

```tsx
import { useAuth } from './contexts/AuthContext';
import { saveThreatAnalysis } from './services/dbService';

function Component() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  const handleSave = async (analysis) => {
    await saveThreatAnalysis(user.uid, analysis);
  };

  return <div>Your content here</div>;
}
```

## Development with Emulator (Optional)

To use Firebase Local Emulator Suite for development:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init`
3. Start emulator: `firebase emulators:start`
4. Uncomment the emulator connection code in `firebaseService.ts`

## Troubleshooting

### "VITE_FIREBASE_* is not defined"
- Make sure `.env` file exists with proper Firebase credentials
- Restart the dev server after updating `.env`

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Ensure user is authenticated before accessing Firestore

### CORS errors
- Configure your Firebase project to allow localhost
- Check Firebase Authentication domain settings
