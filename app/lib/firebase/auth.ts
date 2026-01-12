import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  updateProfile,
} from 'firebase/auth'
import { auth } from './config'

/**
 * Firebase error codes mapping to user-friendly messages
 */
const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'Invalid email or password',
    'auth/wrong-password': 'Invalid email or password',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/invalid-verification-code': 'Invalid verification code',
    'auth/invalid-verification-id': 'Invalid verification ID',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/app-not-authorized': 'Firebase app not authorized. Please check your configuration.',
    'auth/api-key-not-valid': 'Firebase API key is not valid. Please check your configuration.',
    'auth/project-not-found': 'Firebase project not found. Please check your configuration.',
  }
  return errorMessages[errorCode] || `An error occurred: ${errorCode || 'Unknown error'}. Please try again.`
}

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update user profile with name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      })
    }
    
    return userCredential
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error.code))
  }
}

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Firebase sign-in error:', error)
    console.error('Error code:', error?.code)
    console.error('Error message:', error?.message)
    
    // Handle case where error code might not exist
    if (error?.code) {
      throw new Error(getFirebaseErrorMessage(error.code))
    } else {
      // If no error code, use the error message or default
      throw new Error(error?.message || 'An error occurred. Please try again.')
    }
  }
}

/**
 * Sign out
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error: any) {
    throw new Error('Failed to sign out. Please try again.')
  }
}

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}
