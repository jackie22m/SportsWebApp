import { Request, Response } from 'express';
import {
  addFollow,
  getFollowers,
  getFollowing,
  isFollowing,
  removeFollow,
} from '../models/follow.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateFollowSchema } from '../validators/follow.js';

async function followAUser(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  const result = CreateFollowSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  const followerId = auth.userId;
  const { followedUserId } = result.data;

  if (followerId === followedUserId) {
    res.status(400).json({ message: 'You cannot follow yourself' });
    return;
  }

  try {
    const alreadyFollowing = await isFollowing(followerId, followedUserId);
    if (alreadyFollowing) {
      res.status(409).json({ message: 'Already following this user' });
      return;
    }

    const follow = await addFollow(followerId, followedUserId);
    res.status(201).json({ message: 'Followed user', follow });
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function unfollowAUser(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  const { followedUserId } = req.params;
  const followerId = auth.userId;

  try {
    const following = await isFollowing(followerId, String(followedUserId));
    if (!following) {
      res.status(404).json({ message: 'You are not following this user' });
      return;
    }

    await removeFollow(followerId, String(followedUserId));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function getUsersIFollow(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;

  try {
    const following = await getFollowing(String(userId));
    res.status(200).json(following);
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function getMyFollowers(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;

  try {
    const followers = await getFollowers(String(userId));
    res.status(200).json(followers);
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

export { followAUser, getMyFollowers, getUsersIFollow, unfollowAUser };
