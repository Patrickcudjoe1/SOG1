import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getDatabase, Database } from 'firebase/database'
import { getFirestore, Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAl7mIdtWflUibipwblChTahmqe3Vc_Rjw",
  authDomain: "sog1-32845.firebaseapp.com",
  databaseURL: "https://sog1-32845-default-rtdb.firebaseio.com",
  projectId: "sog1-32845",
  storageBucket: "sog1-32845.firebasestorage.app",
  messagingSenderId: "783644971638",
  appId: "1:783644971638:web:4d6da90a3ac104991a0557",
  measurementId: "G-3M9YB8PTZN"
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
