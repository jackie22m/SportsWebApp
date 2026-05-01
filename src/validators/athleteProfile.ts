import { z } from 'zod';

export const CreateAthleteProfileSchema = z.object({
  bio: z.string().min(2).max(300),
  primarySport: z.string().min(2).max(50),
  secondarySport: z.string().optional().or(z.literal('')),
  position: z.string().min(2).max(100),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']),
  location: z.string().min(2).max(100),
});

export const UpdateAthleteProfileSchema = z.object({
  bio: z.string().optional(),
  primarySport: z.string().optional(),
  secondarySport: z.string().optional().or(z.literal('')),
  position: z.string().optional(),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']).optional(),
  location: z.string().optional(),
});

export type CreateAthleteProfileBody = z.infer<typeof CreateAthleteProfileSchema>;
export type UpdateAthleteProfileBody = z.infer<typeof UpdateAthleteProfileSchema>;
