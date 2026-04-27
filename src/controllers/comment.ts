import { Request, Response } from 'express';
import { Comment } from '../entities/comment';
import { Comments, commentIdCounter } from '../models/comment';
import { createCommentSchema } from '../validators/comment';

//POST

export function createComment(req: Request, res: Response): void {
  const result = createCommentSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newComment: Comment = {
    id: String(commentIdCounter.value++),
    ...result.data,
    authorUserID: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  Comments.push(newComment);
  res.status(201).json(newComment);
}

//GET
export function getComments(req: Request, res: Response): void {
  const postId = req.params.postId;

  const postComments = Comments.filter((c) => c.postId === postId);

  res.status(200).json(postComments);
}
