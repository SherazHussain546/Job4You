'use server';

/**
 * @fileOverview Generates a personalized cover letter in LaTeX format based on user profile and job description.
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
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        achievements: z.string().optional(),
    })).describe('List of educational experiences.'),
    experience: z.array(z.object({
        title: z.string(),
        company: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
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
      achievements: z.string().optional(),
      skillsAchieved: z.string().optional(),
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
  latexCode: z.string().describe('The generated cover letter in LaTeX format.'),
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
  prompt: `You are an expert career coach. Your goal is to write a compelling, professional cover letter in LaTeX format.
You must use the provided user profile data and tailor it to the given job description.
The final output must be only the LaTeX code, starting with \\documentclass and ending with \\end{document}.

Job Description:
{{{jobDescription}}}

Here is the user's profile:
- Name: {{{profileData.contactInfo.name}}}
- Email: {{{profileData.contactInfo.email}}}
- Phone: {{{profileData.contactInfo.phone}}}
- LinkedIn: {{{profileData.contactInfo.linkedin}}}
- Experience: Highlight relevant roles from {{{profileData.experience}}}
- Skills: Select from {{{profileData.skills}}}

Use the following LaTeX template. Fill in the placeholders dynamically.
AI Actions:
1.  Extract the hiring manager's name and company name from the job description. If not found, use "Hiring Manager" and the company name.
2.  Write a strong opening paragraph that grabs attention.
3.  In the body paragraphs, connect the user's skills and experience directly to the requirements in the job description. Use 2-3 paragraphs.
4.  Write a confident closing paragraph that reiterates interest and calls to action.
5.  Ensure all placeholders like [Your Name], [Hiring Manager Name], etc., are replaced with actual data.

\\documentclass[10pt,a4paper]{letter}
\\usepackage[T1]{fontenc}
\\usepackage{mathptmx}
\\usepackage[a4paper, top=1in, bottom=1in, left=1in, right=1in]{geometry}
\\usepackage{hyperref}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{1.5ex}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    filecolor=black,
    urlcolor=black,
}

\\signature{\\textbf{ {{{profileData.contactInfo.name}}} }}
\\address{
    \\textbf{ {{{profileData.contactInfo.name}}} } \\\\
    {{#if profileData.contactInfo.phone}} {{{profileData.contactInfo.phone}}} \\\\ {{/if}}
    \\href{mailto:{{{profileData.contactInfo.email}}}}{ {{{profileData.contactInfo.email}}} }
    {{#if profileData.contactInfo.linkedin}} \\\\ \\href{{{{profileData.contactInfo.linkedin}}}}{LinkedIn} {{/if}}
}

\\begin{document}

\\begin{letter}{
    % AI: Extract hiring manager's name and company name from job description
    [Hiring Manager Name] \\\\
    [Company Name] \\\\
    [Company Address]
}

\\opening{Dear [Mr./Ms./Mx. Hiring Manager Name],}

% AI: Write a compelling opening paragraph introducing the user and stating the role they're applying for.
% Reference where the job was seen if possible.
[Opening Paragraph: State your purpose and express enthusiasm.]

% AI: Write 2-3 body paragraphs.
% Paragraph 1: Connect the user's most relevant skills from their profile to the job description's key requirements.
[Body Paragraph 1: Highlight relevant skills and how they match the job.]

% Paragraph 2: Use a specific example from the user's experience (work or projects) to demonstrate their qualifications. Quantify achievements if possible.
[Body Paragraph 2: Provide a concrete example of past success.]

% Paragraph 3 (Optional): Discuss passion for the company or industry.
[Body Paragraph 3: Show genuine interest in the company.]


% AI: Write a strong closing paragraph. Reiterate interest, express confidence, and call to action (e.g., "I am eager to discuss...").
[Closing Paragraph: Reiterate your interest and propose next steps.]

\\closing{Sincerely,}

\\end{letter}

\\end{document}
`,
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
