import { z } from 'zod';

export const CreatePickupGameSchema = z.object({
  bio: z.string().min(2).max(300),
  sport: z.string().min(2).max(50),
  title: z.string().min(2).max(100),
  description: z.string().min(2).max(300),
  locationName: z.string().max(300),
  date: z.string(),
  time: z.string(),
  maxPlayers: z.number(),
  skillLevelRequired: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']),
});

export type CreatePickupGameBody = z.infer<typeof CreatePickupGameSchema>;
