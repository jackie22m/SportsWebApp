import argon2 from 'argon2';
import { Request, Response } from 'express';
import { User } from '../entities/User.js';
import {
  addUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  removeUser,
  updateUserById,
} from '../models/User.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateUserSchema, LoginSchema } from '../validators/User.js';

function toPublicUser(user: User) {
  return {
    userId: user.userId,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    role: user.role,
    status: user.status,
  };
}
async function getAllUsersController(req: Request, res: Response): Promise<void> {
  const users = await getAllUsers();
  res.json({ users: users.map(toPublicUser) });
}
async function logIn(req: Request, res: Response): Promise<void> {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      req.session.logInAttempts = (req.session.logInAttempts ?? 0) + 1;
      res.sendStatus(403);
      return;
    }

    if (!(await argon2.verify(user.passwordHash, password))) {
      res.sendStatus(403);
      return;
    }

    await req.session.clearSession();
    req.session.authenticatedUser = { userId: user.userId, email: user.email };
    req.session.isLoggedIn = true;

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

async function logOut(req: Request, res: Response): Promise<void> {
  await req.session.clearSession();
  res.sendStatus(204);
}

async function createUser(req: Request, res: Response): Promise<void> {
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }
  const { email, password, name } = result.data;

  try {
    const passwordHash = await argon2.hash(password);
    const newUser = await addUser(email, passwordHash, name);
    console.log(newUser);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getMyProfile(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.sendStatus(401);
    return;
  }

  const user = await getUserById(auth.userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json({ user: toPublicUser(user) });
}

// getUserById
async function getUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  const user = await getUserById(String(userId));

  if (!user) {
    res.status(404).json({ error: 'User not found ' });
    return;
  }
  res.json({ user: toPublicUser(user) });
}

async function updateUser(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;
  if (!auth || auth.userId !== req.params.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const user = await getUserById(auth.userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const { name, email } = req.body;

  const updates: Partial<User> = {};

  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;

  const updatedUser = await updateUserById(auth.userId, updates);
  if (!updatedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json({ message: 'User updated', user: toPublicUser(user) });
}

async function deleteMyAccount(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth || auth.userId !== req.params.userId) {
    res.status(403);
    return;
  }
  await removeUser(auth.userId);
  req.session.destroy(() => {});
  res.sendStatus(204);
}

async function adminDeleteUser(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth || auth.userId !== req.params.userId) {
    res.status(403);
    return;
  }
  const { userId } = req.params;
  await removeUser(userId);
  res.status(204);
  return;
}

export {
  adminDeleteUser,
  createUser,
  deleteMyAccount,
  getAllUsersController,
  getMyProfile,
  getUser,
  logIn,
  logOut,
  updateUser,
};
