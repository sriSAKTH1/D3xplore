import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdkdaTPQZQU0zl-p8EamzlnyGnYHciN5U",
  authDomain: "d3xplore.firebaseapp.com",
  projectId: "d3xplore",
  storageBucket: "d3xplore.firebasestorage.app",
  messagingSenderId: "4526060132",
  appId: "1:4526060132:web:8b7ccda0697249f9d9e571",
  measurementId: "G-GJDL9G8QJ2"
};

// Check if configuration is valid (not placeholder)
export const isFirebaseEnabled = 
  firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes("YOUR-API-KEY") &&
  !firebaseConfig.apiKey.includes("AIzaSyDOC");

let app: any;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics;

if (isFirebaseEnabled) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initialized successfully");
    
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Firebase Analytics unavailable");
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("D3xplore: Firebase API Key not found. Running in Demo/LocalStorage mode.");
}

export { auth, db, storage, analytics };