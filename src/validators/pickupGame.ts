import { z } from 'zod';

export const CreatePickupGameSchema = z.object({
  sport: z.string().min(2).max(50),
  title: z.string().min(2).max(100),
  description: z.string().min(2).max(300),
  location: z.string().min(2).max(300),
  date: z.string().date(),
  time: z.string().time(),
  maxPlayers: z.number().min(1).max(100),
  skillLevelRequired: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']),
});

export type CreatePickupGameBody = z.infer<typeof CreatePickupGameSchema>;
