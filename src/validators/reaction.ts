import { z } from 'zod';

export const createReactionSchema = z.object({
  postId: z.string(),
  userId: z.string(),
  type: z.enum(['like', 'love', 'laugh', 'angry']),
});

export type CreateReactionBody = z.infer<typeof createReactionSchema>;
