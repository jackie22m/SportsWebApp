import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from './User.js';
import { Post } from './post.js';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryColumn()
  commentId: string;

  @BeforeInsert()
  generateCommentId(): void {
    this.commentId = uuidv7();
  }

  @Column()
  postId: string;

  // Foreign key to User
  @Column()
  userId: string;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Relation<Post>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
