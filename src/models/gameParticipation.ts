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

  return gameParticipationRepository.save(participation);
}

async function removeFromGame(userId: string, gameId: string) {
  await gameParticipationRepository
    .createQueryBuilder()
    .delete()
    .where('userId = :userId', { userId })
    .andWhere('gameId = :gameId', { gameId })
    .execute();
  await gameParticipationRepository.delete({ userId });
  return;
}

export { joinGame, removeFromGame };
