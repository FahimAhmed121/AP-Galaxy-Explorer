import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  sendEmailVerification as firebaseSendEmailVerification,
  onAuthStateChanged,
  Unsubscribe,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * AuthService
 * Isolated application service wrapping Firebase Auth.
 * Completely decoupled from Phaser rendering engine and gameplay systems.
 */
export class AuthService {
  /**
   * Subscribe to Firebase authentication state changes.
   * Calls callback with User object or null whenever auth state changes.
   */
  static onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  }

  /**
   * Get current authenticated user synchronously
   */
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Sign in using Email and Password
   */
  static async signInWithEmail(email: string, pass: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error: any) {
      console.error('[AuthService] Email sign-in failed:', error);
      throw new Error(AuthService.formatAuthError(error?.code) || error.message || 'Failed to sign in.');
    }
  }

  /**
   * Sign up using Email and Password
   */
  static async signUpWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
      // Send email verification upon account creation
      if (result.user && !result.user.emailVerified) {
        await AuthService.sendEmailVerification(result.user);
      }
      return result.user;
    } catch (error: any) {
      console.error('[AuthService] Email sign-up failed:', error);
      throw new Error(AuthService.formatAuthError(error?.code) || error.message || 'Failed to create account.');
    }
  }

  /**
   * Send Password Reset Email
   */
  static async sendPasswordReset(email: string): Promise<void> {
    try {
      await firebaseSendPasswordReset(auth, email);
    } catch (error: any) {
      console.error('[AuthService] Password reset failed:', error);
      throw new Error(AuthService.formatAuthError(error?.code) || error.message || 'Failed to send reset email.');
    }
  }

  /**
   * Send Email Verification to user
   */
  static async sendEmailVerification(user: User): Promise<void> {
    try {
      await firebaseSendEmailVerification(user);
    } catch (error: any) {
      console.error('[AuthService] Email verification send failed:', error);
      throw new Error(error.message || 'Failed to send verification email.');
    }
  }

  /**
   * Sign Out current user
   */
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('[AuthService] Sign out failed:', error);
      throw new Error(error.message || 'Failed to sign out.');
    }
  }

  /**
   * Format Firebase Auth error codes into human-readable messages
   */
  private static formatAuthError(code?: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  }
}
