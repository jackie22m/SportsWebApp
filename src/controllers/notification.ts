import { Request, Response } from 'express';
import { getNotifications, markNotificationAsRead } from '../models/notification.js';
import { parseDatabaseError } from '../utils/db-utils.js';

async function getAllNotifications(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const notifications = await getNotifications(auth.userId);
    res.status(204).send(notifications);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function markANotificationAsRead(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const { notificationId } = req.params;
    await markNotificationAsRead(String(notificationId));
    res.status(204).send({ message: 'Marked as read' });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}
export { getAllNotifications, markANotificationAsRead };
