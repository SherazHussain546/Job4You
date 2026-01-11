'use server';

/**
 * @fileOverview Validates a job description to ensure it is a legitimate job posting and not malicious using a unified AI service.
 *
 * - validateJobDescription - A function that validates the job description text.
 * - ValidateJobDescriptionInput - The input type for the validation function.
 * - ValidateJobDescriptionOutput - The return type for the validation function.
 */
import "dotenv/config";
import { z } from 'zod';
import { callGenerativeAI } from '../unified-ai-service';

const ValidateJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description text to validate.'),
  applyLink: z.string().optional().describe('The URL to the application page.'),
  applyEmail: z.string().optional().describe('The email address for applications.'),
});
export type ValidateJobDescriptionInput = z.infer<typeof ValidateJobDescriptionInputSchema>;

const ValidateJobDescriptionOutputSchema = z.object({
  decision: z.enum(['valid', 'spam', 'invalid']).describe('The moderation decision.'),
  reason: z.string().describe('The reason for the decision. Empty if valid.'),
});
export type ValidateJobDescriptionOutput = z.infer<typeof ValidateJobDescriptionOutputSchema>;


const promptTemplate = `You are an extremely strict content moderator for a job board. Your task is to analyze the provided text, URL, and email to determine if it is a legitimate job description.

You must be very strict. If you have any doubt, mark it as 'spam'.

Analyze the following job posting content:
- Description: "{{jobDescription}}"
- Apply URL: "{{applyLink}}"
- Apply Email: "{{applyEmail}}"

Perform these checks meticulously:
1.  **Relevance Check**: The text MUST be a job description. It should detail responsibilities, qualifications, or company information. 
    - Mark as 'invalid' if it is gibberish (e.g., "dfksdbfyiusdnfbsy"), random conversation (e.g., "i am feeling bored," "lets hook up"), advertisements, or clearly not a job post.
2.  **Malicious Content Check**: 
    - Look for any code snippets (e.g., SQL injection, JavaScript, shell commands) or text designed to harm a system. Mark as 'invalid'.
    - Analyze the applyLink. If it uses URL shorteners (like bit.ly), suspicious domains, or looks like a phishing attempt, mark as 'spam'.
    - Analyze the applyEmail. If it looks like a temporary or suspicious email address, mark as 'spam'.
3.  **Profanity & Inappropriate Content Check**: The text must not contain any profane, hateful, or inappropriate language. Mark as 'invalid'.

Your decision process:
- If it's clearly malicious, profane, or gibberish -> 'invalid'.
- If the description is vague, the links/email seem suspicious, or it feels "off" but not clearly malicious -> 'spam'.
- If it looks like a legitimate, professional job posting -> 'valid'.

Based on your analysis, provide ONLY a JSON object with two fields:
- "decision": Your final verdict ('valid', 'spam', 'invalid').
- "reason": A brief, user-friendly reason for a 'spam' or 'invalid' decision. If 'valid', this should be an empty string.`;


export async function validateJobDescription(input: ValidateJobDescriptionInput): Promise<ValidateJobDescriptionOutput> {
    try {
        const prompt = promptTemplate
            .replace('{{jobDescription}}', input.jobDescription)
            .replace('{{applyLink}}', input.applyLink || '')
            .replace('{{applyEmail}}', input.applyEmail || '');
        
        const content = await callGenerativeAI(prompt);
        const parsedOutput = JSON.parse(content);
        return ValidateJobDescriptionOutputSchema.parse(parsedOutput);

    } catch (e: any) {
        console.error("Failed to generate or parse AI response for validation:", e);
        // Fallback to a safe default
        return {
            decision: 'spam',
            reason: 'Could not automatically validate the job post content due to an unexpected error. It has been flagged for manual review.'
        };
    }
}
