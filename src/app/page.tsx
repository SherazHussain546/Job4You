'use client';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import LoginPage from '@/components/login-page';
import Dashboard from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { AppLogo } from '@/components/icons';

export default function Home() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // This should not happen if the provider is set up correctly
    return <div>Error: AuthContext not found.</div>;
  }

  const { user, loading } = authContext;

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background">
        <AppLogo className="h-12 w-12 text-primary" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <Dashboard />;
}
