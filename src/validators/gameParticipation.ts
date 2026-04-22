import { z } from 'zod';

export const CreateGameParticipationSchema = z.object({
  status: z.enum(['joined', 'left']),
});

export type CreateGameParticipationBody = z.infer<typeof CreateGameParticipationSchema>;
