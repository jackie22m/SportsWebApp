export type pickupGame = {
  id: string;
  userId: string;
  sport: string;
  title: string;
  description: string;
  locationName: string;
  date: string;
  time: string;
  maxPlayers: number;
  skillLevelRequired: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  players: string[]; // stores user ids
};
