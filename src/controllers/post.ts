import { Request, Response } from 'express';
import { Post } from '../entities/post';
import { postIdCounter, posts } from '../models/post';
import { createPostSchema } from '../validators/post';

//POST
export function createPost(req: Request, res: Response): void {
  const result = createPostSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newPost: Post = {
    id: String(postIdCounter.value++),
    authorUserId: String(postIdCounter.value++),
    type: result.data.type,
    text: result.data.text,
    mediaURL: result.data.mediaURL,
    sportTag: result.data.sportTag,
    topic: result.data.topic,
    relatedPickupGameId: result.data.relatedPickupGameId,
    createdAt: new Date(),
    updatedAt: new Date(),
    visibility: result.data.visibility,
  };

  posts.push(newPost);
  res.status(201).json(newPost);
}

//GET
export function getPost(req: Request, res: Response): void {
  const postId = String(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json(posts);
}
