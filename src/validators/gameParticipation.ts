import { z } from 'zod';

export const CreateGameParticipationSchema = z.object({
  status: z.enum(['joined']),
  role: z.enum(['player']).default('player'),
});

export const UpdateParticipationStatusSchema = z.object({
  status: z.enum(['joined', 'left']),
});

export type CreateGameParticipationBody = z.infer<typeof CreateGameParticipationSchema>;
export type CreateUpdateParticipationStatusBody = z.infer<typeof CreateGameParticipationSchema>;
