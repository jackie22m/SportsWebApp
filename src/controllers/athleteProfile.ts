import { Request, Response } from 'express';
import { athleteProfile } from '../entities/athleteProfile.js';
import {
  addAthleteProfile,
  getAllAthleteProfiles,
  getAthleteProfileById,
  getAthletesByLocation,
  getAthletesBySport,
  removeAthleteProfile,
  updateAnAthleteProfile,
} from '../models/athleteProfile.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateAthleteProfileSchema } from '../validators/athleteProfile.js';

async function getAllAthleteProfilesController(req: Request, res: Response): Promise<void> {
  const athletes = await getAllAthleteProfiles();
  res.json({ athletes });
}
async function createAthleteProfile(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth) {
    res.status(403).json({ message: 'Not authenticated' });
    return;
  }

  const result = CreateAthleteProfileSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  try {
    const newAthleteProfile = await addAthleteProfile(auth.userId, result.data);

    res.status(201).json({
      message: 'Athlete profile created successfully',
      athleteProfile: newAthleteProfile,
    });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function viewMyAthleteProfile(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;
  if (!auth) {
    res.status(401);
    return;
  }
  const athlete = await getAthleteProfileById(auth.userId);

  if (!athlete) {
    res.status(404).json({ message: 'Athlete profile not found' });
    return;
  }

  res.status(200).json(athlete);
}

async function getAnAthleteProfile(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  const athlete = await getAthleteProfileById(String(userId));

  if (!athlete) {
    res.status(404).json({ message: 'Athlete profile not found' });
    return;
  }

  res.status(200).json(athlete);
}

async function getAthleteProfilesBySport(req: Request, res: Response): Promise<void> {
  const { sport } = req.query;

  try {
    // If no sport query param, return all athletes
    if (!sport) {
      const allProfiles = await getAllAthleteProfiles();
      res.status(200).json(allProfiles);
      return;
    }

    // sport is a string | string[] | undefined, so cast it
    const sportString = String(sport);

    const profiles = await getAthletesBySport(sportString);

    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch athlete profiles' });
  }
}

async function getAthleteProfilesByLocation(req: Request, res: Response): Promise<void> {
  const { location } = req.query;

  try {
    // If no location query param, return all athletes
    if (!location) {
      const allProfiles = await getAllAthleteProfiles();
      res.status(200).json(allProfiles);
      return;
    }

    // sport is a string | string[] | undefined, so cast it
    const locationString = String(location);

    const profiles = await getAthletesByLocation(locationString);

    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch athlete profiles' });
  }
}

async function updateAthleteProfile(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  if (!auth || auth.userId !== req.params.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  // Validate
  const result = CreateAthleteProfileSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  // Ensure athlete profile exists
  const athlete = await getAthleteProfileById(auth.userId);
  if (!athlete) {
    res.status(404).json({ message: 'Athlete not found' });
    return;
  }

  // Build updates object from validated data
  const updates: Partial<athleteProfile> = result.data;

  // Perform update
  const updatedAthleteProfile = await updateAnAthleteProfile(auth.userId, updates);

  if (!updatedAthleteProfile) {
    res.status(404).json({ message: 'Athlete not found' });
    return;
  }

  res.status(404).json({ message: 'Athlete not found' });
  return;
}

async function deleteAthleteProfile(req: Request, res: Response): Promise<void> {
  const auth = req.session.authenticatedUser;

  // Must be logged in and deleting your own profile
  if (!auth || auth.userId !== req.params.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  await removeAthleteProfile(auth.userId);

  // Successful deletion
  res.sendStatus(204);
}

export {
  createAthleteProfile,
  deleteAthleteProfile,
  getAllAthleteProfiles,
  getAllAthleteProfilesController,
  getAnAthleteProfile,
  getAthleteProfilesByLocation,
  getAthleteProfilesBySport,
  updateAthleteProfile,
  viewMyAthleteProfile,
};
