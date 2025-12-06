
'use server';

/**
 * @fileOverview Validates a job description to ensure it is a legitimate job posting and not malicious.
 *
 * - validateJobDescription - A function that validates the job description text.
 * - ValidateJobDescriptionInput - The input type for the validation function.
 * - ValidateJobDescriptionOutput - The return type for the validation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description text to validate.'),
});
export type ValidateJobDescriptionInput = z.infer<typeof ValidateJobDescriptionInputSchema>;

const ValidateJobDescriptionOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the job description is valid.'),
  reason: z.string().describe('The reason why the job description is not valid. Empty if valid.'),
});
export type ValidateJobDescriptionOutput = z.infer<typeof ValidateJobDescriptionOutputSchema>;


export async function validateJobDescription(input: ValidateJobDescriptionInput): Promise<ValidateJobDescriptionOutput> {
    return validateJobDescriptionFlow(input);
}


const validateJobDescriptionFlow = ai.defineFlow(
  {
    name: 'validateJobDescriptionFlow',
    inputSchema: ValidateJobDescriptionInputSchema,
    outputSchema: ValidateJobDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

const prompt = ai.definePrompt({
    name: 'validateJobDescriptionPrompt',
    input: { schema: ValidateJobDescriptionInputSchema },
    output: { schema: ValidateJobDescriptionOutputSchema },
    prompt: `You are a strict content moderator for a job board. Your task is to analyze the provided text and determine if it is a legitimate job description.

You must be very strict. If you have any doubt, mark it as invalid.

Analyze the following job description:
"{{{jobDescription}}}"

Perform these checks:
1.  **Malicious Code Check**: Look for any code snippets (e.g., SQL injection, JavaScript, shell commands) or text that seems designed to harm a system.
2.  **Relevance Check**: Determine if the text is actually a job description. It should mention things like job title, responsibilities, qualifications, or company information. Gibberish, spam, advertisements, or random text should be marked as invalid.
3.  **Profanity Check**: The text must not contain any profane or inappropriate language.

Based on your analysis, provide a JSON output with two fields:
- "isValid": true if it passes all checks, false otherwise.
- "reason": If invalid, provide a brief, user-friendly reason (e.g., "Contains suspicious code," "Does not appear to be a job description," or "Contains inappropriate language"). If valid, this should be an empty string.`,
});
