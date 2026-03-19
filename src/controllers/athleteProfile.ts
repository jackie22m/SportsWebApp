import { Request, Response } from 'express';
import { athleteProfile } from '../entities/athleteProfile.js';
import { athleteProfileIdCounter, athleteProfiles } from '../models/athleteProfile.js';
import { CreateAthleteProfileSchema } from '../validators/athleteProfile.js';

export function CreateAthleteProfile(req: Request, res: Response): void {
  const result = CreateAthleteProfileSchema.safeParse(req.body);
  const userId = String(req.params.userId);

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
    locationCity: result.data.locationCity,
  };

  athleteProfiles.push(newAthleteProfile);
  res.status(201).json(newAthleteProfile);
}
