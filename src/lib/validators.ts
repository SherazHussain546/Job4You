
import { z } from 'zod';

const optionalUrl = z.string().url('Must be a valid URL.').optional().or(z.literal(''));

export const experienceSchema = z.object({
  title: z.string().min(1, 'Job title is required.'),
  company: z.string().min(1, 'Company name is required.'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  responsibilities: z.string().min(1, 'Responsibilities are required.'),
});

export const educationSchema = z.object({
  qualification: z.string().min(1, 'Qualification is required.'),
  institute: z.string().min(1, 'Institute name is required.'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  achievements: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  date: z.string().optional(),
  achievements: z.string().min(1, 'Achievements are required.'),
});

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required.'),
  organization: z.string().min(1, 'Issuing organization is required.'),
  date: z.string().optional(),
  link: optionalUrl,
  achievements: z.string().optional(),
  skillsAchieved: z.string().optional(),
});

export const profileSchema = z.object({
  contactInfo: z.object({
    name: z.string().min(1, 'Name is required.'),
    email: z.string().email('Invalid email address.'),
    phone: z.string().min(1, 'Phone number is required.'),
    linkedin: optionalUrl,
    github: optionalUrl,
    instagram: optionalUrl,
    portfolio: optionalUrl,
    other: optionalUrl,
  }),
  education: z.array(educationSchema).min(1, 'At least one education entry is required.'),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
  skills: z.array(z.string().min(1, "Skill entry can't be empty.")).min(3, 'At least three skills are required.'),
});

// Base schema for a job post without refinement
export const baseJobPostSchema = z.object({
    jobTitle: z.string().min(3, 'Job title must be at least 3 characters.'),
    companyName: z.string().min(1, 'Company name is required.'),
    jobDescription: z.string().min(20, 'Description must be at least 20 characters.'),
    category: z.enum(['Tech', 'Pharmacy', 'Engineering', 'Design', 'Marketing', 'Retail', 'Other']),
    jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']),
    applyLink: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
    applyEmail: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
});

// Schema for the full job post object, including the refinement for application method
export const jobPostSchema = baseJobPostSchema.extend({
    postedBy: z.string(),
    posterId: z.string(),
    posterEmail: z.string().email(),
    createdAt: z.any(), // Firestore serverTimestamp will be used here
    status: z.enum(['pending', 'approved', 'rejected']),
});

// Schema for the job post form, which also checks for at least one application method
export const jobPostFormSchema = baseJobPostSchema.refine(data => data.applyLink || data.applyEmail, {
    message: "Either an application link or an email is required.",
    path: ["applyLink"], // Show error on the first of the related fields
});
