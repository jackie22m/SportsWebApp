import { v7 as uuidv7 } from 'uuid';
import { User } from './User.js';
import { Post } from './post.js';

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'reaction' })
export class Reaction {
  @PrimaryColumn()
  reactionId: string;

  @BeforeInsert()
  generateReactionId(): void {
    this.reactionId = uuidv7();
  }

  @Column()
  postId: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: ['like', 'love', 'laugh', 'angry'],
    default: 'like',
  })
  reactionType: 'like' | 'love' | 'laugh' | 'angry';

  @CreateDateColumn()
  dateReacted: Date;

  // many reactions for a user
  @ManyToOne(() => User, (user) => user.reactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  // many reactiosn for a post
  @ManyToOne(() => Post, (post) => post.reactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Relation<Post>;
}
