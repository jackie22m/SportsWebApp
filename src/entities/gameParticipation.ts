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
import { v7 as uuidv7 } from 'uuid';
import { pickupGame } from './pickupGame.js';
import { User } from './User.js';

@Entity({ name: 'gameParticipation' })
export class gameParticipation {
  @PrimaryColumn()
  participationId: string;

  @BeforeInsert()
  generateParticipationId(): void {
    this.participationId = uuidv7();
  }

  // Foreign key to User
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.gameParticipations)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  // Foreign key to pickupGame
  @Column()
  gameId: string;

  @ManyToOne(() => pickupGame, (game) => game.participants)
  @JoinColumn({ name: 'gameId' })
  game: Relation<pickupGame>;

  @Column({
    type: 'enum',
    enum: ['joined', 'left'],
    default: 'joined',
  })
  status: 'joined' | 'left';

  @Column({
    type: 'enum',
    enum: ['organizer', 'player'],
    default: 'player',
  })
  role: 'organizer' | 'player';

  @CreateDateColumn() joinedAt: Date;
}
