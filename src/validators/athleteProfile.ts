import { z } from 'zod';

export const CreateAthleteProfileSchema = z.object({
  bio: z.string().min(2).max(300),
  primarySport: z.string().min(2).max(50),
  secondarySport: z.string().min(2).max(50).optional(),
  position: z.string().min(2).max(100),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']),
  locationCity: z.string().max(300).optional().default('Location Not Avalailable'),
});

export type CreateAthleteProfileBody = z.infer<typeof CreateAthleteProfileSchema>;
