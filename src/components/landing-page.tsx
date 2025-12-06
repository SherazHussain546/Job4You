
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { FileText, Bot, Users, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { PublicHeader } from './public-header';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary">
              &#92;begin&#123;awesome_career&#125;
            </code>
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mt-4">
              Write like a rocket scientist with{' '}
              <span className="font-body">Job</span>
              <span className="text-primary font-headline">for</span>
              <span className="font-body">You</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              The collaborative, online LaTeX editor and AI-powered resume
              builder that anyone can use.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/login">Start for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-20 md:py-32 bg-secondary/30"
        >
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                The Right Tool for Your Job
              </h2>
              <p className="mt-2 text-muted-foreground">
                Purpose-built for scientific and technical writing. Powered by{' '}
                <a
                  href="https://synctech.ie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  SYNC TECH Solutions
                </a>
                .
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="items-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <Bot className="h-8 w-8" />
                  </div>
                  <CardTitle>AI-Powered Assistance</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Our AI analyzes your text to suggest improvements, catch
                  errors, and help you articulate complex ideas with clarity.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle>Seamless Collaboration</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Work with co-authors in real-time, track changes, and manage
                  versions effortlessly, just like a Google Doc.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <FileText className="h-8 w-8" />
                  </div>
                  <CardTitle>Professional Formatting</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Export your work as a perfectly formatted, publication-ready
                  PDF using the power of LaTeX, without the steep learning
                  curve.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center px-4">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                From Idea to Publication in Minutes
              </h2>
              <p className="mt-2 text-muted-foreground">
                A streamlined workflow for technical authors.
              </p>
              <ul className="mt-8 space-y-6 text-lg">
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Start a Project</h3>
                    <p className="text-muted-foreground text-sm">
                      Create a new document from scratch or use one of our
                      templates for papers, reports, or presentations.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Write & Collaborate</h3>
                    <p className="text-muted-foreground text-sm">
                      Focus on your content while our rich-text editor handles
                      the LaTeX. Invite colleagues to edit and comment in
                      real-time.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Publish & Share</h3>
                    <p className="text-muted-foreground text-sm">
                      Let our AI assist with final touches, then compile and
                      download your professional PDF, ready for submission.
                    </p>
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

        {/* Community Section */}
        <section className="w-full py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center px-4">
            <div className="relative mx-auto w-full max-w-2xl">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        Senior Software Engineer
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 pt-1">
                        SYNC TECH Solutions
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Dublin, Ireland
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    We are seeking an experienced Senior Software Engineer to
                    join our dynamic team. The ideal candidate will have a
                    passion for technology and a drive to build scalable,
                    high-quality software solutions. You will work on a variety
                    of projects, from backend services to frontend interfaces,
                    and collaborate with cross-functional teams to deliver
                    exceptional products.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      Full-time
                    </div>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      Tech
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Apply Now</Button>
                </CardFooter>
              </Card>
            </div>
            <div>
              <div className="rounded-full bg-primary/10 p-3 text-primary w-fit mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                Discover Your Next Opportunity
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Go beyond resume building. Our community-driven job board is a
                trusted space where you can find exclusive opportunities, jobs,
                and referrals shared by fellow professionals. Every listing is
                AI-validated and admin-approved to ensure quality and
                legitimacy.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/jobs">Explore Open Roles</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          <div className="text-center md:text-left text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()}{' '}
              <span className="font-body">Job</span>
              <span className="text-primary font-headline">for</span>
              <span className="font-body">You</span> by SYNC TECH Solutions. All
              rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/how-it-works"
              className="hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/community"
              className="hover:text-primary transition-colors"
            >
              Community
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
