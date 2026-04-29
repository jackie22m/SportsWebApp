import { Request, Response } from 'express';
import { getConversation, sendMessage } from '../models/message.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateMessageSchema } from '../validators/message.js';

async function sendAMessage(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  const result = CreateMessageSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }
  const senderId = auth.userId;
  const { receiverId, text } = result.data;

  try {
    const messageSent = await sendMessage(senderId, receiverId, text);
    res.status(201).json({ message: 'Message sent', messageSent });
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function getAConversation(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  const { receiverId } = req.params;
  try {
    const messages = await getConversation(auth.userId, String(receiverId));
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

export { getAConversation, sendAMessage };
