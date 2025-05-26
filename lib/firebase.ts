import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo123",
}

let app: any = null
let auth: any = null
let db: any = null
let isFirebaseConfigured = false

try {
  // Check if we have real Firebase config (not demo values)
  const hasRealConfig = firebaseConfig.apiKey !== "demo-api-key" && firebaseConfig.projectId !== "demo-project"

  if (hasRealConfig) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    isFirebaseConfigured = true
    console.log("Firebase initialized successfully")
  } else {
    console.log("Using demo Firebase configuration")
  }
} catch (error) {
  console.warn("Firebase initialization failed:", error)
}

export { auth, db }

// Helper function to check if Firebase is available and configured
export const isFirebaseAvailable = () => {
  return isFirebaseConfigured && app !== null && auth !== null && db !== null
}

// Helper to get Firebase config status
export const getFirebaseStatus = () => {
  return {
    configured: isFirebaseConfigured,
    available: isFirebaseAvailable(),
    hasAuth: auth !== null,
    hasDb: db !== null,
  }
}
