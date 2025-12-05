
'use client';

import CommunityView from '@/components/community-view';
import { PublicHeader } from '@/components/public-header';


export default function Community() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PublicHeader />

      <main className="flex-1 container mx-auto px-4">
        <CommunityView />
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
