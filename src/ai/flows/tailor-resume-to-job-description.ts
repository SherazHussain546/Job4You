
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
    education: z.array(z.object({
        qualification: z.string(),
        institute: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        achievements: z.string().optional(),
    })).describe('Array of education details.'),
    experience: z.array(z.object({
        title: z.string(),
        company: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        responsibilities: z.string(),
    })).describe('Array of work experience details.'),
    projects: z.array(z.object({
      name: z.string(),
      date: z.string().optional(),
      achievements: z.string(),
    })).describe('Array of project details.'),
    certifications: z.array(z.object({
      name: z.string(),
      organization: z.string(),
      date: z.string().optional(),
      link: z.string().optional(),
      achievements: z.string().optional(),
      skillsAchieved: z.string().optional(),
    })).describe('Array of certification details.'),
    skills: z.array(z.string()).describe('Array of skills.'),
    contactInfo: z.object({
      name: z.string().describe('Name of the person'),
      email: z.string().describe('Email address'),
      phone: z.string().optional().describe('Phone number'),
      linkedin: z.string().optional().describe('LinkedIn profile URL'),
      github: z.string().optional().describe('Your GitHub profile URL'),
      instagram: z.string().optional().describe('Your Instagram profile URL'),
      portfolio: z.string().optional().describe('Your portfolio URL'),
      other: z.string().optional().describe('Other relevant URL'),
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
Contact Info:
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
\\textbf{ {{{this.qualification}}} } at \\textbf{ {{{this.institute}}} } {{#if this.startDate}}({{{this.startDate}}} - {{{this.endDate}}}){{/if}}
{{#if this.achievements}}
{{{this.achievements}}}
{{/if}}
{{/each}}

Experience:
{{#each profileData.experience}}
\\textbf{ {{{this.title}}} } at \\textbf{ {{{this.company}}} } {{#if this.startDate}}({{{this.startDate}}} - {{{this.endDate}}}){{/if}}
{{{this.responsibilities}}}
{{/each}}

Projects:
{{#each profileData.projects}}
\\textbf{ {{{this.name}}} } {{#if this.date}}({{{this.date}}}){{/if}}
{{{this.achievements}}}
{{/each}}

Certifications:
{{#each profileData.certifications}}
\\textbf{ {{{this.name}}} } from \\textbf{ {{{this.organization}}} } {{#if this.date}}({{{this.date}}}){{/if}}
{{#if this.link}}Link: {{{this.link}}}{{/if}}
{{#if this.achievements}}Achievements: {{{this.achievements}}}{{/if}}
{{#if this.skillsAchieved}}Skills Achieved: {{{this.skillsAchieved}}}{{/if}}
{{/each}}

Skills:
{{#each profileData.skills}}{{{this}}}\n{{/each}}


Generate the complete LaTeX code for a professional resume tailored to the job description. Make sure to include a \\documentclass{article} and \\begin{document} and \\end{document} tags.
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
