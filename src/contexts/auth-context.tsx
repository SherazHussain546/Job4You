'use client';

import type { User } from 'firebase/auth';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  signInAnonymously as firebaseSignInAnonymously,
} from 'firebase/auth';
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
    } finally {
      // Auth state change will set loading to false
    }
  };

  const signInAnonymously = async () => {
    try {
      setLoading(true);
      await firebaseSignInAnonymously(auth);
    } catch (error) {
      console.error('Error signing in anonymously', error);
    } finally {
      // Auth state change will set loading to false
    }
  };


  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInAnonymously,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
