import { z } from 'zod';

export const CreateFollowSchema = z.object({
  followedUserId: z.uuidv7(),
});

export type CreateFollowBody = z.infer<typeof CreateFollowSchema>;
