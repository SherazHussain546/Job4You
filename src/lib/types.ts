import type { z } from 'zod';
import type { profileSchema } from '@/lib/validators';

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
