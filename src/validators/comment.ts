import { z } from 'zod';

export const CreateCommentSchema = z.object({
  text: z.string().min(1),
});

export type CreateCommentBody = z.infer<typeof CreateCommentSchema>;
