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
import { pickupGame } from './pickupGame.js';

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

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  // RelatedPickupGameId Optional
  @Column({ nullable: true })
  gameId: string | null;

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
}
