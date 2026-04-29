import { Request, Response } from 'express';
import {
  addReaction,
  getReactionById,
  getReactionsForPost,
  removeReaction,
  updateReaction,
} from '../models/reaction.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateReactionSchema } from '../validators/reaction.js';

async function addAReaction(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  const { postId } = req.params;

  const result = CreateReactionSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  try {
    const newReaction = await addReaction(String(postId), auth.userId, result.data);
    res.status(201).json({ message: 'Reaction added', reaction: newReaction });
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function getReactionsForAPost(req: Request, res: Response): Promise<void> {
  const { postId } = req.params;

  const reactions = await getReactionsForPost(String(postId));
  res.status(200).json(reactions.map((r) => r.reactionType));
}

async function updateAReaction(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { reactionId } = req.params;

  const result = CreateReactionSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  try {
    const reaction = await getReactionById(String(reactionId));
    if (!reaction) {
      res.status(404).json({ message: 'No reaction' });
      return;
    }

    if (reaction.userId !== auth.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const updatedReaction = await updateReaction(String(reactionId), result.data);
    res.status(200).json(updatedReaction);
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function deleteAReaction(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { reactionId } = req.params;

  const reaction = await getReactionById(String(reactionId));
  if (!reaction) {
    res.status(404).json({ message: 'Reaction not found' });
    return;
  }

  if (reaction.userId !== auth.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  await removeReaction(String(reactionId));
  res.status(204).send();
}

export { addAReaction, deleteAReaction, getReactionsForAPost, updateAReaction };
