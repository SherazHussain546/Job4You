'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Users,
  Lightbulb,
  ShieldCheck,
  Globe,
  Scaling,
  HeartHandshake,
} from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const values = [
    {
      icon: HeartHandshake,
      title: 'Friendly & Approachable',
      description:
        'We believe powerful tools should be accessible to everyone. We’re here to support your journey with a platform that’s welcoming and easy to navigate.',
    },
    {
      icon: Users,
      title: 'User-Centric by Design',
      description:
        'You are at the core of our development process. We build features based on your feedback to make your writing process as smooth as possible.',
    },
    {
      icon: ShieldCheck,
      title: 'Trustworthy & Professional',
      description:
        'Your most important work deserves the highest level of security and reliability. You can trust us to protect your data and provide a stable platform.',
    },
    {
      icon: Lightbulb,
      title: 'Collaborative & Innovative',
      description:
        'We are passionate about science and technology. We work with the research community to build the innovative tools you need to succeed.',
    },
    {
      icon: Scaling,
      title: 'Sustainable & Scalable',
      description:
        'We are committed to building a product that can grow with your needs while being mindful of our environmental impact.',
    },
    {
      icon: Globe,
      title: 'Global & Remote-First',
      description:
        'We are a global team that embraces flexibility and trusts our people to deliver outstanding results from anywhere in the world.',
    },
  ];

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
        {/* About Us Section */}
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter">
              The Home of Scientific and Technical Writing
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              Job4You was developed by SYNC TECH Solutions to make scientific writing simpler and collaboration seamless. Millions of users at research institutions and innovative companies worldwide love our platform because it helps them write smarter and achieve more, together.
            </p>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-20 md:py-32 bg-secondary/30">
            <div className="container grid md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-video rounded-xl shadow-2xl">
                    <Image 
                        src="https://picsum.photos/seed/story/1280/720"
                        alt="Founders sketching ideas on a whiteboard"
                        fill
                        className="object-cover rounded-xl"
                        data-ai-hint="team brainstorming"
                    />
                </div>
                 <div>
                     <h2 className="font-headline text-3xl md:text-4xl font-bold">Great Ideas Deserve to be as Polished as They are Powerful</h2>
                     <div className="mt-6 space-y-4 text-muted-foreground">
                        <p>LaTeX has long been the gold standard for academics and researchers—a tool capable of producing beautifully formatted documents. But its power comes with a steep learning curve that can feel intimidating.</p>
                        <p>We saw this challenge not as a barrier, but as an opportunity. In 2023, the team at <a href="https://synctech.ie" target="_blank" rel="noopener noreferrer" className="text-primary underline">SYNC TECH Solutions</a> set out to create a platform that harnessed the full potential of LaTeX while making it accessible to everyone. The result is Job4You—an online, collaborative editor where your focus can remain on your ideas, not on the code.</p>
                        <p>Today, Job4You is trusted by a rapidly growing community for everything from CVs to groundbreaking scientific discoveries. We're here to support your work, every step of the way.</p>
                     </div>
                </div>
            </div>
        </section>


        {/* Our Values Section */}
        <section id="values" className="py-20 md:py-32">
          <div className="container">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                We Aim to Be...
              </h2>
              <p className="mt-2 text-muted-foreground">
                Our core values guide every decision we make.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title}>
                    <CardHeader className="items-center text-center">
                      <div className="rounded-full bg-primary/10 p-4 text-primary">
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground">
                      {value.description}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
            <div className="container">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">Join Millions of Innovators</h2>
                <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Discover why so many researchers, students, and professionals trust Job4You with their best work.</p>
                <div className="mt-8">
                    <Button size="lg" asChild>
                        <Link href="/login">Start Writing for Free</Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Job4You by SYNC TECH Solutions. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
