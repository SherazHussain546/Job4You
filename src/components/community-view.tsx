
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
  Plus,
  Loader2,
  Briefcase,
  Building,
  Mail,
  ExternalLink,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
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
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { validateJobDescription } from '@/ai/flows/validate-job-description';


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

    form.control.register('jobDescription');
    const { jobDescription, applyLink, applyEmail } = form.getValues();
    let finalStatus: 'pending' | 'spam' = 'pending';

    try {
        const validationResult = await validateJobDescription({ jobDescription, applyLink, applyEmail });
        if (validationResult.decision === 'invalid') {
            toast({
                title: 'Invalid Job Post',
                description: validationResult.reason || 'The content was flagged as inappropriate or not a valid job post.',
                variant: 'destructive',
            });
            return;
        }
        if (validationResult.decision === 'spam') {
            finalStatus = 'spam';
        }
    } catch (error) {
        console.error('AI validation failed:', error);
        // Do not block submission, but maybe flag for admin
        finalStatus = 'spam'; // If AI fails, better to manually review
        toast({
            title: 'Validation Issue',
            description: 'Could not fully validate the job description. It has been flagged for admin review.',
        });
    }

    const newJobPost = {
      ...data,
      postedBy: user.displayName || 'Anonymous',
      posterId: user.uid,
      posterEmail: user.email || '',
      createdAt: serverTimestamp(),
      status: finalStatus,
    };
    
    const collectionRef = collection(firestore, 'jobPosts');

    addDoc(collectionRef, newJobPost)
        .then(() => {
            toast({
                title: 'Job Post Submitted!',
                description: `Your job post has been submitted for verification. It will be live once approved.`,
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
              <FormLabel>Company Name</FormLabel>
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

export default function CommunityView({ showHeader = true, showListings = true, showPostButton = true }: { showHeader?: boolean; showListings?: boolean; showPostButton?: boolean }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const jobPostsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'jobPosts'), where('status', '==', 'approved'));
  }, [firestore, user]);

  const { data: allApprovedPosts, isLoading: isLoadingJobs } = useCollection<JobPost>(jobPostsQuery);

  const filteredJobPosts = useMemo(() => {
    if (!allApprovedPosts) return [];
    const sorted = allApprovedPosts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    if (selectedCategory === 'All Categories') {
      return sorted;
    }
    return sorted.filter(post => post.category === selectedCategory);
  }, [allApprovedPosts, selectedCategory]);

  
  const handlePostJobClick = () => {
      if (!user) {
          router.push('/login?redirect=/jobs');
      } else {
          setIsFormOpen(true);
      }
  }
  
  const jobCategories = ["All Categories", ...baseJobPostSchema.shape.category.options];
  const isLoading = isUserLoading || isLoadingJobs;

  return (
    <div className="container mx-auto px-4">
      {showHeader && (
        <section className="w-full py-8 md:py-12">
            <div className="text-center">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary">
                &#92;chapter&#123;job_board&#125;
            </code>
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mt-4">
                Community Job Board
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                Connect directly with companies and referrers. This board is built on trust—a place for our community to share and discover genuine opportunities. Find your next role or hire top talent from a network of skilled professionals.
            </p>
            {showPostButton && (
              <div className="mt-8">
                  {isUserLoading ? (
                  <Button size="lg" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                      </Button>
                  ) : user ? (
                  <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                      <DialogTrigger asChild>
                      <Button size="lg" onClick={() => setIsFormOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
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
                      <ScrollArea className="max-h-[80vh] p-0">
                          <div className="py-4 pr-6">
                          <JobPostForm onFinished={() => setIsFormOpen(false)} />
                          </div>
                      </ScrollArea>
                      </DialogContent>
                  </Dialog>
                  ) : (
                  <Button size="lg" asChild>
                      <Link href="/login?redirect=/community">
                          Join the Conversation to Post a Job
                      </Link>
                  </Button>
                  )}
              </div>
            )}
            </div>
        </section>
      )}

      {showListings && (
        <section id="job-listings" className={'w-full py-8 md:py-12 bg-secondary/30 -mx-4 px-4'}>
            <div className="container mx-auto">
            <div className="relative mb-8 text-center">
                 <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary">
                    &#92;jobforyou&#123;happy_hunting&#125;
                </code>
                <h2 className="font-headline text-3xl md:text-4xl font-bold mt-4">
                    Open Opportunities
                </h2>
                <p className="mt-2 text-muted-foreground">
                    Browse the latest jobs and referrals from the Job4You community.
                </p>
            </div>
            
            {user && (
                <div className="mb-8 flex justify-center">
                <div className="w-full max-w-xs">
                    <Label htmlFor="category-filter">Filter by Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category-filter" className="w-full">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {jobCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : user ? (
                filteredJobPosts && filteredJobPosts.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobPosts.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                    </div>
                ) : (
                    <Card className="text-center py-12">
                    <CardHeader>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Briefcase className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <CardTitle className="mt-4">No Open Jobs Here Yet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {selectedCategory === 'All Categories' 
                                ? 'There are no approved job posts right now. Why not be the first to post one?' 
                                : `Jobs for the "${selectedCategory}" category will appear here soon. Check back later!`}
                        </p>
                    </CardContent>
                    </Card>
                )
            ) : (
                <Card className="py-12 text-center">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">Access Restricted</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-muted-foreground">Please sign up or log in to view job opportunities from the community.</p>
                    <Button asChild>
                    <Link href="/login?redirect=/jobs">Login / Sign Up</Link>
                    </Button>
                </CardContent>
                </Card>
            )}
            </div>
        </section>
      )}
    </div>
  );
}
