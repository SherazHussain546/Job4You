'use server';

/**
 * @fileOverview Tailors a user's resume to a specific job description using OpenAI.
 */
import "dotenv/config";
import { z } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

function getPrompt(input: TailorResumeToJobDescriptionInput): string {
    const { profileData, jobDescription } = input;
    
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
    
    return `You are an expert Hiring Manager and ATS Optimization Specialist. Your goal is to generate resumes and cover letters that score 90+ on Applicant Tracking Systems (ATS) while remaining compelling to human readers. When analyzing user data against a job description, adhere to the following criteria for what makes the 'Best' application:

1. The Perfect ATS-Optimized Resume

    Exact Keyword Matching: You must extract ‘Hard Skills’ (e.g., Python, Salesforce, GAAP) and ‘Soft Skills’ (e.g., Stakeholder Management, Strategic Planning) directly from the Job Description (JD) and naturally weave them into the resume summary and bullet points.

    Action-Oriented & Quantifiable: Every bullet point should follow the structure: Action Verb + Task + Result (Metric). Quantify your wins: Add dollar signs ($) and percentages (%) to your bullet points to simulate the "multi-million dollar portfolio" requirement, even if on a smaller scale.

        Bad: "Responsible for sales."

        Best: "Drove 20% revenue growth (Action + Metric) by implementing a new CRM strategy (Keyword) within 6 months."

    Standardized Section Headings: Use standard headers that parsers recognize immediately: "Professional Experience," "Education," "Technical Skills," and "Contact Information." Avoid creative headers like "My Journey" or "What I Do."

    Reverse-Chronological Layout: Always list experience from newest to oldest. This is the primary format ATS algorithms are programmed to read.

    Contextualizing Gaps: If the user has an employment gap, focus on relevant projects, freelance work, or upskilling (certifications) during that time to maintain keyword density.

    Clean Parsing Format:

        No Columns or Text Boxes: These often scramble text in parsers. Use a single-column layout.

        No Graphics or Tables: Data inside tables is often invisible to older ATS scanners.

        Standard Fonts: Use high-readability fonts like Arial, Calibri, Roboto, or Helvetica.

    Standard Date Formats: Use "Month Year" (e.g., "August 2023") or "MM/YYYY". Avoid "Summer 2023" as parsers struggle to calculate total years of experience from seasons.

2. The Perfect ATS-Optimized Cover Letter

    The "Hook" (Paragraph 1): Immediately state the specific Job Title and Company Name. Mention a specific achievement or passion that aligns with the company’s mission (found in the JD).

    The "Bridge" (Paragraph 2): Do not copy-paste the resume. Instead, select the top 2-3 requirements from the JD and narrate a short story of how the candidate successfully handled similar challenges in the past.

    Keyword Integration: Subtly repeat the top 3 critical keywords from the job description to ensure the cover letter is searchable within the ATS database.

    Cultural Fit (Paragraph 3): Demonstrate research into the company. Mention their recent news, values, or specific technologies they use.

    Strong Call to Action (Closing): confident requesting of an interview, followed by a professional sign-off.

3. The "Do Not" List (Negative Constraints)

    No "Fluff" Adjectives: Avoid words like "Hard-working," "Go-getter," or "Synergy" unless accompanied by proof.

    No Headers/Footers for Critical Info: Some parsers ignore header/footer text. Keep contact info in the main body.

    No Functional Resumes: Do not group by "Skill" instead of "Time." ATS scanners prioritize the standard chronological work history.

Your task is to generate a complete, ATS-optimized resume in LaTeX format that can be up to two pages long.
Your writing must be grammatically perfect and use a highly professional tone.
You must analyze the user's profile data and the job description to create a resume that is powerfully tailored for the specific role.
The final output must be only a JSON object with a single key "latexCode" containing the LaTeX code as a string, starting with \\documentclass and ending with \\end{document}.

Your AI actions are:
1.  Generate a professional, one-sentence title for the user that mirrors the job title from the job description (e.g., "Full-Stack Software Engineer & AI/Cloud Developer").
2.  Create a "PROFESSIONAL SUMMARY" with 3-4 bullet points. Each point must be a concise, impactful statement that highlights the user's most relevant qualifications and skills, directly aligning with the key requirements in the job description.
3.  For the "TECHNICAL SKILLS" section, create a highly relevant and comprehensive skill set. Choose skills from the user's profile that are explicitly mentioned or strongly implied in the job description, and categorize them logically to showcase expertise.
4.  For "PROFESSIONAL EXPERIENCE," select at least 3 of the most relevant roles from the user's profile. For each role, you must write exactly 3 bullet points. Each bullet point must be an impactful, rewritten achievement that uses powerful action verbs, quantifies results where possible, and directly maps to the needs in the job description.
5.  For "DEVELOPMENT PROJECTS," select at least 3 of the most relevant projects from the user's profile. For each project, you must write exactly 3 bullet points. These bullet points must highlight the technologies used and outcomes achieved, aligning them with the job's requirements.
6.  For "CERTIFICATES & TRAINING," select at least 4 of the most relevant certifications from the user's profile.
7.  Conditionally render sections only if there is relevant data to show (e.g., if no selected projects are relevant, do not include the PROJECTS section).

Job Description:
${jobDescription}

User Profile:
- Name: ${profileData.contactInfo.name}
- Contact Details: ${JSON.stringify(profileData.contactInfo, null, 2)}
- Education: ${JSON.stringify(profileData.education, null, 2)}
- Experience: ${JSON.stringify(profileData.experience, null, 2)}
- Projects: ${JSON.stringify(profileData.projects, null, 2)}
- Certifications: ${JSON.stringify(profileData.certifications, null, 2)}
- Skills: ${profileData.skills.join(', ')}


% ATS-Optimized Resume Template: ${profileData.contactInfo.name}
% Designed for maximum parsing reliability by using simple document structure,
% standard sectioning, and minimal custom formatting.
% Return ONLY a JSON object with a "latexCode" field.

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
    {\\Huge \\textbf{ ${profileData.contactInfo.name} }} \\\\
    % AI: Generate a professional title based on the Job Description.
    \\textbf{[Generated Professional Title e.g., Full-Stack Software Engineer & AI/Cloud Developer]} \\\\
    \\vspace{2pt}
    ${contactSection}
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
\\textbf{AI/ML & Automation:} [List AI Skills] \\\\
\\textbf{Web Technologies:} [List Web Skills] \\\\
\\textbf{Cloud & Databases:} [List Cloud & DB Skills] \\\\
\\textbf{GTM & Analytics:} [List Business Skills]

% --------------------
% 4. PROFESSIONAL EXPERIENCE
% --------------------
% AI: This section should only be included if relevant experience exists in the profile.
\\section*{PROFESSIONAL EXPERIENCE}
% AI: Iterate over at least 3 of the most relevant experiences. For each, write exactly 3 bullet points.
\\resitem{ [Job Title] }{ [Company] }{ [Dates] }
\\begin{itemize}
    % AI: Rewrite responsibilities into 3 impactful bullet points aligned with job description keywords.
    \\item [Rewritten, impactful responsibility 1]
    \\item [Rewritten, impactful responsibility 2]
    \\item [Rewritten, impactful responsibility 3]
\\end{itemize}

% --------------------
% 5. DEVELOPMENT PROJECTS
% --------------------
% AI: This section should only be included if relevant projects exist in the profile.
\\section*{DEVELOPMENT PROJECTS}
% AI: Iterate over at least 3 of the most relevant projects. For each, write exactly 3 bullet points.
\\resitem{ [Project Name] }{ [Project Description/Tagline] }{ [Date] }
\\begin{itemize}
    % AI: Rewrite achievements into 3 impactful bullet points highlighting relevant tech and outcomes.
    \\item [Rewritten, impactful achievement 1]
    \\item [Rewritten, impactful achievement 2]
    \\item [Rewritten, impactful achievement 3]
\\end{itemize}

% --------------------
% 6. EDUCATION & CERTIFICATES
% --------------------
\\section*{EDUCATION}
% AI: Iterate over education history.
\\resitem{ [Degree] }{ [University] }{ [Dates] }
\\begin{itemize}
    % AI: Optionally include achievements, awards, etc.
    \\item [Achievement, e.g., Awards: Peer-Mentor Leadership Award (with Distinction).]
\\end{itemize}

% AI: This section should only be included if relevant certifications exist.
\\section*{CERTIFICATES \& TRAINING}
\\begin{itemize}
% AI: Iterate over at least 4 relevant certifications.
    \\item \\textbf{ [Certification Name] } from \\textbf{ [Organization] } \\textit{[Optional: Skills shown]}
\\end{itemize}

\\end{document}
`;
}


export async function tailorResumeToJobDescription(
  input: TailorResumeToJobDescriptionInput
): Promise<TailorResumeToJobDescriptionOutput> {
    try {
        const prompt = getPrompt(input);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('AI returned an empty response.');
        }

        const parsedOutput = JSON.parse(content);
        return TailorResumeToJobDescriptionOutputSchema.parse(parsedOutput);
    } catch (e: any) {
        console.error("Failed to generate or parse AI response for resume:", e);
        throw new Error(`AI generation failed: ${e.message}`);
    }
}
