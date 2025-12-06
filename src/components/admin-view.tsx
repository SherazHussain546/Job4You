
'use client';

import {
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import {
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  Briefcase,
  Building,
  Mail,
  ExternalLink,
  EyeOff,
  ShieldAlert,
} from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import type { JobPost } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from 'react';

const statusStyles: { [key: string]: string } = {
  pending: 'border-yellow-500/50 bg-yellow-500/10',
  approved: 'border-green-500/50 bg-green-500/10',
  rejected: 'border-red-500/50 bg-red-500/10',
  spam: 'border-orange-500/50 bg-orange-500/10',
};

const statusBadgeVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" | null | undefined } = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  spam: 'outline',
}

const AdminJobCard = ({ job, onUpdateStatus, onDelete }: { job: JobPost; onUpdateStatus: (id: string, status: 'approved' | 'rejected' | 'pending' | 'spam') => void; onDelete: (id: string) => void; }) => {
  const isAdminPost = job.posterEmail === 'sherazhussainofficial1@gmail.com';
  return (
    <Card className={`flex flex-col ${statusStyles[job.status]}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.jobTitle}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              {job.companyName && (
                <>
                  <Building className="h-4 w-4" />
                  <span>{job.companyName}</span>
                </>
              )}
            </CardDescription>
          </div>
          <Badge variant={statusBadgeVariant[job.status]}>{job.status}</Badge>
        </div>
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
          <div className="flex items-center gap-2" title={job.posterEmail}>
            <Mail className="h-4 w-4" />
            <span>{isAdminPost ? 'Admin' : job.postedBy}</span>
          </div>
        </div>
         <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {job.applyLink && (
                 <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    <ExternalLink className="h-3 w-3" /> Apply Link
                </a>
            )}
             {job.applyEmail && (
                 <a href={`mailto:${job.applyEmail}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Mail className="h-3 w-3" /> Apply Email
                </a>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end flex-wrap">
        {job.status === 'pending' || job.status === 'spam' ? (
          <>
            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(job.id, 'rejected')}>
              <XCircle className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button size="sm" onClick={() => onUpdateStatus(job.id, 'approved')}>
              <CheckCircle className="mr-2 h-4 w-4" /> Approve
            </Button>
          </>
        ) : null}

        {job.status === 'approved' && (
           <Button size="sm" variant="outline" onClick={() => onUpdateStatus(job.id, 'pending')}>
              <EyeOff className="mr-2 h-4 w-4" /> Unpublish
            </Button>
        )}
        {job.status === 'rejected' && (
           <Button size="sm" onClick={() => onUpdateStatus(job.id, 'approved')}>
              <CheckCircle className="mr-2 h-4 w-4" /> Re-Approve
            </Button>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" ><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the job post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(job.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};


export default function AdminView() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const jobPostsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'jobPosts'), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: jobPosts, isLoading: isLoadingJobs } = useCollection<JobPost>(jobPostsQuery);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending' | 'spam') => {
    const docRef = doc(firestore, 'jobPosts', id);
    try {
      await updateDoc(docRef, { status });
      toast({
        title: `Job post status updated`,
        description: `The job post has been set to ${status}.`,
      });
    } catch (error) {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status },
        })
      );
      toast({
        title: 'Error',
        description: 'Could not update the job post status.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const docRef = doc(firestore, 'jobPosts', id);
    try {
        await deleteDoc(docRef);
        toast({
            title: "Job post deleted",
            description: "The job post has been permanently removed.",
        });
    } catch(error) {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
        }));
        toast({
            title: "Error",
            description: "Could not delete the job post.",
            variant: "destructive"
        });
    }
  }

  const [pendingPosts, approvedPosts, rejectedPosts, spamPosts] = useMemo(() => {
    if (!jobPosts) return [[], [], [], []];
    const pending = jobPosts.filter(p => p.status === 'pending');
    const approved = jobPosts.filter(p => p.status === 'approved');
    const rejected = jobPosts.filter(p => p.status === 'rejected');
    const spam = jobPosts.filter(p => p.status === 'spam');
    return [pending, approved, rejected, spam];
  }, [jobPosts]);

  return (
     <div className="mx-auto max-w-7xl">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Admin Panel</h1>
      <p className="text-muted-foreground">Manage job posts submitted by the community.</p>

        <Tabs defaultValue="pending" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending <Badge variant="secondary" className="ml-2">{pendingPosts.length}</Badge></TabsTrigger>
            <TabsTrigger value="approved">Approved <Badge variant="secondary" className="ml-2">{approvedPosts.length}</Badge></TabsTrigger>
            <TabsTrigger value="rejected">Rejected <Badge variant="secondary" className="ml-2">{rejectedPosts.length}</Badge></TabsTrigger>
            <TabsTrigger value="spam">Spam <Badge variant="destructive" className="ml-2">{spamPosts.length}</Badge></TabsTrigger>
          </TabsList>
          
          {isLoadingJobs ? (
              <div className="flex justify-center items-center h-60">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
          ) : (
            <>
                <TabsContent value="pending">
                    {pendingPosts.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-6">
                            {pendingPosts.map(job => (
                            <AdminJobCard key={job.id} job={job} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12 mt-6">
                            <CardHeader>
                                <div className="mx-auto bg-muted rounded-full w-16 h-16 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <CardTitle className="mt-4">All Clear!</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">There are no pending job posts to review.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="approved">
                     {approvedPosts.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-6">
                            {approvedPosts.map(job => (
                            <AdminJobCard key={job.id} job={job} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12 mt-6">
                             <CardHeader>
                                <div className="mx-auto bg-muted rounded-full w-16 h-16 flex items-center justify-center">
                                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <CardTitle className="mt-4">No Approved Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Approve some posts to see them here.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="rejected">
                     {rejectedPosts.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-6">
                            {rejectedPosts.map(job => (
                            <AdminJobCard key={job.id} job={job} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12 mt-6">
                            <CardHeader>
                                <div className="mx-auto bg-muted rounded-full w-16 h-16 flex items-center justify-center">
                                    <Trash2 className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <CardTitle className="mt-4">No Rejected Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Rejected posts will appear here.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="spam">
                     {spamPosts.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-6">
                            {spamPosts.map(job => (
                            <AdminJobCard key={job.id} job={job} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12 mt-6">
                            <CardHeader>
                                <div className="mx-auto bg-muted rounded-full w-16 h-16 flex items-center justify-center">
                                    <ShieldAlert className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <CardTitle className="mt-4">No Spam Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Posts flagged as spam by the AI will appear here for review.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </>
          )}

        </Tabs>
    </div>
  );
}
