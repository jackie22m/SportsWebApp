import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity({ name: 'follow' })
export class Follow {
  @PrimaryColumn()
  followId: string;

  @BeforeInsert()
  generateCommentId(): void {
    this.followId = uuidv7();
  }

  @Column()
  followerUserId: string;

  @Column()
  followedUserId: string;

  @CreateDateColumn()
  dateFollowed: Date;
}
