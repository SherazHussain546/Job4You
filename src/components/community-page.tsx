
'use client';

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import {
  Menu,
  Plus,
  Loader2,
  Briefcase,
  Building,
  Mail,
  ExternalLink,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import type { JobPost } from '@/lib/types';
import { defaultJobPost } from '@/lib/types';
import { jobPostFormSchema, baseJobPostSchema } from '@/lib/validators';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useState, useMemo } from 'react';
import type { JobPostFormData } from '@/lib/types';


const JobPostForm = ({ onFinished }: { onFinished: () => void }) => {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<JobPostFormData>({
    resolver: zodResolver(jobPostFormSchema),
    defaultValues: defaultJobPost,
  });

  const onSubmit = async (data: JobPostFormData) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to post a job.',
        variant: 'destructive',
      });
      return;
    }

    const newJobPost = {
      ...data,
      postedBy: user.displayName || 'Anonymous',
      posterId: user.uid,
      posterEmail: user.email || '',
      createdAt: serverTimestamp(),
      status: 'pending' as const,
    };
    
    const collectionRef = collection(firestore, 'jobPosts');

    addDoc(collectionRef, newJobPost)
        .then(() => {
            toast({
                title: 'Job Post Submitted!',
                description: 'Your job post has been submitted for verification. It will be live once approved.',
            });
            form.reset();
            onFinished();
        })
        .catch((error) => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                path: collectionRef.path,
                operation: 'create',
                requestResourceData: newJobPost,
                })
            );
            toast({
                title: 'Error',
                description: 'Could not submit your job post. Please try again.',
                variant: 'destructive',
            });
        });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., SYNC TECH Solutions" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a job category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {(baseJobPostSchema.shape.category.options).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="jobType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an employment type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                     {(baseJobPostSchema.shape.jobType.options).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the role, responsibilities, and qualifications..." {...field} className="min-h-[150px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
            <p className="text-sm font-medium mb-2">Application Method</p>
            <p className="text-xs text-muted-foreground mb-4">Provide at least one method for candidates to apply.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="applyLink"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Application Link (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="https://your-company.com/apply" {...field} value={field.value ?? ''}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="applyEmail"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Application Email (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="careers@your-company.com" {...field} value={field.value ?? ''}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             {form.formState.errors.applyLink && (
                <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.applyLink.message}</p>
            )}
        </div>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Verification
            </Button>
        </div>
      </form>
    </Form>
  );
};

const JobCard = ({ job }: { job: JobPost }) => (
  <Card className="flex flex-col">
    <CardHeader>
      <CardTitle className="text-xl">{job.jobTitle}</CardTitle>
      <CardDescription className="flex items-center gap-2 pt-1">
        {job.companyName && (
          <>
            <Building className="h-4 w-4" />
            <span>{job.companyName}</span>
          </>
        )}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{job.jobDescription}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary">{job.jobType}</Badge>
        <Badge variant="secondary">{job.category}</Badge>
      </div>
       <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            Posted{' '}
            {job.createdAt?.seconds
              ? formatDistanceToNow(new Date(job.createdAt.seconds * 1000), { addSuffix: true })
              : 'just now'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{job.postedBy}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter>
        {job.applyLink ? (
            <Button asChild className="w-full">
                <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                </a>
            </Button>
        ) : job.applyEmail ? (
            <Button asChild className="w-full">
                <a href={`mailto:${job.applyEmail}`}>
                Apply via Email <Mail className="ml-2 h-4 w-4" />
                </a>
            </Button>
        ) : null}
    </CardFooter>
  </Card>
);

export default function CommunityPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const jobPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'jobPosts'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore]);

  const { data: allJobPosts, isLoading: isLoadingJobs, error } = useCollection<JobPost>(jobPostsQuery);

  const approvedJobPosts = useMemo(() => {
    return allJobPosts?.filter(post => post.status === 'approved') || [];
  }, [allJobPosts]);
  
  const handlePostJobClick = () => {
      if (!user) {
          router.push('/login?redirect=/community');
      } else {
          setIsFormOpen(true);
      }
  }

  const isLoading = isUserLoading || isLoadingJobs;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              <span className="font-body">Job</span>
              <span className="font-headline text-primary">for</span>
              <span className="font-body">You</span>
            </h1>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
             <Button variant="ghost" asChild>
                <Link href="/how-it-works">How It Works</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="/about">About Us</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="/community">Community</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <div className="grid gap-4 py-4">
                 <Link href="/how-it-works" className="text-lg font-medium">How It Works</Link>
                 <Link href="/about" className="text-lg font-medium">About Us</Link>
                 <Link href="/community" className="text-lg font-medium">Community</Link>
                 <Button asChild>
                   <Link href="/login">Get Started</Link>
                 </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-24">
          <div className="container px-4 text-center">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary">
                &#92;chapter&#123;job_board&#125;
            </code>
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mt-4">
              Community Job Board
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground text-center">
              Connect directly with companies and referrers. Find your next opportunity or hire top talent from our community.
            </p>
            <div className="mt-8">
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button size="lg" onClick={handlePostJobClick} disabled={isUserLoading}>
                        {isUserLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Plus className="mr-2 h-4 w-4" />}
                        Post a Job or Referral
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create a New Job Post</DialogTitle>
                    <DialogDescription>
                      Fill out the details below. Your post will be visible to the community after admin verification.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <JobPostForm onFinished={() => setIsFormOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        <section id="job-listings" className="py-20 md:py-24 bg-secondary/30">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                Open Opportunities
              </h2>
              <p className="mt-2 text-muted-foreground">
                Browse the latest jobs and referrals from the Job4You community.
              </p>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : approvedJobPosts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {approvedJobPosts.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardHeader>
                    <div className="mx-auto bg-muted rounded-full w-16 h-16 flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">No Open Jobs Yet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Check back soon for new opportunities, or be the first to post one!</p>
                </CardContent>
              </Card>
            )}
             {!user && !isUserLoading && (
                 <Card className="mt-12 text-center py-8 bg-card border-border">
                    <CardHeader>
                        <CardTitle>Join the Community to Apply</CardTitle>
                        <CardDescription>Sign up or log in to create job posts and apply directly.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/login?redirect=/community">Login / Sign Up</Link>
                        </Button>
                    </CardContent>
                 </Card>
             )}
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container px-4 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} <span className="font-body">Job</span><span className="text-primary font-headline">for</span><span className="font-body">You</span> by SYNC TECH Solutions. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
