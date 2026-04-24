import { AppDataSource } from '../dataSource.js';
import { gameParticipation } from '../entities/gameParticipation.js';
import { CreateGameParticipationBody } from '../validators/gameParticipation.js';
const gameParticipationRepository = AppDataSource.getRepository(gameParticipation);

async function joinGame(
  userId: string,
  gameId: string,
  data: CreateGameParticipationBody,
): Promise<gameParticipation> {
  const participation = new gameParticipation();
  participation.userId = userId;
  participation.gameId = gameId;
  participation.status = data.status;
  participation.role = data.role;

  return gameParticipationRepository.save(participation);
}

async function leaveGame(userId: string, gameId: string): Promise<gameParticipation | null> {
  // Find the existing participation record
  const participation = await gameParticipationRepository.findOne({
    where: { userId, gameId, status: 'joined' },
    select: { participationId: true, gameId: true },
  });

  if (!participation) {
    return null;
  }

  // Update status
  participation.status = 'left';

  // 3. Save updated record
  return gameParticipationRepository.save(participation);
}

async function getPlayersInGame(gameId: string): Promise<gameParticipation[]> {
  return gameParticipationRepository
    .createQueryBuilder('gp')
    .leftJoinAndSelect('gp.user', 'user')
    .leftJoinAndSelect('user.athleteProfile', 'athleteProfile')
    .where('gp.gameId = :gameId', { gameId })
    .andWhere('gp.status = :status', { status: 'joined' })
    .select([
      'gp',
      'user.name',
      'athleteProfile', // loads all athlete profile fields
    ])
    .getMany();
}

async function getGamesForUser(userId: string): Promise<gameParticipation[]> {
  return gameParticipationRepository
    .createQueryBuilder('gp')
    .leftJoinAndSelect('gp.game', 'game')
    .where('gp.userId = :userId', { userId })
    .andWhere('gp.status = :status', { status: 'joined' })
    .select([
      'gp.participationId',
      'gp.status',
      'game', // loads the entire pickupGame entity
    ])
    .getMany();
}

async function updateParticipationStatus(
  gameId: string,
  userId: string,
  status: 'joined' | 'left',
): Promise<gameParticipation | null> {
  const participation = await gameParticipationRepository.findOne({
    where: { gameId, userId },
  });

  if (!participation) return null;

  participation.status = status;

  return gameParticipationRepository.save(participation);
}

export { getGamesForUser, getPlayersInGame, joinGame, leaveGame, updateParticipationStatus };
