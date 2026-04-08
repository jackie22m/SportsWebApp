import { Request, Response } from 'express';
import { pickupGame } from '../entities/pickupGame.js';
import { pickupGameIdCounter, pickupGames } from '../models/pickupGame.js';
import { userIdCounter } from '../models/User.js';
import { CreatePickupGameSchema } from '../validators/pickupGame.js';

export function createPickupGame(req: Request, res: Response): void {
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
  const userId = String(req.body.userId);

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

export function getAllPickupGames(req: Request, res: Response): void {
  res.status(200).json({ message: 'Viewing all games', pickupGames });
}

export function getPickupGameById(req: Request, res: Response): void {
  const pickupGameId = req.params.pickupGameId;
  const game = pickupGames.find((p) => p.id === pickupGameId);

  if (!game) {
    res.status(404).json({ message: 'Pickup game not found' });
    return;
  }

  res.status(200).json(game);
}

export function getPickupGamesBySport(req: Request, res: Response): void {
  const { sport } = req.query;

  if (sport) {
    const filteredGames = pickupGames.filter(
      (game) => game.sport.toLowerCase() === String(sport).toLowerCase(),
    );

    res.status(200).json(filteredGames);
    return;
  }

  res.status(200).json(pickupGames);
}

export function getPickupGamesByLocation(req: Request, res: Response): void {
  const { locationName } = req.query;

  if (locationName) {
    const filteredGames = pickupGames.filter(
      (game) => game.locationName.toLowerCase() === String(locationName).toLowerCase(),
    );

    res.status(200).json(filteredGames);
    return;
  }

  res.status(200).json(pickupGames);
}

export function getPickupGamesByDate(req: Request, res: Response): void {
  const { date } = req.query;

  if (date) {
    const filteredGames = pickupGames.filter((game) => game.date === String(date));

    res.status(200).json(filteredGames);
    return;
  }

  res.status(200).json(pickupGames);
}

export function getPickupGamesByTime(req: Request, res: Response): void {
  const { time } = req.query;

  if (time) {
    const filteredGames = pickupGames.filter((game) => game.time === String(time));

    res.status(200).json(filteredGames);
    return;
  }

  res.status(200).json(pickupGames);
}

export function leavePickupGame(req: Request, res: Response): void {
  const pickupGameId = req.params.pickupGameId;
  const userId = String(req.body.userId);

  const pickupGame = pickupGames.find((g) => g.id === pickupGameId);

  if (!pickupGame) {
    res.status(404).json({ message: 'Pickup game not found' });
    return;
  }

  const playerIndex = pickupGame.players.indexOf(userId);

  if (playerIndex === -1) {
    res.status(400).json({ message: 'User is not in this game' });
    return;
  }

  pickupGame.players.splice(playerIndex, 1);

  res.status(200).json({
    message: 'Left pickup game successfully',
    pickupGame,
  });
}

export function updatePickupGame(req: Request, res: Response): void {
  const pickupGameId = req.params.pickupGameId;

  const game = pickupGames.find((p) => p.id === pickupGameId);

  if (!game) {
    res.status(404).json({ message: 'Pickup game not found' });
    return;
  }

  const { title, sport, description, locationName, date, time, maxPlayers, skillLevelRequired } =
    req.body;

  if (title !== undefined) game.title = title;
  if (sport !== undefined) game.sport = sport;
  if (description !== undefined) game.description = description;
  if (locationName !== undefined) game.locationName = locationName;
  if (date !== undefined) game.date = date;
  if (time !== undefined) game.time = time;
  if (maxPlayers !== undefined) game.maxPlayers = maxPlayers;
  if (skillLevelRequired !== undefined) game.skillLevelRequired = skillLevelRequired;

  res.status(200).json({ message: 'Pickup game updated successfully', game });
}

export function deletePickupGame(req: Request, res: Response): void {
  const pickupGameId = req.params.pickupGameId;

  const gameIndex = pickupGames.findIndex((g) => g.id === pickupGameId); // position

  if (gameIndex === -1) {
    res.status(404).json({ message: 'Pickup game not found' });
    return;
  }

  pickupGames.splice(gameIndex, 1);

  res.status(200).json({ message: 'Pickup game deleted successfully' });
}
