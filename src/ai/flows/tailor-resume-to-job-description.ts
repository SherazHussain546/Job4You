'use server';

/**
 * @fileOverview Tailors a user's resume (provided in profile data) to a specific job description using the Gemini API.
 *
 * - tailorResumeToJobDescription - A function that takes user profile data and a job description, then returns LaTeX code for a tailored resume.
 * - TailorResumeToJobDescriptionInput - The input type for the tailorResumeToJobDescription function.
 * - TailorResumeToJobDescriptionOutput - The return type for the tailorResumeToJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TailorResumeToJobDescriptionInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description to tailor the resume to.'),
  profileData: z.object({
    education: z.array(z.string()).describe('Array of education details.'),
    experience: z.array(z.string()).describe('Array of work experience details.'),
    skills: z.array(z.string()).describe('Array of skills.'),
    contactInfo: z.object({
      name: z.string().describe('Name of the person'),
      email: z.string().describe('Email address'),
      phone: z.string().describe('Phone number'),
      linkedin: z.string().describe('LinkedIn profile URL'),
    }).describe('Contact information.'),
  }).describe('The user profile data containing education, experience, skills, and contact information.'),
});

export type TailorResumeToJobDescriptionInput = z.infer<
  typeof TailorResumeToJobDescriptionInputSchema
>;

const TailorResumeToJobDescriptionOutputSchema = z.object({
  latexCode: z
    .string()
    .describe('LaTeX code for the tailored resume.'),
});

export type TailorResumeToJobDescriptionOutput = z.infer<
  typeof TailorResumeToJobDescriptionOutputSchema
>;

export async function tailorResumeToJobDescription(
  input: TailorResumeToJobDescriptionInput
): Promise<TailorResumeToJobDescriptionOutput> {
  return tailorResumeToJobDescriptionFlow(input);
}

const tailorResumeToJobDescriptionPrompt = ai.definePrompt({
  name: 'tailorResumeToJobDescriptionPrompt',
  input: {schema: TailorResumeToJobDescriptionInputSchema},
  output: {schema: TailorResumeToJobDescriptionOutputSchema},
  prompt: `You are an expert resume writer specializing in tailoring resumes to specific job descriptions. Use the user's profile data and the job description to create the best possible resume, in LaTeX format. You must only use the data provided in the user profile and not invent any details.

Job Description: {{{jobDescription}}}

User Profile Data:
Education: {{#each profileData.education}}{{{this}}}\n{{/each}}
Experience: {{#each profileData.experience}}{{{this}}}\n{{/each}}
Skills: {{#each profileData.skills}}{{{this}}}\n{{/each}}
Contact Info: Name: {{{profileData.contactInfo.name}}}, Email: {{{profileData.contactInfo.email}}}, Phone: {{{profileData.contactInfo.phone}}}, LinkedIn: {{{profileData.contactInfo.linkedin}}}


Generate the complete LaTeX code for a professional resume tailored to the job description.  Make sure to include a \documentclass{article} and \begin{document} and \end{document} tags.
`,
});

const tailorResumeToJobDescriptionFlow = ai.defineFlow(
  {
    name: 'tailorResumeToJobDescriptionFlow',
    inputSchema: TailorResumeToJobDescriptionInputSchema,
    outputSchema: TailorResumeToJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await tailorResumeToJobDescriptionPrompt(input);
    return output!;
  }
);
