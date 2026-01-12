'use client';

import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { generatePersonalizedCoverLetter, getFallbackCoverLetter } from '@/ai/flows/generate-personalized-cover-letter';
import { tailorResumeToJobDescription, getFallbackResume } from '@/ai/flows/tailor-resume-to-job-description';
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
import { Switch } from './ui/switch';

interface GenerationOutput {
  resumeLatex: string;
  coverLetterLatex: string;
}

export default function ResumeTailor() {
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const [useAI, setUseAI] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }
    if (useAI && !jobDescription.trim()) {
      toast({ title: 'Error', description: 'Job description cannot be empty when AI Tailoring is enabled.', variant: 'destructive' });
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

      let resumeLatex, coverLetterLatex;

      if (useAI) {
        const [resumeResult, coverLetterResult] = await Promise.all([
          tailorResumeToJobDescription({ jobDescription, profileData }),
          generatePersonalizedCoverLetter({ jobDescription, profileData }),
        ]);
        resumeLatex = resumeResult.latexCode;
        coverLetterLatex = coverLetterResult.latexCode;
      } else {
        resumeLatex = getFallbackResume(profileData);
        coverLetterLatex = getFallbackCoverLetter(profileData);
      }
      
      setOutput({
          resumeLatex,
          coverLetterLatex,
      });

    } catch (error) {
      console.error('Error generating application kit:', error);
      toast({
        title: 'Generation Failed',
        description: 'An error occurred while generating documents. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="font-headline text-3xl font-bold tracking-tight">AI Application Tailor</h1>
      <p className="text-muted-foreground">Generate a resume and cover letter from your profile. Enable AI to tailor them for a job.</p>

      <div className="mt-6 grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Bot className="h-6 w-6" />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Enable AI Tailoring</p>
                        <p className="text-sm text-muted-foreground">
                        Let AI customize your resume and cover letter for a specific job description.
                        </p>
                    </div>
                    <Switch checked={useAI} onCheckedChange={setUseAI} />
                </div>
                {useAI && (
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
                )}
            </CardContent>
        </Card>
        
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
            <p className="text-muted-foreground">{useAI ? "The AI is analyzing your profile against the job description." : "Generating documents from your profile."}</p>
        </div>
      )}

      {output && (
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className='space-y-8'>
                <OutputDisplay 
                    title="Tailored Resume (LaTeX)"
                    content={output.resumeLatex}
                    language="latex"
                    downloadExtension="tex"
                    downloadFilename="resume.tex"
                />
                 <Card>
                    <CardHeader>
                        <CardTitle>How to Create Your PDF Documents</CardTitle>
                        <CardDescription>If the Overleaf window opposite does not load, follow these steps.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                            <li>For each document, copy the LaTeX code from the panel above.</li>
                            <li>
                                Go to{' '}
                                <a href="https://www.overleaf.com/project" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                    Overleaf.com <ExternalLink className="inline-block h-4 w-4" />
                                </a>{' '}
                                and sign up or log in.
                            </li>
                            <li>Create a "Blank Project" for your resume, then another for your cover letter.</li>
                            <li>Paste the code you copied into the editor (replacing any existing content in `main.tex`).</li>
                            <li>Click the "Recompile" button to see your PDF.</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
            <div className='space-y-8'>
                 <OutputDisplay 
                    title="Personalized Cover Letter (LaTeX)"
                    content={output.coverLetterLatex}
                    language="latex"
                    downloadExtension="tex"
                    downloadFilename="cover-letter.tex"
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Overleaf Editor</CardTitle>
                        <CardDescription>Compile your LaTeX code here. You may need to sign in.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video w-full rounded-md border bg-muted">
                            <iframe 
                                src="https://www.overleaf.com" 
                                className="h-full w-full"
                                title="Overleaf Editor"
                            ></iframe>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}

      {!isGenerating && !output && (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
            <FileWarning className="h-10 w-10 text-muted-foreground" />
            <h3 className="font-headline text-xl">Your generated documents will appear here</h3>
            <p className="text-muted-foreground">Click generate to start.</p>
        </div>
      )}

    </div>
  );
}
