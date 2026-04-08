import express, { Express } from 'express';
import './config.js'; // do not remove this line
import { createUser, getUser } from './controllers/User.js';
import {
  CreateAthleteProfile,
  getAthleteProfile,
  getAthleteProfileByLocation,
  getAthleteProfileBySport,
  ViewProfile,
} from './controllers/athleteProfile.js';
import {
  createPickupGame,
  deletePickupGame,
  getAllPickupGames,
  getPickupGameById,
  getPickupGamesByDate,
  getPickupGamesByLocation,
  getPickupGamesBySport,
  getPickupGamesByTime,
  leavePickupGame,
  updatePickupGame,
} from './controllers/pickupGame.js';
import { sessionMiddleware } from './sessionConfig.js';

const app: Express = express();

app.use(sessionMiddleware); // Setup session management middleware
app.use(express.json()); // Setup JSON body parsing middleware
app.use(express.urlencoded({ extended: false })); // Setup urlencoded (HTML Forms) body parsing middleware

// Setup static resource file middleware
// This allows the client to access any file inside the `public` directory
// Only put file that you actually want to be publicly accessibly in the `public` folder
app.use(express.static('public', { extensions: ['html'] }));

// -- Routes --------------------------------------------------
// Register your routes below this line
app.post('/users', createUser);
app.get('/users/:userId', getUser);

app.post('/athleteProfiles/:userId', CreateAthleteProfile);
app.get('/athleteProfiles/:userId', ViewProfile);
app.get('/athleteProfiles/:userId', getAthleteProfile);
app.get('/athleteProfiles', getAthleteProfileBySport);
app.get('/athleteProfiles', getAthleteProfileByLocation);

// PICKUP GAMES
app.post('/pickupGames', createPickupGame);
app.get('/pickupGames', getAllPickupGames);
// Filters
app.get('/pickupGames/:pickupGameId', getPickupGameById);
app.get('/pickupGames/sport', getPickupGamesBySport);
app.get('/pickupGames/location', getPickupGamesByLocation);
app.get('/pickupGames/date', getPickupGamesByDate);
app.get('/pickupGames/time', getPickupGamesByTime);

app.put('/pickupGames/:pickupGameId/leave', leavePickupGame);
app.put('/pickupGames/:pickupGameId', updatePickupGame);
app.delete('/pickupGames/:pickupGameId', deletePickupGame);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
