import { AppDataSource } from '../dataSource.js';
import { User } from '../entities/User.js';

// A model is a set of functions that read/write the database for one entity.
export const userIdCounter = { value: 1 }; // delete ***

const userRepository = AppDataSource.getRepository(User);

async function getAllUsers(): Promise<User[]> {
  return userRepository.find({
    select: { email: true, userId: true },
  });
}

async function getUserById(userId: string): Promise<User | null> {
  return userRepository.findOne({ where: { userId } });
}

async function addUser(email: string, passwordHash: string, name: string): Promise<User> {
  const newUser = new User();
  newUser.email = email;
  newUser.passwordHash = passwordHash;
  newUser.name = name;

  return userRepository.save(newUser);
}

async function getUserByEmail(email: string): Promise<User | null> {
  return userRepository.findOne({ where: { email } });
}

async function removeUser(userId: string): Promise<void> {
  await userRepository.delete({ userId });
}

async function updateUserById(userId: string, updates: Partial<User>): Promise<User | null> {
  await userRepository.update({ userId }, updates);
  return getUserById(userId);
}
// FILTERED Data
async function getAllUnverifiedUsers(): Promise<User[]> {
  return userRepository.find({
    select: { email: true, userId: true },
    where: { verifiedEmail: false },
  });
}

async function getAllActiveEmails(): Promise<User[]> {
  return userRepository.find({
    select: { userId: true, email: true },
    where: { verifiedEmail: true },
  });
}

export {
  addUser,
  getAllActiveEmails,
  getAllUnverifiedUsers,
  getAllUsers,
  getUserByEmail,
  getUserById,
  removeUser,
  updateUserById,
};
