
import type { Metadata } from 'next';
import HowItWorksPage from '@/components/how-it-works-page';

export const metadata: Metadata = {
    title: 'How It Works | JobforYou Workflow',
    description: 'See how to go from a simple user profile to a professionally polished, AI-tailored resume and cover letter ready for any job application.',
};

export default function HowItWorks() {
  return <HowItWorksPage />;
}
