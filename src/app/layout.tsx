import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import GoogleAnalytics from '@/components/google-analytics';
import Script from 'next/script';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const metadata: Metadata = {
  metadataBase: new URL('https://job4you.app'), // Replace with your actual domain
  title: {
    default: 'JobforYou | AI Resume Builder & Community Job Board',
    template: '%s | JobforYou',
  },
  description:
    'Generate ATS-optimized resumes and cover letters with AI. Explore a community-driven job board for exclusive tech jobs, freelance opportunities, and referrals. Your next career move starts here.',
  keywords: [
    'AI resume builder',
    'cover letter generator',
    'job board',
    'community jobs',
    'tech jobs',
    'software engineer jobs',
    'freelance opportunities',
    'job referrals',
    'career tools',
    'JobforYou',
    'SYNC TECH Solutions',
    'ATS resume',
    'job application',
  ],
  authors: [{ name: 'SYNC TECH Solutions', url: 'https://synctech.ie' }],
  creator: 'SYNC TECH Solutions',
  publisher: 'SYNC TECH Solutions',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'JobforYou | AI-Powered Resumes & Community Job Board',
    description:
      'Transform your job search with an AI-powered resume tailor and a trusted community job board. Find your next role or top talent with JobforYou.',
    url: 'https://job4you.app', // Replace with your actual domain
    siteName: 'JobforYou',
    images: [
      {
        url: 'https://picsum.photos/seed/og-image/1200/630', 
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
    description:
      'Generate tailored resumes, find exclusive job opportunities, and connect with a professional community. Your career journey, amplified by AI.',
    images: ['https://picsum.photos/seed/twitter-image/1200/600'], 
    creator: '@YourTwitterHandle', // Add your twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'JobforYou',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  description:
    'An AI-powered platform to generate tailored resumes and cover letters, and a community job board for professional opportunities.',
  url: 'https://job4you.app',
  author: {
    '@type': 'Organization',
    name: 'SYNC TECH Solutions',
    url: 'https://synctech.ie',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
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
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K89CV2J9');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Dancing+Script:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K89CV2J9"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
