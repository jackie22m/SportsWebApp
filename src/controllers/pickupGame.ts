import { Request, Response } from 'express';
import { pickupGame } from '../entities/pickupGame.js';
import {
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
} from '../models/pickupGame.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreatePickupGameSchema } from '../validators/pickupGame.js';

async function getAllPickupGamesController(req: Request, res: Response): Promise<void> {
  const pickupGames = await getAllPickupGames();
  res.json({ pickupGames });
}
async function createPickupGame(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }
  const result = CreatePickupGameSchema.safeParse(req.body);

  try {
    const newPickupGame = await addPickupGame(auth.userId, result.data);

    res.status(201).json({
      message: 'Pickup game created successfully',
      pickupGame: newPickupGame,
    });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAPickupGame(req: Request, res: Response): Promise<void> {
  const { gameId } = req.params;
  const game = await getPickupGameById(String(gameId));

  if (!game) {
    res.status(404).json({ message: 'Pickup game not found' });
    return;
  }

  res.status(200).json(game);
}

async function getUpcomingGames(req: Request, res: Response): Promise<void> {
  try {
    const games = await listUpcomingGames();
    res.status(200).json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to fetch upcoming games',
    });
  }
}

async function getPickGamesBySport(req: Request, res: Response): Promise<void> {
  const { sport } = req.query;

  try {
    // If no sport query param, return all games
    if (!sport) {
      const allGames = await listUpcomingGames();
      res.status(200).json(allGames);
      return;
    }

    // sport is a string | string[] | undefined, so cast it
    const sportString = String(sport);

    const games = await getGamesBySport(sportString);

    res.status(200).json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pickup games' });
  }
}

async function getPickupGamesByLocation(req: Request, res: Response): Promise<void> {
  const { location } = req.query;

  try {
    // If no sport query param, return all games
    if (!location) {
      const allGames = await listUpcomingGames();
      res.status(200).json(allGames);
      return;
    }

    const locationString = String(location);

    const games = await getGamesByLocation(locationString);

    res.status(200).json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pickup games' });
  }
}

async function getPickupGamesByDate(req: Request, res: Response): Promise<void> {
  const { date } = req.query;

  try {
    // If no date query param, return all games
    if (!date) {
      const allGames = await listUpcomingGames();
      res.status(200).json(allGames);
      return;
    }

    // Normalize to string
    const dateString = String(date);

    const games = await getGamesByDate(dateString);

    res.status(200).json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pickup games' });
  }
}

async function getPickupGamesByTime(req: Request, res: Response): Promise<void> {
  const { time } = req.query;

  try {
    // If no time query param, return all games
    if (!time) {
      const allGames = await listUpcomingGames();
      res.status(200).json(allGames);
      return;
    }

    const timeString = String(time);

    const games = await getGamesByTime(timeString);

    res.status(200).json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pickup games' });
  }
}

async function updatePickupGame(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { gameId } = req.params;

  const result = CreatePickupGameSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  try {
    const game = await getPickupGameById(String(gameId));
    if (!game) {
      res.status(404).json({ message: 'Pickup game not found' });
      return;
    }

    if (game.userId !== auth.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const updates: Partial<pickupGame> = result.data;

    const updatedPickupGame = await updateGame(String(gameId), updates);

    res.status(200).json(updatedPickupGame);
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

async function cancelPickupGame(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { gameId } = req.params;

  const game = await getPickupGameById(String(gameId));
  if (!game) {
    res.status(404).json({ message: 'Pickup game not found' });
    return;
  }

  if (game.userId !== auth.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  await deletePickupGame(String(gameId));

  res.sendStatus(204);
}

export {
  cancelPickupGame,
  createPickupGame,
  getAllPickupGamesController,
  getAPickupGame,
  getPickGamesBySport,
  getPickupGamesByDate,
  getPickupGamesByLocation,
  getPickupGamesByTime,
  getUpcomingGames,
  updatePickupGame,
};
