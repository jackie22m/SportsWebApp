import { Request, Response } from 'express';
import { User } from '../entities/User.js';
import { userIdCounter, users } from '../models/User.js';
import { CreateUserSchema } from '../validators/User.js';

export function createUser(req: Request, res: Response): void {
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newUser: User = {
    id: String(userIdCounter.value++),
    name: result.data.name,
    displayName: result.data.displayName,
    email: result.data.email,
    password: result.data.password,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    role: 'Player',
    status: 'Active',
    emailVerified: true,
  };

  users.push(newUser);
  res.status(201).json(newUser);
}

export function getUser(req: Request, res: Response): void {
  const userId = String(req.params.userId);
  const user = users.find((p) => p.id === userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json(users);
}
