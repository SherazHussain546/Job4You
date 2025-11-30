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
    education: z.array(z.object({
        qualification: z.string(),
        institute: z.string(),
        achievements: z.string().optional(),
    })).describe('List of educational experiences.'),
    experience: z.array(z.object({
        title: z.string(),
        company: z.string(),
        responsibilities: z.string(),
    })).describe('List of work experiences.'),
    projects: z.array(z.object({
        name: z.string(),
        date: z.string().optional(),
        achievements: z.string(),
    })).describe('List of projects.'),
    certifications: z.array(z.object({
      name: z.string(),
      organization: z.string(),
      date: z.string().optional(),
      link: z.string().optional(),
    })).describe('List of certifications.'),
    skills: z.array(z.string()).describe('List of skills.'),
    contactInfo: z
      .object({
        name: z.string().describe('Your name'),
        email: z.string().describe('Your email'),
        phone: z.string().optional().describe('Your phone number'),
        linkedin: z.string().optional().describe('Your LinkedIn profile URL'),
        github: z.string().optional().describe('Your GitHub profile URL'),
        instagram: z.string().optional().describe('Your Instagram profile URL'),
        portfolio: z.string().optional().describe('Your portfolio URL'),
        other: z.string().optional().describe('Other relevant URL'),
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
{{#if profileData.contactInfo.phone}}Phone: {{{profileData.contactInfo.phone}}}{{/if}}
{{#if profileData.contactInfo.linkedin}}LinkedIn: {{{profileData.contactInfo.linkedin}}}{{/if}}
{{#if profileData.contactInfo.github}}GitHub: {{{profileData.contactInfo.github}}}{{/if}}
{{#if profileData.contactInfo.portfolio}}Portfolio: {{{profileData.contactInfo.portfolio}}}{{/if}}
{{#if profileData.contactInfo.instagram}}Instagram: {{{profileData.contactInfo.instagram}}}{{/if}}
{{#if profileData.contactInfo.other}}Other: {{{profileData.contactInfo.other}}}{{/if}}

Education:
{{#each profileData.education}}
- **{{{this.qualification}}}** from **{{{this.institute}}}**
  {{#if this.achievements}} - Achievements: {{{this.achievements}}}{{/if}}
{{/each}}

Experience:
{{#each profileData.experience}}
- **{{{this.title}}}** at **{{{this.company}}}**
  - {{{this.responsibilities}}}
{{/each}}

Projects:
{{#each profileData.projects}}
- **{{{this.name}}}** ({{#if this.date}}{{{this.date}}}{{/if}})
  - {{{this.achievements}}}
{{/each}}

Certifications:
{{#each profileData.certifications}}
- **{{{this.name}}}** from **{{{this.organization}}}** ({{#if this.date}}{{{this.date}}}{{/if}})
  {{#if this.link}} - [View Certificate]({{{this.link}}}){{/if}}
{{/each}}

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
