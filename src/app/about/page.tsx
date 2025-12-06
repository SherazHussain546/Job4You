
import type { Metadata } from 'next';
import AboutPage from '@/components/about-page';

export const metadata: Metadata = {
    title: 'About Us | The Mission Behind JobforYou',
    description: 'Learn about SYNC TECH Solutions and our mission to simplify technical writing and career development with JobforYou, the AI-powered LaTeX editor and job board.',
};

export default function About() {
  return <AboutPage />;
}
