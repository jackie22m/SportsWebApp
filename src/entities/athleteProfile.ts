import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { User } from './User.js';

@Entity({ name: 'athleteProfile' })
export class athleteProfile {
  @PrimaryColumn()
  userId: string; // same userId as User.userId

  @CreateDateColumn() createdAt: Date;

  @CreateDateColumn() updatedAt: Date;

  @Column()
  bio: string;

  @Column()
  primarySport: string;

  @Column({ nullable: true })
  secondarySport: string;

  @Column()
  position: string;

  @Column({
    type: 'enum',
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    default: 'Beginner',
  })
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';

  @Column()
  location: string;

  @OneToOne(() => User, (user) => user.athleteProfile)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;
}
