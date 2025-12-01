'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, Bot, Briefcase } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo className="h-8 w-8" />
             <h1 className="text-2xl font-bold">
                <span className="font-body">Job</span><span className="font-headline text-primary">for</span><span className="font-body">You</span>
            </h1>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter">
              Land Your Dream Job with AI
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Job4You uses cutting-edge AI to instantly tailor your resume and craft personalized cover letters, making you the perfect candidate for any role.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/login">Start for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-secondary/30">
          <div className="container">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose Job4You?</h2>
              <p className="mt-2 text-muted-foreground">Everything you need to stand out in a crowded job market.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className='items-center'>
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <Bot className="h-8 w-8" />
                  </div>
                  <CardTitle>AI Resume Tailoring</CardTitle>
                </CardHeader>
                <CardContent className='text-center text-muted-foreground'>
                  Our AI analyzes any job description and rewrites your resume in seconds to highlight your most relevant skills and experience.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='items-center'>
                   <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <FileText className="h-8 w-8" />
                  </div>
                  <CardTitle>Personalized Cover Letters</CardTitle>
                </CardHeader>
                <CardContent className='text-center text-muted-foreground'>
                  Generate compelling, unique cover letters for each application. No more writer's block or generic templates.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='items-center'>
                   <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <CardTitle>Professional Formatting</CardTitle>
                </CardHeader>
                <CardContent className='text-center text-muted-foreground'>
                 Export your tailored resume as a professional, ATS-friendly LaTeX PDF that will impress recruiters.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 md:py-32">
            <div className="container grid md:grid-cols-2 gap-12 items-center">
                <div>
                     <h2 className="font-headline text-3xl md:text-4xl font-bold">Get Started in 3 Easy Steps</h2>
                     <p className="mt-2 text-muted-foreground">From job description to job application in minutes.</p>
                     <ul className="mt-8 space-y-6 text-lg">
                        <li className='flex items-start gap-4'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold'>1</div>
                            <div className='flex-1'>
                                <h3 className='font-semibold'>Create Your Profile</h3>
                                <p className='text-muted-foreground text-sm'>Fill out your professional profile once. We'll use this as the master source for all your applications.</p>
                            </div>
                        </li>
                         <li className='flex items-start gap-4'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold'>2</div>
                             <div className='flex-1'>
                                <h3 className='font-semibold'>Paste the Job Description</h3>
                                <p className='text-muted-foreground text-sm'>Find a job you love and simply paste the description into our AI tailor.</p>
                            </div>
                        </li>
                         <li className='flex items-start gap-4'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold'>3</div>
                             <div className='flex-1'>
                                <h3 className='font-semibold'>Generate & Download</h3>
                                <p className='text-muted-foreground text-sm'>Let our AI work its magic. Download your perfectly tailored resume and cover letter, ready to submit.</p>
                            </div>
                        </li>
                     </ul>
                </div>
                 <div className="relative aspect-video rounded-xl shadow-2xl">
                    <Image 
                        src="https://picsum.photos/seed/job-search/1280/720"
                        alt="Job application process"
                        fill
                        className="object-cover rounded-xl"
                        data-ai-hint="job search"
                    />
                </div>
            </div>
        </section>

      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Job4You. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
