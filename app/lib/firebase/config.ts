import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getDatabase, Database } from 'firebase/database'
import { getFirestore, Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBXvn_aq_pwMbRNMypPmVkWTHN3zjr0kXI",
  authDomain: "son-of-god-7.firebaseapp.com",
  databaseURL: "https://son-of-god-7-default-rtdb.firebaseio.com",
  projectId: "son-of-god-7",
  storageBucket: "son-of-god-7.firebasestorage.app",
  messagingSenderId: "834154822850",
  appId: "1:834154822850:web:74f6f17f637735efcb0f5b",
  measurementId: "G-RQ1PDVDPFC"
}

// Initialize Firebase (works on both client and server)
let app: FirebaseApp
let auth: Auth
let database: Database
let firestore: Firestore

// Initialize Firebase app (universal)
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize services
auth = getAuth(app)
database = getDatabase(app)
firestore = getFirestore(app)

// Set persistence only on client side
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Error setting persistence:', error)
  })
}

export { auth, database, firestore }
export default app
