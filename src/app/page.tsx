
import type { Metadata } from 'next';
import LandingPage from '@/components/landing-page';

export const metadata: Metadata = {
  title: 'AI Resume & Cover Letter Builder | JobforYou',
  description: 'Create professional, ATS-friendly resumes and cover letters in minutes with our AI-powered tool. Start for free and land your dream job.',
};

export default function Home() {
  return <LandingPage />;
}
