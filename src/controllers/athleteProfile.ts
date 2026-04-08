import { Request, Response } from 'express';
import { athleteProfile } from '../entities/athleteProfile.js';
import { athleteProfileIdCounter, athleteProfiles } from '../models/athleteProfile.js';
import { CreateAthleteProfileSchema } from '../validators/athleteProfile.js';

export function CreateAthleteProfile(req: Request, res: Response): void {
  const result = CreateAthleteProfileSchema.safeParse(req.body);
  const userId = String(req.params.userId);

  const existingProfile = athleteProfiles.find((p) => p.userId === userId);
  if (existingProfile) {
    res.status(400).json({ message: 'Athlete profile already exists for this user' });
    return;
  }

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newAthleteProfile: athleteProfile = {
    id: String(athleteProfileIdCounter.value++),
    userId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    bio: result.data.bio,
    primarySport: result.data.primarySport,
    secondarySport: result.data.secondarySport,
    position: result.data.position,
    skillLevel: result.data.skillLevel,
    location: result.data.location,
  };

  athleteProfiles.push(newAthleteProfile);
  res.status(201).json(newAthleteProfile);
}

export function ViewProfile(req: Request, res: Response): void {
  const userId = req.params.userId;
  const profile = athleteProfiles.find((p) => p.userId === userId);

  if (!profile) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  res.status(200).json(profile);
}

export function getAthleteProfile(req: Request, res: Response): void {
  const userId = String(req.params.userId);
  const athlete = athleteProfiles.find((p) => p.id === userId);

  if (!athlete) {
    res.status(404).json({ message: 'Athlete profile not found' });
    return;
  }

  res.status(200).json(athlete);
}

export function getAthleteProfileBySport(req: Request, res: Response): void {
  let result = athleteProfiles;
  const { sport } = req.query;

  if (sport) {
    result = result.filter((p) => p.primarySport || p.secondarySport === sport); // filtered by sport
  }

  res.status(200).json(result);
}

export function getAthleteProfileByLocation(req: Request, res: Response): void {
  const location = req.query.location as string;

  if (location) {
    const filteredProfiles = athleteProfiles.filter(
      (profile) => profile.location.toLowerCase() === location.toLowerCase(),
    );

    res.status(200).json(filteredProfiles);
    return;
  }

  res.status(200).json(athleteProfiles);
}
