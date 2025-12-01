import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'JobforYou | The Online LaTeX Editor for Technical Writing',
  description: 'Write like a rocket scientist with JobforYou—the collaborative, online LaTeX editor that anyone can use. Purpose-built for scientific and technical writing.',
  keywords: ['LaTeX editor', 'online LaTeX', 'collaborative writing', 'scientific writing', 'technical writing', 'research papers', 'JobforYou', 'SYNC TECH Solutions'],
  authors: [{ name: 'SYNC TECH Solutions', url: 'https://synctech.ie' }],
  openGraph: {
    title: 'JobforYou | The Online LaTeX Editor for Technical Writing',
    description: 'The collaborative, online LaTeX editor that makes it easy to write, edit, and share your scientific and technical documents.',
    url: 'https://job4you.app', // Replace with your actual domain
    siteName: 'JobforYou',
    images: [
      {
        url: 'https://picsum.photos/seed/og-image/1200/630', // Replace with a real OG image
        width: 1200,
        height: 630,
        alt: 'A preview of the JobforYou collaborative LaTeX editor.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobforYou | The Online LaTeX Editor for Technical Writing',
    description: 'The collaborative, online LaTeX editor that anyone can use. Purpose-built for scientific and technical writing.',
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
