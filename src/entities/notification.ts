import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity({ name: 'notification' })
export class Notification {
  @PrimaryColumn()
  notificationId: string;

  @BeforeInsert()
  generateCommentId(): void {
    this.notificationId = uuidv7();
  }

  @Column()
  userId: string;

  @Column()
  notifMessage: string;

  @Column()
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
