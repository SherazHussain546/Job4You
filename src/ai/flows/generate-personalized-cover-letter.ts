'use server';

/**
 * @fileOverview Generates a personalized cover letter in Markdown format based on user profile and job description.
 *
 * - generatePersonalizedCoverLetter - A function that generates the cover letter.
 * - GeneratePersonalizedCoverLetterInput - The input type for the generatePersonalizedCoverLetter function.
 * - GeneratePersonalizedCoverLetterOutput - The return type for the generatePersonalizedCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedCoverLetterInputSchema = z.object({
  profileData: z.object({
    education: z.array(z.string()).describe('List of educational experiences.'),
    experience: z.array(z.string()).describe('List of work experiences.'),
    skills: z.array(z.string()).describe('List of skills.'),
    contactInfo: z
      .object({
        name: z.string().describe('Your name'),
        email: z.string().describe('Your email'),
        phone: z.string().describe('Your phone number'),
        linkedin: z.string().describe('Your LinkedIn profile URL'),
      })
      .describe('Your contact information'),
  }).describe('User profile data including education, experience, and skills.'),
  jobDescription: z.string().describe('The job description for the target job.'),
});
export type GeneratePersonalizedCoverLetterInput = z.infer<
  typeof GeneratePersonalizedCoverLetterInputSchema
>;

const GeneratePersonalizedCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter in Markdown format.'),
});
export type GeneratePersonalizedCoverLetterOutput = z.infer<
  typeof GeneratePersonalizedCoverLetterOutputSchema
>;

export async function generatePersonalizedCoverLetter(
  input: GeneratePersonalizedCoverLetterInput
): Promise<GeneratePersonalizedCoverLetterOutput> {
  return generatePersonalizedCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedCoverLetterPrompt',
  input: {schema: GeneratePersonalizedCoverLetterInputSchema},
  output: {schema: GeneratePersonalizedCoverLetterOutputSchema},
  prompt: `You are an expert career coach. Your goal is to write a compelling cover letter, highlighting the users most relevant experience for the job description provided.  The cover letter should be in markdown format.

User Profile:
Name: {{{profileData.contactInfo.name}}}
Email: {{{profileData.contactInfo.email}}}
Phone: {{{profileData.contactInfo.phone}}}
LinkedIn: {{{profileData.contactInfo.linkedin}}}

Education:
{{#each profileData.education}}- {{{this}}}{{/each}}

Experience:
{{#each profileData.experience}}- {{{this}}}{{/each}}

Skills:
{{#each profileData.skills}}- {{{this}}}{{/each}}

Job Description:
{{{jobDescription}}}`,
});

const generatePersonalizedCoverLetterFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedCoverLetterFlow',
    inputSchema: GeneratePersonalizedCoverLetterInputSchema,
    outputSchema: GeneratePersonalizedCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
