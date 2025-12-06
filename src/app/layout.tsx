import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'JobforYou | AI-Powered Resumes & Community Job Board',
  description: 'Generate tailored resumes and cover letters with AI. Explore a community-driven job board for exclusive opportunities, jobs, and referrals. Your next career move starts here.',
  keywords: ['AI resume builder', 'cover letter generator', 'job board', 'community jobs', 'tech jobs', 'freelance opportunities', 'job referrals', 'career tools', 'JobforYou', 'SYNC TECH Solutions'],
  authors: [{ name: 'SYNC TECH Solutions', url: 'https://synctech.ie' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'JobforYou | AI-Powered Resumes & Community Job Board',
    description: 'Transform your job search with AI-powered resume tailoring and a trusted community job board. Find your next role or top talent with JobforYou.',
    url: 'https://job4you.app', // Replace with your actual domain
    siteName: 'JobforYou',
    images: [
      {
        url: 'https://picsum.photos/seed/og-image/1200/630', // Replace with a real OG image
        width: 1200,
        height: 630,
        alt: 'A preview of the JobforYou AI resume builder and community job board.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobforYou | AI-Powered Resumes & Community Job Board',
    description: 'Generate tailored resumes, find exclusive job opportunities, and connect with a professional community. Your career journey, amplified by AI.',
    images: ['https://picsum.photos/seed/twitter-image/1200/600'], // Replace with a real Twitter image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Dancing+Script:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
