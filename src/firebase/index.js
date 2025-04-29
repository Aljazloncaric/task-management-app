import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfNH6Rf8kP7F0JmP6nSPeitXOQjgfKXuA",
  authDomain: "task-management-app-d9452.firebaseapp.com",
  projectId: "task-management-app-d9452",
  storageBucket: "task-management-app-d9452.firebasestorage.app",
  messagingSenderId: "161409281801",
  appId: "1:161409281801:web:ca3ba1a774f3869f1d2dd8",
  measurementId: "G-MSW9YLCB6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);

export { auth, db };
