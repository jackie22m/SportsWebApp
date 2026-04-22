import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { athleteProfile } from './athleteProfile.js';
import { gameParticipation } from './gameParticipation.js';
import { pickupGame } from './pickupGame.js';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  userId: string;

  @BeforeInsert() generateId(): void {
    this.userId = uuidv7();
  }

  @Column({ unique: true })
  email: string;

  @Column() passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column() name: string;

  @CreateDateColumn() createdAt: Date;

  @CreateDateColumn({ nullable: true }) lastLoginAt: Date;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: 'user' | 'admin';

  @Column({
    type: 'enum',
    enum: ['active', 'disabled'],
    default: 'active',
  })
  status: 'active' | 'disabled';

  // One user can have only one athlete profiles
  @OneToOne(() => athleteProfile, (profile) => profile.user)
  athleteProfile: Relation<athleteProfile>;

  // One user can have multi pickup games
  @OneToMany(() => pickupGame, (pickupGame) => pickupGame.user)
  pickupGames: Relation<pickupGame[]>;

  // User can be in multiple participations
  @OneToMany(() => gameParticipation, (gameParticipation) => gameParticipation.user)
  gameParticipations: Relation<gameParticipation[]>;
}
