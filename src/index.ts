import express, { Express } from 'express';
import './config.js'; // do not remove this line
import { createUser, getUser } from './controllers/User.js';
import {
  CreateAthleteProfile,
  getAthleteProfile,
  ViewProfile,
  getAthleteProfileBySport,
  getAthleteProfileByLocation,
} from './controllers/athleteProfile.js';
import {
  CreatePickupGame,
  joinPickupGame,
  viewPickupGameDetails,
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

app.post('/pickupGames', CreatePickupGame);
app.post('/pickupGames/:pickupGameId/join', joinPickupGame);
app.get('/pickupGames/:pickupGameId', viewPickupGameDetails);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
