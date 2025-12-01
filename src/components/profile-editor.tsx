'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { defaultProfile } from '@/lib/types';
import { profileSchema } from '@/lib/validators';
import SkillsFieldArrayForm from './skills-field-array-form';
import ExperienceFieldArrayForm from './experience-field-array-form';
import { Loader2 } from 'lucide-react';
import EducationFieldArrayForm from './education-field-array-form';
import ProjectsFieldArrayForm from './projects-field-array-form';
import CertificationsFieldArrayForm from './certifications-field-array-form';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
          const data = docSnap.data();
          // Ensure all fields exist to prevent uncontrolled component errors
          const validatedData: UserProfile = {
            ...defaultProfile,
            ...data,
            contactInfo: {
              ...defaultProfile.contactInfo,
              ...(data.contactInfo || {}),
            },
            education: data.education?.map((edu: any) => ({
                ...defaultProfile.education[0],
                ...edu,
            })) || [],
            experience: data.experience?.map((exp: any) => ({
                ...defaultProfile.experience[0],
                ...exp,
            })) || [],
            projects: data.projects?.map((proj: any) => ({
                ...defaultProfile.projects[0],
                ...proj,
            })) || [],
            certifications: data.certifications?.map((cert: any) => ({
                ...defaultProfile.certifications[0],
                ...cert,
            })) || [],
            skills: data.skills || [],
          };
          form.reset(validatedData);
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
    
    const profileDocRef = doc(firestore, 'users', user.uid, 'profile', 'data');
    const dataToSave = { ...data, id: user.uid };
    
    const marketingDocRef = doc(firestore, 'marketingSubscribers', user.uid);
    const marketingData = {
      name: data.contactInfo.name,
      email: data.contactInfo.email,
    };

    try {
      // Save the main user profile
      await setDoc(profileDocRef, dataToSave, { merge: true });

      // Save the marketing data
      await setDoc(marketingDocRef, marketingData, { merge: true });

      toast({
        title: 'Success',
        description: 'Your profile has been saved.',
      });
    } catch (error) {
       errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: profileDocRef.path, // We can report the primary failure path
          operation: 'write',
          requestResourceData: dataToSave,
        })
      );
      toast({
        title: 'Error Saving Profile',
        description: 'There was a problem saving your profile. Please try again.',
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
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="contactInfo.name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="contactInfo.email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="contactInfo.phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="contactInfo.linkedin" render={({ field }) => (
                            <FormItem><FormLabel>LinkedIn Profile URL</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/johndoe" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="contactInfo.github" render={({ field }) => (
                            <FormItem><FormLabel>GitHub Profile URL</FormLabel><FormControl><Input placeholder="https://github.com/johndoe" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="contactInfo.portfolio" render={({ field }) => (
                            <FormItem><FormLabel>Portfolio URL</FormLabel><FormControl><Input placeholder="https://johndoe.dev" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="contactInfo.instagram" render={({ field }) => (
                            <FormItem><FormLabel>Instagram Profile URL</FormLabel><FormControl><Input placeholder="https://instagram.com/johndoe" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="contactInfo.other" render={({ field }) => (
                            <FormItem><FormLabel>Other URL</FormLabel><FormControl><Input placeholder="https://your-other-site.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                </Card>

                <ExperienceFieldArrayForm form={form} />
                <EducationFieldArrayForm form={form} />
                <ProjectsFieldArrayForm form={form} />
                <CertificationsFieldArrayForm form={form} />
                <SkillsFieldArrayForm form={form} name="skills" title="Skills" description="Add your skills or select from the suggestions below." placeholder="e.g., Python" />

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
