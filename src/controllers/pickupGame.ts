import { Request, Response } from 'express';
import { pickupGame } from '../entities/pickupGame.js';
import { pickupGameIdCounter, pickupGames } from '../models/pickupGame.js';
import { userIdCounter } from '../models/User.js';
import { CreatePickupGameSchema } from '../validators/pickupGame.js';

export function CreatePickupGame(req: Request, res: Response): void {
  const result = CreatePickupGameSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newPickupGame: pickupGame = {
    id: String(pickupGameIdCounter.value++),
    userId: String(userIdCounter.value),
    sport: result.data.sport,
    title: result.data.title,
    description: result.data.description,
    locationName: result.data.locationName,
    date: result.data.date,
    time: result.data.time,
    maxPlayers: result.data.maxPlayers,
    skillLevelRequired: result.data.skillLevelRequired,
    players: [String(userIdCounter.value)],
  };

  pickupGames.push(newPickupGame);
  res.status(201).json(newPickupGame);
}

export function joinPickupGame(req: Request, res: Response): void {
  const pickupGameId = req.params.pickupGameId;
  const { userId } = req.body;

  const pickupGame = pickupGames.find((g) => g.id === pickupGameId);

  if (!pickupGame) {
    res.status(404).json({ message: 'Pickup game not found' });
    return;
  }

  if (pickupGame.players.includes(userId)) {
    res.status(400).json({ message: 'User already joined this game' });
    return;
  }

  if (pickupGame.players.length >= pickupGame.maxPlayers) {
    res.status(400).json({ message: 'Game is full' });
    return;
  }

  pickupGame.players.push(userId);

  res.status(200).json({
    message: 'Joined successfully',
    pickupGame,
  });
}

export function viewPickupGameDetails(req: Request, res: Response): void {
  const pickupGameId = req.params.pickupGameId;
  const game = pickupGames.find((p) => p.id === pickupGameId);

  if (!game) {
    res.status(404).json({ message: 'Pickup game not found' });
    return;
  }

  res.status(200).json(game);
}
