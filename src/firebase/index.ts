'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  // Check if Firebase is already initialized
  if (getApps().length) {
    return getSdks(getApp());
  }

  // During server-side rendering or build, config might be incomplete.
  // We only want to initialize on the client where NEXT_PUBLIC_ variables are available.
  // A check for a key property of the config ensures we don't initialize without it.
  if (!firebaseConfig.apiKey) {
    // If config is not available, we return nulls.
    // The client-provider will handle re-initialization on the client.
    return { firebaseApp: null, auth: null, firestore: null };
  }

  const firebaseApp = initializeApp(firebaseConfig);
  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
