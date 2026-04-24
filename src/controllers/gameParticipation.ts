import { Request, Response } from 'express';
import {
  getGamesForUser,
  getPlayersInGame,
  joinGame,
  leaveGame,
  updateParticipationStatus,
} from '../models/gameParticipation.js';
import { getPickupGameById } from '../models/pickupGame.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import {
  CreateGameParticipationSchema,
  UpdateParticipationStatusSchema,
} from '../validators/gameParticipation.js';

async function joinAGame(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  const { gameId } = req.params;

  // Validate body
  const result = CreateGameParticipationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  try {
    // Ensure game exists
    const game = await getPickupGameById(String(gameId));
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    // Create participation
    const participation = await joinGame(auth.userId, String(gameId), result.data);

    res.status(201).json({
      message: 'Joined game successfully',
      participation,
    });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function leavePickupGame(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  const { gameId } = req.params;

  try {
    const exitGame = await leaveGame(auth.userId, String(gameId));

    if (!exitGame) {
      res.status(404).json({ message: 'You are not joined in this game' });
      return;
    }

    // get updated participants
    const participants = await getPlayersInGame(String(gameId));

    res.status(200).json({
      message: 'Left game successfully',
      participants,
    });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function playersInGame(req: Request, res: Response): Promise<void> {
  const { gameId } = req.params;

  try {
    const game = await getPickupGameById(String(gameId));

    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    // get updated participants
    const participants = await getPlayersInGame(String(gameId));

    res.status(200).json({ participants });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getMyGames(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const games = await getGamesForUser(auth.userId);

    res.status(200).json({
      message: 'Games retrieved successfully',
      games,
    });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function updatePlayerGameStatus(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { gameId } = req.params;

  const result = UpdateParticipationStatusSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  const { status } = result.data;

  try {
    const game = await getPickupGameById(String(gameId));
    if (!game) {
      res.status(404).json({ message: 'Pickup game not found' });
      return;
    }

    if (status === 'joined') {
      const gameStatus = await joinGame(auth.userId, String(gameId), {
        status: 'joined',
        role: 'player',
      });
      res.status(200).json({ message: 'Participation status updated', gameStatus });
    } else if (status === 'left') {
      const gameStatus = await leaveGame(auth.userId, String(gameId));
      res.status(200).json({ message: 'Participation status updated', gameStatus });
    } else {
      const gameStatus = await updateParticipationStatus(String(gameId), auth.userId, status);
      res.status(200).json({ message: 'Participation status updated', gameStatus });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(parseDatabaseError(err));
  }
}

export { getMyGames, joinAGame, leavePickupGame, playersInGame, updatePlayerGameStatus };
