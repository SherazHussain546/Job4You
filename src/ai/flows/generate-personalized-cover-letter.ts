
'use server';

/**
 * @fileOverview Generates a personalized cover letter in LaTeX format using a unified AI service.
 */
import { z } from 'zod';
import { callGenerativeAI } from '../unified-ai-service';

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

const getPrompt = (input: GeneratePersonalizedCoverLetterInput): string => {
    const { profileData, jobDescription } = input;
    const userName = profileData.contactInfo?.name || '';
    
    const contactParts: string[] = [];
    if (profileData.contactInfo) {
      if (profileData.contactInfo.phone) {
          contactParts.push(`${profileData.contactInfo.phone}`);
      }
      if (profileData.contactInfo.email) {
          contactParts.push(`\\href{mailto:${profileData.contactInfo.email}}{${profileData.contactInfo.email}}`);
      }
      if (profileData.contactInfo.linkedin) {
          contactParts.push(`\\href{https://${profileData.contactInfo.linkedin}}{LinkedIn Profile}`);
      }
    }
    const contactSection = contactParts.join(' \\\\ \n');

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

Your task is to generate a compelling, professional cover letter in LaTeX format.
Your writing must be flawless, with no grammatical errors, and maintain a highly professional tone.
You must use the provided user profile data and tailor it to the given job description.
The final output must be only a JSON object with a single key "latexCode" containing the LaTeX code as a string, starting with \\documentclass and ending with \\end{document}.

User Profile:
- Name: ${userName}
- Contact Details: ${JSON.stringify(profileData.contactInfo, null, 2)}
- Education: ${JSON.stringify(profileData.education, null, 2)}
- Experience: ${JSON.stringify(profileData.experience, null, 2)}
- Projects: ${JSON.stringify(profileData.projects, null, 2)}
- Certifications: ${JSON.stringify(profileData.certifications, null, 2)}
- Skills: ${profileData.skills.join(', ')}

Job Description:
${jobDescription}

AI Actions:
1.  Extract the Job Title, Company Name, and Hiring Manager's Name from the job description. If Hiring Manager is not found, use "Hiring Team".
2.  Generate a compelling opening paragraph introducing the user and stating the role they're applying for.
3.  Write 2-3 body paragraphs. For these paragraphs, you must be highly selective. Analyze the job description and the user's profile, then choose the single most relevant project or work experience to highlight. To ensure a high ATS score, you must subtly weave in details from at least 3 relevant work experiences, 3 relevant projects, and 4 relevant certifications from the user's profile. Connect the user's skills and achievements from these examples directly to the key requirements of the job. Use quantifiable achievements where possible. Do not list everything; choose the best and integrate them naturally into a narrative.
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
\\textbf{ ${userName} } \\\\
${contactSection}

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
I am particularly excited about [Mention a specific company product, project, or value you researched] and see a direct opportunity to leverage my expertise in [Mention 1-2 key skills from your profile, e.g., Generative AI] to contribute to this area. I am ready to bring my energy, commitment to excellence, and a collaborative spirit to your team.

Thank you for your time and consideration. I have attached my resume for your review and look forward to the opportunity to discuss how my competencies can drive success at [Company Name].

\\vspace{10pt}

Sincerely, \\\\
${userName}

\\end{document}
`;
};

const getFallbackLatex = (input: GeneratePersonalizedCoverLetterInput): string => {
    const { profileData } = input;
    const userName = profileData.contactInfo?.name || '';
    const contactParts: string[] = [];
    if (profileData.contactInfo) {
        if (profileData.contactInfo.phone) {
            contactParts.push(`${profileData.contactInfo.phone}`);
        }
        if (profileData.contactInfo.email) {
            contactParts.push(`\\href{mailto:${profileData.contactInfo.email}}{${profileData.contactInfo.email}}`);
        }
        if (profileData.contactInfo.linkedin) {
            contactParts.push(`\\href{https://${profileData.contactInfo.linkedin}}{LinkedIn Profile}`);
        }
    }
    const contactSection = contactParts.join(' \\\\ \n');

    return `
\\documentclass[10pt, a4paper]{article}
\\usepackage[T1]{fontenc}
\\usepackage{mathptmx}
\\usepackage[a4paper, top=1.0in, bottom=1.0in, left=1.0in, right=1.0in]{geometry}
\\usepackage{hyperref}
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

\\raggedright
\\textbf{${userName}} \\\\
${contactSection}

\\vspace{10pt}

\\today \\\\

\\vspace{10pt}

\\textbf{[Hiring Manager Name/Hiring Team]} \\\\
\\textbf{[Company Name]} \\\\
\\textbf{[Company Address]} \\\\

\\vspace{10pt}

\\textbf{Subject: Application for [Job Title]}

\\vspace{10pt}

Dear [Mr./Ms./Mx. Last Name or Hiring Team],

I am writing to express my interest in the [Job Title] position I saw advertised on [Platform where you saw the advertisement]. Given my background in [mention your field, e.g., software development, marketing], I am confident I possess the skills and experience you are looking for.

In my previous roles, I have had the opportunity to [mention 1-2 key responsibilities or achievements from your profile]. I am adept at [mention 1-2 key skills from your profile]. I am eager to bring my abilities to your organization and contribute to your team.

Thank you for your time and consideration. My resume is attached for your review, and I look forward to hearing from you soon.

\\vspace{10pt}

Sincerely, \\\\
${userName}

\\end{document}
    `;
};


export async function generatePersonalizedCoverLetter(
  input: GeneratePersonalizedCoverLetterInput
): Promise<GeneratePersonalizedCoverLetterOutput> {
    try {
        const prompt = getPrompt(input);
        const content = await callGenerativeAI(prompt);
        // It's possible the AI returns a non-JSON string, so we need to be careful
        let parsedOutput;
        if (content.includes('{') && content.includes('}')) {
            const jsonString = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
            parsedOutput = JSON.parse(jsonString);
        } else {
            throw new Error("AI response did not contain a valid JSON object.");
        }
        return GeneratePersonalizedCoverLetterOutputSchema.parse(parsedOutput);
    } catch (e: any) {
        console.warn("AI generation for cover letter failed, falling back to template:", e.message);
        const fallbackLatex = getFallbackLatex(input);
        return { latexCode: fallbackLatex };
    }
}
