import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAnaTDfoIZtsI4-znqaMGlIXfpSHzhfvPs",
  authDomain: "studio-9075306461-1298d.firebaseapp.com",
  projectId: "studio-9075306461-1298d",
  storageBucket: "studio-9075306461-1298d.appspot.com",
  messagingSenderId: "941915984146",
  appId: "1:941915984146:web:4db7714a2726c4bbd1a3cb",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
