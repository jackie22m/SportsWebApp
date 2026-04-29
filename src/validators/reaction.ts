import { z } from 'zod';

export const CreateReactionSchema = z.object({
  reactionType: z.enum(['like', 'love', 'laugh', 'angry']),
});

export type CreateReactionBody = z.infer<typeof CreateReactionSchema>;
