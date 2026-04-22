import { AppDataSource } from '../dataSource.js';
import { athleteProfile } from '../entities/athleteProfile.js';
import { CreateAthleteProfileBody } from '../validators/athleteProfile.js';
export const athleteProfiles: athleteProfile[] = []; // delete
export const athleteProfileIdCounter = { value: 1 }; // delete

const athleteProfileRepository = AppDataSource.getRepository(athleteProfile);

async function addAthleteProfile(
  userId: string,
  data: CreateAthleteProfileBody,
): Promise<athleteProfile> {
  const profile = new athleteProfile();

  profile.userId = userId;
  profile.bio = data.bio;
  profile.primarySport = data.primarySport;
  profile.secondarySport = data.secondarySport ?? null;
  profile.position = data.position;
  profile.skillLevel = data.skillLevel;
  profile.location = data.location;

  return athleteProfileRepository.save(profile);
}

async function getAthleteProfileById(userId: string): Promise<athleteProfile | null> {
  return athleteProfileRepository.findOne({ where: { userId } });
}

async function getAthletesBySport(sport: string): Promise<athleteProfile[]> {
  return athleteProfileRepository
    .createQueryBuilder('athleteProfile')
    .where(`LOWER(athleteProfile.primarySport) = LOWER(:sport)`, { sport })
    .orWhere(`LOWER(athleteProfile.secondarySport) = LOWER(:sport)`, { sport })
    .getMany();
}

// Partial
async function getAthletesByLocation(location: string): Promise<athleteProfile[]> {
  return athleteProfileRepository
    .createQueryBuilder('athleteProfile')
    .where('athleteProfile.location ILIKE :loc', { loc: `%${location}%` })
    .getMany();
}

async function updateAnAthleteProfile(
  userId: string,
  updates: Partial<athleteProfile>,
): Promise<athleteProfile | null> {
  await athleteProfileRepository
    .createQueryBuilder()
    .update(athleteProfile)
    .set(updates)
    .where('userId = :userId', { userId })
    .execute();

  return athleteProfileRepository.findOne({ where: { userId } });
}

async function getAllAthleteProfiles(): Promise<athleteProfile[]> {
  return athleteProfileRepository.find();
}

async function removeAthleteProfile(userId: string): Promise<void> {
  await athleteProfileRepository.delete({ userId });
}
export {
  addAthleteProfile,
  getAllAthleteProfiles,
  getAthleteProfileById,
  getAthletesByLocation,
  getAthletesBySport,
  removeAthleteProfile,
  updateAnAthleteProfile,
};
