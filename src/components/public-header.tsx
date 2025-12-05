'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Loader2, Home, BookOpenCheck, Info, Globe, LayoutDashboard, LogIn } from 'lucide-react';
import { useUser } from '@/firebase';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/how-it-works', icon: BookOpenCheck, label: 'How It Works' },
  { href: '/about', icon: Info, label: 'About' },
  { href: '/community', icon: Globe, label: 'Community' },
];

export function PublicHeader() {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();

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

  const MobileAuthIcon = () => {
    if (isUserLoading) {
      return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    if (user) {
      return <LayoutDashboard className="h-5 w-5" />;
    }
    return <LogIn className="h-5 w-5" />;
  };

  const MobileAuthLabel = () => {
    if (isUserLoading) {
      return 'Loading...';
    }
    if (user) {
      return 'Dashboard';
    }
    return 'Login';
  };

  const MobileAuthHref = user ? '/dashboard' : '/login';

  return (
    <>
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
        </div>
      </header>

      {/* Floating Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 flex justify-center">
        <TooltipProvider>
          <nav className="flex h-16 items-center justify-around gap-2 rounded-full bg-primary p-2 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10',
                        isActive && 'bg-primary-foreground/20 text-primary-foreground'
                      )}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={MobileAuthHref}
                  className={cn(
                    'flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10',
                    pathname === MobileAuthHref && 'bg-primary-foreground/20 text-primary-foreground'
                  )}
                >
                  <MobileAuthIcon />
                  <span className="sr-only">
                    <MobileAuthLabel />
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <MobileAuthLabel />
                </p>
              </TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </div>
    </>
  );
}
