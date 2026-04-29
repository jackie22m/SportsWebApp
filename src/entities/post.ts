import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from './User.js';
import { Comment } from './comment.js';
import { pickupGame } from './pickupGame.js';
import { Reaction } from './reaction.js';

@Entity({ name: 'post' })
export class Post {
  @PrimaryColumn()
  postId: string;

  @BeforeInsert()
  generatePostId(): void {
    this.postId = uuidv7();
  }

  // Foreign key to User
  @Column()
  userId: string;

  // many posts for 1 user
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  // RelatedPickupGameId Optional
  @Column({ nullable: true })
  gameId: string | null;

  // many pickupGames for 1 user
  @ManyToOne(() => pickupGame, (game) => game.posts, { nullable: true })
  @JoinColumn({ name: 'gameId' })
  game: Relation<pickupGame> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: ['Text', 'Media', 'Discussion', 'Highlight'],
  })
  type: 'Text' | 'Media' | 'Discussion' | 'Highlight';

  @Column({ nullable: true })
  text: string | null;

  @Column({ nullable: true })
  mediaUrl: string | null;

  @Column({ nullable: true })
  sportsTag: string | null;

  @Column({ nullable: true })
  topic: string | null;

  @Column({
    type: 'enum',
    enum: ['Public', 'Private'],
    default: 'Public',
  })
  visibility: 'Public' | 'Private';

  // one post can have many comments
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Relation<Comment[]>;

  // One post can have many reaction
  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions: Relation<Reaction[]>;
}
