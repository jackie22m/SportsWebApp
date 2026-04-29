import { AppDataSource } from '../dataSource.js';
import { Reaction } from '../entities/reaction.js';
import { CreateReactionBody } from '../validators/reaction.js';

const reactionRepository = AppDataSource.getRepository(Reaction);

async function addReaction(
  postId: string,
  userId: string,
  data: CreateReactionBody,
): Promise<Reaction> {
  const reaction = new Reaction();
  reaction.postId = postId;
  reaction.userId = userId;
  reaction.reactionType = data.reactionType;

  return reactionRepository.save(reaction);
}
async function getReactionById(reactionId: string): Promise<Reaction | null> {
  return reactionRepository.findOne({ where: { reactionId } });
}

async function getReactionsForPost(postId: string): Promise<Reaction[]> {
  return reactionRepository
    .createQueryBuilder('reaction')
    .where('reaction.postId = :postId', { postId })
    .orderBy('reaction.dateReacted', 'DESC')
    .getMany();
}

async function updateReaction(
  reactionId: string,
  updates: Partial<Reaction>,
): Promise<Reaction | null> {
  await reactionRepository
    .createQueryBuilder('reaction')
    .update(Reaction)
    .set(updates)
    .where('"reaction"."reactionId" = :reactionId', { reactionId })
    .execute();

  return reactionRepository.findOne({ where: { reactionId } });
}

async function removeReaction(reactionId: string): Promise<void> {
  await reactionRepository.delete({ reactionId });
}

async function getReactionByUserAndPost(userId: string, postId: string): Promise<Reaction[]> {
  return reactionRepository
    .createQueryBuilder('reaction')
    .where('reaction.userId = :userId', { userId })
    .andWhere('reaction.postId = :postId', { postId })
    .orderBy('reaction.dateReacted', 'DESC')
    .getMany();
}

export {
  addReaction,
  getReactionById,
  getReactionByUserAndPost,
  getReactionsForPost,
  removeReaction,
  updateReaction,
};
