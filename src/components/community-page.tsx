'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import {
  Users,
  MessageSquare,
  Calendar,
  Award,
  Menu,
} from 'lucide-react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function CommunityPage() {
  const forumCategories = [
    { icon: MessageSquare, title: 'General Discussion', description: 'Talk about anything and everything related to your field.' },
    { icon: MessageSquare, title: 'LaTeX & Formatting Help', description: 'Stuck on a tricky table? Ask for help from the pros.' },
    { icon: MessageSquare, title: 'AI Feature Requests', description: 'Have a great idea for a new AI feature? Share it here.' },
    { icon: MessageSquare, title: 'Career Advice', description: 'Share tips on job hunting, interviews, and career growth.' },
  ];

  const events = [
    { date: 'JUL 15', title: 'AMA with an AI Researcher', description: 'Join us for a live Q&A session with a leading expert in generative AI.' },
    { date: 'AUG 01', title: 'Workshop: Advanced LaTeX Techniques', description: 'Learn how to create complex layouts and custom commands.' },
    { date: 'AUG 20', title: 'Community Hangout', description: 'Meet other members, share your work, and get feedback.' },
  ];

  const spotlights = [
      { name: 'Dr. Evelyn Reed', role: 'Astrophysicist', achievement: 'Published groundbreaking research on exoplanets using our platform.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      { name: 'John Carter', role: 'PhD Candidate', achievement: 'Completed his dissertation on quantum computing with a little help from our AI tools.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
      { name: 'Maria Garcia', role: 'Software Engineer', achievement: 'Landed a dream job at a top tech company with a resume tailored by Job4You.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
  ];


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
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container px-4 text-center">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary">
                &#92;chapter&#123;community&#125;
            </code>
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mt-4">
              Welcome to the <span className="font-body">Job</span><span className="text-primary font-headline">for</span><span className="font-body">You</span> Community
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground text-center">
              Connect with fellow researchers, writers, and professionals. Share knowledge, get help, and be inspired by the work of others.
            </p>
             <div className="mt-8">
                <Button size="lg">Join the Discussion</Button>
            </div>
          </div>
        </section>
        
        {/* Forums Section */}
        <section id="forums" className="py-20 md:py-32 bg-secondary/30">
          <div className="container px-4">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                Community Forums
              </h2>
              <p className="mt-2 text-muted-foreground">
                A place for every question and conversation.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {forumCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.title} className="flex flex-col">
                    <CardHeader className="items-center text-center">
                      <div className="rounded-full bg-primary/10 p-4 text-primary">
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle>{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground flex-grow">
                      <p>{category.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Events and Spotlights Section */}
        <section className="py-20 md:py-32">
          <div className="container grid lg:grid-cols-2 gap-16 items-start px-4">
            <div>
              <h2 className="font-headline text-3xl font-bold mb-8">Upcoming Events</h2>
              <div className="space-y-6">
                {events.map((event) => (
                    <div key={event.title} className="flex items-start gap-6">
                        <div className="text-center">
                            <div className="text-lg font-bold text-primary">{event.date.split(' ')[0]}</div>
                            <div className="text-xl font-extrabold">{event.date.split(' ')[1]}</div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            <p className="text-muted-foreground mt-1">{event.description}</p>
                             <Button variant="link" className="p-0 h-auto mt-2">Learn More</Button>
                        </div>
                    </div>
                ))}
              </div>
            </div>
             <div>
              <h2 className="font-headline text-3xl font-bold mb-8">Member Spotlights</h2>
              <div className="space-y-8">
                 {spotlights.map((spotlight) => (
                    <Card key={spotlight.name}>
                        <CardContent className="p-6 flex items-start gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={spotlight.avatar} alt={spotlight.name} />
                                <AvatarFallback>{spotlight.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-lg">{spotlight.name}</h3>
                                <p className="font-medium text-primary">{spotlight.role}</p>
                                <p className="text-muted-foreground mt-2 text-sm">"{spotlight.achievement}"</p>
                            </div>
                        </CardContent>
                    </Card>
                 ))}
              </div>
            </div>
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
