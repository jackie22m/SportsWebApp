import { AppDataSource } from '../dataSource.js';
import { Post } from '../entities/post.js';
import { CreatePostBody } from '../validators/post.js';

const postRepository = AppDataSource.getRepository(Post);

async function addPost(userId: string, data: CreatePostBody): Promise<Post> {
  const post = new Post();

  post.userId = userId;

  post.type = data.type;
  post.text = data.text ?? null;
  post.mediaUrl = data.mediaUrl ?? null;
  post.sportsTag = data.sportsTag ?? null;
  post.topic = data.topic ?? null;
  post.visibility = data.visibility;

  return postRepository.save(post);
}

async function getPostById(postId: string): Promise<Post | null> {
  return postRepository.findOne({ where: { postId } });
}

async function listFeed(): Promise<Post[]> {
  return postRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.user', 'user')
    .leftJoinAndSelect('post.game', 'game')
    .orderBy('post.createdAt', 'DESC')
    .getMany();
}

async function filterPostsBySportTag(sportsTag: string): Promise<Post[]> {
  return postRepository
    .createQueryBuilder('posts')
    .where(`LOWER(post.sportsTag) = LOWER(:sportsTag)`, { sportsTag })
    .leftJoinAndSelect('post.user', 'user')
    .leftJoinAndSelect('post.game', 'game')
    .orderBy('post.createdAt', 'DESC')
    .getMany();
}

async function filterPostsByTopic(topic: string): Promise<Post[]> {
  return postRepository
    .createQueryBuilder('posts')
    .where(`LOWER(post.topic) = LOWER(:topic)`, { topic })
    .leftJoinAndSelect('post.user', 'user')
    .leftJoinAndSelect('post.game', 'game')
    .orderBy('post.createdAt', 'DESC')
    .getMany();
}

async function updatePost(postId: string, updates: Partial<Post>): Promise<Post | null> {
  await postRepository
    .createQueryBuilder()
    .update(Post)
    .set(updates)
    .where('postId = :postId', { postId })
    .execute();

  return postRepository.findOne({ where: { postId } });
}

async function deletePost(postId: string): Promise<void> {
  await postRepository.delete({ postId });
}

export {
  addPost,
  deletePost,
  filterPostsBySportTag,
  filterPostsByTopic,
  getPostById,
  listFeed,
  updatePost,
};
