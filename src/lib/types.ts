import type { z } from 'zod';
import type { profileSchema, experienceSchema, educationSchema, projectSchema, certificationSchema, jobPostSchema, jobPostFormSchema } from '@/lib/validators';

export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type UserProfile = z.infer<typeof profileSchema> & { id?: string };
export type JobPost = z.infer<typeof jobPostSchema> & { id: string };
export type JobPostFormData = z.infer<typeof jobPostFormSchema>;


export const defaultProfile: UserProfile = {
  contactInfo: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    instagram: '',
    portfolio: '',
    other: '',
  },
  education: [{
    qualification: '',
    institute: '',
    startDate: '',
    endDate: '',
    achievements: '',
  }],
  experience: [{
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
  }],
  projects: [{
    name: '',
    date: '',
    achievements: '',
  }],
  certifications: [{
    name: '',
    organization: '',
    date: '',
    link: '',
    achievements: '',
    skillsAchieved: '',
  }],
  skills: [],
};

export const defaultJobPost: JobPostFormData = {
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    category: 'Tech',
    jobType: 'Full-time',
    applyLink: '',
    applyEmail: '',
};

    