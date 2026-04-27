import { z } from 'zod';

export const createCommentSchema = z.object({
  postId: z.string(),
  authorId: z.string(),
  text: z.string().min(1),
});

export type CreateCommentBody = z.infer<typeof createCommentSchema>;
