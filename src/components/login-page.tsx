'use client';

import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleIcon } from '@/components/icons';
import { User, Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const signupSchema = z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const { isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

  const loading = isUserLoading || isSigningIn;

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<SignupData>({ resolver: zodResolver(signupSchema) });


  const handleAuthError = (error: any) => {
    console.error('Authentication error', error);
    let description = 'An unexpected error occurred. Please try again.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = 'Invalid email or password.';
    } else if (error.code === 'auth/email-already-in-use') {
        description = 'An account with this email already exists.';
    }
    toast({
      title: 'Authentication Failed',
      description,
      variant: 'destructive',
    });
    setIsSigningIn(false);
  }

  const onLoginSubmit = async (data: LoginData) => {
    setIsSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const onSignupSubmit = async (data: SignupData) => {
    setIsSigningIn(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signInAnonymously = async () => {
    setIsSigningIn(true);
    try {
      await firebaseSignInAnonymously(auth);
    } catch (error) {
      handleAuthError(error);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl">
            <span className="font-body">Job</span><span className="font-headline text-primary">for</span><span className="font-body">You</span>
          </CardTitle>
          <CardDescription>Your AI-powered job application assistant</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-4">
                            <FormField control={loginForm.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={loginForm.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Login
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
                <TabsContent value="signup">
                    <Form {...signupForm}>
                        <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4 pt-4">
                             <FormField control={signupForm.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={signupForm.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={signupForm.control} name="confirmPassword" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign Up
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
           
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>

            <Button variant="outline" onClick={signInWithGoogle} disabled={loading}>
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
