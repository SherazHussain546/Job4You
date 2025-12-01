'use client';

import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { generatePersonalizedCoverLetter } from '@/ai/flows/generate-personalized-cover-letter';
import { tailorResumeToJobDescription } from '@/ai/flows/tailor-resume-to-job-description';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { defaultProfile } from '@/lib/types';
import { Bot, Loader2, FileWarning, ExternalLink } from 'lucide-react';
import OutputDisplay from './output-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface GenerationOutput {
  latexCode: string;
  coverLetter: string;
}

export default function ResumeTailor() {
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }
    if (!jobDescription.trim()) {
      toast({ title: 'Error', description: 'Job description cannot be empty.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    setOutput(null);

    try {
      const profileRef = doc(firestore, 'users', user.uid, 'profile', 'data');
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        toast({
          title: 'Profile Not Found',
          description: 'Please complete your profile before generating documents.',
          variant: 'destructive',
        });
        setIsGenerating(false);
        return;
      }
      
      const savedData = profileSnap.data();
      // Deep merge to ensure all nested properties have default values
      const profileData: UserProfile = {
        ...defaultProfile,
        ...savedData,
         contactInfo: {
          ...defaultProfile.contactInfo,
          ...(savedData.contactInfo || {}),
        },
        education: savedData.education?.map((edu: any) => ({
          ...defaultProfile.education[0],
          ...edu,
        })) || [],
        experience: savedData.experience?.map((exp: any) => ({
          ...defaultProfile.experience[0],
          ...exp,
        })) || [],
        projects: savedData.projects?.map((proj: any) => ({
            ...defaultProfile.projects[0],
            ...proj,
        })) || [],
        certifications: savedData.certifications?.map((cert: any) => ({
          ...defaultProfile.certifications[0],
          ...cert,
        })) || [],
        skills: savedData.skills || [],
      };


      const [resumeResult, coverLetterResult] = await Promise.all([
        tailorResumeToJobDescription({ jobDescription, profileData }),
        generatePersonalizedCoverLetter({ jobDescription, profileData }),
      ]);
      
      setOutput({
          latexCode: resumeResult.latexCode,
          coverLetter: coverLetterResult.coverLetter,
      });

    } catch (error) {
      console.error('Error generating application kit:', error);
      toast({
        title: 'Generation Failed',
        description: 'An error occurred while communicating with the AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="font-headline text-3xl font-bold tracking-tight">AI Application Tailor</h1>
      <p className="text-muted-foreground">Paste a job description to generate a custom-tailored resume and cover letter.</p>

      <div className="mt-6 grid gap-4">
        <div>
          <Label htmlFor="job-description" className="text-lg font-medium">Job Description</Label>
          <Textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="mt-2 min-h-[200px] text-base"
          />
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Bot className="mr-2 h-5 w-5" />
              Generate Application Kit
            </>
          )}
        </Button>
      </div>

      {isGenerating && (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <h3 className="font-headline text-xl">Crafting your documents...</h3>
            <p className="text-muted-foreground">The AI is analyzing your profile against the job description.</p>
        </div>
      )}

      {output && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className='space-y-8'>
                <OutputDisplay 
                    title="Tailored Resume (LaTeX)"
                    content={output.latexCode}
                    language="latex"
                    downloadExtension="tex"
                    downloadFilename="resume.tex"
                />
                 <Card>
                    <CardHeader>
                        <CardTitle>Next Steps: Create Your PDF Resume</CardTitle>
                        <CardDescription>Follow these instructions to compile your LaTeX code into a professional PDF.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                            <li>Copy the LaTeX code from the panel above.</li>
                            <li>
                                Go to{' '}
                                <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                    Overleaf.com <ExternalLink className="inline-block h-4 w-4" />
                                </a>{' '}
                                and sign up for a free account.
                            </li>
                            <li>Start a new project with a "Blank Project" template.</li>
                            <li>Paste the code you copied into the main editor file (usually `main.tex`).</li>
                            <li>Click the "Recompile" button.</li>
                            <li>Your professionally formatted, ATS-optimized resume is ready! You can now download the PDF and start applying for jobs.</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
            <div>
                <OutputDisplay 
                    title="Personalized Cover Letter"
                    content={output.coverLetter}
                    language="markdown"
                    downloadExtension="md"
                    downloadFilename="cover-letter.md"
                    enablePrint
                />
            </div>
        </div>
      )}

      {!isGenerating && !output && (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
            <FileWarning className="h-10 w-10 text-muted-foreground" />
            <h3 className="font-headline text-xl">Your generated documents will appear here</h3>
            <p className="text-muted-foreground">Enter a job description and click generate to start.</p>
        </div>
      )}

    </div>
  );
}
