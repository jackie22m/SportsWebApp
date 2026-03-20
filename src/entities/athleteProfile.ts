export type athleteProfile = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  bio: string;
  primarySport: string;
  secondarySport: string;
  position: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  location: string;
};
