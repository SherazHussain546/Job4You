
'use server';

/**
 * @fileOverview Tailors a user's resume (provided in profile data) to a specific job description using the Gemini API.
 *
 * - tailorResumeToJobDescription - A function that takes user profile data and a job description, then returns LaTeX code for a tailored resume.
 * - TailorResumeToJobDescriptionInput - The input type for the tailorResumeTo-job-description function.
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
  prompt: `You are an expert resume writer. Your task is to generate a complete, ATS-optimized, one-page resume in LaTeX format.
You must use the provided user profile data and tailor it to the given job description.
Generate a professional summary, and select the most relevant skills, experiences, and projects.
The final output must be only the LaTeX code, starting with \\documentclass and ending with \\end{document}.

Job Description:
{{{jobDescription}}}

User Profile Data:
{{{JSON.stringify profileData}}}

Here is the LaTeX template to use. Fill in the placeholders based on the user's profile and the job description.

\\documentclass[10pt, a4paper]{article}

% --- PDFlatex Compatible Preamble Block ---
\\usepackage[T1]{fontenc}
\\usepackage{mathptmx} % Use Times Roman as the default font (pdflatex compatible)
\\usepackage[a4paper, top=0.5in, bottom=0.5in, left=0.6in, right=0.6in]{geometry}
\\usepackage{titlesec} % For custom section styling
\\usepackage{enumitem} % For compact lists
\\usepackage{hyperref} % For clickable links

% Customization for ATS optimization
\\pagestyle{empty} % No page numbers
\\setlength{\\parindent}{0pt} % No paragraph indent

% Define link colors (black for printing/parsing)
\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    filecolor=black,
    urlcolor=black,
}

% Redefine section to be a simple, bold title
\\titleformat{\\section}{\\vspace{-5pt}\\raggedright\\Large\\bfseries\\scshape}{}{0em}{}
[\\titlerule]
\\titlespacing*{\\section}{0pt}{8pt}{3pt} % Section spacing

% Redefine itemize environment for compact spacing
\\setlist[itemize]{
    noitemsep, 
    leftmargin=*, 
    align=left,
    topsep=3pt,
    parsep=0pt,
}

% --- Custom Command for Role/Project Title ---
\\newcommand{\\resitem}[3]{
    \\vspace{3pt}
    \\textbf{#1} \\hfill \\textbf{#3} \\\\
    \\textit{#2} \\hfill
}

\\begin{document}

% --------------------
% 1. HEADER & CONTACT
% --------------------
\\begin{center}
    {\\Huge \\textbf{ {{{profileData.contactInfo.name}}} }} \\\\
    % AI: Generate a professional title based on the Job Description.
    [Generated Professional Title e.g., Full-Stack Software Engineer & AI/Cloud Developer] \\\\
    \\vspace{2pt}
    {{#if profileData.contactInfo.phone}} {{{profileData.contactInfo.phone}}} $|$ {{/if}} \\href{mailto:{{{profileData.contactInfo.email}}}}{ {{{profileData.contactInfo.email}}} }
    {{#if profileData.contactInfo.linkedin}} $|$ \\href{ {{{profileData.contactInfo.linkedin}}} }{LinkedIn}{{/if}}
    {{#if profileData.contactInfo.github}} $|$ \\href{ {{{profileData.contactInfo.github}}} }{GitHub}{{/if}}
    {{#if profileData.contactInfo.portfolio}} $|$ \\href{ {{{profileData.contactInfo.portfolio}}} }{Portfolio}{{/if}}
    {{#if profileData.contactInfo.instagram}} $|$ \\href{ {{{profileData.contactInfo.instagram}}} }{Instagram}{{/if}}
    {{#if profileData.contactInfo.other}} $|$ \\href{ {{{profileData.contactInfo.other}}} }{Other URL}{{/if}}
\\end{center}

% --------------------
% 2. PROFESSIONAL SUMMARY
% --------------------
% AI: Generate a concise, powerful professional summary (3-4 bullet points) that highlights the user's most relevant qualifications from their profile data in the context of the job description.
\\section*{PROFESSIONAL SUMMARY}
\\begin{itemize}
    % \\item [Generated Summary Point 1]
    % \\item [Generated Summary Point 2]
    % \\item [Generated Summary Point 3]
\\end{itemize}

% --------------------
% 3. TECHNICAL SKILLS
% --------------------
% AI: Select and categorize the user's most relevant skills for the job. You can create categories like 'Programming Languages', 'Frameworks & Libraries', 'Cloud & DevOps', etc.
\\section*{TECHNICAL SKILLS}
% Example: \\textbf{Programming Languages:} {{#each profileData.skills}} {{{this}}} {{/each}} 
% Categorize skills here based on relevance.

% --------------------
% 4. PROFESSIONAL EXPERIENCE
% --------------------
{{#if profileData.experience}}
\\section*{PROFESSIONAL EXPERIENCE}
{{#each profileData.experience}}
{{#if this.title}}
\\resitem{ {{{this.title}}} }{ {{{this.company}}} }{ {{{this.startDate}}} -- {{{this.endDate}}} }
\\begin{itemize}
    \\item {{{this.responsibilities}}}
\\end{itemize}
{{/if}}
{{/each}}
{{/if}}

% --------------------
% 5. DEVELOPMENT PROJECTS
% --------------------
{{#if profileData.projects}}
\\section*{DEVELOPMENT PROJECTS}
{{#each profileData.projects}}
{{#if this.name}}
\\resitem{ {{{this.name}}} }{}{ {{{this.date}}} }
\\begin{itemize}
    \\item {{{this.achievements}}}
\\end{itemize}
{{/if}}
{{/each}}
{{/if}}

% --------------------
% 6. EDUCATION & CERTIFICATES
% --------------------
{{#if profileData.education}}
\\section*{EDUCATION}
{{#each profileData.education}}
{{#if this.qualification}}
\\resitem{ {{{this.qualification}}} }{ {{{this.institute}}} }{ {{{this.startDate}}} -- {{{this.endDate}}} }
{{#if this.achievements}}
\\begin{itemize}
    \\item {{{this.achievements}}}
\\end{itemize}
{{/if}}
{{/if}}
{{/each}}
{{/if}}

{{#if profileData.certifications}}
\\section*{CERTIFICATES \& TRAINING}
\\begin{itemize}
{{#each profileData.certifications}}
{{#if this.name}}
    \\item \\textbf{ {{{this.name}}} }{{#if this.organization}} from \\textbf{ {{{this.organization}}} }{{/if}}{{#if this.achievements}}: {{{this.achievements}}}{{/if}}{{#if this.skillsAchieved}} Skills: {{{this.skillsAchieved}}}{{/if}}
{{/if}}
{{/each}}
\\end{itemize}
{{/if}}

\\end{document}
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
