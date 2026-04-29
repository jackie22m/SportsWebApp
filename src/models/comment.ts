import { AppDataSource } from '../dataSource.js';
import { Comment } from '../entities/comment.js';
import { CreateCommentBody } from '../validators/comment.js';

const commentRepository = AppDataSource.getRepository(Comment);

async function addComment(
  postId: string,
  userId: string,
  data: CreateCommentBody,
): Promise<Comment> {
  const comment = new Comment();

  comment.postId = postId;
  comment.userId = userId;
  comment.text = data.text;

  return commentRepository.save(comment);
}

async function getComment(commentId: string): Promise<Comment | null> {
  return commentRepository.findOne({ where: { commentId } });
}

async function getCommentsForPost(postId: string): Promise<Comment[]> {
  return commentRepository
    .createQueryBuilder('comment')
    .where('comment.postId = :postId', { postId })
    .orderBy('comment.createdAt', 'DESC')
    .getMany();
}

async function updateComment(
  commentId: string,
  updates: Partial<Comment>,
): Promise<Comment | null> {
  await commentRepository
    .createQueryBuilder('comment')
    .update(Comment)
    .set(updates)
    .where('"comment"."commentId" = :commentId', { commentId })
    .execute();

  return commentRepository.findOne({ where: { commentId } });
}

async function deleteComment(commentId: string): Promise<void> {
  await commentRepository.delete({ commentId });
}

export { addComment, deleteComment, getComment, getCommentsForPost, updateComment };
