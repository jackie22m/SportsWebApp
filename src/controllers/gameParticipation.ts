import { Request, Response } from 'express';
import { joinGame } from '../models/gameParticipation.js';
import { getPickupGameById } from '../models/pickupGame.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateGameParticipationSchema } from '../validators/gameParticipation.js';

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

export { joinAGame };
