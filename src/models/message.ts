import { AppDataSource } from '../dataSource.js';
import { Message } from '../entities/message.js';

const messageRepository = AppDataSource.getRepository(Message);

async function sendMessage(
  senderId: string,
  receiverId: string,
  messageText: string,
): Promise<Message> {
  const message = new Message();

  message.senderId = senderId;
  message.receiverId = receiverId;
  message.text = messageText;

  return messageRepository.save(message);
}

async function getConversation(userA: string, userB: string): Promise<Message[]> {
  return messageRepository
    .createQueryBuilder('message')
    .where(
      '(message.senderId = :userA AND message.receiverId = :userB) OR (message.senderId = :userB AND message.receiverId = :userA)',
      { userA, userB },
    )
    .orderBy('message.dateMessaged', 'ASC')
    .getMany();
}

async function markMessageRead(messageId: string): Promise<void> {
  await messageRepository.update({ messageId }, { isRead: true });
}

export { getConversation, markMessageRead, sendMessage };
