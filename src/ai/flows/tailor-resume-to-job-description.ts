
'use server';

/**
 * @fileOverview Tailors a user's resume (provided in profile data) to a specific job description using the Gemini API.
 *
 * - tailorResumeToJobDescription - A function that takes user profile data and a job description, then returns LaTeX code for a tailored resume.
 * - TailorResumeToJobDescriptionInput - The input type for the tailorResumeToJobDescription function.
 * - TailorResumeToJobDescriptionOutput - The return type for the tailorResumeToJobToDescription function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
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


const tailorResumeToJobDescriptionFlow = ai.defineFlow(
  {
    name: 'tailorResumeToJobDescriptionFlow',
    inputSchema: TailorResumeToJobDescriptionInputSchema,
    outputSchema: TailorResumeToJobDescriptionOutputSchema,
  },
  async input => {
    const { profileData } = input;
    let contactSection = '';
    if (profileData.contactInfo.phone) {
        contactSection += profileData.contactInfo.phone;
    }
    if (profileData.contactInfo.email) {
        if (contactSection) contactSection += ' $|$ ';
        contactSection += `\\href{mailto:${profileData.contactInfo.email}}{${profileData.contactInfo.email}}`;
    }
    if (profileData.contactInfo.linkedin) {
        if (contactSection) contactSection += ' $|$ ';
        contactSection += `\\href{https://${profileData.contactInfo.linkedin}}{LinkedIn}`;
    }
    if (profileData.contactInfo.github) {
        if (contactSection) contactSection += ' $|$ ';
        contactSection += `\\href{https://${profileData.contactInfo.github}}{GitHub}`;
    }
     if (profileData.contactInfo.portfolio) {
        if (contactSection) contactSection += ' $|$ ';
        contactSection += `\\href{https://${profileData.contactInfo.portfolio}}{Portfolio}`;
    }
    if (profileData.contactInfo.instagram) {
        if (contactSection) contactSection += ' $|$ ';
        contactSection += `\\href{https://${profileData.contactInfo.instagram}}{Instagram}`;
    }
    if (profileData.contactInfo.other) {
        if (contactSection) contactSection += ' $|$ ';
        contactSection += `\\href{https://${profileData.contactInfo.other}}{Other URL}`;
    }

    const augmentedInput = { ...input, contactSection };

    const {output} = await tailorResumeToJobDescriptionPrompt(augmentedInput);
    return output!;
  }
);

export async function tailorResumeToJobDescription(
  input: TailorResumeToJobDescriptionInput
): Promise<TailorResumeToJobDescriptionOutput> {
  return tailorResumeToJobDescriptionFlow(input);
}

const tailorResumeToJobDescriptionPrompt = ai.definePrompt({
  name: 'tailorResumeToJobDescriptionPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: TailorResumeToJobDescriptionInputSchema.extend({ contactSection: z.string() })},
  prompt: `You are an expert resume writer and career coach. Your task is to generate a complete, ATS-optimized, one-page resume in LaTeX format using the provided template.
Your writing must be grammatically perfect and use a highly professional tone.
You must analyze the user's profile data and the job description to create a resume that is powerfully tailored for the specific role.

Your AI actions are:
1.  Generate a professional, one-sentence title for the user that mirrors the job title from the job description (e.g., "Full-Stack Software Engineer & AI/Cloud Developer").
2.  Create a "PROFESSIONAL SUMMARY" with 3-4 bullet points. Each point must be a concise, impactful statement that highlights the user's most relevant qualifications and skills, directly aligning with the key requirements in the job description.
3.  In the "TECHNICAL SKILLS" section, be highly selective. Choose only the most relevant skills from the user's profile that are explicitly mentioned or strongly implied in the job description. Categorize them logically.
4.  For "PROFESSIONAL EXPERIENCE" and "DEVELOPMENT PROJECTS," select only the 1-2 most relevant roles or projects. For each, rewrite the responsibilities and achievements to use powerful action verbs and quantify results. Directly map these accomplishments to the needs stated in the job description. Omit experiences and projects that are not relevant.
5.  Conditionally render sections only if there is relevant data to show (e.g., if no selected projects are relevant, do not include the PROJECTS section).
The final output must be only a JSON object with a single key "latexCode" containing the LaTeX code as a string, starting with \\documentclass and ending with \\end{document}.

Job Description:
{{{jobDescription}}}

% ATS-Optimized Resume Template: {{{profileData.contactInfo.name}}}
% Designed for maximum parsing reliability by using simple document structure,
% standard sectioning, and minimal custom formatting.

\\documentclass[10pt, a4paper]{article}

% --- PDFlatex Compatible Preamble Block ---
% Use T1 font encoding and Times/Utopia-like font families for better PDF output
\\usepackage[T1]{fontenc}
\\usepackage{mathptmx} % Use Times Roman as the default font (pdflatex compatible)

% Set tight margins typical for a one-page technical resume
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
    {{{contactSection}}}
\\end{center}

% --------------------
% 2. PROFESSIONAL SUMMARY
% --------------------
\\section*{PROFESSIONAL SUMMARY}
% AI: Generate 3-4 bullet points for the summary, tailored to the job description.
\\begin{itemize}
    \\item [Generated Summary Point 1: Highlight key qualification and alignment with the role]
    \\item [Generated Summary Point 2: Showcase a top technical skill relevant to the job]
    \\item [Generated Summary Point 3: Mention a key achievement or experience]
\\end{itemize}

% --------------------
% 3. TECHNICAL SKILLS
% --------------------
\\section*{TECHNICAL SKILLS}
% AI: Select and categorize the user's most relevant skills based on the job description.
\\textbf{Programming Languages:} [List Languages e.g., Python, TypeScript, SQL] \\\\
\\textbf{Frameworks \& Libraries:} [List Frameworks e.g., React.js, Node.js, FastAPI] \\\\
\\textbf{Cloud \& DevOps:} [List DevOps Tools e.g., AWS, Kubernetes, Docker, CI/CD] \\\\
\\textbf{Databases:} [List Databases e.g., PostgreSQL, MongoDB, Firebase]

% --------------------
% 4. PROFESSIONAL EXPERIENCE
% --------------------
{{#if profileData.experience}}
\\section*{PROFESSIONAL EXPERIENCE}
{{#each profileData.experience}}
{{#if this.title}}
\\resitem{ {{{this.title}}} }{ {{{this.company}}} }{ {{#if this.startDate}}{{{this.startDate}}} -- {{/if}}{{{this.endDate}}} }
\\begin{itemize}
    % AI: Rewrite responsibilities to align with keywords from the job description. Use bullet points.
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
    % AI: Rewrite achievements to highlight relevant technologies and outcomes.
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
\\resitem{ {{{this.qualification}}} }{ {{{this.institute}}} }{ {{#if this.startDate}}{{{this.startDate}}} -- {{/if}}{{{this.endDate}}} }
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
