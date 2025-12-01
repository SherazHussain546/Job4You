
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import {
  User,
  ClipboardPaste,
  Bot,
  FileText,
  Menu,
  LogIn,
  Mail,
  KeyRound,
  Briefcase,
  GraduationCap,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { GoogleIcon } from './icons';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

const CodeSnippet = ({ code }: { code: string }) => (
    <pre className="bg-muted text-muted-foreground rounded-md p-4 text-xs overflow-x-auto">
        <code>{code}</code>
    </pre>
);

export default function HowItWorksPage() {

  const resumeSnippet = `\\documentclass[10pt, a4paper]{article}
\\usepackage[T1]{fontenc}
\\usepackage{mathptmx}
\\usepackage[a4paper, top=0.5in, bottom=0.5in, left=0.6in, right=0.6in]{geometry}

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{ John Doe }} \\\\
    Full-Stack Software Engineer & AI/Cloud Developer \\\\
    \\vspace{2pt}
    (123) 456-7890 $|$ \\href{mailto:john.doe@example.com}{john.doe@example.com} $|$ \\href{https://linkedin.com/in/johndoe}{LinkedIn}
\\end{center}

\\section*{PROFESSIONAL SUMMARY}
\\begin{itemize}
    \\item Results-driven Software Engineer with expertise in full-stack development...
\\end{itemize}

% ... and so on

\\end{document}
`;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
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
              <div className="grid gap-4 py-4">
                 <Link href="/how-it-works" className="text-lg font-medium">How It Works</Link>
                 <Link href="/about" className="text-lg font-medium">About Us</Link>
                 <Button asChild>
                   <Link href="/login">Get Started</Link>
                 </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container text-center">
             <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-base font-semibold text-primary">
                &#92;guide&#123;workflow&#125;
            </code>
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mt-4">
              From Profile to Professionally Polished Documents
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground text-center">
                Our AI-powered workflow is designed to be simple, fast, and effective. Follow these steps to create perfectly tailored job application materials in minutes.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container">
            <div className="mx-auto grid max-w-5xl items-center gap-y-16 gap-x-12">
              <div className="space-y-16">
                
                <div className="grid gap-4 md:grid-cols-2 md:items-center">
                  <div className="bg-transparent border-none shadow-none">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">1</span>
                        <div>
                          <CardTitle className="text-2xl">Sign Up for an Account</CardTitle>
                          <p className="text-muted-foreground mt-1">Get started in seconds.</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        Begin by creating an account. You can sign up quickly using your Google account, a traditional email and password, or explore the app by signing in anonymously.
                      </p>
                    </CardContent>
                  </div>
                   <div className="flex items-center justify-center p-8">
                       <Card className="w-full max-w-sm">
                            <CardHeader className="items-center">
                                <div className="rounded-full bg-primary/10 p-4 text-primary">
                                    <User className="h-10 w-10" />
                                </div>
                           </CardHeader>
                           <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <div className="flex items-center rounded-md border border-input bg-background p-2">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <div className="ml-2 h-4 w-40 bg-muted-foreground/30 rounded-sm"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Password</label>
                                    <div className="flex items-center rounded-md border border-input bg-background p-2">
                                        <KeyRound className="h-5 w-5 text-muted-foreground" />
                                        <div className="ml-2 h-4 w-40 bg-muted-foreground/30 rounded-sm"></div>
                                    </div>
                                </div>
                                <div className="h-10 w-full bg-primary rounded-md flex items-center justify-center text-primary-foreground font-medium">
                                    Sign Up
                                </div>
                                 <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                        Or
                                        </span>
                                    </div>
                                </div>
                                <div className="h-10 w-full border border-input rounded-md flex items-center justify-center text-foreground font-medium gap-2">
                                    <GoogleIcon className="h-5 w-5" />
                                    Sign Up with Google
                                </div>
                           </CardContent>
                       </Card>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 md:items-start">
                  <div className="bg-transparent border-none shadow-none md:order-last">
                     <CardHeader>
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">2</span>
                        <div>
                             <CardTitle className="text-2xl">Create Your Professional Profile</CardTitle>
                             <p className="text-muted-foreground mt-1">This is your master document.</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>Once you're in, navigate to the "Profile" tab. Here, you’ll fill out your contact information, work experience, education, projects, and skills. The more detail you provide, the better the AI can tailor your documents. Your profile is saved securely and can be updated at any time.</p>
                    </CardContent>
                  </div>
                    <div className="flex items-center justify-center p-4 md:order-first">
                        <Card className="w-full max-w-sm">
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>Your professional blueprint.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center gap-3 rounded-md border p-3">
                                    <Avatar>
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="h-4 w-24 bg-muted-foreground/30 rounded-sm"></div>
                                        <div className="mt-1 h-3 w-32 bg-muted-foreground/20 rounded-sm"></div>
                                    </div>
                                </div>
                                <div className="space-y-2 rounded-md border p-3">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <h4 className="font-semibold text-muted-foreground">Work Experience</h4>
                                    </div>
                                    <div className="h-3 w-4/5 bg-muted-foreground/20 rounded-sm"></div>
                                    <div className="h-3 w-full bg-muted-foreground/20 rounded-sm"></div>
                                </div>
                                <div className="space-y-2 rounded-md border p-3">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                        <h4 className="font-semibold text-muted-foreground">Education</h4>
                                    </div>
                                    <div className="h-3 w-3/4 bg-muted-foreground/20 rounded-sm"></div>
                                </div>
                                <div className="space-y-2 rounded-md border p-3">
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                        <h4 className="font-semibold text-muted-foreground">Projects</h4>
                                    </div>
                                    <div className="h-3 w-full bg-muted-foreground/20 rounded-sm"></div>
                                </div>
                                <div className="space-y-2 rounded-md border p-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                                        <h4 className="font-semibold text-muted-foreground">Skills</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <Badge variant="secondary" className="h-5 w-16"></Badge>
                                        <Badge variant="secondary" className="h-5 w-20"></Badge>
                                        <Badge variant="secondary" className="h-5 w-12"></Badge>
                                        <Badge variant="secondary" className="h-5 w-24"></Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 md:items-start">
                  <div className="bg-transparent border-none shadow-none">
                     <CardHeader>
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">3</span>
                        <div>
                             <CardTitle className="text-2xl">Provide the Job Description</CardTitle>
                             <p className="text-muted-foreground mt-1">Give the AI its target.</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>Go to the "AI Tailor" tab. Find a job you're interested in and copy the entire job description. Paste it into the text area provided. This context is crucial for the AI to understand what the employer is looking for.</p>
                    </CardContent>
                  </div>
                    <div className="flex items-center justify-center p-4">
                      <Card className="w-full max-w-sm">
                          <CardHeader>
                              <Label htmlFor="jd-example" className="text-lg font-medium">Job Description</Label>
                          </CardHeader>
                          <CardContent>
                              <Textarea 
                                  id="jd-example"
                                  readOnly
                                  className="h-48 text-xs text-muted-foreground"
                                  value="Hiring a Senior Full-Stack Engineer with 5+ years of experience in React and Node.js. Must be proficient in cloud services (AWS preferred) and have a strong understanding of CI/CD pipelines..."
                              />
                          </CardContent>
                      </Card>
                    </div>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2 md:items-start">
                  <div className="bg-transparent border-none shadow-none md:order-last">
                     <CardHeader>
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">4</span>
                        <div>
                             <CardTitle className="text-2xl">Generate Your Documents</CardTitle>
                             <p className="text-muted-foreground mt-1">Let the AI do the heavy lifting.</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>Click the "Generate Application Kit" button. Our AI will analyze your profile against the job description and create a tailored resume and cover letter. The output will be in LaTeX, the gold standard for professional document formatting.</p>
                    </CardContent>
                  </div>
                  <div className="space-y-4 flex flex-col items-center justify-center pt-8 md:order-first">
                    <Bot className="w-24 h-24 text-primary/30" />
                    <div className="w-full max-w-sm">
                        <CodeSnippet code={resumeSnippet} />
                    </div>
                  </div>
                </div>

                 <div className="grid gap-8 md:grid-cols-2 md:items-start">
                  <div className="bg-transparent border-none shadow-none">
                     <CardHeader>
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">5</span>
                         <div>
                             <CardTitle className="text-2xl">Compile and Download Your PDF</CardTitle>
                             <p className="text-muted-foreground mt-1">Get your publication-ready files.</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>Copy the generated LaTeX code for each document. Use the embedded Overleaf editor on the page or go to Overleaf.com, create a new blank project, paste the code, and click "Recompile." You'll have a perfectly formatted, professional PDF ready to submit.</p>
                        <p className="text-sm text-muted-foreground">The Overleaf editor provides an easy way to see a live preview of your document and download the final PDF.</p>
                    </CardContent>
                  </div>
                     <div className="flex items-center justify-center pt-8">
                       <FileText className="w-24 h-24 text-primary/30" />
                    </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
            <div className="container">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">Ready to Land Your Dream Job?</h2>
                <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Put our AI to the test and see how easy it is to create application materials that stand out.</p>
                <div className="mt-8">
                    <Button size="lg" asChild>
                        <Link href="/login">Start Building for Free</Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} <span className="font-body">Job</span><span className="text-primary font-headline">for</span><span className="font-body">You</span> by SYNC TECH Solutions. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}

    

    