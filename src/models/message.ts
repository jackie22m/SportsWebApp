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

async function getAllConversations(userId: string): Promise<Message[]> {
  return messageRepository
    .createQueryBuilder('message')
    .select([
      'message.messageId',
      'message.text',
      'message.dateMessaged',
      'sender.userId',
      'sender.name',
      'receiver.userId',
      'recei3er.name',
    ])
    .leftJoin('message.sender', 'sender')
    .leftJoin('message.receiver', 'receiver')
    .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
    .orderBy('message.dateMessaged', 'DESC')
    .getMany();
}

async function markMessageRead(messageId: string): Promise<void> {
  await messageRepository.update({ messageId }, { isRead: true });
}

export { getAllConversations, getConversation, markMessageRead, sendMessage };
