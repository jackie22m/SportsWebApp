/**
 * createNotification(userId, type, message)
▪ getNotifications(userId)
▪ markNotificationAsRead(notificationId)
 */
import { AppDataSource } from '../dataSource.js';
import { Notification } from '../entities/notification.js';
import { CreateNotificationBody } from '../validators/notification.js';

const notificationRepository = AppDataSource.getRepository(Notification);

async function createNotification(
  userId: string,
  message: CreateNotificationBody,
): Promise<Notification> {
  const notification = new Notification();
  notification.userId = userId;
  notification.notifMessage = message.notifMessage;
  notification.isRead = false;
  return notificationRepository.save(notification);
}

async function getNotifications(userId: string): Promise<Notification[] | null> {
  return notificationRepository.find({ where: { userId } });
}

async function markNotificationAsRead(notificationId: string): Promise<void> {
  await notificationRepository.update({ notificationId }, { isRead: true });
}

export { createNotification, getNotifications, markNotificationAsRead };
