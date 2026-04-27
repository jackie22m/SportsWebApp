import { Request, Response } from 'express';
import { Reaction } from '../entities/reaction';
import { reactionIdCounter, reactions } from '../models/reaction';
import { createReactionSchema } from '../validators/reaction';

// POST
export function createReaction(req: Request, res: Response): void {
  const result = createReactionSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newReaction: Reaction = {
    id: String(reactionIdCounter.value++),
    ...result.data,
    postid: '',
  };

  reactions.push(newReaction);
  res.status(201).json(newReaction);
}

// GET
export function getReactions(req: Request, res: Response): void {
  const { postId, userId } = req.query;

  let filtered = reactions;

  if (postId) {
    filtered = filtered.filter((r) => r.postid == String(postId));
  }

  if (userId) {
    filtered = filtered.filter((r) => r.userId === String(userId));
  }

  res.status(200).json(filtered);
}
