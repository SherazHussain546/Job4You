'use client';

import CommunityView from '@/components/community-view';
import { PublicHeader } from '@/components/public-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Handshake, DollarSign, UserCheck } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PublicHeader />

      <main className="flex-1">
        <CommunityView showListings={false} showHeader={true} />

        <section className="py-16 md:py-24 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">What This Community Is All About</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our mission is simple: to create a trusted space where talented professionals can connect with genuine opportunities. Whether you're hunting for your next role, seeking freelance projects, or looking to refer great candidates, this is your platform. We believe in the power of community to give everyone the push they need to find their dream job.
                    </p>
                </div>

                 <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-primary/10 p-3 text-primary">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <CardTitle>Community Guidelines</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                            <div className="flex items-start gap-3">
                                <Handshake className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Stay Professional</h4>
                                    <p className="text-sm">All interactions should be respectful and professional. This is a space for career growth and collaboration.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <DollarSign className="h-5 w-5 mt-1 text-destructive flex-shrink-0" />
                                 <div>
                                    <h4 className="font-semibold text-foreground">No Money for Jobs or Referrals</h4>
                                    <p className="text-sm">We strictly prohibit asking for or offering payment in exchange for a job or a referral. This community is built on merit and trust.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                             <div className="flex items-center gap-4">
                                <div className="rounded-full bg-primary/10 p-3 text-primary">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                                <CardTitle>The Approval Process</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                           <div>
                                <h4 className="font-semibold text-foreground">Why are posts verified?</h4>
                                <p className="text-sm">To maintain the quality and legitimacy of our job board, every post is reviewed before it goes live. This ensures that all opportunities are genuine and meet our community standards.</p>
                           </div>
                             <div>
                                <h4 className="font-semibold text-foreground">Who is the admin?</h4>
                                <p className="text-sm">
                                    All posts are approved by our site administrator,{' '}
                                    <span className="font-medium text-primary">Sheraz Hussain</span>. 
                                    You can reach out with any questions regarding your post at{' '}
                                    <a href="mailto:sheraz.synctech.ie" className="text-primary underline">sheraz.synctech.ie</a>.
                                </p>
                           </div>
                        </CardContent>
                    </Card>
                </div>

                 <div className="mt-16 text-center max-w-3xl mx-auto">
                    <h3 className="font-headline text-2xl font-bold">Let's build a better future, together.</h3>
                    <p className="mt-2 text-muted-foreground">
                        By working together and upholding these values, we can make this community a powerful force for good in the professional world. Join us in creating a place where talent and opportunity meet.
                    </p>
                </div>
            </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} <span className="font-body">Job</span><span className="text-primary font-headline">for</span><span className="font-body">You</span> by SYNC TECH Solutions. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
