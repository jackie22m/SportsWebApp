import { Request, Response } from 'express';
import {
  addComment,
  deleteComment,
  getComment,
  getCommentsForPost,
  updateComment,
} from '../models/comment.js';
import { getPostById } from '../models/post.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateCommentSchema } from '../validators/comment.js';

async function createComment(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  const { postId } = req.params;

  const result = CreateCommentSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  try {
    const newComment = await addComment(String(postId), auth.userId, result.data);
    res.status(201).json({ text: newComment.text, commentId: newComment.commentId }); // delete the comment ID after test
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function getCommentsForAPost(req: Request, res: Response): Promise<void> {
  const { postId } = req.params;

  const post = await getPostById(String(postId));
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }

  const comments = await getCommentsForPost(String(postId));
  res.status(200).json(comments.map((c) => c.text));
}

async function updateAComment(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { commentId } = req.params;

  const result = CreateCommentSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  try {
    const comment = await getComment(String(commentId));
    if (!comment) {
      res.status(404).json({ message: 'No comment' });
      return;
    }

    if (comment.userId !== auth.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const updatedComment = await updateComment(String(commentId), result.data);

    res.status(200).json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function deleteAComment(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { commentId } = req.params;

  const comment = await getComment(String(commentId));
  if (!comment) {
    res.status(404).json({ message: 'Comment not found' });
    return;
  }

  if (comment.userId !== auth.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  await deleteComment(String(commentId));
  res.status(204).json({ message: 'Comment deleted' });
}

export { createComment, deleteAComment, getCommentsForAPost, updateAComment };
