import { z } from "zod";

export const createPostSchema = z.object({
  authorUserId: z.string(),
  type: z.enum(["text", "media", "disscussion", "highlight"]),
  text: z.string().optional(),
  mediaUrl: z.string().optional(),
  topic: z.string.optional(),
  relatedPickupGameId: z.string().optional(),
  visibilty: z.enum(["public", "friends", "private"])
});

export type CreatePostBody = z.infer<typeof createPostSchema>;