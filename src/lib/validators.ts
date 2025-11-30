import { z } from 'zod';

export const profileSchema = z.object({
  contactInfo: z.object({
    name: z.string().min(1, 'Name is required.'),
    email: z.string().email('Invalid email address.'),
    phone: z.string().optional(),
    linkedin: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  }),
  education: z.array(z.string().min(1, "Education entry can't be empty.")),
  experience: z.array(z.string().min(1, "Experience entry can't be empty.")),
  skills: z.array(z.string().min(1, "Skill entry can't be empty.")),
});
