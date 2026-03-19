import { z } from 'zod';

export const createPostSchema = z.object({
  authorUserId: z.string(),
  type: z.enum(['text', 'media', 'disscussion', 'highlight']),
  text: z.string().optional(),
  mediaURL: z.string().optional(),
  topic: z.string().optional(),
  sportTag: z.string().optional(),
  relatedPickupGameId: z.string().optional(),
  visibility: z.enum(['public', 'friends', 'private']),
});

export type CreatePostBody = z.infer<typeof createPostSchema>;
