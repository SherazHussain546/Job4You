# **App Name**: ResumeCraft AI

## Core Features:

- User Authentication: Allow users to sign in anonymously or with Google using Firebase Authentication.
- Profile Editor: A UI tab allowing users to input and update their education, experience, skills, and contact information, stored in Firestore.
- Firestore Integration: Store and retrieve user profile data in Firestore, under the 'users/{userId}/profile' collection.
- Job Description Input: A text area in the 'Tailor Resume' tab where users can paste job descriptions.
- AI-Powered Resume Tailoring: Use the Gemini API tool to analyze the user's profile and the job description to generate LaTeX code for a tailored resume.
- AI-Powered Cover Letter Generation: Use the Gemini API tool to generate a personalized cover letter in Markdown format based on the user's profile and job requirements.
- Output and Download: Display the LaTeX code and cover letter side-by-side, with buttons to download the resume as a .tex file and the cover letter as a PDF.

## Style Guidelines:

- Primary color: Deep blue (#2E4057) to inspire trust and competence
- Background color: Very light gray (#F0F2F5), almost white, for a clean dashboard feel
- Accent color: Muted teal (#77ACA2) for interactive elements
- Body text: 'Inter', sans-serif, for a modern and neutral feel suitable for blocks of text; Headline font: 'Space Grotesk', sans-serif, for short and stylish titles
- Use simple, professional icons from a set like 'Feather' for a clean, consistent look.
- Implement a modern dashboard layout with a dark sidebar for navigation and a light content area for profile and resume information. Use Tailwind CSS grid and flexbox for responsive design.
- Use subtle transition animations for UI elements, e.g., when switching between tabs or generating content, for a smooth user experience.