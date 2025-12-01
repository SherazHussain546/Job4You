import type { z } from 'zod';
import type { profileSchema, experienceSchema, educationSchema, projectSchema, certificationSchema } from '@/lib/validators';

export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type UserProfile = z.infer<typeof profileSchema> & { id?: string };

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
    achievements: '',
  }],
  experience: [{
    title: '',
    company: '',
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
