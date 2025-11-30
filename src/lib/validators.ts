import { z } from 'zod';

const optionalUrl = z.string().url('Must be a valid URL.').optional().or(z.literal(''));

export const experienceSchema = z.object({
  title: z.string().min(1, 'Job title is required.'),
  company: z.string().min(1, 'Company name is required.'),
  responsibilities: z.string().min(1, 'Responsibilities are required.'),
});

export const educationSchema = z.object({
  qualification: z.string().min(1, 'Qualification is required.'),
  institute: z.string().min(1, 'Institute name is required.'),
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
});

export const profileSchema = z.object({
  contactInfo: z.object({
    name: z.string().min(1, 'Name is required.'),
    email: z.string().email('Invalid email address.'),
    phone: z.string().optional(),
    linkedin: optionalUrl,
    github: optionalUrl,
    instagram: optionalUrl,
    portfolio: optionalUrl,
    other: optionalUrl,
  }),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
  skills: z.array(z.string().min(1, "Skill entry can't be empty.")),
});
