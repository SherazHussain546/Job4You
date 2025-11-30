'use client';

import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo, GoogleIcon } from '@/components/icons';
import { User } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { useState } from 'react';

export default function LoginPage() {
  const auth = useAuth();
  const { isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const loading = isUserLoading || isSigningIn;

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsSigningIn(true);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      setIsSigningIn(false);
    }
  };

  const signInAnonymously = async () => {
    try {
      setIsSigningIn(true);
      await firebaseSignInAnonymously(auth);
    } catch (error) {
      console.error('Error signing in anonymously', error);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <AppLogo className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">ResumeCraft AI</CardTitle>
          <CardDescription>The Smart Resume Tailor</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={signInWithGoogle} disabled={loading}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <Button variant="secondary" onClick={signInAnonymously} disabled={loading}>
            <User className="mr-2 h-4 w-4" />
            Sign in Anonymously
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
