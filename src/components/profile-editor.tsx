'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { defaultProfile } from '@/lib/types';
import { profileSchema } from '@/lib/validators';
import FieldArrayForm from './field-array-form';
import { Loader2 } from 'lucide-react';

export default function ProfileEditor() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultProfile,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const docRef = doc(firestore, 'users', user.uid, 'profile', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          form.reset(docSnap.data() as UserProfile);
        } else {
          form.reset(defaultProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch your profile.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user, form, toast, firestore]);
  
  const onSubmit = async (data: UserProfile) => {
    if (!user) {
      toast({ title: 'Not Authenticated', description: 'You must be logged in to save your profile.', variant: 'destructive' });
      return;
    }
    
    try {
      await setDoc(doc(firestore, 'users', user.uid, 'profile', 'data'), { ...data, id: user.uid });
      toast({
        title: 'Success',
        description: 'Your profile has been saved.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'There was a problem saving your profile.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Profile Editor</h1>
        <p className="text-muted-foreground">Keep your professional information up-to-date.</p>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>How recruiters can reach you.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <FormField control={form.control} name="contactInfo.name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="contactInfo.email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="contactInfo.phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="contactInfo.linkedin" render={({ field }) => (
                            <FormItem><FormLabel>LinkedIn Profile URL</FormLabel><FormControl><Input placeholder="linkedin.com/in/johndoe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                </Card>

                <FieldArrayForm form={form} name="experience" title="Work Experience" description="List your professional roles." placeholder="Software Engineer at Tech Corp - Built cool stuff."/>
                <FieldArrayForm form={form} name="education" title="Education" description="Your academic background." placeholder="B.S. in Computer Science from State University"/>
                <FieldArrayForm form={form} name="skills" title="Skills" description="Relevant skills for your industry." placeholder="React, TypeScript, and Tailwind CSS"/>

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Profile
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  );
}
