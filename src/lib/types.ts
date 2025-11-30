import type { z } from 'zod';
import type { profileSchema, experienceSchema, educationSchema } from '@/lib/validators';

export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
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
  education: [],
  experience: [],
  skills: [],
};
