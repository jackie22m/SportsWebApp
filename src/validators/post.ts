import { z } from 'zod';

export const CreatePostSchema = z.object({
  type: z.enum(['Text', 'Media', 'Discussion', 'Highlight']),
  text: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  sportsTag: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  visibility: z.enum(['Public', 'Private']).default('Public'),
});

export const UpdatePostSchema = z.object({
  type: z.enum(['Text', 'Media', 'Discussion', 'Highlight']).optional(),
  text: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  sportsTag: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  visibility: z.enum(['Public', 'Private']).optional(),
});

export type CreatePostBody = z.infer<typeof CreatePostSchema>;
export type UpdatePostBody = z.infer<typeof UpdatePostSchema>;
