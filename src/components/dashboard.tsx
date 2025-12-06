
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { useAuth, useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut, User, Bot, Briefcase, Shield, Users } from 'lucide-react';
import ProfileEditor from './profile-editor';
import ResumeTailor from './resume-tailor';
import CommunityView from './community-view';
import AdminView from './admin-view';

type Tab = 'profile' | 'tailor' | 'jobs' | 'admin' | 'community';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { user } = useUser();
  const auth = useAuth();
  
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-sidebar-foreground">
                <span className="font-body">Job</span><span className="font-headline text-primary">for</span><span className="font-body">You</span>
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab('profile')}
                isActive={activeTab === 'profile'}
                tooltip={{ children: 'Profile' }}
              >
                <User />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab('tailor')}
                isActive={activeTab === 'tailor'}
                tooltip={{ children: 'AI Tailor' }}
              >
                <Bot />
                <span>AI Tailor</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={() => setActiveTab('jobs')}
                    isActive={activeTab === 'jobs'}
                    tooltip={{ children: 'Job Opportunities' }}
                >
                  <Briefcase />
                  <span>Job Opportunities</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={() => setActiveTab('community')}
                    isActive={activeTab === 'community'}
                    tooltip={{ children: 'Post Job/Referral' }}
                >
                  <Users />
                  <span>Post Job/Referral</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab('admin')}
                  isActive={activeTab === 'admin'}
                  tooltip={{ children: 'Admin Panel' }}
                >
                  <Shield />
                  <span>Admin</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'}/>
              <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-sidebar-foreground">{user?.displayName || 'Anonymous User'}</p>
                <p className="truncate text-xs text-sidebar-foreground/70">{user?.email || 'No email'}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" onClick={handleSignOut}>
                <LogOut size={18}/>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
         <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger />
        </header>
        <main className="container mx-auto h-full p-4 md:p-6 lg:p-8">
            {activeTab === 'profile' && <ProfileEditor />}
            {activeTab === 'tailor' && <ResumeTailor />}
            {activeTab === 'jobs' && <CommunityView showHeader={false} />}
            {activeTab === 'community' && <CommunityView showListings={false} showPostButton={true} showHeader={true} />}
            {activeTab === 'admin' && isAdmin && <AdminView />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
