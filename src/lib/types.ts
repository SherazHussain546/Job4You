import type { z } from 'zod';
import type { profileSchema } from '@/lib/validators';

export type UserProfile = z.infer<typeof profileSchema>;

export const defaultProfile: UserProfile = {
  contactInfo: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
  },
  education: [],
  experience: [],
  skills: [],
};
