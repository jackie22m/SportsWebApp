import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from './User.js';
import { gameParticipation } from './gameParticipation.js';

@Entity({ name: 'pickupGame' })
export class pickupGame {
  @PrimaryColumn()
  gameId: string;

  @BeforeInsert()
  generateGameId(): void {
    this.gameId = uuidv7();
  }

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.pickupGames)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column()
  sport: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column()
  maxPlayers: number;

  @Column({
    type: 'enum',
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    default: 'Beginner',
  })
  skillLevelRequired: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';

  @OneToMany(() => gameParticipation, (gp) => gp.game)
  participants: Relation<gameParticipation[]>;
}
