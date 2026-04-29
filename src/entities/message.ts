import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity({ name: 'message' })
export class Message {
  @PrimaryColumn()
  messageId: string;

  @BeforeInsert()
  generateCommentId(): void {
    this.messageId = uuidv7();
  }

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column()
  text: string;

  @CreateDateColumn()
  dateMessaged: Date;

  @Column()
  isRead: boolean;
}
