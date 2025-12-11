
'use server';

/**
 * @fileOverview Generates a personalized cover letter in LaTeX format based on user profile and job description.
 *
 * - generatePersonalizedCoverLetter - A function that generates the cover letter.
 * - GeneratePersonalizedCoverLetterInput - The input type for the generatePersonalizedCoverLetter function.
 * - GeneratePersonalizedCoverLetterOutput - The return type for the generatePersonalizedCoverLetter function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

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
        achievements: z.string().optional(),
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

const promptTemplate = `You are an expert career coach and professional writer. Your task is to generate a compelling, professional cover letter in LaTeX format.
Your writing must be flawless, with no grammatical errors, and maintain a highly professional tone.
You must use the provided user profile data and tailor it to the given job description.
The final output must be only a JSON object with a single key "latexCode" containing the LaTeX code as a string, starting with \\documentclass and ending with \\end{document}.

User Profile:
- Name: {{{profileData.contactInfo.name}}}
- Contact: {{{contactSection}}}
- Education: {{#each profileData.education}}- {{this.qualification}} at {{this.institute}} ({{this.startDate}} - {{this.endDate}}). Achievements: {{this.achievements}} {{/each}}
- Experience: {{#each profileData.experience}}- {{this.title}} at {{this.company}} ({{this.startDate}} - {{this.endDate}}). Responsibilities: {{this.responsibilities}} {{/each}}
- Projects: {{#each profileData.projects}}- {{this.name}} ({{this.date}}). Achievements: {{this.achievements}} {{/each}}
- Skills: {{#each profileData.skills}}{{{this}}}, {{/each}}

Job Description:
{{{jobDescription}}}

AI Actions:
1.  Extract the Job Title, Company Name, and Hiring Manager's Name from the job description. If Hiring Manager is not found, use "Hiring Team".
2.  Generate a compelling opening paragraph introducing the user and stating the role they're applying for.
3.  Write 2-3 body paragraphs. For these paragraphs, you must be highly selective. Analyze the job description and the user's profile, then choose the *single most relevant* project or work experience to highlight. Connect the user's skills and achievements from that example directly to the key requirements of the job. Use quantifiable achievements where possible. Do not list everything; choose the best.
4.  Write a closing paragraph that expresses genuine enthusiasm for the company and includes a strong call to action.
5.  Replace all placeholders like [Job Title] with the extracted or generated information.

Use the following LaTeX template. Return ONLY a JSON object with a "latexCode" field.

\\documentclass[10pt, a4paper]{article}

% --- PDFlatex Compatible Preamble Block ---
\\usepackage[T1]{fontenc}
\\usepackage{mathptmx} % Use Times Roman as the default font (pdflatex compatible)
\\usepackage[a4paper, top=1.0in, bottom=1.0in, left=1.0in, right=1.0in]{geometry}
\\usepackage{hyperref}

% --- Customization ---
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{1em}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    filecolor=black,
    urlcolor=black,
}

\\begin{document}

% --------------------
% 1. SENDER CONTACT INFORMATION
% --------------------
\\raggedright
\\textbf{ {{{profileData.contactInfo.name}}} } \\\\
{{{contactSection}}}

\\vspace{10pt}

% --------------------
% 2. DATE AND RECIPIENT INFORMATION
% --------------------
\\today \\\\

\\vspace{10pt}

% AI: Extract from Job Description. Use "Hiring Team" if name not found.
\\textbf{[Hiring Manager Name]} \\\\
\\textbf{[Hiring Manager Title]} \\\\
\\textbf{[Company Name]} \\\\

\\vspace{10pt}

% AI: Extract Job Title from Job Description. Generate a relevant subtitle based on user's skills.
\\textbf{Subject: Application for [Job Title] -- [Generated Subtitle, e.g., Full-Stack Software Engineer]}

\\vspace{10pt}

% --------------------
% 3. LETTER BODY
% --------------------
% AI: Address the hiring manager or team.
Dear [Mr./Ms./Mx. Last Name or Hiring Team],

% AI: Write a compelling opening paragraph. Mention the specific role and where it was advertised.
% Express genuine interest and briefly introduce yourself.
I am writing to express my enthusiastic interest in the **[Job Title]** position at **[Company Name]**, as advertised on [Platform]. As a [Your Description, e.g., recent First-Class Honors graduate in Computing] with a strong foundation in [Your Key Areas, e.g., Full-Stack development, AI/ML, and DevSecOps], I am confident that my technical skills and proactive approach align perfectly with your team's requirements.

% AI: Write a body paragraph connecting your experience to the job. Use a specific, powerful example.
% Use quantifiable data from the user's profile if available.
My background spans complex, end-to-end development, specializing in modern frameworks such as [Your Frameworks, eg., Angular, React.js] and scalable cloud services like [Your Cloud Skills, e.g., AWS, Kubernetes]. In my project work, I consistently focused on developing practical, high-impact solutions. For example, [Select a strong project or experience from the user's profile and describe it, e.g., the Market Genius platform I architected...]. This demonstrates my ability to transition from concept to deployment in a complex domain.

% AI: Write another body paragraph showing you understand business impact or are a cultural fit.
Furthermore, my development experience is directly complemented by [Mention a relevant achievement or quality, e.g., quantifiable business achievements]. I believe that combining engineering excellence with a strong understanding of commercial impact is crucial for a development role at **[Company Name]**.

% AI: Write a paragraph showing genuine interest in the specific company.
I am particularly excited about [Mention a specific company product, project, or value you researched] and see a direct opportunity to leverage my expertise in [Mention 1-2 key skills from your profile, e.g., Generative AI] to contribute to this area. I am ready to bring my energy, commitment to excellence, and collaborative spirit to your team.

Thank you for your time and consideration. I have attached my resume for your review and look forward to the opportunity to discuss how my competencies can drive success at [Company Name].

\\vspace{10pt}

Sincerely, \\\\
{{{profileData.contactInfo.name}}}

\\end{document}
`;

function fillTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/{{{?(.*?)}}}?/g, (match, key) => {
    const keys = key.trim().split('.');
    let value: any = data;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return match; // Return original placeholder if key not found
      }
    }
    return value;
  });
}

export async function generatePersonalizedCoverLetter(
  input: GeneratePersonalizedCoverLetterInput
): Promise<GeneratePersonalizedCoverLetterOutput> {
  const { profileData } = input;
  const contactParts = [];
  if (profileData.contactInfo.phone) {
    contactParts.push(`${profileData.contactInfo.phone} \\\\`);
  }
  if (profileData.contactInfo.email) {
    contactParts.push(`\\href{mailto:${profileData.contactInfo.email}}{${profileData.contactInfo.email}} \\\\`);
  }
  if (profileData.contactInfo.linkedin) {
    contactParts.push(`\\href{https://${profileData.contactInfo.linkedin}}{LinkedIn Profile} \\\\`);
  }
  const contactSection = contactParts.join('\n');

  const fullPrompt = fillTemplate(promptTemplate, { ...input, contactSection });

  const { text } = await ai.generate({
    model: 'gemini-1.5-flash-latest',
    prompt: fullPrompt,
  });

  try {
    // The model sometimes returns the JSON wrapped in ```json ... ```, so we need to clean it.
    const cleanedJson = text.replace(/^```json\s*|```\s*$/g, '');
    const parsedOutput = JSON.parse(cleanedJson);
    return GeneratePersonalizedCoverLetterOutputSchema.parse(parsedOutput);
  } catch (e) {
    console.error('Failed to parse AI response for cover letter:', e, "Raw response:", text);
    throw new Error('AI returned an invalid format.');
  }
}
