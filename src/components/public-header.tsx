'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';

export function PublicHeader() {
  const { user, isUserLoading } = useUser();

  const AuthButton = () => {
    if (isUserLoading) {
      return (
        <Button disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      );
    }
    if (user) {
      return (
        <Button asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      );
    }
    return (
      <Button asChild>
        <Link href="/login">Get Started</Link>
      </Button>
    );
  };

  return (
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
          <AuthButton />
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
              <Link href="/how-it-works" className="text-lg font-medium">
                How It Works
              </Link>
              <Link href="/about" className="text-lg font-medium">
                About Us
              </Link>
              <Link href="/community" className="text-lg font-medium">
                Community
              </Link>
              <AuthButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
