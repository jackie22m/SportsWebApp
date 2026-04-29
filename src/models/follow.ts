import { AppDataSource } from '../dataSource.js';
import { Follow } from '../entities/follow.js';

const followRepository = AppDataSource.getRepository(Follow);

async function addFollow(followerId: string, followedId: string): Promise<Follow> {
  const follow = new Follow();
  follow.followerUserId = followerId;
  follow.followedUserId = followedId;

  return followRepository.save(follow);
}

async function removeFollow(followerId: string, followedId: string): Promise<void> {
  await followRepository.delete({ followerUserId: followerId, followedUserId: followedId });
}

async function isFollowing(followerId: string, followedId: string): Promise<boolean> {
  const follow = await followRepository.findOne({
    where: { followerUserId: followerId, followedUserId: followedId },
  });

  return follow !== null;
}

async function getFollowing(userId: string): Promise<Follow[]> {
  return followRepository.find({
    where: { followerUserId: userId },
    order: { dateFollowed: 'DESC' },
  });
}

async function getFollowers(userId: string): Promise<Follow[]> {
  return followRepository.find({
    where: { followedUserId: userId },
    order: { dateFollowed: 'DESC' },
  });
}

export { addFollow, getFollowers, getFollowing, isFollowing, removeFollow };
