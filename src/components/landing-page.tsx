
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, Bot, Users, Menu } from 'lucide-react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
             <h1 className="text-2xl font-bold">
                <span className="font-body">Job</span><span className="font-headline text-primary">for</span><span className="font-body">You</span>
            </h1>
          </Link>
           <nav className="hidden items-center gap-2 md:flex">
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
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container text-center">
             <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary">
                &#92;begin&#123;awesome_paper&#125;
            </code>
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mt-4">
              Write like a rocket scientist with <span className="font-body">Job</span><span className="text-primary font-headline">for</span><span className="font-body">You</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              The collaborative, online LaTeX editor that anyone can use.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/login">Start for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-secondary/30">
          <div className="container">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">The Right Tool for Your Job</h2>
               <p className="mt-2 text-muted-foreground">Purpose-built for scientific and technical writing. Powered by <a href="https://synctech.ie" target="_blank" rel="noopener noreferrer" className="text-primary underline">SYNC TECH Solutions</a>.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className='items-center'>
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <Bot className="h-8 w-8" />
                  </div>
                  <CardTitle>AI-Powered Assistance</CardTitle>
                </CardHeader>
                <CardContent className='text-center text-muted-foreground'>
                  Our AI analyzes your text to suggest improvements, catch errors, and help you articulate complex ideas with clarity.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='items-center'>
                   <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle>Seamless Collaboration</CardTitle>
                </CardHeader>
                <CardContent className='text-center text-muted-foreground'>
                  Work with co-authors in real-time, track changes, and manage versions effortlessly, just like a Google Doc.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='items-center'>
                   <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <FileText className="h-8 w-8" />
                  </div>
                  <CardTitle>Professional Formatting</CardTitle>
                </CardHeader>
                <CardContent className='text-center text-muted-foreground'>
                 Export your work as a perfectly formatted, publication-ready PDF using the power of LaTeX, without the steep learning curve.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 md:py-32">
            <div className="container grid md:grid-cols-2 gap-12 items-center">
                <div>
                     <h2 className="font-headline text-3xl md:text-4xl font-bold">From Idea to Publication in Minutes</h2>
                     <p className="mt-2 text-muted-foreground">A streamlined workflow for technical authors.</p>
                     <ul className="mt-8 space-y-6 text-lg">
                        <li className='flex items-start gap-4'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold'>1</div>
                            <div className='flex-1'>
                                <h3 className='font-semibold'>Start a Project</h3>
                                <p className='text-muted-foreground text-sm'>Create a new document from scratch or use one of our templates for papers, reports, or presentations.</p>
                            </div>
                        </li>
                         <li className='flex items-start gap-4'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold'>2</div>
                             <div className='flex-1'>
                                <h3 className='font-semibold'>Write & Collaborate</h3>
                                <p className='text-muted-foreground text-sm'>Focus on your content while our rich-text editor handles the LaTeX. Invite colleagues to edit and comment in real-time.</p>
                            </div>
                        </li>
                         <li className='flex items-start gap-4'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold'>3</div>
                             <div className='flex-1'>
                                <h3 className='font-semibold'>Publish & Share</h3>
                                <p className='text-muted-foreground text-sm'>Let our AI assist with final touches, then compile and download your professional PDF, ready for submission.</p>
                            </div>
                        </li>
                     </ul>
                </div>
                 <div className="relative mx-auto w-full max-w-sm aspect-square">
                    <Image
                        src="https://github.com/SherazHussain546/Job4You/blob/main/images/Logo2.png?raw=true"
                        alt="Job4You Logo"
                        fill
                        className="object-contain"
                        data-ai-hint="logo"
                    />
                </div>
            </div>
        </section>

      </main>

      <footer className="py-6 border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between text-center md:text-left text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} <span className="font-body">Job</span><span className="text-primary font-headline">for</span><span className="font-body">You</span> by SYNC TECH Solutions. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
