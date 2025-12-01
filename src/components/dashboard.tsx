'use client';

import { useState } from 'react';
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
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { useAuth, useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut, User, Bot } from 'lucide-react';
import ProfileEditor from './profile-editor';
import ResumeTailor from './resume-tailor';

type Tab = 'profile' | 'tailor';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { user } = useUser();
  const auth = useAuth();

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
          <div className="flex items-center gap-2">
            
            <h1 className="text-2xl font-bold text-sidebar-foreground">
                <span className="font-body">Job</span><span className="font-headline text-primary">for</span><span className="font-body">You</span>
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
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
                onClick={() => setActiveTab('profile')}
                isActive={activeTab === 'profile'}
                tooltip={{ children: 'Profile' }}
              >
                <User />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
        <main className="h-full p-4 md:p-6 lg:p-8">
            {activeTab === 'profile' && <ProfileEditor />}
            {activeTab === 'tailor' && <ResumeTailor />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
