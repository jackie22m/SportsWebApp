import { AppDataSource } from '../dataSource.js';
import { pickupGame } from '../entities/pickupGame.js';
import { CreatePickupGameBody } from '../validators/pickupGame.js';

const pickupGameRepository = AppDataSource.getRepository(pickupGame);

async function getAllPickupGames(): Promise<pickupGame[]> {
  return pickupGameRepository.find();
}

async function addPickupGame(userId: string, data: CreatePickupGameBody): Promise<pickupGame> {
  const game = new pickupGame();
  game.userId = userId;
  game.sport = data.sport;
  game.title = data.title;
  game.description = data.description;
  game.location = data.location;
  game.date = data.date;
  game.time = data.time;
  game.maxPlayers = data.maxPlayers;
  game.skillLevelRequired = data.skillLevelRequired;

  return pickupGameRepository.save(game);
}

async function getPickupGameById(gameId: string): Promise<pickupGame | null> {
  return pickupGameRepository.findOne({ where: { gameId } });
}

async function listUpcomingGames(): Promise<pickupGame[]> {
  return pickupGameRepository
    .createQueryBuilder('game')
    .where('game.date >= CURRENT_DATE')
    .orderBy('game.date')
    .addOrderBy('game.time')
    .getMany();
}

async function getGamesBySport(sport: string): Promise<pickupGame[]> {
  return pickupGameRepository
    .createQueryBuilder('pickupGame')
    .where('pickupGame.date >= CURRENT_DATE')
    .andWhere(`LOWER(pickupGame.sport) = LOWER(:sport)`, { sport })
    .orderBy('pickupGame.date', 'ASC')
    .addOrderBy('pickupGame.time', 'ASC')
    .getMany();
}

async function getGamesByLocation(location: string): Promise<pickupGame[]> {
  return pickupGameRepository
    .createQueryBuilder('pickupGame')
    .where('pickupGame.date >= CURRENT_DATE')
    .andWhere(`LOWER(pickupGame.location) = LOWER(:location)`, { location })
    .orderBy('pickupGame.date', 'ASC')
    .addOrderBy('pickupGame.time', 'ASC')
    .getMany();
}

async function getGamesByDate(date: string): Promise<pickupGame[]> {
  return pickupGameRepository
    .createQueryBuilder('pickupGame')
    .where('pickupGame.date >= CURRENT_DATE')
    .andWhere('pickupGame.date = :date', { date })
    .orderBy('pickupGame.date', 'ASC')
    .addOrderBy('pickupGame.time', 'ASC')
    .getMany();
}

async function getGamesByTime(time: string): Promise<pickupGame[]> {
  return pickupGameRepository
    .createQueryBuilder('pickupGame')
    .where('pickupGame.date >= CURRENT_DATE')
    .andWhere('pickupGame.time = :time', { time })
    .orderBy('pickupGame.date', 'ASC')
    .addOrderBy('pickupGame.time', 'ASC')
    .getMany();
}

async function updateGame(
  gameId: string,
  updates: Partial<pickupGame>,
): Promise<pickupGame | null> {
  await pickupGameRepository
    .createQueryBuilder()
    .update(pickupGame)
    .set(updates)
    .where('gameId = :gameId', { gameId })
    .execute();

  return pickupGameRepository.findOne({ where: { gameId } });
}

async function deletePickupGame(gameId: string): Promise<void> {
  await pickupGameRepository.delete({ gameId });
}

export {
  addPickupGame,
  deletePickupGame,
  getAllPickupGames,
  getGamesByDate,
  getGamesByLocation,
  getGamesBySport,
  getGamesByTime,
  getPickupGameById,
  listUpcomingGames,
  updateGame,
};
