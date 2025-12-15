/**
 * Firebase Auth Context Provider
 * Manages Google OAuth authentication state across the app
 */
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

/**
 * Maps Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'auth/configuration-not-found':
      return 'Google Sign-In is not enabled. Please enable it in Firebase Console.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/operation-not-allowed':
      return 'Google Sign-In is not enabled for this project.';
    default:
      return error.message || 'An error occurred during sign-in.';
  }
}

interface FirebaseAuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

interface FirebaseAuthProviderProps {
  children: ReactNode;
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        setError(null);
      },
      (authError) => {
        setError(authError.message);
        setLoading(false);
        setUser(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const authError = err as AuthError;
      const friendlyMessage = getAuthErrorMessage(authError);
      setError(friendlyMessage);
      console.error('Auth error:', authError.code, authError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    }
  }, []);

  const value: FirebaseAuthContextType = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useAuth(): FirebaseAuthContextType {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}
