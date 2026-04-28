import { Request, Response } from 'express';
import { Post } from '../entities/post.js';
import {
  addPost,
  deletePost,
  filterPostsBySportTag,
  filterPostsByTopic,
  getPostById,
  listFeed,
  updatePost,
} from '../models/post.js';

import { parseDatabaseError } from '../utils/db-utils.js';
import { CreatePostSchema } from '../validators/post.js';

async function createPost(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }
  const result = CreatePostSchema.safeParse(req.body);

  try {
    const newPost = await addPost(auth.userId, result.data);

    res.status(201).json({ mesage: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAPost(req: Request, res: Response): Promise<void> {
  const { postId } = req.params;
  const post = await getPostById(String(postId));

  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }
  res.status(200).json(post);
}

async function getFeed(req: Request, res: Response): Promise<void> {
  try {
    const posts = await listFeed();
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to fetch posts',
    });
  }
}
async function getPostsBySportsTag(req: Request, res: Response): Promise<void> {
  const { sportsTag } = req.query;
  try {
    // If no sport query param, return all games
    if (!sportsTag) {
      const allPosts = await listFeed();
      res.status(200).json(allPosts);
      return;
    }

    // sport is a string | string[] | undefined, so cast it
    const sportsTagString = String(sportsTag);

    const posts = await filterPostsBySportTag(sportsTagString);

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
}

async function getPostsByTopic(req: Request, res: Response): Promise<void> {
  const { topic } = req.query;
  try {
    if (!topic) {
      const allPosts = await listFeed();
      res.status(200).json(allPosts);
      return;
    }

    // sport is a string | string[] | undefined, so cast it
    const topicString = String(topic);

    const posts = await filterPostsByTopic(topicString);

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
}

async function updateAPost(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { postId } = req.params;

  const result = CreatePostSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  try {
    const post = await getPostById(String(postId));
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.userId !== auth.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const updates: Partial<Post> = result.data;

    const updatedPost = await updatePost(String(postId), updates);
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function deleteAPost(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { postId } = req.params;

  const post = await getPostById(String(postId));
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }

  if (post.userId !== auth.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  await deletePost(String(postId));

  res.sendStatus(204);
}

export {
  createPost,
  deleteAPost,
  getAPost,
  getFeed,
  getPostsBySportsTag,
  getPostsByTopic,
  updateAPost,
};
